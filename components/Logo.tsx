import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} relative group transition-transform duration-300 hover:scale-110`}>
      <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg relative z-10">
        <defs>
          <linearGradient id="vibrantBronze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="vibrantMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>
        
        {/* Colorful Outer Ring */}
        <circle cx="50" cy="50" r="46" fill="#0f172a" />
        <circle cx="50" cy="50" r="42" stroke="url(#vibrantBronze)" strokeWidth="4" />
        <circle cx="50" cy="50" r="38" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" strokeDasharray="4 4" />

        {/* VK Monogram */}
        <g transform="translate(22, 32) scale(0.6)">
          <path 
            d="M0 0 L30 70 L60 0 L45 0 L30 40 L15 0 Z" 
            fill="white" 
            className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
          />
          <path 
            d="M65 0 L65 70 L78 70 L78 38 L95 70 L112 70 L88 32 L110 0 L94 0 L78 25 L78 0 Z" 
            fill="#10b981" 
          />
        </g>
      </svg>
    </div>
  );
};

export default Logo;