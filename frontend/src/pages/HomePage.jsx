import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame, Coins, Zap, Shield, Sparkles, ArrowRight,
  BookOpen, Users, RefreshCw, Star, Compass, Code,
  Palette, Globe, Music, Brain, TrendingUp, CheckCircle
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const STATS = [
  { number: '12K+', label: 'Active Learners' },
  { number: '4.8K', label: 'Skills Listed' },
  { number: '98%', label: 'Satisfaction Rate' },
  { number: '50K+', label: 'Coins Earned' },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Peer Mentorship',
    desc: 'Trade coding, design, languages, and creative arts directly with verified tutors in live 1-on-1 sessions.',
    color: '#8B7BB5',
    glow: 'rgba(139, 123, 181, 0.2)',
  },
  {
    icon: Coins,
    title: 'SkillCoins Economy',
    desc: 'Earn SkillCoins for teaching. Spend them on learning. Maintain streaks for daily coin bonuses.',
    color: '#F4D35E',
    glow: 'rgba(244, 211, 94, 0.2)',
  },
  {
    icon: Flame,
    title: 'Daily Streaks',
    desc: 'Log in daily to keep your streak alive. Longer streaks = bigger coin rewards. Don\'t break the chain!',
    color: '#DE5E44',
    glow: 'rgba(222, 94, 68, 0.2)',
  },
  {
    icon: RefreshCw,
    title: 'Skill Exchanges',
    desc: 'Request a skill trade with another user. Complete the exchange and both parties earn coins.',
    color: '#4DA1A9',
    glow: 'rgba(77, 161, 169, 0.2)',
  },
  {
    icon: Users,
    title: 'Live Chat Studio',
    desc: 'Message any user directly. Build real relationships, plan sessions, and share resources.',
    color: '#6B9E78',
    glow: 'rgba(107, 158, 120, 0.2)',
  },
  {
    icon: Shield,
    title: 'Admin Command Center',
    desc: 'Full admin dashboard to manage users, grant coins, moderate content, and view platform analytics.',
    color: '#C05020',
    glow: 'rgba(192, 80, 32, 0.2)',
  },
];

const CATEGORIES = [
  { icon: Code, label: 'Technology', color: '#6B9BD2' },
  { icon: Palette, label: 'Design', color: '#DE5E44' },
  { icon: Globe, label: 'Languages', color: '#6B9E78' },
  { icon: Music, label: 'Music', color: '#C06EC0' },
  { icon: Brain, label: 'Business', color: '#F4D35E' },
  { icon: Star, label: 'Creative Arts', color: '#FF8C42' },
];

