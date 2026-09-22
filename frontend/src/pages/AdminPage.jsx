import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, RefreshCw, Coins, Users, Zap, MessageSquare, Ban, Award, Lock } from 'lucide-react';
import { api } from '../api/client';

export default function AdminPage({ currentUser, onOpenAuth, showToast }) {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Grant coins sub-modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [grantAmount, setGrantAmount] = useState(100);
  const [grantReason, setGrantReason] = useState('Platform Bonus');

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadAdminData();
    }
  }, [currentUser]);

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
      console.error("Admin error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantCoins = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.grantCoins(selectedUser.id, grantAmount, grantReason);
      showToast(`Granted ${grantAmount} SkillCoins to ${selectedUser.full_name}! 🪙`);
      setSelectedUser(null);
      loadAdminData();
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleToggleBan = async (userId) => {
    try {
      await api.toggleBan(userId);
      showToast("User status updated.");
      loadAdminData();
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      await api.toggleRole(userId);
      showToast("User role updated.");
      loadAdminData();
    } catch (err) {
      showToast(err.message);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="mx-4 my-12 p-12 glass-panel text-center max-w-md mx-auto space-y-4">
        <Lock className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-black text-red-600">Access Restricted</h2>
        <p className="text-xs text-slate-500">Administrator access required. Please sign in with an admin account!</p>
        <button onClick={onOpenAuth} className="btn-primary text-xs py-2.5 px-6 inline-flex bg-red-600">
          Sign In Admin Mode
        </button>
      </div>
    );
  }

  const filteredUsers = usersList.filter((u) => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-4 my-6 space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-8 border-l-4 border-l-red-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#2C1F56] dark:text-white font-['Outfit']">Administrator Command Center</h1>
            <p className="text-xs text-slate-500 dark:text-slate-300">Monitor Neon Postgres stats, grant treasury coins, and manage user accounts</p>
          </div>
        </div>

        <button onClick={loadAdminData} className="btn-ghost text-xs py-2 px-3.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-panel p-4 text-center">
            <div className="text-xs text-slate-500 font-bold mb-1">Total Users</div>
            <div className="text-2xl font-black text-[#2C1F56] dark:text-white font-['Outfit']">{stats.total_users}</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <div className="text-xs text-slate-500 font-bold mb-1">Active Skills</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-300 font-['Outfit']">{stats.total_skills}</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <div className="text-xs text-slate-500 font-bold mb-1">Total Swaps</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-['Outfit']">{stats.total_exchanges}</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <div className="text-xs text-slate-500 font-bold mb-1">Messages Sent</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-300 font-['Outfit']">{stats.total_chat_messages}</div>
          </div>
          <div className="glass-panel p-4 text-center col-span-2 md:col-span-1">
            <div className="text-xs text-slate-500 font-bold mb-1">Coins Circulating</div>
            <div className="text-2xl font-black text-amber-500 font-['Outfit']">{stats.total_coins_circulating} 🪙</div>
          </div>
        </div>
      )}

      {/* User Directory Table */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2C1F56] dark:text-white uppercase tracking-wider">User Directory & Treasury Grants</h3>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-900/10 dark:border-white/10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/5 dark:bg-slate-900/60 text-slate-500 font-bold border-b border-slate-900/10 dark:border-white/10 uppercase text-[10px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Streak 🔥</th>
                <th className="py-3 px-3">Coins 🪙</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/5 dark:divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/5 dark:hover:bg-white/5">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={u.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-800" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{u.full_name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      u.role === 'admin' ? 'bg-red-500/15 text-red-600 dark:text-red-300 border border-red-500/30' : 'bg-slate-900/10 text-slate-600 dark:text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-black text-[#DE5E44]">{u.streak_count} Days</td>
                  <td className="py-3 px-3 font-black text-amber-500">{u.skillcoins} 🪙</td>
                  <td className="py-3 px-3 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-300 rounded font-bold text-[11px]"
                    >
                      + Grant 🪙
                    </button>
                    {u.id !== currentUser.id && (
                      <>
                        <button
                          onClick={() => handleToggleRole(u.id)}
                          className="px-2.5 py-1 bg-[#2C1F56]/15 hover:bg-[#2C1F56]/25 border border-[#2C1F56]/30 text-[#2C1F56] dark:text-purple-300 rounded font-bold text-[11px]"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote Admin'}
                        </button>
                        <button
                          onClick={() => handleToggleBan(u.id)}
                          className={`px-2.5 py-1 rounded font-bold text-[11px] ${
                            u.is_banned ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' : 'bg-red-500/15 text-red-600 border border-red-500/30'
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
      </div>

      {/* Grant Coins Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 max-w-sm w-full border border-amber-500/40 space-y-4">
            <h3 className="text-lg font-bold text-[#2C1F56] dark:text-white">Grant SkillCoins to {selectedUser.full_name}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Amount 🪙</label>
              <input
                type="number"
                value={grantAmount}
                onChange={(e) => setGrantAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-900/10 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Note / Reason</label>
              <input
                type="text"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-900/10 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedUser(null)} className="btn-ghost w-full text-xs py-2 justify-center">
                Cancel
              </button>
              <button onClick={handleGrantCoins} className="btn-primary w-full text-xs py-2 justify-center">
                Grant Coins
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
