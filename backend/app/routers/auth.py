from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Body, Depends, HTTPException, Query, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db.models import User
from app.db.session import get_db
from app.dependencies import AuthUser, get_current_user
from app.limiter import limiter
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)
from app.services import auth_service
from app.services.email_service import send_password_reset_email, send_verification_email

router = APIRouter()


async def _token_response(db: AsyncSession, user: User) -> TokenResponse:
    access_token = auth_service.create_access_token(user.id, user.email)
    refresh_token = await auth_service.create_refresh_token(db, user.id)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.JWT_ACCESS_EXPIRE_MINUTES * 60,
        user={"id": str(user.id), "email": user.email},
    )


@limiter.limit("5/minute")
@router.post("/register", status_code=201, response_model=MessageResponse)
async def register(request: Request, data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await auth_service.get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    verification_token = auth_service.generate_token()
    user = User(
        email=data.email.lower(),
        password_hash=auth_service.hash_password(data.password),
        email_verified=False,
        verification_token=verification_token,
    )
    db.add(user)
    await db.commit()

    await send_verification_email(user.email, verification_token)
    return {"message": "Registration successful. Please check your email to verify your account."}


@limiter.limit("10/minute")
@router.post("/login", response_model=TokenResponse)
async def login(request: Request, data: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await auth_service.get_user_by_email(db, data.email)
    if not user or not auth_service.verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.email_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified")
    return await _token_response(db, user)


@limiter.limit("10/minute")
@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: Request, data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    user = await auth_service.validate_refresh_token(db, data.refresh_token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    await auth_service.revoke_refresh_token(db, data.refresh_token)
    return await _token_response(db, user)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    data: RefreshRequest | None = Body(default=None),
):
    if data and data.refresh_token:
        await auth_service.revoke_refresh_token(db, data.refresh_token)
    else:
        await auth_service.revoke_all_refresh_tokens(db, user.id)
    return {"message": "Logged out successfully"}


@limiter.limit("3/minute")
@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(request: Request, data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    user = await auth_service.get_user_by_email(db, data.email)
    if user:
        reset_token = auth_service.generate_token()
        user.reset_token = reset_token
        user.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        await db.commit()
        await send_password_reset_email(user.email, reset_token)
    return {"message": "If this email is registered, you will receive a reset link."}


@limiter.limit("5/minute")
@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(request: Request, data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    user = None

    if data.token:
        result = await db.execute(select(User).where(User.reset_token == data.token))
        user = result.scalar_one_or_none()
        if not user or not user.reset_token_expires or user.reset_token_expires < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    elif data.access_token and data.refresh_token:
        # Legacy Supabase-style flow — treat access_token as reset token
        result = await db.execute(select(User).where(User.reset_token == data.access_token))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user.password_hash = auth_service.hash_password(data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    await auth_service.revoke_all_refresh_tokens(db, user.id)
    await db.commit()
    return {"message": "Password updated successfully"}


@router.get("/verify-email", response_model=MessageResponse)
async def verify_email(token: str = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.verification_token == token))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    user.email_verified = True
    user.verification_token = None
    await db.commit()
    return {"message": "Email verified successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(user: AuthUser = Depends(get_current_user)):
    return UserResponse(id=str(user.id), email=user.email, created_at=user.created_at)


@router.delete("/me", status_code=204)
async def delete_account(
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    db_user = await auth_service.get_user_by_id(db, user.id)
    if not db_user:
        raise HTTPException(status_code=400, detail="Failed to delete account.")
    await db.delete(db_user)
    await db.commit()
