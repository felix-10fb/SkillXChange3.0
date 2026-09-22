import React from 'react';
import { Flame, Coins, MessageSquare, ShieldCheck, Plus, LogIn, LogOut, Award, RefreshCw, UserCheck } from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  onOpenAuth, 
  onLogout, 
  onOpenCreateSkill, 
  onOpenStreak, 
  onOpenRewards, 
  onOpenChat, 
  onOpenAdmin,
  onOpenExchanges,
  activeExchangesCount
}) {
  return (
    <nav className="glass-panel sticky top-4 z-40 mx-4 my-3 px-6 py-3.5 flex items-center justify-between shadow-2xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-purple-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
            SX
          </div>
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
            Skill<span className="text-purple-400">X</span>Change
          </span>
          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
            v2.0
          </span>
        </div>
      </div>

      {/* User Actions & Stats */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <>
            {/* Daily Streak Counter */}
            <button 
              onClick={onOpenStreak} 
              className="streak-badge cursor-pointer transition-transform hover:scale-105"
              title="Daily Login Streak 🔥 - Click to claim daily bonus!"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{currentUser.streak_count} Days</span>
            </button>

            {/* SkillCoins Balance Badge */}
            <button 
              onClick={onOpenRewards}
              className="coin-badge cursor-pointer transition-transform hover:scale-105"
              title="SkillCoins Balance 🪙 - Click to visit Reward Store!"
            >
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{currentUser.skillcoins} 🪙</span>
            </button>

            {/* Exchanges button */}
            <button 
              onClick={onOpenExchanges}
              className="glass-button-secondary py-2 px-3 relative text-sm"
              title="My Skill Exchanges"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span className="hidden md:inline">Swaps</span>
              {activeExchangesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {activeExchangesCount}
                </span>
              )}
            </button>

            {/* Live Chatbox button */}
            <button 
              onClick={onOpenChat}
              className="glass-button-secondary py-2 px-3 text-sm relative"
              title="Direct Messages & Mentorship Chat"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Chat</span>
            </button>

            {/* Post Skill Button */}
            <button onClick={onOpenCreateSkill} className="glass-button text-sm py-2 px-3.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post Skill</span>
            </button>

            {/* Admin Dashboard (Visible to Admins) */}
            {currentUser.role === 'admin' && (
              <button 
                onClick={onOpenAdmin}
                className="bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-red-500/40 text-red-200 py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:from-red-600/50 hover:to-amber-600/50 transition-all shadow-lg shadow-red-900/20"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* Profile Avatar & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <img 
                src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`} 
                alt="Avatar"
                className="w-9 h-9 rounded-full border border-purple-400/40 bg-slate-800 object-cover"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-200 leading-tight">{currentUser.full_name}</div>
                <div className="text-[10px] font-semibold text-purple-400 capitalize">{currentUser.role}</div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button onClick={onOpenAuth} className="glass-button text-sm">
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </nav>
  );
}
