import sys
import os

# Add the project root to sys.path so `from backend.xxx import ...` resolves correctly
# on Vercel's serverless runtime, which runs from the /var/task directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app  # noqa: E402 — must come after sys.path fix
