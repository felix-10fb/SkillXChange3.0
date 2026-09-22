import React from 'react';
import { Flame, Coins, Zap, Shield, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export default function HeroBanner({ onOpenCreateSkill, onOpenAuth, currentUser, onDemoLogin }) {
  return (
    <div className="mx-4 my-6 p-8 rounded-3xl glass-panel relative overflow-hidden border border-purple-500/20 shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            <span>GAMIFIED SKILL EXCHANGE & REWARDS ECONOMY</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Exchange Knowledge. <br />
            Earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">SkillCoins</span> & Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Streaks</span> 🔥
          </h1>

          <p className="text-slate-300 text-base max-w-xl leading-relaxed">
            SkillXChange 2.0 connects passionate learners and mentors worldwide. Teach your expertise to earn SkillCoins, keep your daily learning streak alive, and build real human connections through interactive chat.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {currentUser ? (
              <button onClick={onOpenCreateSkill} className="glass-button text-base px-6 py-3">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span>Post Your First Skill</span>
              </button>
            ) : (
              <button onClick={onOpenAuth} className="glass-button text-base px-6 py-3">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Demo Login Bar (If not logged in) */}
          {!currentUser && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                ⚡ Quick Demo One-Click Sign In:
              </span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => onDemoLogin('admin@skillxchange.com', 'admin123')}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Mode</span>
                </button>
                <button 
                  onClick={() => onDemoLogin('alex@skillxchange.com', 'alex123')}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all"
                >
                  Alex (React Pro)
                </button>
                <button 
                  onClick={() => onDemoLogin('sarah@skillxchange.com', 'sarah123')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all"
                >
                  Sarah (UI/UX)
                </button>
                <button 
                  onClick={() => onDemoLogin('david@skillxchange.com', 'david123')}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all"
                >
                  David (Spanish)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Metric Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900/60 border border-purple-500/30 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white font-['Outfit']">100% Peer</div>
            <div className="text-xs text-slate-400 font-medium">Direct Mentorship Swaps</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/30 to-slate-900/60 border border-amber-500/30 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-['Outfit']">SkillCoins</div>
            <div className="text-xs text-slate-400 font-medium">In-App Economy & Rewards</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-900/30 to-slate-900/60 border border-orange-500/30 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-white font-['Outfit']">Daily Streaks</div>
            <div className="text-xs text-slate-400 font-medium">Keep Learning Alive 🔥</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-slate-900/60 border border-emerald-500/30 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-['Outfit']">Neon SQL</div>
            <div className="text-xs text-slate-400 font-medium">PostgreSQL Engine</div>
          </div>
        </div>
      </div>
    </div>
  );
}
