import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, RefreshCw, Zap, Flame, Coins, Shield, BookOpen } from 'lucide-react';
import { api, getUser, setToken, setUser, getToken } from './api/client';

import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import AuthModal from './components/AuthModal';
import SkillCard from './components/SkillCard';
import CreateSkillModal from './components/CreateSkillModal';
import StreakModal from './components/StreakModal';
import ChatBox from './components/ChatBox';
import RewardStoreModal from './components/RewardStoreModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import ExchangesModal from './components/ExchangesModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [skills, setSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Active Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateSkillOpen, setIsCreateSkillOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isExchangesOpen, setIsExchangesOpen] = useState(false);

  // Chat State
  const [activeContact, setActiveContact] = useState(null);
  const [exchangesCount, setExchangesCount] = useState(0);

  const categories = ['All', 'Technology', 'Design', 'Languages', 'Music', 'Business', 'Fitness'];

  useEffect(() => {
    // Refresh user profile if token exists
    if (getToken()) {
      api.getMe()
        .then((u) => {
          setCurrentUser(u);
          setUser(u);
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          setCurrentUser(null);
        });
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory, selectedType, searchQuery]);

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const data = await api.getSkills(selectedCategory, selectedType, searchQuery);
      setSkills(data);
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleDemoLogin = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      setToken(res.access_token);
      setUser(res.user);
      setCurrentUser(res.user);
      showToast(`Welcome back, ${res.user.full_name}! 🔥`);
    } catch (err) {
      showToast("Demo login error: " + err.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentUser(null);
    showToast("Signed out successfully.");
  };

  const handleRequestSwap = async (skill) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    try {
      await api.requestExchange({ skill_id: skill.id, note: "Excited to swap skills!" });
      showToast(`Requested skill swap for "${skill.title}"! 🚀`);
      setIsExchangesOpen(true);
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleChatUser = (userId, userName) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setActiveContact({ id: userId, name: userName });
    setIsChatOpen(true);
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill post?")) return;
    try {
      await api.deleteSkill(skillId);
      showToast("Skill deleted successfully.");
      fetchSkills();
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className="min-h-screen pb-16 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl glass-panel border-purple-500/40 text-purple-200 text-xs font-bold shadow-2xl animate-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenCreateSkill={() => currentUser ? setIsCreateSkillOpen(true) : setIsAuthOpen(true)}
        onOpenStreak={() => currentUser ? setIsStreakOpen(true) : setIsAuthOpen(true)}
        onOpenRewards={() => currentUser ? setIsRewardsOpen(true) : setIsAuthOpen(true)}
        onOpenChat={() => currentUser ? setIsChatOpen(true) : setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenExchanges={() => currentUser ? setIsExchangesOpen(true) : setIsAuthOpen(true)}
        activeExchangesCount={exchangesCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 w-full flex-1">
        {/* Hero Section */}
        <HeroBanner
          onOpenCreateSkill={() => currentUser ? setIsCreateSkillOpen(true) : setIsAuthOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          currentUser={currentUser}
          onDemoLogin={handleDemoLogin}
        />

        {/* Filter & Search Toolbar */}
        <div className="mx-4 my-6 glass-panel p-4 flex flex-wrap items-center justify-between gap-4 border-white/10">
          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pr-2 border-r border-white/10">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Type Filter & Search Bar */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Offer vs Request Filter */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 text-xs font-bold">
              <button
                onClick={() => setSelectedType('All')}
                className={`px-3 py-1 rounded-lg transition-all ${selectedType === 'All' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('offer')}
                className={`px-3 py-1 rounded-lg transition-all ${selectedType === 'offer' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                ⚡ Offers
              </button>
              <button
                onClick={() => setSelectedType('request')}
                className={`px-3 py-1 rounded-lg transition-all ${selectedType === 'request' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                🔍 Requests
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 lg:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills..."
                className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Skill Cards Grid */}
        {loadingSkills ? (
          <div className="text-center py-20 text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
            <span>Fetching live skill listings from Neon Postgres...</span>
          </div>
        ) : skills.length === 0 ? (
          <div className="glass-panel p-12 text-center my-8 max-w-lg mx-auto space-y-4">
            <BookOpen className="w-12 h-12 text-purple-400 mx-auto opacity-60" />
            <h3 className="text-xl font-bold text-white">No Skills Found</h3>
            <p className="text-xs text-slate-400">Be the pioneer! Post a skill to start trading knowledge & earning SkillCoins 🪙</p>
            <button
              onClick={() => currentUser ? setIsCreateSkillOpen(true) : setIsAuthOpen(true)}
              className="glass-button text-xs py-2 px-4 inline-flex"
            >
              Post First Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 my-6">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                currentUser={currentUser}
                onRequestSwap={handleRequestSwap}
                onChatUser={handleChatUser}
                onDeleteSkill={handleDeleteSkill}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-500 border-t border-white/5 space-y-2">
        <p className="font-semibold text-slate-400">
          SkillXChange 2.0 &bull; Powered by FastAPI & Neon PostgreSQL &bull; Deployable on Vercel
        </p>
        <p className="text-[11px]">
          Streaks 🔥 &bull; SkillCoins 🪙 &bull; Real-Time Chat &bull; Admin Management Portal
        </p>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          setCurrentUser(u);
          showToast(`Welcome ${u.full_name}! 🔥`);
        }}
        onDemoLogin={handleDemoLogin}
      />

      <CreateSkillModal
        isOpen={isCreateSkillOpen}
        onClose={() => setIsCreateSkillOpen(false)}
        onSkillCreated={() => {
          showToast("Skill published successfully! 🎉");
          fetchSkills();
        }}
      />

      <StreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(u) => setCurrentUser(u)}
      />

      <ChatBox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={currentUser}
        activeContact={activeContact}
        setActiveContact={setActiveContact}
      />

      <RewardStoreModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(u) => setCurrentUser(u)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
      />

      <ExchangesModal
        isOpen={isExchangesOpen}
        onClose={() => setIsExchangesOpen(false)}
        currentUser={currentUser}
        onExchangesUpdated={(cnt) => setExchangesCount(cnt)}
      />
    </div>
  );
}
