import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_FcUS90aeNWbi@ep-icy-boat-b5143umf-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"
)

SECRET_KEY = os.getenv("SECRET_KEY", "skillxchange_ultra_secure_secret_key_2026_v3")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
