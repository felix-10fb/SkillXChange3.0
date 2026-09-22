import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, ArrowRight, Coins, Clock, XCircle, LayoutDashboard } from 'lucide-react';
import { api } from '../api/client';

export default function DashboardPage({ currentUser, onOpenAuth, showToast, setExchangesCount }) {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadExchanges();
    }
  }, [currentUser]);

  const loadExchanges = async () => {
    setLoading(true);
    try {
      const data = await api.getExchanges();
      setExchanges(data);
      if (setExchangesCount) setExchangesCount(data.length);
    } catch (err) {
      console.error("Failed to load exchanges:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (exchangeId, status) => {
    try {
      await api.updateExchangeStatus(exchangeId, status);
      showToast(`Skill swap status updated to "${status}"!`);
      loadExchanges();
    } catch (err) {
      showToast("Update failed: " + err.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="mx-4 my-12 p-12 glass-panel text-center max-w-md mx-auto space-y-4">
        <LayoutDashboard className="w-16 h-16 text-[#DE5E44] mx-auto" />
        <h2 className="text-2xl font-black text-[#2C1F56] dark:text-white">My Skill Swaps Dashboard</h2>
        <p className="text-xs text-slate-500">Sign in to manage active mentorship requests and track coin earnings!</p>
        <button onClick={onOpenAuth} className="btn-primary text-xs py-2.5 px-6 inline-flex">
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 my-6 space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-8 border-l-4 border-l-[#2C1F56] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#2C1F56] dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-1">
            <RefreshCw className="w-4 h-4" />
            <span>MY MENTORSHIP WORKSPACE</span>
          </div>
          <h1 className="text-3xl font-black" style={{ color: '#2C1F56' }}>Skill Swaps & Sessions</h1>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Approve requested mentorship sessions and complete exchanges to receive SkillCoin payouts</p>
        </div>

        <button onClick={loadExchanges} className="btn-ghost text-xs py-2 px-3.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Swaps</span>
        </button>
      </div>

      {/* Exchanges Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#DE5E44]" />
            <span>Loading active exchanges...</span>
          </div>
        ) : exchanges.length === 0 ? (
          <div className="glass-panel p-12 text-center max-w-md mx-auto space-y-3">
            <RefreshCw className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
            <h3 className="text-xl font-bold text-[#2C1F56] dark:text-white">No Swaps Yet</h3>
            <p className="text-xs text-slate-500">Explore the Skill Marketplace to request your first 1-on-1 session!</p>
          </div>
        ) : (
          exchanges.map((ex) => {
            const isProvider = currentUser.id === ex.provider_id;
            return (
              <div 
                key={ex.id}
                className="glass-panel glass-panel-hover p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-[#DE5E44]"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-[#2C1F56] dark:text-white">{ex.skill_title}</span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase ${
                      ex.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                      ex.status === 'accepted' ? 'bg-[#2C1F56]/15 text-[#2C1F56] dark:text-purple-300 border border-[#2C1F56]/30' :
                      ex.status === 'cancelled' ? 'bg-red-500/15 text-red-500 border border-red-500/30' :
                      'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}>
                      {ex.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Requester: <strong className="text-slate-800 dark:text-slate-200">{ex.requester_name}</strong></span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Skill Host: <strong className="text-slate-800 dark:text-slate-200">{ex.provider_name}</strong></span>
                  </div>

                  <div className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
                    <Coins className="w-4 h-4" />
                    <span>{ex.coin_amount} SkillCoins 🪙</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {ex.status === 'pending' && isProvider && (
                    <button
                      onClick={() => handleUpdateStatus(ex.id, 'accepted')}
                      className="btn-primary text-xs py-2 px-4"
                    >
                      Accept Swap
                    </button>
                  )}

                  {ex.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(ex.id, 'completed')}
                      className="btn-secondary text-xs py-2 px-4"
                    >
                      Complete Session & Pay 🪙
                    </button>
                  )}

                  {ex.status !== 'completed' && ex.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(ex.id, 'cancelled')}
                      className="btn-ghost text-xs py-2 px-3 text-red-500 hover:bg-red-500/10"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
