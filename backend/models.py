from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # "user" or "admin"
    skillcoins = Column(Integer, default=100)
    streak_count = Column(Integer, default=1)
    last_checkin = Column(DateTime, default=datetime.utcnow)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    is_banned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    skills = relationship("Skill", back_populates="owner", cascade="all, delete-orphan")
    sent_messages = relationship("ChatMessage", foreign_keys="ChatMessage.sender_id", back_populates="sender")
    received_messages = relationship("ChatMessage", foreign_keys="ChatMessage.receiver_id", back_populates="receiver")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # Technology, Design, Languages, Music, Business, Fitness
    skill_type = Column(String, nullable=False)  # "offer" or "request"
    coin_price = Column(Integer, default=20)
    level = Column(String, default="Intermediate")  # Beginner, Intermediate, Advanced
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="skills")
    exchanges = relationship("Exchange", back_populates="skill", cascade="all, delete-orphan")

class Exchange(Base):
    __tablename__ = "exchanges"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending")  # pending, accepted, completed, cancelled
    coin_amount = Column(Integer, default=20)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    skill = relationship("Skill", back_populates="exchanges")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")

class CoinTransaction(Base):
    __tablename__ = "coin_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)  # positive for gain, negative for spent
    transaction_type = Column(String, nullable=False)  # signup_bonus, streak_bonus, exchange_paid, exchange_received, reward_redeem, admin_grant
    description = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class RewardItem(Base):
    __tablename__ = "reward_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    coin_price = Column(Integer, nullable=False)
    icon = Column(String, default="🎁")
    category = Column(String, default="Perks")
    code = Column(String, nullable=False)
