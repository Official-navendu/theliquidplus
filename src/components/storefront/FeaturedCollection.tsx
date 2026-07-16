'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, RefreshCw, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const tabs = ['Featured', 'Best Sellers', 'Trending', 'New Arrivals', 'Most Popular'];

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  comparePrice?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  onSale: boolean;
  brand: string;
  slug?: string;
}

const productsData: Record<string, ProductItem[]> = {
  'Featured': [
    { id: 'f1', name: 'Carbon Shield 9H Ceramic', category: 'Ceramic Coating', price: '$6,500', comparePrice: '$7,500', rating: 4.9, reviewsCount: 142, image: '/spray-bottles.png', onSale: true, brand: 'The Liquid Plus' },
    { id: 'f2', name: 'Premium Red Microfiber Towel', category: 'Microfiber Collection', price: '$1,299', rating: 4.8, reviewsCount: 96, image: '/microfiber-1.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'f3', name: 'Satin Finish Leather Guard', category: 'Interior Care', price: '$1,499', rating: 4.7, reviewsCount: 88, image: '/spray-bottles.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'f4', name: 'Dual-Pile Microfiber Cloth', category: 'Microfiber Collection', price: '$899', rating: 4.6, reviewsCount: 54, image: '/microfiber-2.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'f5', name: 'Apex Iron Off Wheel Cleaner', category: 'Wheel & Tire Care', price: '$1,850', comparePrice: '$2,100', rating: 4.9, reviewsCount: 110, image: '/spray-bottles.png', onSale: true, brand: 'The Liquid Plus' },
    { id: 'f6', name: 'Ultra Gloss Quick Detailer', category: 'Exterior Care', price: '$1,150', rating: 4.8, reviewsCount: 72, image: '/spray-bottles.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'f7', name: 'Clay Bar Detailing Prep', category: 'Exterior Care', price: '$950', rating: 4.5, reviewsCount: 38, image: '/spray-bottles.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'f8', name: 'Ceramic Tyre Dressing', category: 'Wheel & Tire Care', price: '$1,650', rating: 4.8, reviewsCount: 65, image: '/spray-bottles.png', onSale: false, brand: 'The Liquid Plus' },
  ],
  'Best Sellers': [
    { id: 'b1', name: 'Apex Iron Off Wheel Cleaner', category: 'Wheel & Tire Care', price: '$1,850', comparePrice: '$2,100', rating: 4.9, reviewsCount: 110, image: '/spray-bottles.png', onSale: true, brand: 'The Liquid Plus' },
    { id: 'b2', name: 'Premium Red Microfiber Towel', category: 'Microfiber Collection', price: '$1,299', rating: 4.8, reviewsCount: 96, image: '/microfiber-1.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'b3', name: 'Carbon Shield 9H Ceramic', category: 'Ceramic Coating', price: '$6,500', comparePrice: '$7,500', rating: 4.9, reviewsCount: 142, image: '/spray-bottles.png', onSale: true, brand: 'The Liquid Plus' },
    { id: 'b4', name: 'Ceramic Tyre Dressing', category: 'Wheel & Tire Care', price: '$1,650', rating: 4.8, reviewsCount: 65, image: '/spray-bottles.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'b5', name: 'Ultra Gloss Quick Detailer', category: 'Exterior Care', price: '$1,150', rating: 4.8, reviewsCount: 72, image: '/spray-bottles.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'b6', name: 'Dual-Pile Microfiber Cloth', category: 'Microfiber Collection', price: '$899', rating: 4.6, reviewsCount: 54, image: '/microfiber-2.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'b7', name: 'Clay Bar Detailing Prep', category: 'Exterior Care', price: '$950', rating: 4.5, reviewsCount: 38, image: '/spray-bottles.png', onSale: false, brand: 'The Liquid Plus' },
    { id: 'b8', name: 'Satin Finish Leather Guard', category: 'Interior Care', price: '$1,499', rating: 4.7, reviewsCount: 88, image: '/spray-bottles.png', onSale: false, brand: 'The Liquid Plus' },
  ],
  'Trending': [],
  'New Arrivals': [],
  'Most Popular': []
};

// Fallback copies for other tabs
productsData['Trending'] = [...productsData['Featured']].reverse();
productsData['New Arrivals'] = [...productsData['Best Sellers']].reverse();
productsData['Most Popular'] = [...productsData['Featured']].sort(() => Math.random() - 0.5);

export function FeaturedCollection({ initialProductsData }: { initialProductsData?: Record<string, ProductItem[]> }) {
  const [activeTab, setActiveTab] = React.useState('Featured');

  const sourceData = initialProductsData || productsData;
  const products = sourceData[activeTab] || sourceData['Featured'] || [];

  return (
    <section id="featured-collection" className="py-14 bg-white text-[#0A0A0A] border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-[8px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
            Curated Catalog
          </span>
          <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-[#0A0A0A]">
            Featured Collection
          </h2>
          <div className="w-10 h-[1.5px] bg-[#FF4D00] mx-auto mt-1" />
        </div>

        {/* Tab Switcher Controls */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mb-8 border-b border-[#EAEAEA] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] tracking-[0.2em] font-black uppercase pb-2 transition-all cursor-pointer relative ${
                activeTab === tab
                  ? 'text-[#FF4D00]'
                  : 'text-[#666666] hover:text-[#0A0A0A]'
              }`}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF4D00]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid display (4 Products x 2 Rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group flex flex-col space-y-3 p-4 bg-white border border-[#EAEAEA] rounded-2xl hover:border-[#FF4D00]/30 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative text-left"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F8F8] rounded-xl border border-[#EAEAEA] hover-zoom">
                {product.onSale && (
                  <span className="absolute top-3 left-3 z-10 bg-[#FF4D00] text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm">
                    Sale
                  </span>
                )}
                
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                />

                {/* Overlaid Actions Trigger */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-white p-2.5 rounded-xl transition-all shadow-lg border border-[#EAEAEA] cursor-pointer" aria-label="Add to cart">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </button>
                  <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-white p-2.5 rounded-xl transition-all shadow-lg border border-[#EAEAEA] cursor-pointer" aria-label="Quick View">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-white p-2.5 rounded-xl transition-all shadow-lg border border-[#EAEAEA] cursor-pointer" aria-label="Compare">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-white p-2.5 rounded-xl transition-all shadow-lg border border-[#EAEAEA] cursor-pointer" aria-label="Add to wishlist">
                    <Heart className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[8px] tracking-[0.2em] text-[#FF4D00] uppercase font-black">
                  {product.brand}
                </span>
                <Link href={`/products/${product.slug || 'slug'}`}>
                  <h3 className="text-xs font-bold tracking-wide text-[#0A0A0A] group-hover:text-[#FF4D00] transition-colors cursor-pointer line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <span className="text-[9px] tracking-wider text-[#666666] block uppercase">
                  {product.category}
                </span>

                {/* Rating */}
                <div className="flex items-center space-x-1 text-[9px] text-[#666666]">
                  <div className="flex text-[#FF4D00]">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <span className="font-bold">{product.rating}</span>
                  <span className="opacity-70 font-light">({product.reviewsCount} Reviews)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-center space-x-2 pt-1 font-num">
                  <span className="text-xs font-black text-[#0A0A0A]">{product.price}</span>
                  {product.comparePrice && (
                    <span className="text-[10px] text-[#666666] line-through font-light">
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
export default FeaturedCollection;
