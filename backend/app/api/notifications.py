"""Notification endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session

from app.db import get_session
from app.models.user import User
from app.models.push_subscription import PushSubscription
from app.api.auth import get_current_user_dependency

router = APIRouter()


class PushSubscriptionRequest(BaseModel):
    """Web Push subscription request"""

    endpoint: str
    keys: dict[str, str]  # p256dh and auth


@router.post("/subscribe")
async def subscribe_to_push(
    subscription: PushSubscriptionRequest,
    user: User = Depends(get_current_user_dependency),
    session: Session = Depends(get_session),
) -> dict:
    """Subscribe user to Web Push notifications"""
    # Check if subscription already exists
    from sqlmodel import select

    statement = select(PushSubscription).where(
        PushSubscription.user_id == user.id,
        PushSubscription.endpoint == subscription.endpoint,
    )
    existing = session.exec(statement).first()

    if existing:
        # Update existing
        existing.p256dh = subscription.keys.get("p256dh", "")
        existing.auth = subscription.keys.get("auth", "")
        session.add(existing)
    else:
        # Create new
        push_sub = PushSubscription(
            user_id=user.id or 0,
            endpoint=subscription.endpoint,
            p256dh=subscription.keys.get("p256dh", ""),
            auth=subscription.keys.get("auth", ""),
        )
        session.add(push_sub)

    session.commit()

    return {"status": "subscribed"}

