from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    skillcoins: int
    streak_count: int
    last_checkin: datetime
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    is_banned: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Skill Schemas ---
class SkillCreate(BaseModel):
    title: str
    description: str
    category: str
    skill_type: str  # "offer" or "request"
    coin_price: int = 20
    level: str = "Intermediate"

class SkillOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    skill_type: str
    coin_price: int
    level: str
    owner_id: int
    owner_name: Optional[str] = None
    owner_avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Exchange Schemas ---
class ExchangeCreate(BaseModel):
    skill_id: int
    note: Optional[str] = ""

class ExchangeOut(BaseModel):
    id: int
    skill_id: int
    skill_title: Optional[str] = None
    requester_id: int
    requester_name: Optional[str] = None
    provider_id: int
    provider_name: Optional[str] = None
    status: str
    coin_amount: int
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ExchangeStatusUpdate(BaseModel):
    status: str  # "accepted", "completed", "cancelled"

# --- Chat Schemas ---
class ChatMessageCreate(BaseModel):
    receiver_id: int
    content: str

class ChatMessageOut(BaseModel):
    id: int
    sender_id: int
    sender_name: Optional[str] = None
    receiver_id: int
    receiver_name: Optional[str] = None
    content: str
    is_read: bool
    timestamp: datetime

    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    user_id: int
    user_name: str
    user_avatar: Optional[str] = None
    last_message: str
    last_timestamp: datetime
    unread_count: int

# --- Coin & Reward Schemas ---
class CoinTransactionOut(BaseModel):
    id: int
    amount: int
    transaction_type: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class RewardItemOut(BaseModel):
    id: int
    title: str
    description: str
    coin_price: int
    icon: str
    category: str
    code: str

    class Config:
        from_attributes = True

class GrantCoinsRequest(BaseModel):
    amount: int
    reason: str

# --- Admin Stats ---
class AdminStatsOut(BaseModel):
    total_users: int
    total_skills: int
    total_exchanges: int
    total_chat_messages: int
    total_coins_circulating: int
