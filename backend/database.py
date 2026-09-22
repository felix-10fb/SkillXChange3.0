import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool, QueuePool
from backend.config import DATABASE_URL

# Detect if we're running in Vercel's serverless environment
# Vercel sets the VERCEL environment variable automatically
IS_SERVERLESS = os.getenv("VERCEL") is not None

# Use NullPool in serverless (Vercel) to avoid connection leaks across Lambda invocations.
# Use QueuePool with sensible limits for long-running local/uvicorn deployments.
if IS_SERVERLESS:
    engine = create_engine(
        DATABASE_URL,
        poolclass=NullPool,      # No persistent connection pool — safe for serverless
    )
else:
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_pre_ping=True,      # Recycle stale connections
        pool_size=5,
        max_overflow=10,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
