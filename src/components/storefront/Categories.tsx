'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    name: 'Exterior',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=400',
    href: '/shop',
  },
  {
    name: 'Interior',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400',
    href: '/shop',
  },
  {
    name: 'Ceramic Coating',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400',
    href: '/shop',
  },
  {
    name: 'Wash & Care',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=400',
    href: '/shop',
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400',
    href: '/shop',
  },
  {
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400',
    href: '/shop',
  },
];

interface CategoryItem {
  name: string;
  image: string;
  href: string;
}

export function Categories({ categoriesData }: { categoriesData?: CategoryItem[] }) {
  const list = categoriesData && categoriesData.length > 0 ? categoriesData : categories;

  return (
    <section id="categories" className="py-14 bg-white text-[#0A0A0A] border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
            Core Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-[#0A0A0A]">
            Shop By Category
          </h2>
          <div className="w-10 h-[1.5px] bg-[#FF4D00] mx-auto mt-1" />
        </div>

        {/* 6 Oval Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center">
          {list.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Link
                href={cat.href}
                className="group flex flex-col items-center space-y-3"
              >
                {/* Oval/Circular Image Container */}
                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-[#EAEAEA] bg-[#F8F8F8] transition-all duration-500 group-hover:border-[#FF4D00] group-hover:-translate-y-1 group-hover:shadow-[0_8px_16px_rgba(255,77,0,0.12)] flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                </div>

                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0A0A0A] group-hover:text-[#FF4D00] transition-colors">
                  {cat.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
export default Categories;
