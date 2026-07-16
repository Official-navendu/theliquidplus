'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, RefreshCw } from 'lucide-react';
import Image from 'next/image';

const bestSellers = [
  {
    id: '1',
    name: 'Carbon Shield 9H Ceramic',
    category: 'Ceramic Coating',
    price: '$6,500',
    comparePrice: '$7,500',
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400',
    onSale: true,
    brand: 'The Liquid Plus',
  },
  {
    id: '2',
    name: 'HydroFoam Snow Shampoo',
    category: 'Car Shampoo',
    price: '$1,299',
    rating: 4.8,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=400',
    onSale: false,
    brand: 'The Liquid Plus',
  },
  {
    id: '3',
    name: 'Satin Finish Leather Guard',
    category: 'Interior Care',
    price: '$1,499',
    rating: 4.7,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400',
    onSale: false,
    brand: 'The Liquid Plus',
  },
  {
    id: '4',
    name: 'Crystal Clear Glass Cleaner',
    category: 'Glass Care',
    price: '$899',
    rating: 4.6,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1605558191976-9a00b77faac0?q=80&w=400',
    onSale: false,
    brand: 'The Liquid Plus',
  },
  {
    id: '5',
    name: 'Apex Iron Off Wheel Cleaner',
    category: 'Wheel & Tire Care',
    price: '$1,850',
    comparePrice: '$2,100',
    rating: 4.9,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400',
    onSale: true,
    brand: 'The Liquid Plus',
  },
  {
    id: '6',
    name: 'Ultra Gloss Quick Detailer',
    category: 'Exterior Care',
    price: '$1,150',
    rating: 4.8,
    reviewsCount: 72,
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=400',
    onSale: false,
    brand: 'The Liquid Plus',
  },
  {
    id: '7',
    name: 'Clay Bar Detailing Prep',
    category: 'Exterior Care',
    price: '$950',
    rating: 4.5,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1627124718133-0112dec7a6a4?q=80&w=400',
    onSale: false,
    brand: 'The Liquid Plus',
  },
  {
    id: '8',
    name: 'Ceramic Tyre Dressing',
    category: 'Wheel & Tire Care',
    price: '$1,650',
    rating: 4.8,
    reviewsCount: 65,
    image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400',
    onSale: false,
    brand: 'The Liquid Plus',
  },
];

export function BestSellers() {
  return (
    <section id="best-sellers" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-[9px] tracking-[0.3em] text-[#FF4D00] uppercase font-bold">
            Best Sellers
          </span>
          <h2 className="text-3xl font-light tracking-[0.1em] uppercase">
            Detailing Favorites
          </h2>
          <div className="w-12 h-[2px] bg-[#FF4D00] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group flex flex-col space-y-4 relative bg-[#0a0a0a] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111] rounded-lg">
                
                {/* Discount Badge */}
                {product.onSale && (
                  <span className="absolute top-3 left-3 z-10 bg-[#FF4D00] text-black text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm">
                    Sale
                  </span>
                )}

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                {/* Overlaid Actions Trigger */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-black p-2.5 rounded-none transition-colors border border-white/10 shadow-lg" aria-label="Add to cart">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </button>
                  <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-black p-2.5 rounded-none transition-colors border border-white/10 shadow-lg" aria-label="Quick View">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-black p-2.5 rounded-none transition-colors border border-white/10 shadow-lg" aria-label="Compare">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-black p-2.5 rounded-none transition-colors border border-white/10 shadow-lg" aria-label="Add to wishlist">
                    <Heart className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <span className="text-[8px] tracking-[0.2em] text-[#FF4D00] uppercase font-bold">
                  {product.brand}
                </span>
                <h3 className="text-xs font-semibold tracking-wide text-[#E5E5E5] group-hover:text-white transition-colors cursor-pointer line-clamp-1">
                  {product.name}
                </h3>
                
                <span className="text-[9px] tracking-wider text-[#B5B5B5] block">
                  {product.category}
                </span>

                {/* Reviews */}
                <div className="flex items-center space-x-1 text-[9px] text-[#B5B5B5]">
                  <span className="text-[#FF4D00]">★ ★ ★ ★ ★</span>
                  <span>{product.rating}</span>
                  <span className="opacity-70">({product.reviewsCount} Reviews)</span>
                </div>

                {/* Pricing Details */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-xs font-semibold text-white">{product.price}</span>
                  {product.comparePrice && (
                    <span className="text-[10px] text-[#B5B5B5] line-through">
                      {product.comparePrice}
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default BestSellers;
