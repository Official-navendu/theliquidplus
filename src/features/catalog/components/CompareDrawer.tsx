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
          className="fixed inset-x-0 bottom-0 z-[45] border-t border-white/10 bg-[#0a0a0a] text-white shadow-2xl"
        >
          <div className="mx-auto max-w-7xl space-y-4 px-6 py-5">
            {/* Header controls */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <RefreshCw className="animate-spin-slow h-4 w-4 text-[#FF4D00]" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  Compare Products ({compareList.length} of 4)
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={clearCompare}
                  className="text-[9px] tracking-wider text-zinc-500 uppercase hover:text-white"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-zinc-500 hover:text-white"
                  aria-label="Minimize Compare Panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Split cards compare grids */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {compareList.map((product) => (
                <div
                  key={product.id}
                  className="relative flex flex-col justify-between space-y-3 rounded-lg border border-white/5 bg-[#111111] p-3"
                >
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute top-2 right-2 z-10 p-1 text-zinc-500 hover:text-red-500"
                    aria-label="Remove from compare"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded bg-[#000]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized={product.image?.startsWith('data:')}
                      />
                    </div>
                    <div className="space-y-0.5 text-left">
                      <h4 className="line-clamp-1 text-[10px] font-bold text-zinc-200">
                        {product.name}
                      </h4>
                      <span className="text-[8px] font-semibold text-[#FF4D00] uppercase">
                        {product.brand}
                      </span>
                      <span className="block pt-0.5 text-[9px] font-black">
                        {product.price.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Short specs */}
                  <div className="space-y-1 rounded bg-black/30 p-2 text-[9px] text-zinc-500">
                    <div>
                      Finish:{' '}
                      <span className="font-semibold text-zinc-300">
                        {product.productType === 'coating' ? 'Glass Gloss' : 'Satin / Clean'}
                      </span>
                    </div>
                    <div>
                      Form:{' '}
                      <span className="font-semibold text-zinc-300 capitalize">
                        {product.productType}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, '500ml', 1)}
                    className="flex w-full items-center justify-center space-x-1.5 rounded bg-white py-2 text-[9px] font-black tracking-widest text-black uppercase transition-colors hover:bg-[#FF4D00] hover:text-black"
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
