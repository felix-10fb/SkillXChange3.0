import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Flame, Coins, MessageSquare, ShieldCheck, Plus, LogIn, LogOut,
  RefreshCw, Compass, Home, LayoutDashboard, Gift, Sun, Moon,
  ChevronDown, Bell, Menu, X
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCreateSkill,
  activeExchangesCount,
  theme,
  setTheme,
}) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Rewards', path: '/rewards', icon: Gift },
    { label: 'My Swaps', path: '/dashboard', icon: RefreshCw, badge: activeExchangesCount },
    { label: 'Chat', path: '/chat', icon: MessageSquare },
  ];
  if (currentUser?.role === 'admin') {
    navLinks.push({ label: 'Admin', path: '/admin', icon: ShieldCheck, isAdmin: true });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        padding: '0.6rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        background: scrolled ? 'rgba(13, 8, 32, 0.95)' : 'rgba(13, 8, 32, 0.80)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: `1px solid ${scrolled ? 'rgba(222, 94, 68, 0.2)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* Brand */}
        <Link to="/" style={{ flexShrink: 0, textDecoration: 'none' }}>
          <BrandLogo size="sm" showText animated />
        </Link>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          background: 'rgba(255,255,255,0.04)', padding: '0.35rem',
          borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)',
        }} className="hide-mobile">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 0.9rem', borderRadius: '12px',
                  fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none',
                  position: 'relative', transition: 'all 0.2s ease',
                  background: active
                    ? link.isAdmin
                      ? 'linear-gradient(135deg, #7B2020, #C05020)'
                      : 'linear-gradient(135deg, rgba(222,94,68,0.25), rgba(74,56,128,0.25))'
                    : 'transparent',
                  color: active
                    ? link.isAdmin ? '#FFAA80' : 'var(--coral-light)'
                    : link.isAdmin ? '#FF6060' : 'var(--text-muted)',
                  borderBottom: active ? `2px solid ${link.isAdmin ? '#FF6060' : 'var(--coral)'}` : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = link.isAdmin ? '#FF6060' : 'var(--text-muted)'; } }}
              >
                <Icon size={14} />
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span style={{
                    minWidth: '18px', height: '18px', borderRadius: '9999px',
                    background: 'var(--coral)', color: '#fff',
                    fontSize: '10px', fontWeight: 900, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                  }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '7px', cursor: 'pointer',
              color: theme === 'dark' ? '#F4D35E' : '#3A2A6C',
              display: 'flex', transition: 'all 0.2s ease',
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {currentUser ? (
            <>
              {/* Streak Badge */}
              <Link to="/rewards" className="streak-badge hide-mobile" title="Daily Streak">
                <Flame size={14} className="animate-flame" style={{ color: 'var(--coral-light)' }} />
                <span>{currentUser.streak_count ?? 0} 🔥</span>
              </Link>

              {/* Coins Badge */}
              <Link to="/rewards" className="coin-badge hide-mobile" title="SkillCoins">
                <Coins size={14} style={{ color: 'var(--gold)' }} />
                <span>{currentUser.skillcoins ?? 0} 🪙</span>
              </Link>

              {/* Post Skill */}
              <button
                onClick={onOpenCreateSkill}
                className="btn btn-primary btn-sm hide-mobile"
                style={{ gap: '0.4rem' }}
              >
                <Plus size={14} />
                <span>Post Skill</span>
              </button>

              {/* Avatar + Name + Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.6rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <img
                  src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`}
                  alt={currentUser.full_name}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--coral)', objectFit: 'cover', flexShrink: 0 }}
                />
                <div className="hide-mobile" style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.full_name}
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: currentUser.role === 'admin' ? '#FF6060' : 'var(--coral)' }}>
                    {currentUser.role}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  style={{
                    background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px',
                    padding: '6px', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FF6060'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.4)'; e.currentTarget.style.background = 'rgba(255,80,80,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'none'; }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="hide-desktop"
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '7px', cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex', transition: 'all 0.2s ease',
            }}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="hide-desktop" style={{
          position: 'fixed', top: '62px', left: 0, right: 0, zIndex: 499,
          background: 'rgba(13, 8, 32, 0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'fadeUp 0.2s ease-out',
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.85rem 1rem', borderRadius: '12px',
                  fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
                  background: active ? 'rgba(222,94,68,0.15)' : 'rgba(255,255,255,0.03)',
                  color: active ? 'var(--coral-light)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'rgba(222,94,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {currentUser && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/rewards" className="streak-badge" style={{ flex: 1, justifyContent: 'center' }}>
                <Flame size={14} /> {currentUser.streak_count ?? 0} 🔥
              </Link>
              <Link to="/rewards" className="coin-badge" style={{ flex: 1, justifyContent: 'center' }}>
                <Coins size={14} /> {currentUser.skillcoins ?? 0} 🪙
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
