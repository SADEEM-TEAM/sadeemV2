import React from 'react';
import brandLogo from '@/assets/brand_logo.svg';

export function BrandLogo({ size = 64 }: { size?: number }) {
  return (
    <img
      src={brandLogo}
      alt="سديم"
      draggable={false}
      className="block select-none"
      style={{
        height: size,
        width: 'auto',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 4px 18px rgba(251,191,36,0.45))'
      }}
    />
  );
}
