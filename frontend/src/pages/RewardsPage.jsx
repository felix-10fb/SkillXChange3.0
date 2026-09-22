import React, { useState, useEffect } from 'react';
import { Flame, Coins, Gift, ShoppingBag, Sparkles, CheckCircle2, History, ShieldCheck } from 'lucide-react';
import { api, setUser } from '../api/client';

export default function RewardsPage({ currentUser, onUserUpdated, showToast, onOpenAuth }) {
  const [rewards, setRewards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [claiming, setClaiming] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadRewardsData();
    }
  }, [currentUser]);

  const loadRewardsData = async () => {
    try {
      const [r, t] = await Promise.all([
        api.getRewards(),
        api.getTransactions()
      ]);
      setRewards(r);
      setTransactions(t);
    } catch (err) {
      console.error("Failed to load rewards data:", err);
    }
  };

  const handleClaimStreak = async () => {
    setClaiming(true);
    try {
      const updatedUser = await api.claimDailyCheckin();
      setUser(updatedUser);
      onUserUpdated(updatedUser);
      showToast(`🔥 Daily Streak Claimed! You earned +${15 + Math.min(updatedUser.streak_count * 5, 50)} SkillCoins! 🪙`);
      loadRewardsData();
    } catch (err) {
      showToast(err.message || "Streak already claimed today.");
    } finally {
      setClaiming(false);
    }
  };

  const handleRedeemReward = async (reward) => {
    setRedeeming(true);
    try {
      const res = await api.redeemReward(reward.id);
      showToast(`Redeemed "${reward.title}"! Code: ${res.claim_code}`);
      const updated = { ...currentUser, skillcoins: res.remaining_skillcoins };
      setUser(updated);
      onUserUpdated(updated);
      loadRewardsData();
    } catch (err) {
      showToast(err.message || "Redemption failed.");
    } finally {
      setRedeeming(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="mx-4 my-12 p-12 glass-panel text-center max-w-md mx-auto space-y-4">
        <Gift className="w-16 h-16 text-[#DE5E44] mx-auto" />
        <h2 className="text-2xl font-black text-[#2C1F56] dark:text-white">Streaks & Reward Store</h2>
        <p className="text-xs text-slate-500">Sign in to claim daily login streaks, view your SkillCoin balance, and redeem perks!</p>
        <button onClick={onOpenAuth} className="btn-primary text-xs py-2.5 px-6 inline-flex">
          Sign In / Register
        </button>
      </div>
    );
  }

  const streakDays = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="mx-4 my-6 space-y-8 pb-12">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Streak Flame Banner Left */}
        <div className="lg:col-span-6 glass-panel p-8 border-l-4 border-l-[#DE5E44] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#DE5E44]/15 border border-[#DE5E44]/30 flex items-center justify-center">
                <Flame className="w-8 h-8 text-[#DE5E44] animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#2C1F56] dark:text-white font-['Outfit']">
                  {currentUser.streak_count} Day Streak! 🔥
                </h2>
                <p className="text-xs text-slate-500">Log in daily to boost your multiplier</p>
              </div>
            </div>

            <button
              onClick={handleClaimStreak}
              disabled={claiming}
              className="btn-primary text-xs py-2.5 px-4"
            >
              {claiming ? "Claiming..." : "Claim Today's Bonus"}
            </button>
          </div>

          {/* 7-Day Flame Track */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {streakDays.map((d) => {
              const isPassed = d <= (currentUser.streak_count % 7 || 7);
              return (
                <div 
                  key={d}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 text-xs font-black ${
                    isPassed 
                      ? 'bg-[#DE5E44]/15 border-[#DE5E44]/40 text-[#DE5E44]' 
                      : 'bg-slate-900/5 dark:bg-slate-900/40 border-slate-900/10 text-slate-400'
                  }`}
                >
                  <span>D{d}</span>
                  {isPassed ? <CheckCircle2 className="w-4 h-4 text-[#DE5E44]" /> : <Coins className="w-4 h-4 text-slate-400" />}
                  <span className="text-[9px]">+{15 + d * 5}🪙</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SkillCoin Wallet Right */}
        <div className="lg:col-span-6 glass-panel p-8 border-l-4 border-l-[#F4D35E] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Coins className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">SkillCoin Treasury</div>
                <div className="text-3xl font-black text-[#2C1F56] dark:text-amber-400 font-['Outfit']">
                  {currentUser.skillcoins} 🪙
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Earn SkillCoins by teaching skills, maintaining login streaks, or completing mentorship sessions. Spend coins to redeem store vouchers below!
          </p>
        </div>
      </div>

      {/* Reward Store Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#2C1F56] dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#DE5E44]" />
            <span>SkillCoin Reward Store</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards.map((r) => {
            const canAfford = currentUser.skillcoins >= r.coin_price;
            return (
              <div 
                key={r.id}
                className="glass-panel glass-panel-hover p-5 flex flex-col justify-between border border-slate-900/10 dark:border-white/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{r.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#2C1F56]/10 text-[#2C1F56] dark:text-purple-300">
                      {r.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#2C1F56] dark:text-white mb-1">{r.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">{r.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-900/10 dark:border-white/10">
                  <div className="text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    <span>{r.coin_price} 🪙</span>
                  </div>

                  <button
                    onClick={() => handleRedeemReward(r)}
                    disabled={!canAfford || redeeming}
                    className={`btn-primary text-xs py-1.5 px-3 ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {canAfford ? "Redeem" : "Need 🪙"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-lg font-bold text-[#2C1F56] dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-[#DE5E44]" />
          <span>Recent SkillCoin Transactions</span>
        </h3>

        <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-900/10 dark:border-white/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/5 dark:bg-slate-900/50 text-slate-500 font-bold border-b border-slate-900/10 dark:border-white/10 uppercase text-[10px]">
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/5 dark:divide-white/5">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">{t.description}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-medium">{t.transaction_type}</td>
                  <td className={`py-2.5 px-3 text-right font-black ${t.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {t.amount > 0 ? `+${t.amount}` : t.amount} 🪙
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
