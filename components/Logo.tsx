
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8E5A31" />
            <stop offset="20%" stopColor="#C5A059" />
            <stop offset="50%" stopColor="#A67C52" />
            <stop offset="80%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#5E3A1E" />
          </linearGradient>
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#555555" />
            <stop offset="50%" stopColor="#333333" />
            <stop offset="100%" stopColor="#111111" />
          </linearGradient>
          <filter id="brushedEffect">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
          </filter>
        </defs>
        
        {/* Bronze Outer Ring */}
        <circle cx="50" cy="50" r="45" stroke="url(#bronzeGradient)" strokeWidth="6" fill="white" />
        <circle cx="50" cy="50" r="41.5" stroke="rgba(0,0,0,0.05)" strokeWidth="1" fill="none" />

        {/* VK Monogram - Stylized to match the provided image */}
        <g transform="translate(22, 32) scale(0.6)">
          {/* V Shape */}
          <path 
            d="M0 0 L30 70 L60 0 L45 0 L30 40 L15 0 Z" 
            fill="url(#metalGradient)" 
          />
          {/* K Shape */}
          <path 
            d="M65 0 L65 70 L78 70 L78 38 L95 70 L112 70 L88 32 L110 0 L94 0 L78 25 L78 0 Z" 
            fill="url(#metalGradient)" 
          />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
