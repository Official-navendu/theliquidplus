'use client';

import * as React from 'react';
import { useCartStore } from '../hooks/useCartStore';
import { Product } from '../constants/products';
import { Heart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Award, Truck, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartPageContainer() {
  const { cart, updateQuantity, removeFromCart, addToWishlist, coupon, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = React.useState('');
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = React.useState<string | null>(null);

  const subtotal = React.useMemo(() => {
    return cart.reduce((sum, item) => {
      const sizeMultiplier = item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
      return sum + item.product.price * sizeMultiplier * item.quantity;
    }, 0);
  }, [cart]);

  const discount = React.useMemo(() => {
    if (!coupon) return 0;
    return subtotal * (coupon.discountPercent / 100);
  }, [subtotal, coupon]);

  const estimatedTax = React.useMemo(() => {
    return (subtotal - discount) * 0.18; // 18% standard GST
  }, [subtotal, discount]);

  const shipping = (subtotal >= 10 || subtotal === 0) ? 0 : 5.00;
  const grandTotal = subtotal - discount + estimatedTax + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const success = applyCoupon(couponCode);
    if (success) {
      setCouponSuccess(`Coupon code applied successfully!`);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try "DETAIL20".');
    }
  };

  const handleMoveToWishlist = (itemId: string, product: Product) => {
    addToWishlist(product);
    removeFromCart(itemId);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] tracking-widest uppercase text-[#B5B5B5] flex items-center space-x-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#FF4D00] font-medium">Your Cart</span>
        </div>

        <h1 className="text-3xl font-light uppercase tracking-wider text-white">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="py-20 border border-white/5 bg-[#0a0a0a] rounded-xl text-center flex flex-col items-center justify-center space-y-4">
            <span className="text-4xl">🛒</span>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-[#E5E5E5]">Your Cart is Empty</h3>
            <p className="text-xs text-[#B5B5B5] max-w-xs font-light leading-relaxed">
              Formulate your automotive shine with our nano-ceramic coatings and slick pre-wash foam shampoos.
            </p>
            <Link
              href="/shop"
              className="bg-[#FF4D00] text-white hover:bg-[#E04400] text-[10px] tracking-widest uppercase font-bold px-8 py-3.5 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,77,0,0.45)] transition-all rounded-xl inline-block cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border border-white/5 bg-[#0a0a0a] p-6 rounded-xl space-y-6">
                {cart.map((item) => {
                  const sizeMultiplier = item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
                  const itemPrice = item.product.price * sizeMultiplier;

                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-6 last:border-0 last:pb-0 gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-20 w-16 bg-[#111] rounded overflow-hidden flex-shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-[#E5E5E5] line-clamp-1">{item.product.name}</h3>
                          <div className="text-[9px] text-[#B5B5B5] uppercase tracking-wider flex space-x-2">
                            <span>{item.product.brand}</span>
                            <span>•</span>
                            <span className="text-[#FF4D00]">{item.selectedSize}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 pt-1">
                            <button
                              onClick={() => handleMoveToWishlist(item.id, item.product)}
                              className="text-[9px] tracking-wider uppercase text-[#E5E5E5] hover:text-white flex items-center space-x-1 bg-transparent border-0 cursor-pointer"
                            >
                              <Heart className="h-3 w-3" />
                              <span>Move to Wishlist</span>
                            </button>
                            <span className="text-zinc-700">|</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[9px] tracking-wider uppercase text-[#E5E5E5] hover:text-red-500 flex items-center space-x-1 bg-transparent border-0 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Selector & Price info */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-white/10 bg-black rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-[#E5E5E5] hover:text-white bg-transparent border-0 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-semibold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-[#E5E5E5] hover:text-white bg-transparent border-0 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-semibold text-white">
                            {(itemPrice * item.quantity).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[9px] text-[#B5B5B5] block uppercase pt-0.5">
                            {itemPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} each
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon section */}
              <div className="border border-white/5 bg-[#0a0a0a] p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white">Promotional Coupon</h3>
                  {coupon && (
                    <button
                      onClick={removeCoupon}
                      className="text-[9px] text-[#FF4D00] hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      Remove ({coupon.code})
                    </button>
                  )}
                </div>

                {!coupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code (e.g. DETAIL20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-black border border-white/10 text-white placeholder-[#B5B5B5] px-4 py-3 text-xs focus:ring-0 focus:border-[#FF4D00] rounded flex-grow outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white px-6 text-[10px] tracking-widest font-bold uppercase rounded transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="bg-[#FF4D00]/5 border border-[#FF4D00]/20 p-3 rounded flex justify-between items-center text-xs">
                    <span className="text-[#FF4D00]">Coupon Applied: <strong>{coupon.code}</strong></span>
                    <span className="font-semibold text-[#FF4D00]">{coupon.discountPercent}% Discount</span>
                  </div>
                )}

                {couponError && <p className="text-[10px] text-red-500 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-green-500 font-medium">{couponSuccess}</p>}
              </div>
            </div>

            {/* Right Column: Order Summary checkout card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border border-white/5 bg-[#0a0a0a] p-6 rounded-xl space-y-4">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase border-b border-white/5 pb-3 text-white">Order Summary</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#B5B5B5]">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">
                      {subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount ({coupon.code} {coupon.discountPercent}%)</span>
                      <span>
                        -{discount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}

                   <div className="flex justify-between text-[#B5B5B5]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-500 font-bold" : "text-white font-semibold"}>
                      {shipping === 0 ? 'FREE SHIPPING' : shipping.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#B5B5B5]">
                    <span>GST (18%)</span>
                    <span className="text-white font-semibold">
                      {estimatedTax.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="border-t border-white/5 pt-3 flex justify-between text-sm uppercase tracking-wider font-bold">
                    <span className="text-white">Grand Total</span>
                    <span className="text-[#FF4D00]">
                      {grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] tracking-widest font-black uppercase py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,77,0,0.3)] cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Trust Tag Grid details */}
              <div className="grid grid-cols-2 gap-2 text-[#B5B5B5] text-[9px] uppercase tracking-widest font-semibold text-center">
                <div className="p-3 border border-white/5 bg-[#0a0a0a] rounded flex flex-col items-center space-y-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#FF4D00]" />
                  <span>Secure Checkout</span>
                </div>
                <div className="p-3 border border-white/5 bg-[#0a0a0a] rounded flex flex-col items-center space-y-1.5">
                  <Award className="h-4 w-4 text-[#FF4D00]" />
                  <span>Genuine Products</span>
                </div>
                <div className="p-3 border border-white/5 bg-[#0a0a0a] rounded flex flex-col items-center space-y-1.5">
                  <Truck className="h-4 w-4 text-[#FF4D00]" />
                  <span>Express Shipping</span>
                </div>
                <div className="p-3 border border-white/5 bg-[#0a0a0a] rounded flex flex-col items-center space-y-1.5">
                  <RotateCcw className="h-4 w-4 text-[#FF4D00]" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
export default CartPageContainer;
