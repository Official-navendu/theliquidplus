'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';

const menuItems = [
  { name: 'New Arrivals' },
  { name: 'Featured' },
  { name: 'Top Trending' },
  { name: 'Premium Kits' },
  { name: 'Ceramic Collection' },
  { name: 'Best Sellers' },
];

const sampleProducts: Record<string, Array<{ id: string; name: string; price: string; rating: number; image: string }>> = {
  'New Arrivals': [
    { id: 'ea1', name: 'Ultimate Ceramic Coating 9H', price: '$4,999', rating: 4.9, image: '/spray-bottles.png' },
    { id: 'ea2', name: 'Graphene Detail Spray', price: '$2,900', rating: 4.8, image: '/spray-bottles.png' },
    { id: 'ea3', name: 'Premium Interior Shimmer', price: '$1,800', rating: 4.7, image: '/spray-bottles.png' },
    { id: 'ea4', name: 'Microfiber Wash Mitt', price: '$499', rating: 4.6, image: '/microfiber-1.png' },
    { id: 'ea5', name: 'HydroFoam Car Shampoo', price: '$1,299', rating: 4.9, image: '/spray-bottles.png' },
    { id: 'ea6', name: 'Apex Iron Wheel Off', price: '$1,850', rating: 4.8, image: '/spray-bottles.png' },
  ],
  'Featured': [],
  'Top Trending': [],
  'Premium Kits': [],
  'Ceramic Collection': [],
  'Best Sellers': [],
};

menuItems.forEach((item) => {
  if (item.name !== 'New Arrivals') {
    sampleProducts[item.name] = [...sampleProducts['New Arrivals']].sort(() => Math.random() - 0.5);
  }
});

export function ExploreCollections() {
  const [activeMenu, setActiveMenu] = React.useState('New Arrivals');

  const products = sampleProducts[activeMenu] || sampleProducts['New Arrivals'];

  return (
    <section className="py-14 bg-white text-[#0A0A0A] border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
            Featured Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-[#0A0A0A]">
            Curated Catalog
          </h2>
          <div className="w-10 h-[1.5px] bg-[#FF4D00] mx-auto mt-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Vertical Menu */}
          <div className="lg:col-span-3 flex flex-col space-y-2 border-r border-[#EAEAEA] pr-6 text-left">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`py-3 px-4 text-xs font-black uppercase tracking-widest text-left transition-all rounded-xl relative cursor-pointer ${
                    isActive ? 'text-[#FF4D00] bg-[#FF4D00]/5' : 'text-zinc-500 hover:text-[#0A0A0A]'
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeMenuLine"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF4D00] rounded-r"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Product Grid (3 Products x 2 Rows = 6 total) */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="group p-4 bg-[#1A1A1A] border border-white/5 rounded-2xl hover:border-[#FF4D00] hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(255,77,0,0.15)] transition-all duration-300 relative text-left"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/40 rounded-xl border border-white/5 hover-zoom">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="pt-3 space-y-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#FF4D00] transition-colors">{prod.name}</h4>
                    <div className="flex items-center space-x-1 text-[9px] text-[#B5B5B5]">
                      <div className="flex text-[#FF4D00]">
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                      <span className="font-bold text-[#E5E5E5]">{prod.rating}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs font-black text-white font-num">{prod.price}</span>
                      <button className="h-8 w-8 bg-black/40 border border-white/10 text-white hover:bg-[#FF4D00] hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export default ExploreCollections;
