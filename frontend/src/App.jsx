import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

import { api, getUser, setToken, setUser, getToken } from './api/client';

import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CreateSkillModal from './components/CreateSkillModal';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import RewardsPage from './pages/RewardsPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [theme, setTheme] = useState(localStorage.getItem('skillxchange_theme') || 'light');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateSkillOpen, setIsCreateSkillOpen] = useState(false);

  // Shared Chat contact state
  const [activeContact, setActiveContact] = useState(null);
  const [exchangesCount, setExchangesCount] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skillxchange_theme', theme);
  }, [theme]);

  useEffect(() => {
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
      showToast(`Welcome ${res.user.full_name}! 🔥`);
    } catch (err) {
      showToast("Demo login failed: " + err.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentUser(null);
    showToast("Signed out successfully.");
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl glass-panel border-[#DE5E44]/40 text-[#DE5E44] dark:text-white text-xs font-black shadow-2xl animate-in slide-in-from-top-4 duration-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Navigation Bar */}
        <Navbar
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          onOpenCreateSkill={() => currentUser ? setIsCreateSkillOpen(true) : setIsAuthOpen(true)}
          activeExchangesCount={exchangesCount}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Main Multi-Page Route Container */}
        <main className="max-w-7xl mx-auto px-4 w-full flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  currentUser={currentUser}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onDemoLogin={handleDemoLogin}
                  onOpenCreateSkill={() => currentUser ? setIsCreateSkillOpen(true) : setIsAuthOpen(true)}
                />
              } 
            />

            <Route 
              path="/explore" 
              element={
                <ExplorePage 
                  currentUser={currentUser}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onOpenCreateSkill={() => setIsCreateSkillOpen(true)}
                  onChatUser={(userId, userName) => {
                    setActiveContact({ id: userId, name: userName });
                    window.location.href = '/chat';
                  }}
                  showToast={showToast}
                />
              } 
            />

            <Route 
              path="/rewards" 
              element={
                <RewardsPage 
                  currentUser={currentUser}
                  onUserUpdated={(u) => setCurrentUser(u)}
                  showToast={showToast}
                  onOpenAuth={() => setIsAuthOpen(true)}
                />
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <DashboardPage 
                  currentUser={currentUser}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  showToast={showToast}
                  setExchangesCount={setExchangesCount}
                />
              } 
            />

            <Route 
              path="/chat" 
              element={
                <ChatPage 
                  currentUser={currentUser}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  activeContact={activeContact}
                  setActiveContact={setActiveContact}
                />
              } 
            />

            <Route 
              path="/admin" 
              element={
                <AdminPage 
                  currentUser={currentUser}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  showToast={showToast}
                />
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-8 text-center text-xs text-slate-500 border-t border-slate-900/10 dark:border-white/5 space-y-2">
          <p className="font-bold text-slate-600 dark:text-slate-400">
            SkillXChange Platform &bull; Deep Indigo & Terracotta Coral Brand Palette &bull; Neon PostgreSQL
          </p>
          <p className="text-[11px] opacity-75">
            Streaks 🔥 &bull; SkillCoins 🪙 &bull; Multi-Page Routing &bull; Live Chat Studio &bull; Admin Command Center
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
          }}
        />
      </div>
    </Router>
  );
}
