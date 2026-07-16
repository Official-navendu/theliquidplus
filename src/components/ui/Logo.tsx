/* eslint-disable @next/next/no-img-element */
import * as React from 'react';

export function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="The Liquid Plus Logo"
      className={className}
      style={{ objectFit: 'contain', height: '32px', width: 'auto' }}
    />
  );
}
export default Logo;
