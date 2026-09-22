from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.database import engine, Base
from backend.seed import seed_database
from backend.routers import auth_router
from backend.routers import user_router
from backend.routers import skill_router
from backend.routers import exchange_router
from backend.routers import chat_router
from backend.routers import reward_router
from backend.routers import admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Skip heavy DB init on Vercel serverless (tables + seed already exist).
    # Only run create_all / seed locally or on first deploy.
    import os
    if not os.getenv("VERCEL"):
        try:
            print("Initializing Neon Postgres tables...")
            Base.metadata.create_all(bind=engine)
            seed_database()
        except Exception as e:
            print("Database startup error:", e)
    yield

app = FastAPI(
    title="SkillXChange 2.0 API Engine",
    description="FastAPI Powered Backend with Neon PostgreSQL, SkillCoins, Streaks & Live Chat",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for local development & Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(skill_router.router)
app.include_router(exchange_router.router)
app.include_router(chat_router.router)
app.include_router(reward_router.router)
app.include_router(admin_router.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "platform": "SkillXChange 2.0",
        "database": "Neon Postgres Connected",
        "backend": "FastAPI Powered"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
