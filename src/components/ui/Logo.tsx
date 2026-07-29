import * as React from 'react';
import Image from 'next/image';

export function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="The Liquid Plus Logo"
      width={150}
      height={32}
      className={className}
      priority
      style={{ objectFit: 'contain' }}
    />
  );
}
export default Logo;
