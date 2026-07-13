import logging

import aiosmtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


def _smtp_configured() -> bool:
    return bool(settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD)


async def send_email(to: str, subject: str, body: str) -> None:
    if not _smtp_configured():
        logger.warning("SMTP not configured — email to %s skipped: %s", to, subject)
        return

    message = EmailMessage()
    message["From"] = settings.SMTP_FROM
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USER,
        password=settings.SMTP_PASSWORD,
        start_tls=settings.SMTP_USE_TLS,
    )


async def send_verification_email(to: str, token: str) -> None:
    link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    body = (
        "Bienvenue sur PromptOptim !\n\n"
        "Cliquez sur le lien ci-dessous pour vérifier votre adresse email :\n"
        f"{link}\n\n"
        "Si vous n'avez pas créé de compte, ignorez cet email."
    )
    await send_email(to, "Vérifiez votre email — PromptOptim", body)


async def send_password_reset_email(to: str, token: str) -> None:
    link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    body = (
        "Vous avez demandé une réinitialisation de mot de passe.\n\n"
        f"Cliquez sur ce lien (valide 1 heure) :\n{link}\n\n"
        "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email."
    )
    await send_email(to, "Réinitialisation mot de passe — PromptOptim", body)
