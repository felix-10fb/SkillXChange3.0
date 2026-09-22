import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Sparkles, Key, Mail, User, Eye, EyeOff, Flame, Coins } from 'lucide-react';
import { api, setToken, setUser } from '../api/client';
import BrandLogo from './BrandLogo';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onDemoLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', full_name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

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
          throw new Error('Please fill in all fields.');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        res = await api.register(formData);
      } else {
        if (!formData.email || !formData.password) {
          throw new Error('Please enter your email and password.');
        }
        res = await api.login({ email: formData.email, password: formData.password });
      }

      setToken(res.access_token);
      setUser(res.user);
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      await onDemoLogin(email, password);
      onClose();
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content glass-elevated" style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: '28px',
        border: '1px solid rgba(222, 94, 68, 0.25)',
        padding: '2.5rem',
        position: 'relative',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(244,211,94,0.08)',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.2rem', right: '1.2rem',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)',
            transition: 'all 0.2s ease', display: 'flex',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <BrandLogo size="md" showText={false} animated />
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)',
            marginBottom: '0.4rem',
          }}>
            {isRegister ? 'Join SkillXChange' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {isRegister
              ? '🎉 Register now and claim your 100 free SkillCoins!'
              : 'Sign in to your streaks, skills & messages'}
          </p>

          {/* Perks for register */}
          {isRegister && (
            <div style={{
              display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.75rem', flexWrap: 'wrap'
            }}>
              <span className="coin-badge" style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}>
                <Coins size={12} /> 100 SkillCoins
              </span>
              <span className="streak-badge" style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}>
                <Flame size={12} /> Day 1 Streak
              </span>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            marginBottom: '1.25rem', padding: '0.85rem 1rem',
            borderRadius: '12px', background: 'rgba(220, 50, 50, 0.12)',
            border: '1px solid rgba(220, 50, 50, 0.35)', color: '#FF8080',
            fontSize: '0.82rem', fontWeight: 600, textAlign: 'center',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <>
              <div>
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    className="input-field"
                    type="text" name="full_name" value={formData.full_name}
                    onChange={handleChange} placeholder="e.g. Alex Rivera"
                    autoComplete="name"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Username</label>
                <div style={{ position: 'relative' }}>
                  <Sparkles size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    className="input-field"
                    type="text" name="username" value={formData.username}
                    onChange={handleChange} placeholder="e.g. alex_dev"
                    autoComplete="username"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input
                className="input-field"
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input
                className="input-field"
                type={showPass ? 'text' : 'password'} name="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)',
                  padding: '2px', display: 'flex', alignItems: 'center',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ marginTop: '0.5rem', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '14px' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
                Authenticating...
              </span>
            ) : isRegister ? (
              <><UserPlus size={18} /><span>Create Account & Claim 100 🪙</span></>
            ) : (
              <><LogIn size={18} /><span>Sign In</span></>
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', textAlign: 'center', marginBottom: '0.75rem' }}>
            ⚡ Quick Demo Login
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: '🛡️ Admin', email: 'admin@skillxchange.com', pass: 'admin123', color: '#FF6B6B' },
              { label: '⚡ Alex', email: 'alex@skillxchange.com', pass: 'alex123', color: '#8B7BB5' },
              { label: '🎨 Sarah', email: 'sarah@skillxchange.com', pass: 'sarah123', color: '#DE5E44' },
              { label: '🌐 David', email: 'david@skillxchange.com', pass: 'david123', color: '#4DA1A9' },
            ].map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleDemoClick(acc.email, acc.pass)}
                disabled={loading}
                style={{
                  padding: '0.6rem 0.75rem', borderRadius: '10px',
                  background: `${acc.color}15`, border: `1px solid ${acc.color}35`,
                  color: acc.color, fontSize: '0.78rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${acc.color}25`; e.currentTarget.style.borderColor = `${acc.color}60`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${acc.color}15`; e.currentTarget.style.borderColor = `${acc.color}35`; }}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); setFormData({ username: '', email: '', full_name: '', password: '' }); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--coral)', fontSize: '0.83rem', fontWeight: 700,
              textDecoration: 'underline', fontFamily: 'inherit',
            }}
          >
            {isRegister ? 'Already have an account? Sign In →' : "Don't have an account? Create One →"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
