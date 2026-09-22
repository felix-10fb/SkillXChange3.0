# SkillXChange 2.0 🚀

A modern, gamified peer-to-peer Skill Exchange platform with FastAPI Python backend, Neon PostgreSQL database, SkillCoins economy, daily login streaks, live chatbox, and administrator dashboard.

![SkillXChange 2.0](https://img.shields.io/badge/Status-Production%20Ready-emerald)
![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20Python%203.13-purple)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-indigo)

---

## ✨ Features & Highlights

1. **⚡ Fast & Modern Architecture**:
   - **Backend**: Built with FastAPI, Pydantic schemas, SQLAlchemy ORM, and JWT authentication.
   - **Database**: Cloud-hosted **Neon PostgreSQL** database with dynamic schema auto-migrations and seed scripts.
   - **Frontend**: React + Vite SPA rendered in sleek dark glassmorphism, responsive across desktop and mobile.

2. **🔥 Gamification & Streaks**:
   - **Daily Login Streak Counter**: Earn bonus SkillCoins by keeping your daily learning streak active 🔥.
   - **Reward Boosters**: Claim weekly multipliers and streak shields.

3. **🪙 SkillCoins Economy**:
   - **Welcome Bonus**: Every newly registered user receives 100 SkillCoins.
   - **Earn Coins**: Host sessions and share skills to earn coins from learners.
   - **Spend Coins**: Redeem coins in the **Reward Store** for gold mentor badges, promoted posts, and VIP vouchers.

4. **💬 Interactive Live Chatbox**:
   - Direct messaging between skill hosts and learners to discuss session outlines, schedule video swaps, and build lasting professional connections.

5. **👑 Administrator Dashboard**:
   - Platform stats (total users, active posts, exchange count, circulating SkillCoins).
   - User control panel: Search users, grant bonus SkillCoins, promote/demote admins, or suspend abusive accounts.

---

## 🔑 Quick Demo Logins

| Role | Email | Password | Details |
|---|---|---|---|
| **Administrator** | `admin@skillxchange.com` | `admin123` | Full access to Admin Dashboard, coin grants & moderation |
| **User (React Pro)** | `alex@skillxchange.com` | `alex123` | Full-stack mentor with 250 SkillCoins & 7-day streak |
| **User (UI/UX)** | `sarah@skillxchange.com` | `sarah123` | Figma design tutor with 400 SkillCoins & 12-day streak |
| **User (Languages)** | `david@skillxchange.com` | `david123` | Spanish teacher with 180 SkillCoins & 4-day streak |

---

## 🛠️ Local Development Setup

### 1. Backend (FastAPI)
```bash
# Install dependencies
pip install -r requirements.txt

# Run database seeder (populates Neon Postgres tables & demo accounts)
python -m backend.seed

# Start FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
```
FastAPI interactive Swagger docs will be available at: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)
```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🌐 Vercel Deployment

This project contains a pre-configured `vercel.json` at root:
1. Connect your GitHub repository (`https://github.com/felix-10fb/SkillXChange3.0.git`) to Vercel.
2. Set Environment Variable in Vercel:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_FcUS90aeNWbi@ep-icy-boat-b5143umf-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require`
3. Click **Deploy**. Vercel will automatically build the React SPA and serve the FastAPI serverless API routes.
