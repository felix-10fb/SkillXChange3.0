import React from 'react';
import logoImg from '../assets/logo.jpg';

const sizeMap = {
  xs: { img: 28, text: '0.85rem', gap: '0.4rem' },
  sm: { img: 36, text: '0.95rem', gap: '0.5rem' },
  md: { img: 44, text: '1.1rem', gap: '0.6rem' },
  lg: { img: 60, text: '1.4rem', gap: '0.7rem' },
  xl: { img: 100, text: '1.8rem', gap: '0.9rem' },
  '2xl': { img: 140, text: '2.2rem', gap: '1rem' },
};

export default function BrandLogo({ 
  size = 'md', 
  showText = true, 
  animated = false,
  vertical = false 
}) {
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        gap: s.gap,
        userSelect: 'none',
      }}
    >
      {/* Logo Image */}
      <div
        style={{
          width: s.img,
          height: s.img,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '2px solid rgba(222, 94, 68, 0.5)',
          boxShadow: '0 4px 20px rgba(222, 94, 68, 0.35), 0 0 0 1px rgba(244,211,94,0.15)',
          animation: animated ? 'pulseGlow 3s ease-in-out infinite' : 'none',
          transition: 'transform 0.3s ease',
        }}
        className={animated ? 'animate-pulse-glow' : ''}
        onMouseEnter={e => { if (animated) e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { if (animated) e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <img
          src={logoImg}
          alt="SkillXChange Logo"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: s.text,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #F0EAF8 30%, #DE5E44 70%, #F4D35E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SkillXChange
          </span>
          {(size === 'lg' || size === 'xl' || size === '2xl') && (
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'rgba(196, 181, 232, 0.7)',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              Learn · Exchange · Grow
            </span>
          )}
        </div>
      )}
    </div>
  );
}
