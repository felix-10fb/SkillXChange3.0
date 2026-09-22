from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import List

from backend.database import get_db
from backend.models import ChatMessage, User
from backend.schemas import ChatMessageCreate, ChatMessageOut, ConversationOut
from backend.auth import get_current_user

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.get("/conversations", response_model=List[ConversationOut])
def get_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch list of users current_user has chatted with, along with last message & unread status"""
    # Find all distinct users engaged in chat
    msg_users = db.query(ChatMessage).filter(
        or_(ChatMessage.sender_id == current_user.id, ChatMessage.receiver_id == current_user.id)
    ).order_by(ChatMessage.timestamp.desc()).all()

    contact_ids = []
    for m in msg_users:
        other_id = m.receiver_id if m.sender_id == current_user.id else m.sender_id
        if other_id not in contact_ids:
            contact_ids.append(other_id)

    conversations = []
    for cid in contact_ids:
        contact_user = db.query(User).get(cid)
        if not contact_user:
            continue

        last_msg = db.query(ChatMessage).filter(
            or_(
                and_(ChatMessage.sender_id == current_user.id, ChatMessage.receiver_id == cid),
                and_(ChatMessage.sender_id == cid, ChatMessage.receiver_id == current_user.id)
            )
        ).order_by(ChatMessage.timestamp.desc()).first()

        unread_count = db.query(ChatMessage).filter(
            ChatMessage.sender_id == cid,
            ChatMessage.receiver_id == current_user.id,
            ChatMessage.is_read == False
        ).count()

        if last_msg:
            conversations.append(ConversationOut(
                user_id=contact_user.id,
                user_name=contact_user.full_name,
                user_avatar=contact_user.avatar_url,
                last_message=last_msg.content,
                last_timestamp=last_msg.timestamp,
                unread_count=unread_count
            ))

    return conversations

@router.get("/messages/{other_user_id}", response_model=List[ChatMessageOut])
def get_messages(
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Mark incoming messages as read
    db.query(ChatMessage).filter(
        ChatMessage.sender_id == other_user_id,
        ChatMessage.receiver_id == current_user.id,
        ChatMessage.is_read == False
    ).update({"is_read": True})
    db.commit()

    messages = db.query(ChatMessage).filter(
        or_(
            and_(ChatMessage.sender_id == current_user.id, ChatMessage.receiver_id == other_user_id),
            and_(ChatMessage.sender_id == other_user_id, ChatMessage.receiver_id == current_user.id)
        )
    ).order_by(ChatMessage.timestamp.asc()).all()

    other_user = db.query(User).get(other_user_id)

    out = []
    for m in messages:
        c = ChatMessageOut.from_orm(m)
        c.sender_name = current_user.full_name if m.sender_id == current_user.id else (other_user.full_name if other_user else "User")
        c.receiver_name = other_user.full_name if m.receiver_id == other_user.id else (current_user.full_name)
        out.append(c)

    return out

@router.post("/send", response_model=ChatMessageOut)
def send_message(
    msg_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    receiver = db.query(User).get(msg_in.receiver_id)
    if not receiver:
        raise HTTPException(status_code=404, detail="Recipient user not found")

    new_msg = ChatMessage(
        sender_id=current_user.id,
        receiver_id=receiver.id,
        content=msg_in.content,
        is_read=False
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    out = ChatMessageOut.from_orm(new_msg)
    out.sender_name = current_user.full_name
    out.receiver_name = receiver.full_name
    return out
