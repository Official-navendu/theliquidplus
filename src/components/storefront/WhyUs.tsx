/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Truck, RefreshCw, Lock, HelpCircle } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Premium Quality',
    description: 'Formulated with high-grade European active chemical resins.',
    counter: '99.9%',
    label: 'Product Purity'
  },
  {
    icon: Flame,
    title: 'Professional Grade',
    description: 'Heavy duty nano-ceramic coatings and compounds engineered for certified detailers.',
    counter: '15K+',
    label: 'Certified Detailers'
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Insured padded transit dispatched within 24 hours to preserve chemistry freshness.',
    counter: '24hr',
    label: 'Average Dispatch'
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: 'Hassle-free 14-day return framework if formulas do not meet your detailing standards.',
    counter: '100%',
    label: 'Satisfaction Rate'
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'SSL-encrypted financial checkouts accepting all major cards and secure gateways.',
    counter: '256-bit',
    label: 'Encryption Standard'
  },
  {
    icon: HelpCircle,
    title: 'Expert Support',
    description: 'Direct live access to master detailing technicians for guidance on application procedures.',
    counter: '24/7',
    label: 'Support Coverage'
  },
];

export function WhyUs() {
  return (
    <section className="py-14 bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[#0A0A0A] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
            THE LIQUID PLUS ADVANTAGE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest leading-tight">
            <span className="text-white">WHY CHOOSE</span> <span className="text-[#FF4D00]">US</span>
          </h2>
          <div className="w-10 h-[1.5px] bg-[#FF4D00] mx-auto mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                style={{ borderRadius: '16px' }}
                className="group p-5 bg-white border border-[#EAEAEA] hover:bg-[#FF4D00] hover:border-[#FF4D00] hover:shadow-[0_10px_20px_rgba(255,77,0,0.3)] transition-all duration-300 ease-out relative text-left overflow-hidden flex flex-col justify-between h-[180px] cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div
                    style={{ borderRadius: '12px' }}
                    className="p-2 bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[#FF4D00] transition-all duration-300 group-hover:bg-transparent group-hover:border-transparent group-hover:text-white"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  
                  <div className="text-right">
                    <div className="font-num text-lg font-black text-[#FF4D00] group-hover:text-white tracking-tight transition-colors duration-300">
                      {feat.counter}
                    </div>
                    <div className="text-[7px] text-[#888] group-hover:text-white/80 uppercase tracking-wider font-bold transition-colors duration-300">
                      {feat.label}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold tracking-wider uppercase text-[#0A0A0A] group-hover:text-white transition-colors duration-300">
                    {feat.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 group-hover:text-white font-light leading-relaxed transition-colors duration-300 line-clamp-2">
                    {feat.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default WhyUs;
