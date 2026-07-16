'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=400',
    alt: 'Car Wash Foam Detailing',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400',
    alt: 'Machine Polishing Swirl Correction',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400',
    alt: 'Finished High-Gloss Ceramic Coating',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=400',
    alt: 'Paint Water Beading Hydrophobic Reflection',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400',
    alt: 'Clean Leather Detailing Surface',
  },
];

export function SocialGallery() {
  return (
    <section className="py-14 bg-white text-[#0A0A0A] border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center space-y-2 mb-10">
          <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
            Detailers Gallery
          </span>
          <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-[#0A0A0A]">
            #TheLiquidPlus
          </h2>
          <div className="w-10 h-[1.5px] bg-[#FF4D00] mx-auto mt-1" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((img, index) => (
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative aspect-square w-full overflow-hidden group border border-[#EAEAEA] bg-[#F8F8F8] rounded-xl"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
export default SocialGallery;
