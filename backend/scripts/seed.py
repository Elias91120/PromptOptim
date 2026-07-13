"""Seed test user and demo templates on startup (idempotent)."""

import os

from sqlalchemy import select

from app.db.models import PromptTemplate, User
from app.db.session import AsyncSessionLocal
from app.services.auth_service import hash_password

TEST_EMAIL = os.environ.get("SEED_TEST_EMAIL", "test@3geeks.fr")
TEST_PASSWORD = os.environ.get("SEED_TEST_PASSWORD", "PromptOptim!2026")

DEMO_TEMPLATES = [
    {
        "title": "Email professionnel",
        "description": "Template pour rédiger des emails formels",
        "template_text": "Rédige un email professionnel pour {sujet} destiné à {destinataire}.",
        "target_model": "mistral_2",
        "category": "business",
    },
    {
        "title": "Résumé technique",
        "description": "Synthèse concise d'un sujet technique",
        "template_text": "Résume {sujet} en 5 points clés pour un public {niveau}.",
        "target_model": "claude_opus",
        "category": "tech",
    },
    {
        "title": "Prompt image Midjourney",
        "description": "Base pour générer une image",
        "template_text": "Crée une image de {sujet} en style {style}, ambiance {ambiance}.",
        "target_model": "midjourney_v6",
        "category": "creative",
    },
]


async def run_seed() -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == TEST_EMAIL))
        user = result.scalar_one_or_none()
        if not user:
            user = User(
                email=TEST_EMAIL,
                password_hash=hash_password(TEST_PASSWORD),
                email_verified=True,
                verification_token=None,
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        for tpl in DEMO_TEMPLATES:
            existing = await db.execute(
                select(PromptTemplate).where(
                    PromptTemplate.title == tpl["title"],
                    PromptTemplate.is_public.is_(True),
                )
            )
            if existing.scalar_one_or_none():
                continue
            db.add(
                PromptTemplate(
                    user_id=None,
                    is_public=True,
                    usage_count=0,
                    **tpl,
                )
            )
        await db.commit()
