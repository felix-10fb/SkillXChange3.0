from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from backend.database import get_db
from backend.models import User, CoinTransaction
from backend.schemas import UserRegister, UserLogin, Token, UserOut
from backend.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check existing email/username
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Set avatar avatar placeholder
    avatar_url = f"https://api.dicebear.com/7.x/bottts/svg?seed={user_in.username}"

    db_user = User(
        username=user_in.username,
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role="user",
        skillcoins=100,  # Welcome bonus
        streak_count=1,
        last_checkin=datetime.utcnow(),
        avatar_url=avatar_url,
        bio="Excited to learn & exchange skills on SkillXChange 2.0!"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Add initial coin transaction log
    transaction = CoinTransaction(
        user_id=db_user.id,
        amount=100,
        transaction_type="signup_bonus",
        description="Welcome to SkillXChange bonus 🪙"
    )
    db.add(transaction)
    db.commit()

    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer", "user": db_user}

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if user.is_banned:
        raise HTTPException(status_code=403, detail="Account has been suspended by administrator.")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
