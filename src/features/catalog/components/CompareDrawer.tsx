'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import Image from 'next/image';

export function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useCartStore();
  const [isOpen, setIsOpen] = React.useState(true);

  if (compareList.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="fixed bottom-0 inset-x-0 z-[45] bg-[#0a0a0a] border-t border-white/10 shadow-2xl text-white"
        >
          <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
            
            {/* Header controls */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-[#FF4D00] animate-spin-slow" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold">
                  Compare Products ({compareList.length} of 4)
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={clearCompare}
                  className="text-[9px] tracking-wider uppercase text-zinc-500 hover:text-white"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white p-1"
                  aria-label="Minimize Compare Panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Split cards compare grids */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {compareList.map((product) => (
                <div
                  key={product.id}
                  className="relative p-3 bg-[#111111] border border-white/5 rounded-lg flex flex-col justify-between space-y-3"
                >
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute top-2 right-2 z-10 text-zinc-500 hover:text-red-500 p-1"
                    aria-label="Remove from compare"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-10 bg-[#000] rounded overflow-hidden flex-shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <h4 className="text-[10px] font-bold text-zinc-200 line-clamp-1">{product.name}</h4>
                      <span className="text-[8px] text-[#FF4D00] uppercase font-semibold">{product.brand}</span>
                      <span className="text-[9px] font-black block pt-0.5">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  {/* Short specs */}
                  <div className="text-[9px] text-zinc-500 space-y-1 bg-black/30 p-2 rounded">
                    <div>Finish: <span className="text-zinc-300 font-semibold">{product.productType === 'coating' ? 'Glass Gloss' : 'Satin / Clean'}</span></div>
                    <div>Form: <span className="text-zinc-300 font-semibold capitalize">{product.productType}</span></div>
                  </div>

                  <button
                    onClick={() => addToCart(product, '500ml', 1)}
                    className="w-full py-2 bg-white text-black hover:bg-[#FF4D00] hover:text-black text-[9px] tracking-widest font-black uppercase rounded transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default CompareDrawer;
