import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Coins, MessageSquare, ShieldCheck, Plus, LogIn, LogOut, RefreshCw, Compass, Home, LayoutDashboard, Gift, Sun, Moon } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({ 
  currentUser, 
  onOpenAuth, 
  onLogout, 
  onOpenCreateSkill, 
  activeExchangesCount,
  theme,
  setTheme
}) {
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore Skills', path: '/explore', icon: Compass },
    { label: 'Streaks & Rewards', path: '/rewards', icon: Gift },
    { label: 'My Swaps', path: '/dashboard', icon: RefreshCw, badge: activeExchangesCount },
    { label: 'Chat', path: '/chat', icon: MessageSquare },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ label: 'Admin Portal', path: '/admin', icon: ShieldCheck, isAdmin: true });
  }

  return (
    <nav className="glass-panel sticky top-3 z-50 mx-4 my-2 px-6 py-3 flex items-center justify-between shadow-xl">
      {/* Brand Logo Link */}
      <Link to="/" className="hover:opacity-90 transition-opacity">
        <BrandLogo size="md" showText={true} animated={true} />
      </Link>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/5 dark:bg-slate-900/40 p-1 rounded-2xl border border-slate-900/5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                isActive
                  ? link.isAdmin
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md'
                    : 'bg-[#2C1F56] text-white shadow-md'
                  : link.isAdmin
                    ? 'text-red-500 hover:bg-red-500/10'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-900/10 dark:hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
              {link.badge > 0 && (
                <span className="w-4 h-4 bg-[#DE5E44] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 dark:hover:bg-white/10 transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#2C1F56]" />}
        </button>

        {currentUser ? (
          <>
            {/* Daily Streak Counter Link */}
            <Link 
              to="/rewards" 
              className="streak-badge cursor-pointer transition-transform hover:scale-105"
              title="Daily Login Streak 🔥"
            >
              <Flame className="w-4 h-4 fill-[#DE5E44] animate-pulse" />
              <span className="text-xs font-black">{currentUser.streak_count} Days</span>
            </Link>

            {/* SkillCoins Balance Badge Link */}
            <Link 
              to="/rewards"
              className="coin-badge cursor-pointer transition-transform hover:scale-105"
              title="SkillCoins Balance 🪙"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black">{currentUser.skillcoins} 🪙</span>
            </Link>

            {/* Post Skill Button */}
            <button onClick={onOpenCreateSkill} className="btn-primary text-xs py-2 px-3.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post Skill</span>
            </button>

            {/* User Profile Info & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-900/10 dark:border-white/10">
              <img 
                src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`} 
                alt="Avatar"
                className="w-9 h-9 rounded-full border-2 border-[#DE5E44] bg-slate-800 object-cover"
              />
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {currentUser.full_name}
                </div>
                <div className="text-[10px] font-extrabold uppercase text-[#DE5E44]">
                  {currentUser.role}
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button onClick={onOpenAuth} className="btn-secondary text-xs">
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </nav>
  );
}
