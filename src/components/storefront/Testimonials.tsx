'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Sanjay Kapoor',
    vehicle: 'Porsche 911 GT3',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    quote:
      'Carbon Shield 9H is a game changer. The deep glass reflection is unmatched, and water shedding is intense.',
  },
  {
    id: 2,
    name: 'Marcus Reynolds',
    vehicle: 'Tesla Model S Plaid',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    quote:
      'The hydrophobic performance of the Ceramic Coating has beaten all competing products we tested.',
  },
  {
    id: 3,
    name: 'Liam Sterling',
    vehicle: 'BMW M3 Competition',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
    quote:
      'HydroFoam Snow Shampoo is now our standard shop soap. Incredibly slick wash preventing swirl scratches.',
  },
  {
    id: 4,
    name: 'David Mercer',
    vehicle: 'Audi R8 V10',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150',
    quote:
      'Zero streaks on carbon fiber trims with the Quick Detailer. Leaves a true luxury high-gloss outcome.',
  },
  {
    id: 5,
    name: 'Vikram Sen',
    vehicle: 'Mercedes AMG G63',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    quote:
      'The leather guard leaves a clean satin finish, not sticky. Our clients love the fresh leather smell.',
  },
  {
    id: 6,
    name: 'Emily Watson',
    vehicle: 'Land Rover Defender',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
    quote:
      'Amazing detailing outcome with the dual-pile microfiber. Truly professional-grade car care.',
  },
  {
    id: 7,
    name: 'Carlos Mendez',
    vehicle: 'Corvette C8',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150',
    quote:
      'The spray detailer gives that instant wet pop before car shows. Unbelievable slickness and gloss.',
  },
  {
    id: 8,
    name: 'Jessica Thorne',
    vehicle: 'Porsche Taycan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150',
    quote:
      'The premium red microfiber mitt is insanely soft! Glides over ceramic coatings with zero resistance.',
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
    <section className="relative overflow-hidden border-b border-[#EAEAEA] bg-white py-14 text-[#0A0A0A]">
      <div className="relative z-10 mx-auto mb-8 max-w-7xl px-6 text-center">
        <span className="mb-1 block text-[8px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
          CLIENT EXPERIENCE
        </span>
        <h2 className="text-2xl leading-tight font-black tracking-widest text-[#0A0A0A] uppercase sm:text-3xl">
          TRUSTED BY <span className="text-[#FF4D00]">PROFESSIONALS</span>
        </h2>
        <div className="mx-auto mt-1 h-[1.5px] w-10 bg-[#FF4D00]" />
      </div>

      <div className="relative flex w-full overflow-hidden select-none">
        <div className="animate-marquee-testimonials flex space-x-5 py-3 hover:[animation-play-state:paused]">
          {list.map((test) => (
            <motion.div
              key={test.id}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{ borderRadius: '16px' }}
              className="group flex h-36 w-[260px] flex-shrink-0 cursor-pointer flex-col justify-between border border-[#EAEAEA] bg-white p-3.5 text-left shadow-sm transition-all duration-300 ease-out hover:border-[#FF4D00] hover:bg-[#FF4D00] hover:shadow-[0_10px_20px_rgba(255,77,0,0.25)]"
            >
              <div>
                <div className="mb-1.5 flex text-[#FFD700]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700] transition-colors duration-300 group-hover:fill-white group-hover:text-white"
                    />
                  ))}
                </div>
                <div className="line-clamp-2 text-[9.5px] leading-relaxed font-light text-[#444] italic transition-colors duration-300 group-hover:text-white">
                  &ldquo;{test.quote}&rdquo;
                </div>
              </div>

              <div className="flex items-center space-x-2 border-t border-[#EAEAEA] pt-2 transition-colors duration-300 group-hover:border-white/10">
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#EAEAEA] group-hover:border-white/20">
                  <Image
                    src={test.avatar}
                    alt={test.name}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-[9.5px] font-bold text-[#0A0A0A] uppercase transition-colors duration-300 group-hover:text-white">
                    {test.name}
                  </div>
                  <div className="text-[7px] font-black tracking-wider text-[#FF4D00] uppercase transition-colors duration-300 group-hover:text-white">
                    {test.vehicle}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Copy for infinite loop */}
        <div
          className="animate-marquee-testimonials ml-5 flex space-x-5 py-3 hover:[animation-play-state:paused]"
          aria-hidden="true"
        >
          {list.map((test) => (
            <motion.div
              key={`dup-${test.id}`}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{ borderRadius: '16px' }}
              className="group flex h-36 w-[260px] flex-shrink-0 cursor-pointer flex-col justify-between border border-[#EAEAEA] bg-white p-3.5 text-left shadow-sm transition-all duration-300 ease-out hover:border-[#FF4D00] hover:bg-[#FF4D00] hover:shadow-[0_10px_20px_rgba(255,77,0,0.25)]"
            >
              <div>
                <div className="mb-1.5 flex text-[#FFD700]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700] transition-colors duration-300 group-hover:fill-white group-hover:text-white"
                    />
                  ))}
                </div>
                <div className="line-clamp-2 text-[9.5px] leading-relaxed font-light text-[#444] italic transition-colors duration-300 group-hover:text-white">
                  &ldquo;{test.quote}&rdquo;
                </div>
              </div>

              <div className="flex items-center space-x-2 border-t border-[#EAEAEA] pt-2 transition-colors duration-300 group-hover:border-white/10">
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#EAEAEA] group-hover:border-white/20">
                  <Image
                    src={test.avatar}
                    alt={test.name}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-[9.5px] font-bold text-[#0A0A0A] uppercase transition-colors duration-300 group-hover:text-white">
                    {test.name}
                  </div>
                  <div className="text-[7px] font-black tracking-wider text-[#FF4D00] uppercase transition-colors duration-300 group-hover:text-white">
                    {test.vehicle}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-testimonials {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
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
