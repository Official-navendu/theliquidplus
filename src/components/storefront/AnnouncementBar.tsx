'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

export function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname !== '/') {
    return null;
  }

  const messages = [
    '🚚 Free Shipping above $999',
    '🔥 Flat 20% OFF Site-wide',
    '⭐ Premium Detailing Products',
    '💎 Engineered with Nano-Technology for Supreme Protection',
  ];

  return (
    <div className="w-full bg-[#0A0A0A] text-white text-[10px] font-black uppercase h-10 flex items-center overflow-hidden border-b border-white/5 relative z-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Render twice for continuous loop */}
        <div className="flex space-x-16 px-4">
          {messages.map((msg, i) => (
            <span key={i} className="tracking-[0.2em] font-bold">
              {msg} <span className="text-[#FF4D00] ml-16">|</span>
            </span>
          ))}
        </div>
        <div className="flex space-x-16 px-4" aria-hidden="true">
          {messages.map((msg, i) => (
            <span key={i} className="tracking-[0.2em] font-bold">
              {msg} <span className="text-[#FF4D00] ml-16">|</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
export default AnnouncementBar;
