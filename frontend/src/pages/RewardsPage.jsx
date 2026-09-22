import React, { useState, useEffect } from 'react';
import { Flame, Coins, Gift, Star, ShoppingBag, Clock, CheckCircle, Zap, TrendingUp, Lock } from 'lucide-react';
import { api } from '../api/client';

const REWARD_STORE = [
  { id: 1, title: '7-Day Streak Shield', desc: 'Protect your streak if you miss 1 day.', price: 50, icon: '🛡️', category: 'Boosters', color: '#DE5E44' },
  { id: 2, title: 'Gold Mentor Badge', desc: 'Exclusive profile badge for top teachers.', price: 150, icon: '👑', category: 'Badges', color: '#F4D35E' },
  { id: 3, title: 'Featured Skill Boost', desc: 'Pin your skill to the top for 14 days.', price: 100, icon: '🚀', category: 'Promotions', color: '#8B7BB5' },
  { id: 4, title: 'VIP Mentorship Pass', desc: 'Priority 60-min 1-on-1 session with a Pro.', price: 200, icon: '🎓', category: 'Vouchers', color: '#4DA1A9' },
  { id: 5, title: 'Double Coin Weekend', desc: 'Earn 2× SkillCoins for 48 hours.', price: 75, icon: '🌟', category: 'Boosters', color: '#F4D35E' },
  { id: 6, title: 'Custom Avatar Frame', desc: 'Animated coral frame for your profile.', price: 60, icon: '🖼️', category: 'Cosmetics', color: '#DE5E44' },
];

const STREAK_MILESTONES = [
  { days: 3, reward: 15, icon: '🌱' },
  { days: 7, reward: 50, icon: '🔥' },
  { days: 14, reward: 120, icon: '⚡' },
  { days: 30, reward: 300, icon: '👑' },
  { days: 60, reward: 750, icon: '🌟' },
  { days: 100, reward: 1500, icon: '💎' },
];

