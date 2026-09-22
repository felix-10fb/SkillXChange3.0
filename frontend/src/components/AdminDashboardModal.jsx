import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Users, Zap, RefreshCw, Coins, MessageSquare, Ban, Award, Plus, Search } from 'lucide-react';
import { api } from '../api/client';

export default function AdminDashboardModal({ isOpen, onClose, currentUser }) {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Grant coins sub-modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [grantAmount, setGrantAmount] = useState(100);
  const [grantReason, setGrantReason] = useState('Community Reward');

  useEffect(() => {
    if (isOpen && currentUser?.role === 'admin') {
      loadAdminData();
    }
  }, [isOpen, currentUser]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers()
      ]);
      setStats(s);
      setUsersList(u);
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantCoins = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.grantCoins(selectedUser.id, grantAmount, grantReason);
      setMessage(`Granted ${grantAmount} SkillCoins to ${selectedUser.full_name}! 🪙`);
      setSelectedUser(null);
      loadAdminData();
    } catch (err) {
      alert("Failed to grant coins: " + err.message);
    }
  };

  const handleToggleBan = async (userId) => {
    try {
      await api.toggleBan(userId);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      await api.toggleRole(userId);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isOpen || currentUser?.role !== 'admin') return null;

  const filteredUsers = usersList.filter((u) => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="glass-panel p-8 max-w-4xl w-full relative border border-red-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-['Outfit']">Administrator Portal</h2>
              <p className="text-xs text-slate-300">Platform overview, user moderation & SkillCoin treasury</p>
            </div>
          </div>

          <button onClick={loadAdminData} className="glass-button-secondary text-xs py-1.5 px-3">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
            {message}
          </div>
        )}

        {/* Metrics Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-1">Total Users</div>
              <div className="text-xl font-extrabold text-white font-['Outfit']">{stats.total_users}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-1">Active Skills</div>
              <div className="text-xl font-extrabold text-purple-400 font-['Outfit']">{stats.total_skills}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-1">Total Swaps</div>
              <div className="text-xl font-extrabold text-emerald-400 font-['Outfit']">{stats.total_exchanges}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-1">Messages</div>
              <div className="text-xl font-extrabold text-blue-400 font-['Outfit']">{stats.total_chat_messages}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400 font-semibold mb-1">Coins Circulating</div>
              <div className="text-xl font-extrabold text-yellow-400 font-['Outfit']">{stats.total_coins_circulating} 🪙</div>
            </div>
          </div>
        )}

        {/* Users Table Header & Search */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Directory & Management</h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name/email..."
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="max-h-[300px] overflow-y-auto rounded-xl border border-white/10 bg-slate-950/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-bold border-b border-white/10 uppercase text-[10px]">
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Streak 🔥</th>
                <th className="py-2.5 px-3">Coins 🪙</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-4 flex items-center gap-2.5">
                    <img src={u.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full bg-slate-800" />
                    <div>
                      <div className="font-bold text-slate-200">{u.full_name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-orange-400">{u.streak_count} Days</td>
                  <td className="py-2.5 px-3 font-bold text-yellow-400">{u.skillcoins} 🪙</td>
                  <td className="py-2.5 px-3 text-right space-x-1">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 rounded font-bold text-[10px]"
                      title="Grant Bonus SkillCoins"
                    >
                      + Grant 🪙
                    </button>
                    {u.id !== currentUser.id && (
                      <>
                        <button
                          onClick={() => handleToggleRole(u.id)}
                          className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded font-bold text-[10px]"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote Admin'}
                        </button>
                        <button
                          onClick={() => handleToggleBan(u.id)}
                          className={`px-2 py-1 rounded font-bold text-[10px] ${
                            u.is_banned 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {u.is_banned ? 'Unban' : 'Suspend'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grant Coins Sub-Modal Popup */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-6 max-w-sm w-full border border-yellow-500/40 space-y-4">
              <h3 className="text-lg font-bold text-white">Grant SkillCoins to {selectedUser.full_name}</h3>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Amount 🪙</label>
                <input
                  type="number"
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedUser(null)} className="glass-button-secondary w-full text-xs py-2 justify-center">
                  Cancel
                </button>
                <button onClick={handleGrantCoins} className="glass-button w-full text-xs py-2 justify-center bg-yellow-500 text-black font-bold">
                  Grant Coins
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
