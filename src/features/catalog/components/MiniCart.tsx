'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import Image from 'next/image';
import Link from 'next/link';

export function MiniCart() {
  const { cart, isMiniCartOpen, setMiniCartOpen, updateQuantity, removeFromCart } = useCartStore();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMiniCartOpen(false);
      }
    };
    if (isMiniCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMiniCartOpen, setMiniCartOpen]);

  const subtotal = React.useMemo(() => {
    return cart.reduce((sum, item) => {
      const sizeMultiplier = item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
      return sum + item.product.price * sizeMultiplier * item.quantity;
    }, 0);
  }, [cart]);

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <>
          {/* Outside backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setMiniCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#0A0A0A] border-l border-white/10 shadow-2xl flex flex-col justify-between text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="h-5 w-5 text-[#FF4D00]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Shopping Bag ({cart.length})</span>
              </div>
              <button
                onClick={() => setMiniCartOpen(false)}
                className="text-[#B5B5B5] hover:text-[#FF4D00] p-1 transition-colors bg-transparent border-0 cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-4xl">🛒</span>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#E5E5E5]">Your bag is empty</h3>
                  <p className="text-[10px] text-[#B5B5B5] max-w-[200px] leading-relaxed font-light">
                    Add premium ceramic coatings and detailing formulas to start shopping.
                  </p>
                  <button
                    onClick={() => setMiniCartOpen(false)}
                    className="text-[10px] tracking-widest uppercase font-bold text-[#FF4D00] hover:text-[#FF4D00]/80 bg-transparent border-0 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const sizeMultiplier = item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
                  const itemPrice = item.product.price * sizeMultiplier;

                  return (
                    <div key={item.id} className="flex space-x-4 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      {/* Image Thumbnail */}
                      <div className="relative h-20 w-16 bg-[#111] rounded overflow-hidden flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>

                      {/* Detail Section */}
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-[#E5E5E5] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#B5B5B5] hover:text-red-500 p-0.5 bg-transparent border-0 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        
                        <div className="text-[9px] text-[#B5B5B5] uppercase tracking-wider flex space-x-2">
                          <span>{item.product.brand}</span>
                          <span>•</span>
                          <span className="text-[#FF4D00]">{item.selectedSize}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          {/* Quantity selector (+ / -) */}
                          <div className="flex items-center border border-white/10 bg-[#050505] rounded-sm">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-[#B5B5B5] hover:text-white bg-transparent border-0 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-[10px] font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-[#B5B5B5] hover:text-white bg-transparent border-0 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-xs font-semibold text-white">
                            {(itemPrice * item.quantity).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-[#0a0a0a] space-y-4">
                <div className="flex justify-between text-xs tracking-wider uppercase font-semibold">
                  <span className="text-white">Subtotal</span>
                  <span className="text-[#FF4D00]">
                    {subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </span>
                </div>
                
                <div className="text-[10px] text-[#B5B5B5] tracking-wide font-light leading-relaxed">
                  Shipping thresholds and customs calculated at checkout page step.
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={() => setMiniCartOpen(false)}
                    className="w-full py-3.5 bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white text-center text-[10px] tracking-widest font-bold uppercase transition-all rounded-xl cursor-pointer"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setMiniCartOpen(false)}
                    className="w-full py-3.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-center text-[10px] tracking-widest font-black uppercase transition-all rounded-xl hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,77,0,0.3)] cursor-pointer"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
export default MiniCart;
