'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="py-14 bg-white text-[#0A0A0A] border-b border-[#EAEAEA]">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center space-y-2 mb-10">
          <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
            Detailing Transformation
          </span>
          <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-[#0A0A0A]">
            Before & After Showcase
          </h2>
          <div className="w-10 h-[1.5px] bg-[#FF4D00] mx-auto mt-1" />
          <p className="text-[10px] text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
            Drag the center slider line to inspect the paint gloss transformation achieved using our compounds.
          </p>
        </div>

        {/* Sliding comparison frame */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative h-[320px] md:h-[400px] w-full overflow-hidden select-none cursor-ew-resize rounded-xl border border-white/10"
        >
          {/* Before Image (Unpolished) */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200"
              alt="Unpolished Paint Surface"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover grayscale brightness-50 contrast-125 blur-[1px]"
            />
            <span className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm text-[9px] tracking-widest uppercase font-bold px-3 py-1 text-red-500 rounded border border-red-500/20">
              Before Detail
            </span>
          </div>

          {/* After Image Overlay (hydrophobic gloss) */}
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <Image
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200"
              alt="Polished High-Gloss Ceramic Paint Surface"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover brightness-110 saturate-120"
            />
            <span className="absolute top-4 right-4 z-10 bg-[#FF4D00]/20 backdrop-blur-sm text-[9px] tracking-widest uppercase font-bold px-3 py-1 text-[#FF4D00] rounded border border-[#FF4D00]/30">
              After Protection
            </span>
          </div>

          {/* Slider Line Divider */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#FF4D00] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 bg-[#FF4D00] text-black font-black flex items-center justify-center rounded-full shadow-2xl">
              ↔
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
export default BeforeAfter;
