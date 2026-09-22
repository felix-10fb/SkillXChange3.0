import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Coins, Zap, Shield, Sparkles, ArrowRight, BookOpen, Users, RefreshCw, Star, CheckCircle } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function HomePage({ currentUser, onOpenAuth, onDemoLogin, onOpenCreateSkill }) {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section Banner */}
      <div className="mx-4 my-6 p-10 rounded-3xl glass-panel relative overflow-hidden border-2 border-[#DE5E44]/20 shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DE5E44]/10 border border-[#DE5E44]/30 text-[#DE5E44] text-xs font-black tracking-wide">
              <Sparkles className="w-4 h-4 animate-spin text-[#DE5E44]" />
              <span>THE NEXT-GEN GAMIFIED SKILL EXCHANGE MARKETPLACE</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight" style={{ color: '#2C1F56' }}>
              Exchange Knowledge. <br />
              Earn <span className="text-[#DE5E44]">SkillCoins</span> & Daily <span className="text-[#F4D35E] drop-shadow-md">Streaks</span> 🔥
            </h1>

            <p className="text-base max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              SkillXChange connects developers, designers, language enthusiasts, and artists worldwide. Teach your expertise to earn SkillCoins, maintain your learning streak, and build real 1-on-1 mentorship connections.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/explore" className="btn-primary text-sm px-6 py-3.5">
                <Compass className="w-5 h-5" />
                <span>Explore Skills</span>
              </Link>

              {currentUser ? (
                <button onClick={onOpenCreateSkill} className="btn-secondary text-sm px-6 py-3.5">
                  <Zap className="w-5 h-5 text-[#F4D35E]" />
                  <span>Post a Skill</span>
                </button>
              ) : (
                <button onClick={onOpenAuth} className="btn-secondary text-sm px-6 py-3.5">
                  <span>Join Free & Get 100 🪙</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* One-Click Quick Demo Sign In */}
            {!currentUser && (
              <div className="pt-4 border-t border-slate-900/10 dark:border-white/10 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider block text-slate-500">
                  ⚡ Quick Demo Accounts (One-Click Test Login):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => onDemoLogin('admin@skillxchange.com', 'admin123')}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-extrabold transition-all flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <span>Admin Mode</span>
                  </button>
                  <button 
                    onClick={() => onDemoLogin('alex@skillxchange.com', 'alex123')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2C1F56]/10 hover:bg-[#2C1F56]/20 border border-[#2C1F56]/30 text-[#2C1F56] dark:text-purple-300 text-xs font-extrabold transition-all"
                  >
                    Alex (React Pro)
                  </button>
                  <button 
                    onClick={() => onDemoLogin('sarah@skillxchange.com', 'sarah123')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#DE5E44]/10 hover:bg-[#DE5E44]/20 border border-[#DE5E44]/30 text-[#DE5E44] text-xs font-extrabold transition-all"
                  >
                    Sarah (UI/UX)
                  </button>
                  <button 
                    onClick={() => onDemoLogin('david@skillxchange.com', 'david123')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-extrabold transition-all"
                  >
                    David (Spanish)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hero Right Visual Logo Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-[#2C1F56]/10 to-[#DE5E44]/10 border border-[#DE5E44]/20 backdrop-blur-md text-center space-y-6">
            <BrandLogo size="xl" showText={false} animated={true} />
            <div>
              <h3 className="text-2xl font-black text-[#2C1F56] dark:text-white">SkillXChange Platform</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Powered by FastAPI & Neon PostgreSQL</p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full text-left">
              <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-900/10 dark:border-white/10">
                <div className="text-xs text-slate-500 font-bold">In-App Currency</div>
                <div className="text-lg font-black text-[#DE5E44] flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-500" /> SkillCoins 🪙
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-900/10 dark:border-white/10">
                <div className="text-xs text-slate-500 font-bold">Daily Streak</div>
                <div className="text-lg font-black text-[#DE5E44] flex items-center gap-1">
                  <Flame className="w-4 h-4 text-[#DE5E44]" /> Flame Bonus 🔥
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mx-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 space-y-3 border-l-4 border-l-[#2C1F56]">
          <div className="w-12 h-12 rounded-2xl bg-[#2C1F56]/10 flex items-center justify-center text-[#2C1F56] dark:text-purple-300 font-black">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#2C1F56] dark:text-white">Peer-to-Peer Mentorship</h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
            Trade coding, design, language, and music skills directly with verified tutors in 1-on-1 interactive sessions.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3 border-l-4 border-l-[#DE5E44]">
          <div className="w-12 h-12 rounded-2xl bg-[#DE5E44]/10 flex items-center justify-center text-[#DE5E44] font-black">
            <Coins className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#2C1F56] dark:text-white">Gamified Economy</h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
            Earn SkillCoins for every session you host, maintain login streaks, and redeem exclusive perks in the Reward Store.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3 border-l-4 border-l-[#F4D35E]">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-black">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#2C1F56] dark:text-white">Direct Messaging</h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
            Connect instantly via our built-in real-time chatbox to plan learning milestones and swap knowledge easily.
          </p>
        </div>
      </div>
    </div>
  );
}