export default function HomePage({ currentUser, onOpenAuth, onDemoLogin, onOpenCreateSkill }) {
  return (
    <div style={{ paddingBottom: '6rem' }}>

      {/* ── HERO SECTION ── */}
      <section style={{ padding: '3rem 1.5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3rem', alignItems: 'center',
        }}>

          {/* Left: Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', width: 'fit-content' }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.45rem 1rem', borderRadius: '9999px',
                background: 'rgba(222, 94, 68, 0.12)', border: '1px solid rgba(222, 94, 68, 0.35)',
                color: 'var(--coral-light)', fontSize: '0.75rem', fontWeight: 800,
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                <Sparkles size={14} style={{ animation: 'flamePulse 2s ease-in-out infinite' }} />
                Next-Gen Skill Exchange Platform
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-0.03em', color: 'var(--text-primary)',
            }}>
              Exchange Skills.
              <br />
              Earn <span style={{
                background: 'linear-gradient(135deg, var(--coral-light), var(--gold))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>SkillCoins</span>.
              <br />
              Build Streaks <span style={{ display: 'inline-block', animation: 'flamePulse 1.5s ease-in-out infinite' }}>🔥</span>
            </h1>

            {/* Sub */}
            <p style={{
              fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7,
              maxWidth: '520px',
            }}>
              SkillXChange connects developers, designers, language learners & artists worldwide.
              Teach what you know, learn what you want — powered by a gamified coin economy.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/explore" className="btn btn-primary btn-lg">
                <Compass size={18} /> Explore Skills
              </Link>
              {currentUser ? (
                <button onClick={onOpenCreateSkill} className="btn btn-secondary btn-lg">
                  <Zap size={18} style={{ color: 'var(--gold)' }} /> Post a Skill
                </button>
              ) : (
                <button onClick={onOpenAuth} className="btn btn-secondary btn-lg">
                  Join Free & Get 100 🪙 <ArrowRight size={18} />
                </button>
              )}
            </div>

            {/* Demo Quick Login */}
            {!currentUser && (
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-faint)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  ⚡ Quick Demo Accounts
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    { label: '🛡️ Admin', email: 'admin@skillxchange.com', pass: 'admin123', color: '#FF6B6B' },
                    { label: '⚛️ Alex (React)', email: 'alex@skillxchange.com', pass: 'alex123', color: '#8B7BB5' },
                    { label: '🎨 Sarah (UX)', email: 'sarah@skillxchange.com', pass: 'sarah123', color: '#DE5E44' },
                    { label: '🌐 David (ES)', email: 'david@skillxchange.com', pass: 'david123', color: '#4DA1A9' },
                  ].map(acc => (
                    <button
                      key={acc.email}
                      onClick={() => onDemoLogin(acc.email, acc.pass)}
                      style={{
                        padding: '0.45rem 0.9rem', borderRadius: '10px',
                        background: `${acc.color}18`, border: `1px solid ${acc.color}40`,
                        color: acc.color, fontSize: '0.78rem', fontWeight: 700,
                        cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${acc.color}30`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${acc.color}18`; }}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Visual Panel */}
          <div style={{
            background: 'var(--bg-surface)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(222, 94, 68, 0.2)', borderRadius: '28px',
            padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '1.5rem',
            boxShadow: '0 30px 80px rgba(222,94,68,0.12), 0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <BrandLogo size="xl" showText vertical animated />

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
              {STATS.map((stat) => (
                <div key={stat.label} style={{
                  padding: '1rem', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center',
                }}>
                  <div className="stat-number" style={{ fontSize: '1.5rem' }}>{stat.number}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 8px #4CAF50', flexShrink: 0, animation: 'flamePulse 2s infinite' }} />
              Backend Live · Neon PostgreSQL Connected
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES STRIP ── */}
      <section style={{
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  to={`/explore?category=${cat.label}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: '9999px',
                    background: `${cat.color}12`, border: `1px solid ${cat.color}35`,
                    color: cat.color, fontSize: '0.82rem', fontWeight: 700,
                    textDecoration: 'none', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${cat.color}25`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${cat.color}12`; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Icon size={14} />
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>
            Everything You Need to <span style={{ background: 'linear-gradient(135deg, var(--coral-light), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Thrive</span>
          </h2>
          <p className="section-sub" style={{ maxWidth: '500px', margin: '0.5rem auto 0' }}>
            SkillXChange is not just a marketplace — it's a gamified learning ecosystem.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-card"
                style={{ padding: '1.75rem', borderLeft: `3px solid ${feat.color}` }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: '14px', marginBottom: '1rem',
                  background: feat.glow, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${feat.color}30`,
                }}>
                  <Icon size={22} style={{ color: feat.color }} />
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>How It Works</h2>
          <p className="section-sub">Start exchanging skills in 3 simple steps.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { step: '01', title: 'Create an Account', desc: 'Sign up for free and receive 100 SkillCoins instantly as a welcome bonus.', icon: '🎉' },
            { step: '02', title: 'List or Browse Skills', desc: 'Post skills you can teach or browse hundreds of offers from talented community members.', icon: '🔍' },
            { step: '03', title: 'Exchange & Earn', desc: 'Request a skill swap, complete sessions, and earn coins. Maintain your streak for daily bonuses!', icon: '🚀' },
          ].map((s) => (
            <div key={s.step} style={{
              padding: '2rem', borderRadius: '20px',
              background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'var(--shadow-card)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '-10px', right: '-10px',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '5rem', fontWeight: 900, color: 'rgba(222, 94, 68, 0.06)',
                lineHeight: 1, userSelect: 'none',
              }}>
                {s.step}
              </div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '0 1.5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          padding: '3rem 2.5rem', borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(44,31,86,0.8), rgba(222,94,68,0.15))',
          border: '1px solid rgba(222, 94, 68, 0.3)',
          boxShadow: '0 20px 60px rgba(222, 94, 68, 0.15)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: '1.5rem',
        }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Ready to start your journey? 🚀
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Join thousands of learners already exchanging skills on SkillXChange.
            </p>
          </div>
          {!currentUser ? (
            <button onClick={onOpenAuth} className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
              <Sparkles size={18} /> Get Started Free
            </button>
          ) : (
            <Link to="/explore" className="btn btn-primary btn-lg" style={{ flexShrink: 0, textDecoration: 'none' }}>
              <Compass size={18} /> Browse Skills Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
