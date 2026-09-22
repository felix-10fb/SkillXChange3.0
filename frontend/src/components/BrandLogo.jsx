import React from 'react';

export default function BrandLogo({ size = "md", showText = true, animated = false }) {
  const sizeMap = {
    sm: { icon: "w-8 h-8", text: "text-lg" },
    md: { icon: "w-10 h-10", text: "text-xl" },
    lg: { icon: "w-16 h-16", text: "text-3xl" },
    xl: { icon: "w-24 h-24", text: "text-4xl" }
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Brand Double-Arrow Circuit Logo SVG */}
      <svg 
        className={`${dim.icon} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Purple Interlocking Arrow Loop */}
        <path 
          d="M 40,50 L 130,50 C 155,50 170,70 155,95 L 115,145 C 105,158 90,165 75,160 C 60,155 55,140 65,125 L 85,95 C 95,80 110,75 125,75 L 140,75" 
          stroke="#2C1F56" 
          strokeWidth="24" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Top Purple Arrowhead */}
        <path 
          d="M 120,35 L 145,50 L 120,65 Z" 
          fill="#2C1F56" 
        />
        {/* Top Circuit Dot Line */}
        <line x1="55" y1="85" x2="85" y2="55" stroke="#F4D35E" strokeWidth="6" strokeLinecap="round" />
        <circle cx="55" cy="85" r="7" fill="#F4D35E" />

        {/* Bottom Coral Interlocking Arrow Loop */}
        <path 
          d="M 160,150 L 70,150 C 45,150 30,130 45,105 L 85,55 C 95,42 110,35 125,40 C 140,45 145,60 135,75 L 115,105 C 105,120 90,125 75,125 L 60,125" 
          stroke="#DE5E44" 
          strokeWidth="24" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Bottom Coral Arrowhead */}
        <path 
          d="M 80,165 L 55,150 L 80,135 Z" 
          fill="#DE5E44" 
        />
        {/* Bottom Circuit Dot Line */}
        <line x1="145" y1="115" x2="115" y2="145" stroke="#F4D35E" strokeWidth="6" strokeLinecap="round" />
        <circle cx="145" cy="115" r="7" fill="#F4D35E" />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight font-['Outfit'] ${dim.text}`} style={{ color: '#2C1F56' }}>
            SKILL<span style={{ color: '#DE5E44' }}>X</span>CHANGE
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8E7DBE] mt-0.5">
            Knowledge Marketplace
          </span>
        </div>
      )}
    </div>
  );
}
