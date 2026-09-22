from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from backend.database import engine, Base, SessionLocal
from backend.models import User, Skill, RewardItem, ChatMessage, Exchange, CoinTransaction
from backend.auth import get_password_hash

def seed_database():
    print("Creating all tables in Neon Postgres...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.email == "admin@skillxchange.com").first()
        if not admin:
            print("Seeding Administrator account...")
            admin = User(
                username="admin",
                email="admin@skillxchange.com",
                full_name="Platform Admin",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                skillcoins=5000,
                streak_count=15,
                last_checkin=datetime.utcnow(),
                avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss",
                bio="Official Administrator for SkillXChange 2.0. Managing platform operations & user satisfaction."
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # Seed sample users if needed
        demo_users = [
            ("alex_dev", "alex@skillxchange.com", "Alex Rivera", "alex123", "Full-Stack Dev & React enthusiast! 🔥", "https://api.dicebear.com/7.x/bottts/svg?seed=AlexR", 250, 7),
            ("sarah_design", "sarah@skillxchange.com", "Sarah Chen", "sarah123", "UI/UX Designer passionate about Figma & modern web typography.", "https://api.dicebear.com/7.x/bottts/svg?seed=SarahC", 400, 12),
            ("david_lang", "david@skillxchange.com", "David Miller", "david123", "Polyglot teaching Spanish & German conversation.", "https://api.dicebear.com/7.x/bottts/svg?seed=DavidM", 180, 4),
            ("maya_music", "maya@skillxchange.com", "Maya Lin", "maya123", "Acoustic Guitarist & Vocal Coach. Let's make music!", "https://api.dicebear.com/7.x/bottts/svg?seed=MayaL", 320, 9),
        ]

        user_objs = {}
        for username, email, name, pwd, bio, avatar, coins, streak in demo_users:
            u = db.query(User).filter(User.email == email).first()
            if not u:
                u = User(
                    username=username,
                    email=email,
                    full_name=name,
                    hashed_password=get_password_hash(pwd),
                    role="user",
                    skillcoins=coins,
                    streak_count=streak,
                    last_checkin=datetime.utcnow(),
                    avatar_url=avatar,
                    bio=bio
                )
                db.add(u)
                db.commit()
                db.refresh(u)
            user_objs[username] = u

        # Seed skills
        if db.query(Skill).count() == 0:
            print("Seeding default Skill listings...")
            sample_skills = [
                Skill(
                    title="Full-Stack React & Next.js Architecture",
                    description="Learn how to build high-performance web applications with React, TailwindCSS, and state management.",
                    category="Technology",
                    skill_type="offer",
                    coin_price=30,
                    level="Advanced",
                    owner_id=user_objs["alex_dev"].id
                ),
                Skill(
                    title="Figma Design Systems & Modern UX/UI",
                    description="Master visual component libraries, glassmorphism UI tokens, and dynamic micro-interactions.",
                    category="Design",
                    skill_type="offer",
                    coin_price=25,
                    level="Intermediate",
                    owner_id=user_objs["sarah_design"].id
                ),
                Skill(
                    title="Spanish Conversational Mastery",
                    description="Fluent native Spanish sessions covering daily business and travel conversations.",
                    category="Languages",
                    skill_type="offer",
                    coin_price=20,
                    level="Beginner",
                    owner_id=user_objs["david_lang"].id
                ),
                Skill(
                    title="Acoustic Guitar Fingerpicking Basics",
                    description="Learn chords, melody lines, and rhythm techniques for acoustic guitar.",
                    category="Music",
                    skill_type="offer",
                    coin_price=35,
                    level="Beginner",
                    owner_id=user_objs["maya_music"].id
                ),
                Skill(
                    title="Looking for Python FastAPI & SQL Mentorship",
                    description="Seeking an expert to guide me through database indexing, Async ORM, and JWT authentication.",
                    category="Technology",
                    skill_type="request",
                    coin_price=40,
                    level="Intermediate",
                    owner_id=user_objs["sarah_design"].id
                )
            ]
            db.add_all(sample_skills)
            db.commit()

        # Seed Reward Store Items
        if db.query(RewardItem).count() == 0:
            print("Seeding Reward Store items...")
            rewards = [
                RewardItem(
                    title="🔥 7-Day Streak Saver Shield",
                    description="Protects your daily login streak count if you miss 1 day.",
                    coin_price=50,
                    icon="🛡️",
                    category="Boosters",
                    code="SHIELD-7DAY-STREAK"
                ),
                RewardItem(
                    title="👑 Gold Master Mentor Badge",
                    description="Exclusive shiny profile badge highlighting you as a top verified teacher.",
                    coin_price=150,
                    icon="👑",
                    category="Badges",
                    code="BADGE-GOLD-MENTOR"
                ),
                RewardItem(
                    title="🚀 Featured Skill Listing Boost",
                    description="Pin your offered skill post to the top of the SkillXChange home page for 14 days.",
                    coin_price=100,
                    icon="🚀",
                    category="Promotions",
                    code="BOOST-FEATURED-14D"
                ),
                RewardItem(
                    title="🎁 1-on-1 VIP Mentorship Voucher",
                    description="Unlocks a priority 60-minute direct session pass with any Pro tutor.",
                    coin_price=200,
                    icon="🎓",
                    category="Vouchers",
                    code="VOUCHER-VIP-PASS"
                )
            ]
            db.add_all(rewards)
            db.commit()

        # Seed sample chat messages
        if db.query(ChatMessage).count() == 0:
            print("Seeding sample chat messages...")
            msg1 = ChatMessage(
                sender_id=user_objs["sarah_design"].id,
                receiver_id=user_objs["alex_dev"].id,
                content="Hey Alex! Loved your React architecture post. Are you available for a skill swap this week?",
                is_read=True,
                timestamp=datetime.utcnow() - timedelta(hours=3)
            )
            msg2 = ChatMessage(
                sender_id=user_objs["alex_dev"].id,
                receiver_id=user_objs["sarah_design"].id,
                content="Hi Sarah! Absolutely! I'd love to exchange code tips for some Figma design advice.",
                is_read=True,
                timestamp=datetime.utcnow() - timedelta(hours=2)
            )
            db.add_all([msg1, msg2])
            db.commit()

        print("Database seeding completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
