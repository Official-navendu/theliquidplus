'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function LimitedTimeSale() {
  const [timeLeft, setTimeLeft] = React.useState({ hours: 12, minutes: 44, seconds: 59 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return {
            ...prev,
            minutes: prev.seconds === 0 ? prev.minutes - 1 : prev.minutes,
            seconds: 59,
          };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-b border-white/5 bg-black py-14 text-white">
      <div className="pointer-events-none absolute inset-0 bg-black" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Left Column: Offer details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 text-left"
          >
            <span className="inline-block rounded-full border border-[#FF4D00]/30 bg-[#FF4D00]/20 px-3 py-1 text-[8px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
              Limited Time Sale
            </span>

            <h2 className="text-2xl leading-tight font-black tracking-widest uppercase sm:text-3xl">
              <span className="text-white">CERAMIC</span>{' '}
              <span className="text-[#FF4D00]">PROTECTION</span> <br />
              <span className="mt-0.5 block text-lg font-light text-[#B5B5B5]">
                SUPER PACK OFFER
              </span>
            </h2>

            <p className="max-w-sm text-xs leading-relaxed font-light text-zinc-400">
              Order the Nano-Shield Ceramic 9H + Graphene Detail spray combo today and save 30% on
              shipping and premium microfiber towels.
            </p>

            {/* Countdown timer */}
            <div className="font-num flex items-center space-x-2.5 pt-1">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF4D00]/20 bg-[#0A0A0A] text-sm font-black text-[#FF4D00]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="mt-1 text-[7.5px] font-black tracking-widest text-zinc-500 uppercase">
                  Hours
                </span>
              </div>
              <span className="text-sm font-black text-zinc-700">:</span>
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF4D00]/20 bg-[#0A0A0A] text-sm font-black text-[#FF4D00]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="mt-1 text-[7.5px] font-black tracking-widest text-zinc-500 uppercase">
                  Mins
                </span>
              </div>
              <span className="text-sm font-black text-zinc-700">:</span>
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF4D00]/20 bg-[#0A0A0A] text-sm font-black text-[#FF4D00]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="mt-1 text-[7.5px] font-black tracking-widest text-zinc-500 uppercase">
                  Secs
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/shop"
                className="inline-block rounded-xl border-0 bg-[#FF4D00] px-6 py-2.5 text-[9px] font-black tracking-widest text-white uppercase transition-transform duration-300 hover:scale-105 hover:bg-[#E04400]"
              >
                Claim Discount Pack
              </a>
            </div>
          </motion.div>

          {/* Right Column: Visual Graphic Banner */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative flex h-[280px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-white/5 bg-[#050505] p-6 text-left shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#FF4D00]/30"
          >
            {/* Visual background logo watermark */}
            <div className="absolute right-[-10px] bottom-[-10px] h-48 w-48 opacity-20 transition-transform duration-700 group-hover:scale-105">
              <Image
                src="/spray-bottles.png"
                alt="Liquid Plus Spray Bottles"
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="relative z-20 space-y-2">
              <span className="text-[8px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
                Featured Combo
              </span>
              <h3 className="text-lg font-black tracking-widest text-white uppercase">
                NANO-SHIELD DUAL EDITION
              </h3>
              <p className="max-w-xs text-[10px] leading-relaxed font-light text-zinc-400">
                Ultra-hydrophobic ceramic chemical protection bundle. Tested by elite detailing
                studios worldwide.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default LimitedTimeSale;
