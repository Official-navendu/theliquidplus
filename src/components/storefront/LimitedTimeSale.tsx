/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function LimitedTimeSale() {
  const [timeLeft, setTimeLeft] = React.useState({ hours: 12, minutes: 44, seconds: 59 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.seconds === 0 ? prev.minutes - 1 : prev.minutes, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-14 bg-black text-white overflow-hidden relative border-t border-b border-white/5">
      <div className="absolute inset-0 bg-black pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Column: Offer details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 text-left"
          >
            <span className="text-[8px] tracking-[0.25em] bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 px-3 py-1 font-black rounded-full uppercase inline-block">
              Limited Time Sale
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest leading-tight">
              <span className="text-white">CERAMIC</span> <span className="text-[#FF4D00]">PROTECTION</span> <br />
              <span className="font-light text-[#B5B5B5] block mt-0.5 text-lg">SUPER PACK OFFER</span>
            </h2>

            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-sm">
              Order the Nano-Shield Ceramic 9H + Graphene Detail spray combo today and save 30% on shipping and premium microfiber towels.
            </p>

            {/* Countdown timer */}
            <div className="flex items-center space-x-2.5 pt-1 font-num">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-xl bg-[#0A0A0A] border border-[#FF4D00]/20 flex items-center justify-center text-sm font-black text-[#FF4D00]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-[7.5px] uppercase tracking-widest text-zinc-500 font-black mt-1">Hours</span>
              </div>
              <span className="text-sm text-zinc-700 font-black">:</span>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-xl bg-[#0A0A0A] border border-[#FF4D00]/20 flex items-center justify-center text-sm font-black text-[#FF4D00]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-[7.5px] uppercase tracking-widest text-zinc-500 font-black mt-1">Mins</span>
              </div>
              <span className="text-sm text-zinc-700 font-black">:</span>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-xl bg-[#0A0A0A] border border-[#FF4D00]/20 flex items-center justify-center text-sm font-black text-[#FF4D00]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="text-[7.5px] uppercase tracking-widest text-zinc-500 font-black mt-1">Secs</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/shop"
                className="bg-[#FF4D00] hover:bg-[#E04400] text-white hover:scale-105 px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl inline-block transition-transform duration-300 border-0"
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
            className="h-[280px] rounded-2xl border border-white/5 bg-[#050505] relative overflow-hidden flex flex-col justify-end p-6 text-left group cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-[#FF4D00]/30 transition-all duration-300"
          >
            {/* Visual background logo watermark */}
            <div className="absolute right-[-10px] bottom-[-10px] w-48 h-48 opacity-20 group-hover:scale-105 transition-transform duration-700">
              <img src="/spray-bottles.png" alt="Liquid Plus Spray Bottles" className="w-full h-full object-contain" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
            
            <div className="relative z-20 space-y-2">
              <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black">
                Featured Combo
              </span>
              <h3 className="text-lg font-black uppercase tracking-widest text-white">
                NANO-SHIELD DUAL EDITION
              </h3>
              <p className="text-[10px] text-zinc-400 font-light leading-relaxed max-w-xs">
                Ultra-hydrophobic ceramic chemical protection bundle. Tested by elite detailing studios worldwide.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
export default LimitedTimeSale;
