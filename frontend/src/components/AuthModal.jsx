import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Sparkles, Key, Mail, User } from 'lucide-react';
import { api, setToken, setUser } from '../api/client';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onDemoLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (isRegister) {
        if (!formData.username || !formData.email || !formData.full_name || !formData.password) {
          throw new Error("Please fill in all fields.");
        }
        res = await api.register(formData);
      } else {
        if (!formData.email || !formData.password) {
          throw new Error("Please enter your email and password.");
        }
        res = await api.login({ email: formData.email, password: formData.password });
      }

      setToken(res.access_token);
      setUser(res.user);
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel p-8 max-w-md w-full relative border border-purple-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-emerald-400 p-0.5 mx-auto shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
              SX
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isRegister ? "Create SkillXChange Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister 
              ? "Join the skill-sharing community and claim 100 free SkillCoins 🪙"
              : "Sign in to access your skills, streaks & messages"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. alex_dev"
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full justify-center py-3 text-base mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register & Claim 100 🪙</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Login Quick Options */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onDemoLogin('admin@skillxchange.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => onDemoLogin('alex@skillxchange.com', 'alex123')}
              className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all"
            >
              Alex (React)
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-xs text-purple-400 hover:underline font-semibold"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Create One"}
          </button>
        </div>
      </div>
    </div>
  );
}
