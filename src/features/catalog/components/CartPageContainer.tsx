'use client';

import * as React from 'react';
import { useCartStore } from '../hooks/useCartStore';
import { Product } from '../constants/products';
import { Heart, Trash2, ArrowRight, ShieldCheck, Award, Truck, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartPageContainer() {
  const { cart, updateQuantity, removeFromCart, addToWishlist, coupon, applyCoupon, removeCoupon } =
    useCartStore();
  const [couponCode, setCouponCode] = React.useState('');
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = React.useState<string | null>(null);

  const subtotal = React.useMemo(() => {
    return cart.reduce((sum, item) => {
      const sizeMultiplier =
        item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
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

  const shipping = subtotal >= 10 || subtotal === 0 ? 0 : 5.0;
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
    <div className="min-h-screen bg-black py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] tracking-widest text-[#B5B5B5] uppercase">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-[#FF4D00]">Your Cart</span>
        </div>

        <h1 className="text-3xl font-light tracking-wider text-white uppercase">
          Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-white/5 bg-[#0a0a0a] py-20 text-center">
            <span className="text-4xl">🛒</span>
            <h3 className="text-sm font-semibold tracking-widest text-[#E5E5E5] uppercase">
              Your Cart is Empty
            </h3>
            <p className="max-w-xs text-xs leading-relaxed font-light text-[#B5B5B5]">
              Formulate your automotive shine with our nano-ceramic coatings and slick pre-wash foam
              shampoos.
            </p>
            <Link
              href="/shop"
              className="inline-block cursor-pointer rounded-xl bg-[#FF4D00] px-8 py-3.5 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:scale-105 hover:bg-[#E04400] hover:shadow-[0_0_15px_rgba(255,77,0,0.45)]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left Column: Cart Items List */}
            <div className="space-y-6 lg:col-span-8">
              <div className="space-y-6 rounded-xl border border-white/5 bg-[#0a0a0a] p-6">
                {cart.map((item) => {
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
                      className="flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-[#111]">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            unoptimized={item.product.image?.startsWith('data:')}
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="line-clamp-1 text-sm font-semibold text-[#E5E5E5]">
                            {item.product.name}
                          </h3>
                          <div className="flex space-x-2 text-[9px] tracking-wider text-[#B5B5B5] uppercase">
                            <span>{item.product.brand}</span>
                            <span>•</span>
                            <span className="text-[#FF4D00]">{item.selectedSize}</span>
                          </div>

                          <div className="flex items-center space-x-3 pt-1">
                            <button
                              onClick={() => handleMoveToWishlist(item.id, item.product)}
                              className="flex cursor-pointer items-center space-x-1 border-0 bg-transparent text-[9px] tracking-wider text-[#E5E5E5] uppercase hover:text-white"
                            >
                              <Heart className="h-3 w-3" />
                              <span>Move to Wishlist</span>
                            </button>
                            <span className="text-zinc-700">|</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="flex cursor-pointer items-center space-x-1 border-0 bg-transparent text-[9px] tracking-wider text-[#E5E5E5] uppercase hover:text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Selector & Price info */}
                      <div className="flex w-full items-center justify-between gap-8 sm:w-auto sm:justify-end">
                        {/* Quantity Selector */}
                        <div className="flex items-center rounded-sm border border-white/10 bg-black">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="cursor-pointer border-0 bg-transparent px-3 py-1.5 text-[#E5E5E5] hover:text-white"
                          >
                            -
                          </button>
                          <span className="min-w-[20px] px-3 text-center text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="cursor-pointer border-0 bg-transparent px-3 py-1.5 text-[#E5E5E5] hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-semibold text-white">
                            {(itemPrice * item.quantity).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0,
                            })}
                          </span>
                          <span className="block pt-0.5 text-[9px] text-[#B5B5B5] uppercase">
                            {itemPrice.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0,
                            })}{' '}
                            each
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon section */}
              <div className="space-y-4 rounded-xl border border-white/5 bg-[#0a0a0a] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">
                    Promotional Coupon
                  </h3>
                  {coupon && (
                    <button
                      onClick={removeCoupon}
                      className="cursor-pointer border-0 bg-transparent text-[9px] text-[#FF4D00] hover:underline"
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
                      className="flex-grow rounded border border-white/10 bg-black px-4 py-3 text-xs text-white placeholder-[#B5B5B5] outline-none focus:border-[#FF4D00] focus:ring-0"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer rounded border border-white bg-white px-6 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:border-[#FF4D00] hover:bg-[#0A0A0A] hover:text-white"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between rounded border border-[#FF4D00]/20 bg-[#FF4D00]/5 p-3 text-xs">
                    <span className="text-[#FF4D00]">
                      Coupon Applied: <strong>{coupon.code}</strong>
                    </span>
                    <span className="font-semibold text-[#FF4D00]">
                      {coupon.discountPercent}% Discount
                    </span>
                  </div>
                )}

                {couponError && (
                  <p className="text-[10px] font-medium text-red-500">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-[10px] font-medium text-green-500">{couponSuccess}</p>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary checkout card */}
            <div className="space-y-6 lg:col-span-4">
              <div className="space-y-4 rounded-xl border border-white/5 bg-[#0a0a0a] p-6">
                <h3 className="border-b border-white/5 pb-3 text-xs font-semibold tracking-[0.2em] text-white uppercase">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#B5B5B5]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      {subtotal.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-green-500">
                      <span>
                        Discount ({coupon.code} {coupon.discountPercent}%)
                      </span>
                      <span>
                        -
                        {discount.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#B5B5B5]">
                    <span>Shipping</span>
                    <span
                      className={
                        shipping === 0 ? 'font-bold text-green-500' : 'font-semibold text-white'
                      }
                    >
                      {shipping === 0
                        ? 'FREE SHIPPING'
                        : shipping.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 2,
                          })}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#B5B5B5]">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-white">
                      {estimatedTax.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-white/5 pt-3 text-sm font-bold tracking-wider uppercase">
                    <span className="text-white">Grand Total</span>
                    <span className="text-[#FF4D00]">
                      {grandTotal.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="flex w-full cursor-pointer items-center justify-center space-x-1.5 rounded-xl bg-[#FF4D00] py-4 text-[10px] font-black tracking-widest text-white uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#E04400] hover:shadow-[0_0_15px_rgba(255,77,0,0.3)]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Trust Tag Grid details */}
              <div className="grid grid-cols-2 gap-2 text-center text-[9px] font-semibold tracking-widest text-[#B5B5B5] uppercase">
                <div className="flex flex-col items-center space-y-1.5 rounded border border-white/5 bg-[#0a0a0a] p-3">
                  <ShieldCheck className="h-4 w-4 text-[#FF4D00]" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex flex-col items-center space-y-1.5 rounded border border-white/5 bg-[#0a0a0a] p-3">
                  <Award className="h-4 w-4 text-[#FF4D00]" />
                  <span>Genuine Products</span>
                </div>
                <div className="flex flex-col items-center space-y-1.5 rounded border border-white/5 bg-[#0a0a0a] p-3">
                  <Truck className="h-4 w-4 text-[#FF4D00]" />
                  <span>Express Shipping</span>
                </div>
                <div className="flex flex-col items-center space-y-1.5 rounded border border-white/5 bg-[#0a0a0a] p-3">
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
