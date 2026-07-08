import React from 'react';

export const Logo = ({ width = "40px", height = "40px", className = "" }) => {
  return (
    <img
      src="/logo.png"
      alt="Logo PymeWeb"
      width={width}
      height={height}
      className={className}
    />
  );
};