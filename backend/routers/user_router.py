from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from backend.database import get_db
from backend.models import User, CoinTransaction
from backend.schemas import UserOut, CoinTransactionOut
from backend.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/checkin", response_model=UserOut)
def daily_checkin(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Claim daily streak bonus and increment streak 🔥"""
    now = datetime.utcnow()
    last = current_user.last_checkin or (now - timedelta(days=2))
    
    time_diff = now - last
    
    # If checked in today (less than 20 hours ago)
    if time_diff < timedelta(hours=20):
        raise HTTPException(
            status_code=400, 
            detail=f"You already claimed your streak today! Come back tomorrow 🔥"
        )
    
    # If missed more than 48 hours, reset streak to 1
    if time_diff > timedelta(hours=48):
        current_user.streak_count = 1
    else:
        current_user.streak_count += 1

    current_user.last_checkin = now
    
    # Calculate daily coin bonus based on streak length (15 + 5 * streak)
    reward_coins = 15 + min(current_user.streak_count * 5, 50)
    current_user.skillcoins += reward_coins

    # Log transaction
    trans = CoinTransaction(
        user_id=current_user.id,
        amount=reward_coins,
        transaction_type="streak_bonus",
        description=f"Daily Streak Day {current_user.streak_count} Bonus 🔥"
    )
    db.add(trans)
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/transactions", response_model=List[CoinTransactionOut])
def get_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(CoinTransaction).filter(
        CoinTransaction.user_id == current_user.id
    ).order_by(CoinTransaction.created_at.desc()).limit(30).all()