function StatBox({ icon, label, value, color, glow }) {
  return (
    <div style={{
      padding: '1.5rem', borderRadius: '20px',
      background: 'var(--bg-surface)', border: `1px solid ${color}30`,
      boxShadow: `0 8px 32px ${glow || 'rgba(0,0,0,0.3)'}`,
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${glow || 'rgba(0,0,0,0.4)'}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 32px ${glow || 'rgba(0,0,0,0.3)'}`; }}
    >
      <div style={{ fontSize: '1.75rem' }}>{icon}</div>
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 900,
        letterSpacing: '-0.03em', color,
      }}>
        {value}
      </div>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  );
}

export default function RewardsPage({ currentUser, onUserUpdated, showToast, onOpenAuth }) {
  const [claiming, setClaiming] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [redeeming, setRedeeming] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [activeTab, setActiveTab] = useState('store');

  // Check if daily claim is available
  useEffect(() => {
    if (!currentUser) return;
    const last = currentUser.last_checkin;
    if (!last) { setCanClaim(true); return; }
    const hoursSince = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60);
    setCanClaim(hoursSince >= 20);
  }, [currentUser]);

  // Load transaction history when tab changes
  useEffect(() => {
    if (activeTab === 'history' && currentUser) {
      setLoadingTx(true);
      api.getTransactions()
        .then(setTransactions)
        .catch(() => showToast('Could not load history', 'error'))
        .finally(() => setLoadingTx(false));
    }
  }, [activeTab, currentUser]);

  if (!currentUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', padding: '2rem' }}>
        <div style={{ fontSize: '4rem' }}>🔒</div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Sign in to access Rewards
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '360px' }}>
          Log in or create an account to earn SkillCoins, maintain streaks, and redeem exclusive rewards.
        </p>
        <button onClick={onOpenAuth} className="btn btn-primary btn-lg">
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleDailyCheckin = async () => {
    if (!canClaim || claiming) return;
    setClaiming(true);
    try {
      const updated = await api.claimDailyCheckin();
      onUserUpdated(updated);
      setCanClaim(false);
      const bonusCoins = 15 + Math.min(updated.streak_count * 5, 50);
      showToast(`🔥 Streak Day ${updated.streak_count}! You earned ${bonusCoins} 🪙`, 'success');
    } catch (err) {
      showToast(err.message || 'Already claimed today!', 'error');
    } finally {
      setClaiming(false);
    }
  };

  const handleRedeem = async (reward) => {
    if ((currentUser.skillcoins || 0) < reward.price) {
      showToast(`Not enough SkillCoins! Need ${reward.price} 🪙`, 'error');
      return;
    }
    setRedeeming(reward.id);
    try {
      const result = await api.redeemReward(reward.id);
      if (result?.user) onUserUpdated(result.user);
      showToast(`🎉 Redeemed: ${reward.title}!`, 'success');
    } catch (err) {
      showToast(err.message || 'Redemption failed', 'error');
    } finally {
      setRedeeming(null);
    }
  };

  const streakPct = Math.min((currentUser.streak_count / 7) * 100, 100);
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > (currentUser.streak_count || 0));

  return (
    <div style={{ padding: '2rem 1.5rem 6rem', maxWidth: '1280px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Rewards & Streaks</h1>
        <p className="section-sub">Earn daily coins, maintain your streak, and redeem exclusive rewards.</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatBox icon="🔥" label="Current Streak" value={`${currentUser.streak_count ?? 0} Days`} color="var(--coral-light)" glow="rgba(222,94,68,0.2)" />
        <StatBox icon="🪙" label="SkillCoins" value={currentUser.skillcoins ?? 0} color="var(--gold)" glow="rgba(244,211,94,0.15)" />
        <StatBox icon="📅" label="Total Checkins" value={currentUser.streak_count ?? 0} color="#8B7BB5" glow="rgba(139,123,181,0.15)" />
        <StatBox icon="⭐" label="Rank" value={currentUser.role === 'admin' ? 'Admin' : currentUser.skillcoins > 500 ? 'Pro' : 'Learner'} color="#4DA1A9" glow="rgba(77,161,169,0.15)" />
      </div>

      {/* Daily Streak Claim Card */}
      <div style={{
        padding: '2rem 2.5rem', borderRadius: '24px', marginBottom: '2rem',
        background: canClaim
          ? 'linear-gradient(135deg, rgba(222,94,68,0.18), rgba(74,56,128,0.25))'
          : 'var(--bg-surface)',
        border: `1px solid ${canClaim ? 'rgba(222, 94, 68, 0.5)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: canClaim ? 'var(--shadow-coral)' : 'var(--shadow-card)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem',
      }}>
        {/* Flame visual */}
        <div style={{
          width: 80, height: 80, borderRadius: '20px',
          background: 'rgba(222, 94, 68, 0.15)', border: '2px solid rgba(222,94,68,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', flexShrink: 0,
          animation: canClaim ? 'flamePulse 1.5s ease-in-out infinite' : 'none',
        }}>
          🔥
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Daily Streak Check-In
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            {canClaim
              ? `Day ${(currentUser.streak_count ?? 0) + 1} awaits! Claim your ${15 + Math.min(((currentUser.streak_count ?? 0) + 1) * 5, 50)} 🪙 bonus.`
              : 'You have already claimed today. Come back tomorrow for your next reward!'}
          </p>

          {/* Progress bar to next milestone */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-faint)', marginBottom: '4px' }}>
              <span>{currentUser.streak_count ?? 0} days</span>
              <span>{nextMilestone ? `${nextMilestone.days} days for ${nextMilestone.icon} +${nextMilestone.reward}🪙` : '🏆 Max milestone reached!'}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${streakPct}%` }} />
            </div>
          </div>
        </div>

        <button
          onClick={handleDailyCheckin}
          disabled={!canClaim || claiming}
          className={`btn ${canClaim ? 'btn-primary' : 'btn-ghost'} btn-lg`}
          style={{ flexShrink: 0, opacity: canClaim ? 1 : 0.5, cursor: canClaim ? 'pointer' : 'not-allowed' }}
        >
          {claiming ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Claiming...
            </span>
          ) : canClaim ? (
            <><Flame size={18} /> Claim Daily Bonus</>
          ) : (
            <><Clock size={18} /> Come Back Tomorrow</>
          )}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Streak Milestones */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          🏆 Streak Milestones
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {STREAK_MILESTONES.map((m) => {
            const achieved = (currentUser.streak_count ?? 0) >= m.days;
            return (
              <div key={m.days} style={{
                flex: '0 0 auto', width: '140px', padding: '1.25rem 1rem',
                borderRadius: '16px', textAlign: 'center',
                background: achieved ? 'rgba(244,211,94,0.12)' : 'var(--bg-surface)',
                border: `1px solid ${achieved ? 'rgba(244,211,94,0.5)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: achieved ? 'var(--shadow-gold)' : 'var(--shadow-card)',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem', filter: achieved ? 'none' : 'grayscale(80%)' }}>{m.icon}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 900, color: achieved ? 'var(--gold)' : 'var(--text-muted)' }}>
                  {m.days} Days
                </div>
                <div style={{ fontSize: '0.72rem', color: achieved ? 'var(--gold)' : 'var(--text-faint)', fontWeight: 700, marginTop: '2px' }}>
                  +{m.reward} 🪙
                </div>
                {achieved && <CheckCircle size={14} style={{ color: '#4CAF50', marginTop: '0.4rem' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', width: 'fit-content' }}>
        {[
          { key: 'store', label: '🛒 Reward Store' },
          { key: 'history', label: '📊 Coin History' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
              background: activeTab === tab.key ? 'var(--coral)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
              fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reward Store */}
      {activeTab === 'store' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {REWARD_STORE.map((reward) => {
            const canAfford = (currentUser.skillcoins ?? 0) >= reward.price;
            const isRedeeming = redeeming === reward.id;
            return (
              <div key={reward.id} style={{
                padding: '1.75rem', borderRadius: '20px',
                background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${reward.color}50`; e.currentTarget.style.boxShadow = `0 20px 50px ${reward.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{reward.icon}</span>
                  <span style={{
                    padding: '0.35rem 0.7rem', borderRadius: '9999px',
                    background: `${reward.color}18`, border: `1px solid ${reward.color}40`,
                    color: reward.color, fontSize: '0.72rem', fontWeight: 800,
                  }}>
                    {reward.category}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {reward.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{reward.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: 'var(--gold)' }}>
                      {reward.price}
                    </span>
                    <span style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>🪙</span>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isRedeeming}
                    className={`btn btn-sm ${canAfford ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ opacity: canAfford ? 1 : 0.5, cursor: canAfford ? 'pointer' : 'not-allowed' }}
                  >
                    {isRedeeming ? '...' : canAfford ? <><ShoppingBag size={14} />Redeem</> : <><Lock size={14} />Need {reward.price - (currentUser.skillcoins ?? 0)} more</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coin History */}
      {activeTab === 'history' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
          {loadingTx ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading history...</div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              No transactions yet. Start earning SkillCoins!
            </div>
          ) : (
            <div>
              {transactions.map((tx, i) => (
                <div key={tx.id || i} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderBottom: i < transactions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'background 0.15s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '12px',
                    background: tx.amount > 0 ? 'rgba(76, 175, 80, 0.12)' : 'rgba(220, 50, 50, 0.12)',
                    border: `1px solid ${tx.amount > 0 ? 'rgba(76,175,80,0.3)' : 'rgba(220,50,50,0.3)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {tx.amount > 0 ? '🪙' : '💸'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.description}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                      {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, flexShrink: 0,
                    color: tx.amount > 0 ? '#4CAF50' : '#FF6060',
                  }}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 🪙
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
