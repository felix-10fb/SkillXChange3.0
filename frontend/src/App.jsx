import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

import { api, getUser, setToken, setUser, getToken } from './api/client';

import Navbar from './components/Navbar';
import BrandLogo from './components/BrandLogo';
import AuthModal from './components/AuthModal';
import CreateSkillModal from './components/CreateSkillModal';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import RewardsPage from './pages/RewardsPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';

function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message]);

  const colors = {
    info: { border: 'var(--border-coral)', icon: <Sparkles size={18} style={{ color: 'var(--gold)' }} /> },
    success: { border: 'rgba(76, 175, 80, 0.5)', icon: <CheckCircle size={18} style={{ color: '#4CAF50' }} /> },
    error: { border: 'rgba(220, 50, 50, 0.5)', icon: <AlertCircle size={18} style={{ color: '#FF6060' }} /> },
  };

  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', top: '70px', right: '1.5rem', zIndex: 9999,
      padding: '0.9rem 1.25rem',
      borderRadius: '16px',
      background: 'var(--bg-elevated)',
      border: `1px solid ${c.border}`,
      color: 'var(--text-primary)',
      fontWeight: 700, fontSize: '0.875rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      backdropFilter: 'blur(20px)',
      maxWidth: '360px',
      animation: 'toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      {c.icon}
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1, padding: 0 }}
      >
        ×
      </button>
    </div>
  );
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [theme, setTheme] = useState(localStorage.getItem('skillxchange_theme') || 'dark');
  const [toasts, setToasts] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateSkillOpen, setIsCreateSkillOpen] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
  const [exchangesCount, setExchangesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skillxchange_theme', theme);
  }, [theme]);

  // Restore session from stored token
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

  const showToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleDemoLogin = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      setToken(res.access_token);
      setUser(res.user);
      setCurrentUser(res.user);
      showToast(`Welcome back, ${res.user.full_name}! 🔥`, 'success');
    } catch (err) {
      showToast('Demo login failed: ' + err.message, 'error');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentUser(null);
    showToast('Signed out. See you soon! 👋', 'info');
  };

  const handleAuthSuccess = (u) => {
    setCurrentUser(u);
    showToast(`Welcome, ${u.full_name}! You have ${u.skillcoins} 🪙 to spend!`, 'success');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Toasts */}
      {toasts.map((t) => (
        <Toast key={t.id} message={t.msg} type={t.type} onClose={() => removeToast(t.id)} />
      ))}

      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenCreateSkill={() => currentUser ? setIsCreateSkillOpen(true) : setIsAuthOpen(true)}
        activeExchangesCount={exchangesCount}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Pages */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={
            <HomePage
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onDemoLogin={handleDemoLogin}
              onOpenCreateSkill={() => currentUser ? setIsCreateSkillOpen(true) : setIsAuthOpen(true)}
            />
          } />
          <Route path="/explore" element={
            <ExplorePage
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenCreateSkill={() => setIsCreateSkillOpen(true)}
              onChatUser={(userId, userName) => {
                setActiveContact({ id: userId, name: userName });
                navigate('/chat');
              }}
              showToast={showToast}
            />
          } />
          <Route path="/rewards" element={
            <RewardsPage
              currentUser={currentUser}
              onUserUpdated={(u) => { setCurrentUser(u); setUser(u); }}
              showToast={showToast}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          } />
          <Route path="/dashboard" element={
            <DashboardPage
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              showToast={showToast}
              setExchangesCount={setExchangesCount}
            />
          } />
          <Route path="/chat" element={
            <ChatPage
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              activeContact={activeContact}
              setActiveContact={setActiveContact}
            />
          } />
          <Route path="/admin" element={
            <AdminPage
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              showToast={showToast}
            />
          } />
          <Route path="*" element={
            <HomePage
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onDemoLogin={handleDemoLogin}
              onOpenCreateSkill={() => currentUser ? setIsCreateSkillOpen(true) : setIsAuthOpen(true)}
            />
          } />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1.5rem', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(13, 8, 32, 0.4)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <BrandLogo size="sm" showText animated={false} />
        </div>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-faint)', marginBottom: '0.25rem' }}>
          SkillXChange Platform · Deep Indigo & Terracotta Coral · Neon PostgreSQL
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', opacity: 0.6 }}>
          Streaks 🔥 · SkillCoins 🪙 · Live Chat · Admin Portal · FastAPI Powered
        </p>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onDemoLogin={handleDemoLogin}
      />
      <CreateSkillModal
        isOpen={isCreateSkillOpen}
        onClose={() => setIsCreateSkillOpen(false)}
        onSkillCreated={() => showToast('Skill published! 🎉 Start earning SkillCoins.', 'success')}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
