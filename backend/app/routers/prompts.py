from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import PromptHistory
from app.db.session import get_db
from app.dependencies import AuthUser, get_current_user
from app.limiter import limiter
from app.schemas.prompts import PromptHistoryRead, PromptRequest, PromptResponse, UserStatsResponse
from app.services import anonymizer, impact_calculator, llm_engine

router = APIRouter()


@limiter.limit("20/minute")
@router.post("/generate", response_model=PromptResponse)
async def generate_prompt(
    request: Request,
    data: PromptRequest,
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    anonymized_text = anonymizer.scrub_pii(data.input_text)

    llm_result = await llm_engine.rewrite_prompt(anonymized_text, data.target_model)
    optimized_prompt = llm_result["optimized_prompt"]
    reasoning = llm_result["reasoning"]

    green_data = impact_calculator.calculate_green_impact(
        original_text=data.input_text,
        optimized_text=optimized_prompt,
        model_name=data.target_model.value,
    )
    sovereignty_data = impact_calculator.get_sovereignty_data(data.target_model.value)

    history = PromptHistory(
        user_id=user.id,
        original_intent=data.input_text,
        optimized_prompt=optimized_prompt,
        target_model=data.target_model.value,
        green_data=green_data.model_dump(),
        sovereignty_data=sovereignty_data.model_dump(),
        ai_reasoning=reasoning,
    )
    db.add(history)
    try:
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to save prompt to history: {str(e)}",
        )

    return PromptResponse(
        original_intent=data.input_text,
        optimized_prompt=optimized_prompt,
        target_model=data.target_model.value,
        green_data=green_data,
        sovereignty_data=sovereignty_data,
        ai_reasoning=reasoning,
    )


@router.get("/history", response_model=list[PromptHistoryRead])
async def get_history(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PromptHistory)
        .where(PromptHistory.user_id == user.id)
        .order_by(PromptHistory.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = result.scalars().all()
    return [
        PromptHistoryRead(
            id=row.id,
            original_intent=row.original_intent,
            optimized_prompt=row.optimized_prompt,
            target_model=row.target_model,
            green_data=row.green_data,
            sovereignty_data=row.sovereignty_data,
            ai_reasoning=row.ai_reasoning,
            created_at=row.created_at,
        )
        for row in rows
    ]


@router.get("/stats", response_model=UserStatsResponse)
async def get_stats(
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PromptHistory.green_data, PromptHistory.target_model).where(
            PromptHistory.user_id == user.id
        )
    )
    rows = result.all()

    total_prompts = len(rows)
    total_tokens_saved = 0
    total_co2_saved = 0.0
    model_usage: dict[str, int] = {}

    for green, model in rows:
        green = green or {}
        total_tokens_saved += green.get("tokens_saved", 0)
        total_co2_saved += green.get("co2_saved_g", 0.0)
        model_name = model or "unknown"
        model_usage[model_name] = model_usage.get(model_name, 0) + 1

    return UserStatsResponse(
        total_prompts=total_prompts,
        total_tokens_saved=total_tokens_saved,
        total_co2_saved=round(total_co2_saved, 4),
        model_usage=model_usage,
    )
