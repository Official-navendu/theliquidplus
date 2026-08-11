'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';

const menuItems = [
  { name: 'New Arrivals' },
  { name: 'Featured' },
  { name: 'Top Trending' },
  { name: 'Premium Kits' },
  { name: 'Ceramic Collection' },
  { name: 'Best Sellers' },
];

const sampleProducts: Record<
  string,
  Array<{ id: string; name: string; price: string; rating: number; image: string }>
> = {
  'New Arrivals': [
    {
      id: 'ea1',
      name: 'Ultimate Ceramic Coating 9H',
      price: '$4,999',
      rating: 4.9,
      image: '/spray-bottles.png',
    },
    {
      id: 'ea2',
      name: 'Graphene Detail Spray',
      price: '$2,900',
      rating: 4.8,
      image: '/spray-bottles.png',
    },
    {
      id: 'ea3',
      name: 'Premium Interior Shimmer',
      price: '$1,800',
      rating: 4.7,
      image: '/spray-bottles.png',
    },
    {
      id: 'ea4',
      name: 'Microfiber Wash Mitt',
      price: '$499',
      rating: 4.6,
      image: '/microfiber-1.png',
    },
    {
      id: 'ea5',
      name: 'HydroFoam Car Shampoo',
      price: '$1,299',
      rating: 4.9,
      image: '/spray-bottles.png',
    },
    {
      id: 'ea6',
      name: 'Apex Iron Wheel Off',
      price: '$1,850',
      rating: 4.8,
      image: '/spray-bottles.png',
    },
  ],
  Featured: [],
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
    <section className="border-b border-[#EAEAEA] bg-white py-14 text-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Title Header */}
        <div className="mx-auto mb-10 max-w-2xl space-y-2 text-center">
          <span className="block text-[8px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
            Featured Collections
          </span>
          <h2 className="text-2xl font-light tracking-widest text-[#0A0A0A] uppercase sm:text-3xl">
            Curated Catalog
          </h2>
          <div className="mx-auto mt-1 h-[1.5px] w-10 bg-[#FF4D00]" />
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Vertical Menu */}
          <div className="flex flex-col space-y-2 border-r border-[#EAEAEA] pr-6 text-left lg:col-span-3">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`relative cursor-pointer rounded-xl px-4 py-3 text-left text-xs font-black tracking-widest uppercase transition-all ${
                    isActive
                      ? 'bg-[#FF4D00]/5 text-[#FF4D00]'
                      : 'text-zinc-500 hover:text-[#0A0A0A]'
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeMenuLine"
                      className="absolute top-0 bottom-0 left-0 w-[3px] rounded-r bg-[#FF4D00]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Product Grid (3 Products x 2 Rows = 6 total) */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="group relative rounded-2xl border border-white/5 bg-[#1A1A1A] p-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF4D00] hover:shadow-[0_12px_24px_rgba(255,77,0,0.15)]"
                >
                  <div className="hover-zoom relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/5 bg-black/40">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1 pt-3">
                    <h4 className="line-clamp-1 text-xs font-bold text-white transition-colors group-hover:text-[#FF4D00]">
                      {prod.name}
                    </h4>
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
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-num text-xs font-black text-white">{prod.price}</span>
                      <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white transition-colors hover:bg-[#FF4D00] hover:text-white">
                        <ShoppingCart className="h-3.5 w-3.5" />
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
