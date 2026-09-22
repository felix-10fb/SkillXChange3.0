from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from backend.database import get_db
from backend.models import User, Skill, Exchange, ChatMessage, CoinTransaction
from backend.schemas import UserOut, AdminStatsOut, GrantCoinsRequest
from backend.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats", response_model=AdminStatsOut)
def get_admin_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_skills = db.query(Skill).count()
    total_exchanges = db.query(Exchange).count()
    total_messages = db.query(ChatMessage).count()
    total_coins = db.query(func.sum(User.skillcoins)).scalar() or 0

    return AdminStatsOut(
        total_users=total_users,
        total_skills=total_skills,
        total_exchanges=total_exchanges,
        total_chat_messages=total_messages,
        total_coins_circulating=int(total_coins)
    )

@router.get("/users", response_model=List[UserOut])
def get_all_users(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(User).order_by(User.id.asc()).all()

@router.post("/users/{user_id}/grant-coins", response_model=UserOut)
def grant_coins(
    user_id: int,
    request: GrantCoinsRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    target_user = db.query(User).get(user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    target_user.skillcoins += request.amount

    # Log transaction
    trans = CoinTransaction(
        user_id=target_user.id,
        amount=request.amount,
        transaction_type="admin_grant",
        description=f"Admin Grant: {request.reason} 👑"
    )
    db.add(trans)
    db.commit()
    db.refresh(target_user)
    return target_user

@router.post("/users/{user_id}/toggle-ban", response_model=UserOut)
def toggle_ban(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    target_user = db.query(User).get(user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if target_user.id == admin.id:
        raise HTTPException(status_code=400, detail="Administrator cannot ban themselves.")

    target_user.is_banned = not target_user.is_banned
    db.commit()
    db.refresh(target_user)
    return target_user

@router.post("/users/{user_id}/toggle-role", response_model=UserOut)
def toggle_role(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    target_user = db.query(User).get(user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    target_user.role = "admin" if target_user.role == "user" else "user"
    db.commit()
    db.refresh(target_user)
    return target_user
