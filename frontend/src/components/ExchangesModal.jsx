import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle, Clock, XCircle, ArrowRight, Coins } from 'lucide-react';
import { api } from '../api/client';

export default function ExchangesModal({ isOpen, onClose, currentUser, onExchangesUpdated }) {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadExchanges();
    }
  }, [isOpen, currentUser]);

  const loadExchanges = async () => {
    setLoading(true);
    try {
      const data = await api.getExchanges();
      setExchanges(data);
      if (onExchangesUpdated) onExchangesUpdated(data.length);
    } catch (err) {
      console.error("Failed to load exchanges:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (exchangeId, status) => {
    try {
      await api.updateExchangeStatus(exchangeId, status);
      loadExchanges();
    } catch (err) {
      alert("Status update failed: " + err.message);
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel p-8 max-w-2xl w-full relative border border-purple-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-['Outfit']">Skill Swap Requests</h2>
              <p className="text-xs text-slate-300">Track active mentorship proposals & complete sessions to earn SkillCoins</p>
            </div>
          </div>

          <button onClick={loadExchanges} className="glass-button-secondary text-xs py-1.5 px-3">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>

        {/* Exchanges List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {exchanges.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No skill swaps requested yet. Click "Request Swap" on any skill post!
            </div>
          ) : (
            exchanges.map((ex) => {
              const isProvider = currentUser.id === ex.provider_id;
              return (
                <div 
                  key={ex.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{ex.skill_title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ex.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        ex.status === 'accepted' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        ex.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {ex.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>Requester: <strong className="text-slate-200">{ex.requester_name}</strong></span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span>Host: <strong className="text-slate-200">{ex.provider_name}</strong></span>
                    </div>

                    <div className="text-xs font-bold text-yellow-400 flex items-center gap-1 pt-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{ex.coin_amount} SkillCoins 🪙</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {ex.status === 'pending' && isProvider && (
                      <button
                        onClick={() => handleUpdateStatus(ex.id, 'accepted')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs"
                      >
                        Accept Swap
                      </button>
                    )}

                    {ex.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(ex.id, 'completed')}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-bold text-xs"
                      >
                        Complete & Pay 🪙
                      </button>
                    )}

                    {ex.status !== 'completed' && ex.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(ex.id, 'cancelled')}
                        className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs"
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
    </div>
  );
}
