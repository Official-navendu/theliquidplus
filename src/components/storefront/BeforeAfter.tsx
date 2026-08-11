'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type TabType = 'Exterior' | 'Interior' | 'Tyres';

const tabData = {
  Exterior: {
    beforeUrl: '/assets/before-after/exterior-before.webp',
    beforeClass: 'object-cover',
    afterUrl: '/assets/before-after/exterior-after.webp',
    afterClass: 'object-cover',
    beforeLabel: 'Neglected & Dirty',
    afterLabel: 'Ceramic Detail Gloss',
  },
  Interior: {
    beforeUrl: '/assets/before-after/interior-before.webp',
    beforeClass: 'object-cover',
    afterUrl: '/assets/before-after/interior-after.webp',
    afterClass: 'object-cover',
    beforeLabel: 'Dusty & Stained',
    afterLabel: 'Deep Studio Clean',
  },
  Tyres: {
    beforeUrl: '/assets/before-after/tyres-before.webp',
    beforeClass: 'object-cover',
    afterUrl: '/assets/before-after/tyres-after.webp',
    afterClass: 'object-cover',
    beforeLabel: 'Faded Brake Dust',
    afterLabel: 'Gloss Dressing Finish',
  },
};

export function BeforeAfter() {
  const [activeTab, setActiveTab] = React.useState<TabType>('Exterior');
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
    // Only move if we hover/drag
    if (e.buttons === 1 || e.type === 'mousemove') {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const current = tabData[activeTab];

  return (
    <section className="border-b border-[#EAEAEA] bg-white py-14 text-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:max-w-6xl">
        <div className="mb-8 space-y-2 text-center">
          <span className="block text-[8px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
            Detailing Transformation
          </span>
          <h2 className="text-2xl font-light tracking-widest text-[#0A0A0A] uppercase sm:text-3xl">
            Before & After Showcase
          </h2>
          <div className="mx-auto mt-1 h-[1.5px] w-10 bg-[#FF4D00]" />
          <p className="mx-auto max-w-sm text-[10px] leading-relaxed font-light text-zinc-500">
            Drag the center slider line to inspect the paint, dashboard, and tire gloss
            transformation.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-0 sm:space-x-3">
          {(['Exterior', 'Interior', 'Tyres'] as const).map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
                className={`cursor-pointer rounded-full border px-5 py-2 text-[9px] font-black tracking-[0.2em] uppercase transition-all outline-none ${
                  isActive
                    ? 'border-[#FF4D00] bg-[#FF4D00]/5 font-bold text-[#FF4D00] shadow-sm'
                    : 'border-zinc-200 bg-transparent text-[#666666] hover:border-zinc-400 hover:text-[#0A0A0A]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Sliding comparison frame — larger visual impact */}
        <div className="relative h-[360px] w-full cursor-ew-resize overflow-hidden rounded-[24px] border border-zinc-200 bg-zinc-50 shadow-sm select-none sm:h-[440px] md:h-[520px] lg:h-[580px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="absolute inset-0 h-full w-full"
            >
              {/* Before Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={current.beforeUrl}
                  alt={current.beforeLabel}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
                  className={current.beforeClass}
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 z-10 rounded border border-red-500/20 bg-black/60 px-2.5 py-1 text-[8px] font-black tracking-widest text-red-500 uppercase backdrop-blur-sm">
                  Before: {current.beforeLabel}
                </span>
              </div>

              {/* After Image Overlay */}
              <div
                className="absolute inset-0 z-10 overflow-hidden"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
              >
                <Image
                  src={current.afterUrl}
                  alt={current.afterLabel}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
                  className={current.afterClass}
                  loading="lazy"
                />
                <span className="absolute top-4 right-4 z-10 rounded border border-[#FF4D00]/30 bg-[#FF4D00]/20 px-2.5 py-1 text-[8px] font-black tracking-widest text-[#FF4D00] uppercase backdrop-blur-sm">
                  After: {current.afterLabel}
                </span>
              </div>

              {/* Slider Line Divider */}
              <div
                className="pointer-events-none absolute top-0 bottom-0 z-20 w-[2px] bg-[#FF4D00]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF4D00] font-black text-white shadow-2xl">
                  ↔
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
export default BeforeAfter;
