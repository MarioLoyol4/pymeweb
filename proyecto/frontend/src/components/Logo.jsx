import React from 'react';

export const Logo = ({ width = "40px", height = "40px", className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 120 120" 
      width={width} 
      height={height}
      className={className}
    >
      <defs>
        <linearGradient id="pymeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#042045" />
          <stop offset="50%" stop-color="#0066CC" />
          <stop offset="100%" stop-color="#00F0FF" />
        </linearGradient>
      </defs>
      
      <g transform="translate(10, 15)">
        <path d="M15,80 L45,30 L70,55 L95,15" fill="none" stroke="url(#pymeGradient)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="80,10 100,10 100,30" fill="#00F0FF" />
        <circle cx="15" cy="80" r="8" fill="#042045" />
        <circle cx="45" cy="30" r="8" fill="#0066CC" />
        <circle cx="70" cy="55" r="8" fill="#00BFFF" />
      </g>
    </svg>
  );
};