import React, { useState, useEffect } from 'react';
import { X, Coins, ShoppingBag, Sparkles, Check, ShieldCheck, Award, Zap } from 'lucide-react';
import { api, setUser } from '../api/client';

export default function RewardStoreModal({ isOpen, onClose, currentUser, onUserUpdated }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadRewards();
    }
  }, [isOpen]);

  const loadRewards = async () => {
    try {
      const data = await api.getRewards();
      setRewards(data);
    } catch (err) {
      console.error("Failed to load rewards:", err);
    }
  };

  const handleRedeem = async (reward) => {
    setLoading(true);
    setRedeemedCode('');
    setError('');

    try {
      const res = await api.redeemReward(reward.id);
      setRedeemedCode(`Redeemed "${reward.title}"! Claim Code: ${res.claim_code}`);
      
      if (currentUser) {
        const updated = { ...currentUser, skillcoins: res.remaining_skillcoins };
        setUser(updated);
        onUserUpdated(updated);
      }
    } catch (err) {
      setError(err.message || "Failed to redeem reward.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel p-8 max-w-2xl w-full relative border border-yellow-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-['Outfit']">SkillCoin Reward Store</h2>
              <p className="text-xs text-slate-300">Spend your hard-earned SkillCoins 🪙 on exclusive perks & boosts</p>
            </div>
          </div>

          <div className="coin-badge py-1 px-3 text-sm">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{currentUser.skillcoins} 🪙 Balance</span>
          </div>
        </div>

        {redeemedCode && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
            {redeemedCode}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
          {rewards.map((r) => {
            const canAfford = currentUser.skillcoins >= r.coin_price;
            return (
              <div 
                key={r.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between hover:border-yellow-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{r.icon}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
                      {r.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{r.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{r.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{r.coin_price} 🪙</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(r)}
                    disabled={!canAfford || loading}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      canAfford 
                        ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-200 cursor-pointer' 
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? "Redeem Perk" : "Need More 🪙"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
