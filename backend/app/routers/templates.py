from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import PromptTemplate
from app.db.session import get_db
from app.dependencies import AuthUser, get_current_user
from app.schemas.templates import TemplateCreate, TemplateRead

router = APIRouter()


@router.get("/templates", response_model=list[TemplateRead])
async def list_templates(
    category: str | None = Query(default=None),
    mine_only: bool = Query(default=False),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(PromptTemplate)

    if mine_only:
        query = query.where(PromptTemplate.user_id == user.id)
    else:
        query = query.where(
            or_(PromptTemplate.user_id == user.id, PromptTemplate.is_public.is_(True))
        )

    if category:
        query = query.where(PromptTemplate.category == category)

    query = query.order_by(PromptTemplate.created_at.desc()).offset(skip).limit(limit)

    try:
        result = await db.execute(query)
        rows = result.scalars().all()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch templates.",
        )

    return [
        TemplateRead(
            id=row.id,
            title=row.title,
            description=row.description,
            template_text=row.template_text,
            target_model=row.target_model,
            category=row.category,
            is_public=row.is_public,
            is_mine=row.user_id == user.id,
            usage_count=row.usage_count,
            created_at=row.created_at,
        )
        for row in rows
    ]


@router.post("/templates", response_model=TemplateRead, status_code=201)
async def create_template(
    data: TemplateCreate,
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    template = PromptTemplate(
        user_id=user.id,
        title=data.title,
        description=data.description,
        template_text=data.template_text,
        target_model=data.target_model,
        category=data.category,
        is_public=data.is_public,
    )
    db.add(template)
    await db.commit()
    await db.refresh(template)

    return TemplateRead(
        id=template.id,
        title=template.title,
        description=template.description,
        template_text=template.template_text,
        target_model=template.target_model,
        category=template.category,
        is_public=template.is_public,
        is_mine=True,
        usage_count=template.usage_count,
        created_at=template.created_at,
    )


@router.delete("/templates/{template_id}", status_code=204)
async def delete_template(
    template_id: int,
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PromptTemplate).where(
            PromptTemplate.id == template_id,
            PromptTemplate.user_id == user.id,
        )
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")

    await db.delete(template)
    await db.commit()
