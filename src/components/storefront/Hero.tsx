'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative mt-16 flex h-[500px] w-full items-center overflow-hidden bg-white select-none md:h-[600px] lg:h-[640px]">
      {/* Background Video */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/car.mp4"
        />
      </motion.div>

      {/* Left White Fade Effect (25-30% on desktop, 35% on tablet, full-screen overlay on mobile) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-gradient-to-r from-white via-white/80 to-transparent md:w-[45%] lg:w-[35%]" />
      {/* Fallback overlay for extra mobile readability */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-white/20 md:hidden" />

      {/* Content Container */}
      <div className="relative z-20 mx-auto flex h-full w-full max-w-[1400px] items-center px-6 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex max-w-[520px] flex-col justify-center space-y-4 text-left"
        >
          {/* Small Label */}
          <div className="flex items-center space-x-2 text-[9px] font-black tracking-[0.2em] text-[#FF4D00] uppercase">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Premium Detailing</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl leading-[1.1] font-black tracking-tight text-black uppercase sm:text-4xl md:text-[42px]">
            THE FUTURE OF <br />
            <span className="text-[#FF4D00]">CAR PROTECTION</span>
          </h1>

          {/* Description */}
          <p className="max-w-[400px] text-[11px] leading-relaxed font-normal text-zinc-600 sm:text-xs">
            Premium ceramic coatings, nano sealants, and professional detailing solutions engineered
            for automotive enthusiasts and certified detailing experts.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
            <Link
              href="/shop"
              className="flex w-full cursor-pointer items-center justify-center space-x-1.5 rounded-xl border-0 bg-[#FF4D00] px-5 py-2.5 text-[9px] font-black tracking-widest text-white uppercase transition-all duration-300 hover:bg-[#E04400] hover:shadow-[0_4px_12px_rgba(255,77,0,0.25)] sm:w-auto"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/shop"
              className="flex w-full cursor-pointer items-center justify-center rounded-xl border-0 bg-black px-5 py-2.5 text-[9px] font-black tracking-widest text-white uppercase transition-all duration-300 hover:bg-zinc-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] sm:w-auto"
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
