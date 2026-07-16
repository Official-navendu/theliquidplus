/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[640px] mt-16 bg-white overflow-hidden flex items-center select-none">
      
      {/* Background Video */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          src="/assets/car.mp4"
        />
      </motion.div>

      {/* Left White Fade Effect (25-30% on desktop, 35% on tablet, full-screen overlay on mobile) */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[45%] lg:w-[35%] bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      {/* Fallback overlay for extra mobile readability */}
      <div className="absolute inset-0 bg-white/20 md:hidden z-10 pointer-events-none" />

      {/* Content Container */}
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8 md:px-12 relative z-20 flex items-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-[520px] flex flex-col justify-center space-y-4 text-left"
        >
          {/* Small Label */}
          <div className="flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-black text-[#FF4D00]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Premium Detailing</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black uppercase tracking-tight leading-[1.1] text-black">
            THE FUTURE OF <br />
            <span className="text-[#FF4D00]">CAR PROTECTION</span>
          </h1>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-zinc-600 font-normal leading-relaxed max-w-[400px]">
            Premium ceramic coatings, nano sealants, and professional detailing solutions engineered for automotive enthusiasts and certified detailing experts.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Link
              href="/shop"
              className="bg-[#FF4D00] hover:bg-[#E04400] text-white hover:shadow-[0_4px_12px_rgba(255,77,0,0.25)] px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer border-0 w-full sm:w-auto"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/shop"
              className="bg-black hover:bg-zinc-800 text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer border-0 w-full sm:w-auto"
            >
              EXPLORE
            </Link>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
export default Hero;
