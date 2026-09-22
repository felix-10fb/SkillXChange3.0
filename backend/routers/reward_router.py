from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models import RewardItem, User, CoinTransaction
from backend.schemas import RewardItemOut
from backend.auth import get_current_user

router = APIRouter(prefix="/api/rewards", tags=["Rewards"])

@router.get("", response_model=List[RewardItemOut])
def get_rewards(db: Session = Depends(get_db)):
    return db.query(RewardItem).all()

@router.post("/redeem/{reward_id}")
def redeem_reward(
    reward_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reward = db.query(RewardItem).filter(RewardItem.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward item not found")

    if current_user.skillcoins < reward.coin_price:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough SkillCoins! Need {reward.coin_price} 🪙, but you have {current_user.skillcoins} 🪙"
        )

    # Deduct coins
    current_user.skillcoins -= reward.coin_price
    
    # Log transaction
    trans = CoinTransaction(
        user_id=current_user.id,
        amount=-reward.coin_price,
        transaction_type="reward_redeem",
        description=f"Redeemed reward: {reward.title} 🎁"
    )
    db.add(trans)
    db.commit()
    db.refresh(current_user)

    return {
        "message": f"Successfully redeemed '{reward.title}'!",
        "claim_code": reward.code,
        "remaining_skillcoins": current_user.skillcoins
    }
