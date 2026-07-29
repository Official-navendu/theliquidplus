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
    label: 'Product Purity',
  },
  {
    icon: Flame,
    title: 'Professional Grade',
    description:
      'Heavy duty nano-ceramic coatings and compounds engineered for certified detailers.',
    counter: '15K+',
    label: 'Certified Detailers',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description:
      'Insured padded transit dispatched within 24 hours to preserve chemistry freshness.',
    counter: '24hr',
    label: 'Average Dispatch',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description:
      'Hassle-free 14-day return framework if formulas do not meet your detailing standards.',
    counter: '100%',
    label: 'Satisfaction Rate',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'SSL-encrypted financial checkouts accepting all major cards and secure gateways.',
    counter: '256-bit',
    label: 'Encryption Standard',
  },
  {
    icon: HelpCircle,
    title: 'Expert Support',
    description:
      'Direct live access to master detailing technicians for guidance on application procedures.',
    counter: '24/7',
    label: 'Support Coverage',
  },
];

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-black py-14 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[#0A0A0A]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-2xl space-y-2 text-center">
          <span className="block text-[8px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
            THE LIQUID PLUS ADVANTAGE
          </span>
          <h2 className="text-2xl leading-tight font-black tracking-widest uppercase sm:text-3xl">
            <span className="text-white">WHY CHOOSE</span>{' '}
            <span className="text-[#FF4D00]">US</span>
          </h2>
          <div className="mx-auto mt-1 h-[1.5px] w-10 bg-[#FF4D00]" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                className="group relative flex h-[180px] cursor-pointer flex-col justify-between overflow-hidden border border-[#EAEAEA] bg-white p-5 text-left transition-all duration-300 ease-out hover:border-[#FF4D00] hover:bg-[#FF4D00] hover:shadow-[0_10px_20px_rgba(255,77,0,0.3)]"
              >
                <div className="flex items-start justify-between">
                  <div
                    style={{ borderRadius: '12px' }}
                    className="border border-[#FF4D00]/20 bg-[#FF4D00]/10 p-2 text-[#FF4D00] transition-all duration-300 group-hover:border-transparent group-hover:bg-transparent group-hover:text-white"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <div className="text-right">
                    <div className="font-num text-lg font-black tracking-tight text-[#FF4D00] transition-colors duration-300 group-hover:text-white">
                      {feat.counter}
                    </div>
                    <div className="text-[7px] font-bold tracking-wider text-[#888] uppercase transition-colors duration-300 group-hover:text-white/80">
                      {feat.label}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold tracking-wider text-[#0A0A0A] uppercase transition-colors duration-300 group-hover:text-white">
                    {feat.title}
                  </div>
                  <div className="line-clamp-2 text-[10px] leading-relaxed font-light text-zinc-500 transition-colors duration-300 group-hover:text-white">
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
