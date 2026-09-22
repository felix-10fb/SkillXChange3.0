import React, { useState } from 'react';
import { X, Flame, Coins, Sparkles, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { api, setUser } from '../api/client';

export default function StreakModal({ isOpen, onClose, currentUser, onUserUpdated }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleClaim = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const updatedUser = await api.claimDailyCheckin();
      setUser(updatedUser);
      onUserUpdated(updatedUser);
      setMessage(`🔥 Daily Streak Claimed! You earned +${15 + Math.min(updatedUser.streak_count * 5, 50)} SkillCoins! 🪙`);
    } catch (err) {
      setError(err.message || "Streak already claimed today.");
    } finally {
      setLoading(false);
    }
  };

  const streakDays = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="modal-overlay">
      <div className="glass-panel p-8 max-w-md w-full relative border border-orange-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-1 mx-auto shadow-xl shadow-orange-500/30 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white font-['Outfit']">
            {currentUser.streak_count} Day Streak!
          </h2>
          <p className="text-xs text-slate-300">
            Log in daily to maintain your learning streak and earn bonus SkillCoins 🪙
          </p>
        </div>

        {/* 7-Day Streak Reward Track */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Weekly Reward Tracker</span>
            <span className="text-orange-400 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Bonus +5 🪙 / day
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {streakDays.map((d) => {
              const isPassed = d <= (currentUser.streak_count % 7 || 7);
              return (
                <div 
                  key={d}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold ${
                    isPassed 
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' 
                      : 'bg-slate-800/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>D{d}</span>
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                  ) : (
                    <Coins className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <span className="text-[9px]">+{15 + d * 5}🪙</span>
                </div>
              );
            })}
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-bounce">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 font-black py-3.5 rounded-xl text-base shadow-xl shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Flame className="w-5 h-5 fill-slate-950" />
          <span>{loading ? "Claiming Bonus..." : "Claim Today's Streak Bonus 🔥"}</span>
        </button>
      </div>
    </div>
  );
}
