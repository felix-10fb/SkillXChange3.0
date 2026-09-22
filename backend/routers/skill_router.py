from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database import get_db
from backend.models import Skill, User
from backend.schemas import SkillCreate, SkillOut
from backend.auth import get_current_user

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.get("", response_model=List[SkillOut])
def get_skills(
    category: Optional[str] = None,
    skill_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Skill).join(User, Skill.owner_id == User.id)
    
    if category and category != "All":
        query = query.filter(Skill.category == category)
    if skill_type and skill_type != "All":
        query = query.filter(Skill.skill_type == skill_type)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Skill.title.ilike(search_pattern)) | 
            (Skill.description.ilike(search_pattern))
        )
        
    skills = query.order_by(Skill.created_at.desc()).all()
    
    # Enrich with owner info
    result = []
    for s in skills:
        s_dict = SkillOut.from_orm(s)
        s_dict.owner_name = s.owner.full_name
        s_dict.owner_avatar = s.owner.avatar_url
        result.append(s_dict)
        
    return result

@router.post("", response_model=SkillOut)
def create_skill(
    skill_in: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_skill = Skill(
        title=skill_in.title,
        description=skill_in.description,
        category=skill_in.category,
        skill_type=skill_in.skill_type,
        coin_price=skill_in.coin_price,
        level=skill_in.level,
        owner_id=current_user.id
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)

    res = SkillOut.from_orm(new_skill)
    res.owner_name = current_user.full_name
    res.owner_avatar = current_user.avatar_url
    return res

@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill post not found")
        
    if skill.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this skill")
        
    db.delete(skill)
    db.commit()
    return {"message": "Skill deleted successfully"}
