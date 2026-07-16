/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sanjay Kapoor',
    vehicle: 'Porsche 911 GT3',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    quote: 'Carbon Shield 9H is a game changer. The deep glass reflection is unmatched, and water shedding is intense.',
  },
  {
    id: 2,
    name: 'Marcus Reynolds',
    vehicle: 'Tesla Model S Plaid',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    quote: 'The hydrophobic performance of the Ceramic Coating has beaten all competing products we tested.',
  },
  {
    id: 3,
    name: 'Liam Sterling',
    vehicle: 'BMW M3 Competition',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
    quote: 'HydroFoam Snow Shampoo is now our standard shop soap. Incredibly slick wash preventing swirl scratches.',
  },
  {
    id: 4,
    name: 'David Mercer',
    vehicle: 'Audi R8 V10',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150',
    quote: 'Zero streaks on carbon fiber trims with the Quick Detailer. Leaves a true luxury high-gloss outcome.',
  },
  {
    id: 5,
    name: 'Vikram Sen',
    vehicle: 'Mercedes AMG G63',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    quote: 'The leather guard leaves a clean satin finish, not sticky. Our clients love the fresh leather smell.',
  },
  {
    id: 6,
    name: 'Emily Watson',
    vehicle: 'Land Rover Defender',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
    quote: 'Amazing detailing outcome with the dual-pile microfiber. Truly professional-grade car care.',
  },
  {
    id: 7,
    name: 'Carlos Mendez',
    vehicle: 'Corvette C8',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150',
    quote: 'The spray detailer gives that instant wet pop before car shows. Unbelievable slickness and gloss.',
  },
  {
    id: 8,
    name: 'Jessica Thorne',
    vehicle: 'Porsche Taycan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150',
    quote: 'The premium red microfiber mitt is insanely soft! Glides over ceramic coatings with zero resistance.',
  },
];

interface TestimonialItem {
  id: number;
  name: string;
  vehicle: string;
  avatar: string;
  quote: string;
}

export function Testimonials({ testimonialsData }: { testimonialsData?: TestimonialItem[] }) {
  const list = testimonialsData && testimonialsData.length > 0 ? testimonialsData : testimonials;
  return (
    <section className="py-14 bg-white text-[#0A0A0A] border-b border-[#EAEAEA] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-8">
        <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block mb-1">
          CLIENT EXPERIENCE
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-[#0A0A0A] leading-tight">
          TRUSTED BY <span className="text-[#FF4D00]">PROFESSIONALS</span>
        </h2>
        <div className="w-10 h-[1.5px] bg-[#FF4D00] mx-auto mt-1" />
      </div>

      <div className="flex w-full overflow-hidden relative select-none">
        <div className="flex animate-marquee-testimonials space-x-5 hover:[animation-play-state:paused] py-3">
          {list.map((test) => (
            <motion.div
              key={test.id}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{ borderRadius: '16px' }}
              className="w-[260px] flex-shrink-0 p-3.5 bg-white border border-[#EAEAEA] shadow-sm hover:bg-[#FF4D00] hover:border-[#FF4D00] hover:shadow-[0_10px_20px_rgba(255,77,0,0.25)] transition-all duration-300 ease-out flex flex-col justify-between h-36 text-left group cursor-pointer"
            >
              <div>
                <div className="flex text-[#FFD700] mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700] group-hover:fill-white group-hover:text-white transition-colors duration-300" />
                  ))}
                </div>
                <div className="text-[9.5px] text-[#444] group-hover:text-white font-light leading-relaxed italic transition-colors duration-300 line-clamp-2">
                  &ldquo;{test.quote}&rdquo;
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-[#EAEAEA] group-hover:border-white/10 transition-colors duration-300">
                <div className="relative h-7 w-7 rounded-full overflow-hidden border border-[#EAEAEA] group-hover:border-white/20">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[9.5px] font-bold text-[#0A0A0A] group-hover:text-white uppercase transition-colors duration-300">{test.name}</div>
                  <div className="text-[7px] text-[#FF4D00] group-hover:text-white font-black uppercase tracking-wider transition-colors duration-300">{test.vehicle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Copy for infinite loop */}
        <div className="flex animate-marquee-testimonials space-x-5 hover:[animation-play-state:paused] ml-5 py-3" aria-hidden="true">
          {list.map((test) => (
            <motion.div
              key={`dup-${test.id}`}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{ borderRadius: '16px' }}
              className="w-[260px] flex-shrink-0 p-3.5 bg-white border border-[#EAEAEA] shadow-sm hover:bg-[#FF4D00] hover:border-[#FF4D00] hover:shadow-[0_10px_20px_rgba(255,77,0,0.25)] transition-all duration-300 ease-out flex flex-col justify-between h-36 text-left group cursor-pointer"
            >
              <div>
                <div className="flex text-[#FFD700] mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700] group-hover:fill-white group-hover:text-white transition-colors duration-300" />
                  ))}
                </div>
                <div className="text-[9.5px] text-[#444] group-hover:text-white font-light leading-relaxed italic transition-colors duration-300 line-clamp-2">
                  &ldquo;{test.quote}&rdquo;
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-[#EAEAEA] group-hover:border-white/10 transition-colors duration-300">
                <div className="relative h-7 w-7 rounded-full overflow-hidden border border-[#EAEAEA] group-hover:border-white/20">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[9.5px] font-bold text-[#0A0A0A] group-hover:text-white uppercase transition-colors duration-300">{test.name}</div>
                  <div className="text-[7px] text-[#FF4D00] group-hover:text-white font-black uppercase tracking-wider transition-colors duration-300">{test.vehicle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-testimonials {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-testimonials {
          display: flex;
          animation: marquee-testimonials 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
export default Testimonials;
