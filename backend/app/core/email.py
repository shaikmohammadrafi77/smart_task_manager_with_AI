"""Email notification service (placeholder for SMTP)"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from app.core.config import settings


async def send_email(to: str, subject: str, body: str) -> bool:
    """
    Send email notification (placeholder implementation)
    Returns True if sent successfully, False otherwise
    """
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        # Log that email is not configured
        print(f"[EMAIL NOT CONFIGURED] Would send to {to}: {subject}")
        return False

    try:
        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_USER
        msg["To"] = to
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

