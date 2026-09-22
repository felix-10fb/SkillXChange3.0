from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models import Exchange, Skill, User, CoinTransaction
from backend.schemas import ExchangeCreate, ExchangeOut, ExchangeStatusUpdate
from backend.auth import get_current_user

router = APIRouter(prefix="/api/exchanges", tags=["Exchanges"])

@router.get("", response_model=List[ExchangeOut])
def get_user_exchanges(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exchanges = db.query(Exchange).filter(
        (Exchange.requester_id == current_user.id) | (Exchange.provider_id == current_user.id)
    ).order_by(Exchange.created_at.desc()).all()

    result = []
    for ex in exchanges:
        out = ExchangeOut.from_orm(ex)
        out.skill_title = ex.skill.title if ex.skill else "Skill"
        
        req_user = db.query(User).get(ex.requester_id)
        prov_user = db.query(User).get(ex.provider_id)
        out.requester_name = req_user.full_name if req_user else "User"
        out.provider_name = prov_user.full_name if prov_user else "User"
        result.append(out)

    return result

@router.post("", response_model=ExchangeOut)
def request_exchange(
    exchange_in: ExchangeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(Skill.id == exchange_in.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
        
    if skill.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot request exchange on your own skill")

    # Check requester has enough SkillCoins
    if current_user.skillcoins < skill.coin_price:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient SkillCoins. Required: {skill.coin_price} 🪙, You have: {current_user.skillcoins} 🪙"
        )

    new_ex = Exchange(
        skill_id=skill.id,
        requester_id=current_user.id,
        provider_id=skill.owner_id,
        status="pending",
        coin_amount=skill.coin_price,
        note=exchange_in.note
    )
    db.add(new_ex)
    db.commit()
    db.refresh(new_ex)

    out = ExchangeOut.from_orm(new_ex)
    out.skill_title = skill.title
    out.requester_name = current_user.full_name
    out.provider_name = skill.owner.full_name
    return out

@router.patch("/{exchange_id}/status", response_model=ExchangeOut)
def update_exchange_status(
    exchange_id: int,
    status_update: ExchangeStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ex = db.query(Exchange).filter(Exchange.id == exchange_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exchange not found")

    new_status = status_update.status
    if new_status not in ["accepted", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    # Check permission
    if current_user.id not in [ex.requester_id, ex.provider_id] and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this exchange")

    # If completing exchange, transfer SkillCoins from requester to provider
    if new_status == "completed" and ex.status != "completed":
        requester = db.query(User).get(ex.requester_id)
        provider = db.query(User).get(ex.provider_id)
        
        if requester.skillcoins < ex.coin_amount:
            raise HTTPException(status_code=400, detail="Requester does not have enough SkillCoins to complete exchange.")
            
        requester.skillcoins -= ex.coin_amount
        provider.skillcoins += ex.coin_amount

        # Log coin transactions
        db.add(CoinTransaction(
            user_id=requester.id,
            amount=-ex.coin_amount,
            transaction_type="exchange_paid",
            description=f"Paid {ex.coin_amount} SkillCoins for exchange: {ex.skill.title}"
        ))
        db.add(CoinTransaction(
            user_id=provider.id,
            amount=ex.coin_amount,
            transaction_type="exchange_received",
            description=f"Earned {ex.coin_amount} SkillCoins for teaching: {ex.skill.title} 🪙"
        ))

    ex.status = new_status
    db.commit()
    db.refresh(ex)

    out = ExchangeOut.from_orm(ex)
    out.skill_title = ex.skill.title if ex.skill else "Skill"
    out.requester_name = db.query(User).get(ex.requester_id).full_name
    out.provider_name = db.query(User).get(ex.provider_id).full_name
    return out
