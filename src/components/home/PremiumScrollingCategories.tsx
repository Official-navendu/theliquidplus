'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  tag?: string;
}

export function PremiumScrollingCategories({ categories }: { categories?: CategoryProps[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const triggersRef = React.useRef<(HTMLDivElement | null)[]>([]);

  // Parse categories from prop
  const list = React.useMemo(() => {
    if (!categories) {
      return [];
    }
    return categories.map((cat, idx) => ({
      id: cat.id,
      num: String(idx + 1).padStart(2, '0'),
      name: cat.name,
      image: cat.bannerUrl || cat.imageUrl || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200',
      href: `/categories/${cat.slug}`,
      tag: cat.tag || 'Collection Range',
    }));
  }, [categories]);

  // Set up Intersection Observer to track active section in desktop sticky scroll
  React.useEffect(() => {
    if (list.length === 0) return;

    const observerOptions = {
      root: null, // viewport
      rootMargin: '-40% 0px -40% 0px', // Trigger when section passes through the center of screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const indexStr = entry.target.getAttribute('data-index');
          if (indexStr !== null) {
            const idx = parseInt(indexStr, 10);
            setActiveIndex(idx);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all targets
    triggersRef.current.forEach((trigger) => {
      if (trigger) observer.observe(trigger);
    });

    return () => {
      observer.disconnect();
    };
  }, [list]);

  // Native scroll to target element
  const scrollToCategory = (index: number) => {
    const target = triggersRef.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  if (list.length === 0) {
    return null;
  }

  return (
    <>
      {/* ==========================================
          DESKTOP & TABLET VIEW (Sticky 450vh scroll storytelling in Premium Floating Card)
          ========================================== */}
      <div className="hidden md:block relative bg-white select-none py-20 px-6 lg:px-8 border-b border-zinc-100">
        
        {/* Section Title Header matching Liquid Plus design */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3 px-6">
          <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
            COLLECTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-widest !text-[#0A0A0A]">
            SHOP BY CATEGORY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-light max-w-xl mx-auto leading-relaxed">
            Discover our premium detailing collections designed for every stage of professional car care.
          </p>
          <div className="w-8 h-[1.5px] bg-[#FF4D00] mx-auto mt-2" />
        </div>

        {/* Scroll triggers wrapper and sticky block container */}
        <div className="relative" style={{ height: `${list.length * 90}vh` }}>
          
          {/* Sticky luxury content card container */}
          <div className="sticky top-[100px] h-[calc(100vh-140px)] max-w-[1600px] mx-auto w-full rounded-[32px] overflow-hidden border border-white/20 bg-zinc-950/80 backdrop-blur-md shadow-[0_24px_80px_rgba(0,0,0,0.15)] flex items-stretch z-10">
            
            {/* LEFT PANEL: White Minimal Navigation Panel */}
            <div className="w-[38%] lg:w-[34%] xl:w-[30%] bg-white flex flex-col justify-between p-12 z-20 relative text-left border-r border-zinc-200">
              
              {/* Header */}
              <div className="space-y-1">
                <span className="text-[9px] tracking-[0.3em] text-[#FF4D00] uppercase font-black block">
                  CARE RANGES
                </span>
              </div>

              {/* Vertical Menu Buttons */}
              <div className="flex flex-col space-y-4 my-auto relative">
                {list.map((cat, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(idx)}
                      className={`w-full text-left py-4 px-6 rounded-2xl transition-all duration-300 relative overflow-hidden group flex items-center justify-between outline-none cursor-pointer ${
                        isActive
                          ? 'bg-zinc-50 opacity-100'
                          : 'bg-transparent opacity-60 hover:opacity-100 hover:bg-zinc-50'
                      }`}
                    >
                      {/* Active Accent Line */}
                      {isActive && (
                        <motion.div
                          layoutId="activeAccentLine"
                          className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF4D00]"
                          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                        />
                      )}

                      <div className="flex items-center space-x-5 pl-2">
                        <span className={`text-[11px] font-mono tracking-widest font-bold transition-colors duration-300 ${
                          isActive ? 'text-[#FF4D00]' : 'text-zinc-500'
                        }`}>
                          {cat.num}
                        </span>
                        <h3 className={`text-sm lg:text-base uppercase tracking-wider font-bold transition-colors duration-300 ${
                          isActive ? 'text-[#FF4D00]' : 'text-[#111111]'
                        }`}>
                          {cat.name}
                        </h3>
                      </div>

                      {/* Premium Animated arrow */}
                      <div className={`transition-all duration-300 transform ${
                        isActive ? 'text-[#FF4D00] opacity-100' : 'text-[#111111] opacity-40 group-hover:opacity-100'
                      }`}>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Brand Slogan Footer */}
              <div className="text-[8px] tracking-[0.25em] text-[#FF4D00] font-black uppercase">
                THE LIQUID PLUS
              </div>
            </div>

            {/* RIGHT COLUMN: Large Immersive Lifestyle Category Images (Crossfade & Scale visual transition) */}
            <div className="w-[62%] lg:w-[66%] xl:w-[70%] h-full relative z-10 overflow-hidden bg-zinc-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={list[activeIndex].id}
                  initial={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Link href={list[activeIndex].href} className="block w-full h-full relative group">
                    <Image
                      src={list[activeIndex].image}
                      alt={list[activeIndex].name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      className="object-cover"
                    />
                    
                    {/* Very subtle left shadow boundary */}
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-10" />

                    {/* Detailing tag overlay */}
                    <div className="absolute top-10 right-10 z-20">
                      <span className="bg-zinc-950/70 backdrop-blur-sm border border-white/10 text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                        {list[activeIndex].tag}
                      </span>
                    </div>

                    {/* Optional Floating CTA Explore badge */}
                    <div className="absolute bottom-10 right-10 z-20 flex items-center space-x-2 bg-zinc-950/75 backdrop-blur-sm border border-white/10 text-white text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-[#FF4D00] hover:border-[#FF4D00] transition-all cursor-pointer shadow-lg group-hover:scale-105">
                      <span>Explore Collection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Sibling intersection observer trigger targets */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {list.map((cat, idx) => (
              <div
                key={`observer-trigger-${cat.id}`}
                ref={(el) => {
                  triggersRef.current[idx] = el;
                }}
                data-index={idx}
                className="h-[90vh] w-full"
              />
            ))}
          </div>

        </div>
      </div>

      {/* ==========================================
          MOBILE VIEW (Pills -> Image first -> Dark Content Card)
          ========================================== */}
      <section className="block md:hidden bg-white py-16 border-b border-zinc-100 text-left">
        <div className="px-6 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
              Automotive Collections
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-wider !text-black">
              Shop By Category
            </h2>
            <div className="w-8 h-[1.5px] bg-[#FF4D00]" />
          </div>

          {/* Sticky horizontal pill layout */}
          <div className="flex overflow-x-auto space-x-2.5 pb-3 scrollbar-hide -mx-6 px-6">
            {list.map((cat, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#FF4D00] text-white border-[#FF4D00] shadow-[0_4px_12px_rgba(255,77,0,0.25)] scale-[1.02]'
                      : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:text-black'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Mobile Image First */}
          <div className="relative w-full rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-100 aspect-[4/3] shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={list[activeIndex].id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                <Link href={list[activeIndex].href} className="block w-full h-full relative">
                  <Image
                    src={list[activeIndex].image}
                    alt={list[activeIndex].name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  
                  {/* Mobile active tag */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-black/70 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-white/10">
                      {list[activeIndex].tag}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dark Content Card below */}
          <div className="bg-zinc-950 rounded-2xl p-6 flex flex-col justify-between shadow-lg text-left min-h-[140px]">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-widest text-[#FF4D00] font-black block">
                  CARE RANGES
                </span>
                <h3 className="text-xl font-bold uppercase !text-white tracking-tight">
                  {list[activeIndex].name}
                </h3>
              </div>
              <span className="text-lg font-mono text-[#FF4D00] font-bold">
                {list[activeIndex].num}
              </span>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <Link
                href={list[activeIndex].href}
                className="inline-flex bg-[#FF4D00] text-white hover:bg-[#E04400] px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all items-center space-x-1.5 shadow-md"
              >
                <span>EXPLORE</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default PremiumScrollingCategories;
