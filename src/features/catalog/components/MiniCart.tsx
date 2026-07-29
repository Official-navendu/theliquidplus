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
      const sizeMultiplier =
        item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
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
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setMiniCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col justify-between border-l border-zinc-200/80 bg-white text-zinc-800 shadow-2xl sm:w-[420px]"
          >
            {/* Header */}
            <div className="border-zinc-150 flex items-center justify-between border-b bg-white p-6">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="h-5 w-5 text-[#FF4D00]" />
                <span className="text-xs font-black tracking-[0.2em] text-zinc-900 uppercase">
                  Shopping Bag ({cart.length})
                </span>
              </div>
              <button
                onClick={() => setMiniCartOpen(false)}
                className="cursor-pointer border-0 bg-transparent p-1 text-zinc-400 transition-colors hover:text-zinc-700"
                aria-label="Close cart drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-grow space-y-6 overflow-y-auto bg-zinc-50/50 p-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <span className="text-4xl">🛒</span>
                  <h3 className="text-xs font-black tracking-widest text-zinc-700 uppercase">
                    Your bag is empty
                  </h3>
                  <p className="text-zinc-450 max-w-[200px] text-[10px] leading-relaxed font-light">
                    Add premium ceramic coatings and detailing formulas to start shopping.
                  </p>
                  <button
                    onClick={() => setMiniCartOpen(false)}
                    className="cursor-pointer border-0 bg-transparent text-[10px] font-black tracking-widest text-[#FF4D00] uppercase hover:text-[#E04400]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const sizeMultiplier =
                    item.selectedSize === '1 Litre'
                      ? 1.8
                      : item.selectedSize === '5 Litres'
                        ? 6.5
                        : 1.0;
                  const itemPrice = item.product.price * sizeMultiplier;

                  return (
                    <div
                      key={item.id}
                      className="border-zinc-150 flex space-x-4 border-b pb-6 last:border-0 last:pb-0"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded border border-zinc-200/80 bg-zinc-50">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized={item.product.image?.startsWith('data:')}
                        />
                      </div>

                      {/* Detail Section */}
                      <div className="flex-grow space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="line-clamp-1 text-left text-xs font-bold text-zinc-800">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="cursor-pointer border-0 bg-transparent p-0.5 text-zinc-400 transition-colors hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex space-x-2 text-left text-[9px] tracking-wider text-zinc-500 uppercase">
                          <span>{item.product.brand}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#FF4D00]">{item.selectedSize}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Quantity selector (+ / -) */}
                          <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 px-1.5 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="cursor-pointer border-0 bg-transparent px-1 font-bold text-zinc-400 hover:text-zinc-700"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-4 px-2 text-center text-[10px] font-black text-zinc-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="cursor-pointer border-0 bg-transparent px-1 font-bold text-zinc-400 hover:text-zinc-700"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-zinc-850 text-xs font-black">
                            {(itemPrice * item.quantity).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0,
                            })}
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
              <div className="border-zinc-150 space-y-4 border-t bg-white p-6">
                <div className="flex justify-between text-xs font-black tracking-wider uppercase">
                  <span className="text-zinc-700">Subtotal</span>
                  <span className="text-sm text-[#FF4D00]">
                    {subtotal.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>

                <div className="text-zinc-450 text-left text-[9px] leading-relaxed font-light tracking-wide uppercase">
                  Shipping thresholds and sales tax calculated at checkout page step.
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setMiniCartOpen(false)}
                    className="border-zinc-250 w-full cursor-pointer rounded-xl border py-3.5 text-center text-[10px] font-black tracking-widest text-zinc-700 uppercase transition-all hover:border-zinc-400"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setMiniCartOpen(false)}
                    className="w-full cursor-pointer rounded-xl bg-[#FF4D00] py-3.5 text-center text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-[#E04400] hover:shadow-md"
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
