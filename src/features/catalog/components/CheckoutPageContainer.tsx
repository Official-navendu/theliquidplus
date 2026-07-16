/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { useCartStore } from '../hooks/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '../constants/products';
import { createStorefrontOrderAction } from '../actions/storefront';

export function CheckoutPageContainer() {
  const { cart, coupon, clearCart } = useCartStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);

  const isDevMode = process.env.NODE_ENV !== 'production';

  const activeCart = React.useMemo(() => {
    if (cart.length > 0) return cart;
    if (isDevMode) {
      return [
        {
          id: 'dummy-1',
          product: PRODUCTS[0],
          quantity: 1,
          selectedSize: '500ml',
        },
        {
          id: 'dummy-2',
          product: PRODUCTS[1],
          quantity: 2,
          selectedSize: '1 Litre',
        },
        {
          id: 'dummy-3',
          product: PRODUCTS[2],
          quantity: 1,
          selectedSize: '500ml',
        },
      ];
    }
    return [];
  }, [cart, isDevMode]);

  // Form State
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    country: 'India',
    state: '',
    city: '',
    zip: '',
    address: '',
    apartment: '',
    addressLabel: 'Home',
    sameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    deliveryMethod: 'standard', // standard | express
    paymentMethod: 'credit_card', // credit_card | upi | cod
    acceptTerms: false,
    newsletter: false,
    orderNotes: '',
  });

  const subtotal = React.useMemo(() => {
    return activeCart.reduce((sum, item) => {
      const sizeMultiplier = item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
      return sum + item.product.price * sizeMultiplier * item.quantity;
    }, 0);
  }, [activeCart]);

  const discount = React.useMemo(() => {
    if (!coupon) return 0;
    return subtotal * (coupon.discountPercent / 100);
  }, [subtotal, coupon]);

  const deliveryCharge = formData.deliveryMethod === 'express' ? 15.00 : (subtotal >= 10 || subtotal === 0) ? 0 : 5.00;
  const estimatedTax = (subtotal - discount) * 0.18; // 18% standard GST
  const grandTotal = subtotal - discount + estimatedTax + deliveryCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.acceptTerms) {
      alert('You must accept the terms & conditions to proceed.');
      return;
    }
    setIsPlacingOrder(true);
    try {
      const orderItems = activeCart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      }));

      const res = await createStorefrontOrderAction({
        guestEmail: formData.email,
        guestPhone: formData.phone,
        subtotalAmount: subtotal,
        taxAmount: estimatedTax,
        shippingAmount: deliveryCharge,
        discountAmount: discount,
        couponCode: coupon?.code || undefined,
        items: orderItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zip,
        },
      });

      if (res.success && res.data) {
        setIsPlacingOrder(false);
        clearCart();
        router.push(`/order/success?total=${grandTotal}&invoice=${res.data.invoiceRef}`);
      } else {
        alert(res.error?.message || 'Failed to place order.');
        setIsPlacingOrder(false);
      }
    } catch (err: any) {
      alert(err.message || 'Error placing order.');
      setIsPlacingOrder(false);
    }
  };

  if (activeCart.length === 0) {
    return (
      <div className="bg-black min-h-screen py-20 flex flex-col items-center justify-center text-center px-6">
        <span className="text-5xl">🛒</span>
        <h2 className="text-lg font-bold tracking-[0.2em] uppercase text-[#E5E5E5] mt-4">Checkout Invalid</h2>
        <p className="text-xs text-[#B5B5B5] font-light max-w-xs mt-2 leading-relaxed">
          Your shopping cart is currently empty. Add premium products to proceed.
        </p>
        <Link
          href="/shop"
          className="mt-6 bg-[#FF4D00] text-white hover:bg-[#E04400] text-[10px] tracking-widest font-black uppercase px-8 py-3.5 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,77,0,0.45)] transition-all rounded-xl inline-block cursor-pointer"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Breadcrumb */}
        <div className="text-[10px] tracking-widest uppercase text-[#B5B5B5] flex items-center space-x-2">
          <Link href="/cart" className="hover:text-white transition-colors">Bag</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#FF4D00] font-medium">Checkout</span>
        </div>

        {/* Step Indicator Header */}
        <div className="grid grid-cols-4 gap-4 max-w-3xl border-b border-white/5 pb-6">
          {[
            { step: 1, label: 'Customer Info' },
            { step: 2, label: 'Shipping' },
            { step: 3, label: 'Payment' },
            { step: 4, label: 'Review' },
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => currentStep > item.step && setCurrentStep(item.step)}
              className={`flex flex-col space-y-1 text-left select-none cursor-pointer ${
                currentStep >= item.step ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider text-[#B5B5B5] font-bold">Step 0{item.step}</span>
              <span className={`text-[10px] uppercase tracking-widest font-black ${
                currentStep === item.step ? 'text-[#FF4D00]' : 'text-[#E5E5E5]'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Master Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Multi-Step checkout forms */}
          <div className="lg:col-span-8 space-y-8 animate-fade-in">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">01. Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Company Name (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                      placeholder="Detailing Studio Inc."
                    />
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white px-8 py-3.5 text-[10px] tracking-widest font-black uppercase transition-all rounded-xl cursor-pointer"
                  >
                    Continue to Shipping
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">02. Shipping & Delivery</h3>
                  
                  {/* Address inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">State / Region</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                        placeholder="Mumbai"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Postal / Zip Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                        placeholder="400001"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Address Label</label>
                      <select
                        name="addressLabel"
                        value={formData.addressLabel}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded cursor-pointer"
                      >
                        <option value="Home">Home Address</option>
                        <option value="Work">Office / Studio</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                      placeholder="12, Link Road, Andheri West"
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Apartment, Suite, Unit (Optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                      placeholder="Flat 402, Building A"
                    />
                  </div>

                  {/* Billing address toggle */}
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <label className="flex items-center space-x-3 text-xs text-[#B5B5B5] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="sameAsShipping"
                        checked={formData.sameAsShipping}
                        onChange={handleInputChange}
                        className="h-4 w-4 bg-[#0a0a0a] border-white/10 text-[#FF4D00] focus:ring-0"
                      />
                      <span>Billing address is same as shipping</span>
                    </label>

                    {!formData.sameAsShipping && (
                      <div className="bg-[#050505] p-5 border border-white/5 rounded-lg space-y-4">
                        <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">Billing Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="billingFirstName"
                            placeholder="First Name"
                            value={formData.billingFirstName}
                            onChange={handleInputChange}
                            className="bg-black border border-white/10 text-xs px-4 py-3 text-white rounded"
                          />
                          <input
                            type="text"
                            name="billingLastName"
                            placeholder="Last Name"
                            value={formData.billingLastName}
                            onChange={handleInputChange}
                            className="bg-black border border-white/10 text-xs px-4 py-3 text-white rounded"
                          />
                        </div>
                        <input
                          type="text"
                          name="billingAddress"
                          placeholder="Billing Street Address"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-white/10 text-xs px-4 py-3 text-white rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* Delivery Options */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">Select Delivery Method</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Standard */}
                      <label className={`border p-4 flex items-center justify-between cursor-pointer rounded ${
                        formData.deliveryMethod === 'standard' ? 'border-[#FF4D00] bg-[#FF4D00]/5' : 'border-white/10 hover:border-white/20'
                      }`}>
                        <div className="flex items-center space-x-3 text-left">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="standard"
                            checked={formData.deliveryMethod === 'standard'}
                            onChange={handleInputChange}
                            className="text-[#FF4D00]"
                          />
                          <div>
                            <span className="text-xs font-semibold block text-[#E5E5E5]">Standard Delivery</span>
                            <span className="text-[10px] text-[#B5B5B5]">Est. 4-6 business days</span>
                          </div>
                        </div>
                        <span className="text-xs text-[#B5B5B5]">Free</span>
                      </label>

                      {/* Express */}
                      <label className={`border p-4 flex items-center justify-between cursor-pointer rounded ${
                        formData.deliveryMethod === 'express' ? 'border-[#FF4D00] bg-[#FF4D00]/5' : 'border-white/10 hover:border-white/20'
                      }`}>
                        <div className="flex items-center space-x-3 text-left">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="express"
                            checked={formData.deliveryMethod === 'express'}
                            onChange={handleInputChange}
                            className="text-[#FF4D00]"
                          />
                          <div>
                            <span className="text-xs font-semibold block text-[#E5E5E5]">Express Shipping</span>
                            <span className="text-[10px] text-[#B5B5B5]">Est. 1-2 business days</span>
                          </div>
                        </div>
                        <span className="text-xs text-[#B5B5B5]">$350</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="border border-white/10 hover:border-[#FF4D00] px-6 py-3.5 text-[10px] tracking-widest font-black uppercase text-[#B5B5B5] hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white px-8 py-3.5 text-[10px] tracking-widest font-black uppercase transition-all rounded-xl cursor-pointer"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">03. Select Payment Method</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'credit_card', label: 'Credit Card', desc: 'Secure payment via SSL gateway' },
                      { id: 'upi', label: 'UPI payment', desc: 'Instant transfer via BHIM, GPay' },
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay on dispatch delivery' },
                    ].map((payment) => (
                      <label
                        key={payment.id}
                        className={`border p-5 flex flex-col justify-between text-left rounded cursor-pointer transition-all ${
                          formData.paymentMethod === payment.id ? 'border-[#FF4D00] bg-[#FF4D00]/5' : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-[#E5E5E5]">{payment.label}</span>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={payment.id}
                            checked={formData.paymentMethod === payment.id}
                            onChange={handleInputChange}
                            className="text-[#FF4D00]"
                          />
                        </div>
                        <p className="text-[10px] text-[#B5B5B5] mt-4 leading-relaxed font-light">{payment.desc}</p>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === 'credit_card' && (
                    <div className="bg-[#050505] p-5 border border-white/5 rounded-lg space-y-4">
                      <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">Card Credentials</h4>
                      <div className="space-y-2 text-xs">
                        <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full bg-black border border-white/10 text-xs px-4 py-3 text-white rounded"
                        />
                      </div>
                      <div className="space-y-2 text-xs">
                        <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Card Number</label>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-black border border-white/10 text-xs px-4 py-3 text-white rounded"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="bg-black border border-white/10 text-xs px-4 py-3 text-white w-full rounded"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">CVV</label>
                          <input
                            type="password"
                            placeholder="***"
                            className="bg-black border border-white/10 text-xs px-4 py-3 text-white w-full rounded"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <div className="bg-[#050505] p-5 border border-white/5 rounded-lg space-y-4">
                      <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">UPI Address</h4>
                      <div className="space-y-2 text-xs">
                        <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">UPI VPA</label>
                        <input
                          type="text"
                          placeholder="john@okaxis"
                          className="w-full bg-black border border-white/10 text-xs px-4 py-3 text-white rounded"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="border border-white/10 hover:border-[#FF4D00] px-6 py-3.5 text-[10px] tracking-widest font-black uppercase text-[#B5B5B5] hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white px-8 py-3.5 text-[10px] tracking-widest font-black uppercase transition-all rounded-xl cursor-pointer"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">04. Final Review & Confirmation</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#050505] p-6 border border-white/5 rounded-lg text-xs space-y-4 sm:space-y-0">
                    <div className="space-y-2 text-left">
                      <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#FF4D00]">Shipping To</h4>
                      <p className="text-[#E5E5E5] font-semibold">{formData.firstName} {formData.lastName}</p>
                      <p className="text-[#B5B5B5]">{formData.address}, {formData.apartment && `${formData.apartment}, `}{formData.city}, {formData.state} - {formData.zip}</p>
                      <p className="text-[#B5B5B5]">Phone: {formData.phone}</p>
                    </div>

                    <div className="space-y-2 text-left">
                      <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#FF4D00]">Payment Overview</h4>
                      <p className="text-[#E5E5E5] font-semibold uppercase">{formData.paymentMethod.replace('_', ' ')}</p>
                      <p className="text-[#B5B5B5]">Delivery Speed: <span className="capitalize">{formData.deliveryMethod}</span></p>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] tracking-wider uppercase text-[#B5B5B5]">Order Notes (Optional)</label>
                    <textarea
                      name="orderNotes"
                      rows={3}
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors resize-none rounded"
                      placeholder="Special instructions for delivery, gates, etc."
                    />
                  </div>

                  {/* Terms and conditions */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-start space-x-3 text-xs text-[#B5B5B5] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 bg-[#0a0a0a] border-white/10 text-[#FF4D00] focus:ring-0 mt-0.5"
                      />
                      <span>I agree to the Terms of Service, Privacy Policy, and return guidelines of The Liquid Plus.</span>
                    </label>

                    <label className="flex items-start space-x-3 text-xs text-[#B5B5B5] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                        className="h-4 w-4 bg-[#0a0a0a] border-white/10 text-[#FF4D00] focus:ring-0 mt-0.5"
                      />
                      <span>Subscribe to our exclusive detailing updates and promo code releases.</span>
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="border border-white/10 hover:border-[#FF4D00] px-6 py-3.5 text-[10px] tracking-widest font-black uppercase text-[#B5B5B5] hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      disabled={isPlacingOrder}
                      onClick={handlePlaceOrder}
                      className="bg-[#FF4D00] hover:bg-[#E04400] text-white px-10 py-4 text-[10px] tracking-widest font-black uppercase transition-all flex items-center space-x-2 disabled:opacity-60 rounded-xl hover:scale-105 hover:shadow-[0_0_15px_rgba(255,77,0,0.4)] cursor-pointer"
                    >
                      {isPlacingOrder ? (
                        <>
                          <span className="animate-spin text-sm">⏳</span>
                          <span>Securing Order...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          <span>Place Secure Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Sticky Checkout Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 border border-white/5 bg-[#0a0a0a] p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase border-b border-white/5 pb-3 text-white">Your Selection</h3>
            
            {/* Cart Items list */}
            <div className="max-h-[220px] overflow-y-auto pr-2 space-y-4">
              {activeCart.map((item) => {
                const sizeMultiplier = item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
                const itemPrice = item.product.price * sizeMultiplier;

                return (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative h-12 w-10 bg-[#111] rounded overflow-hidden flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow text-left space-y-0.5">
                      <h4 className="text-[10px] font-bold text-[#E5E5E5] line-clamp-1">{item.product.name}</h4>
                      <div className="text-[8px] text-[#B5B5B5] uppercase tracking-widest flex space-x-1.5">
                        <span>Size: {item.selectedSize}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-white">
                      {(itemPrice * item.quantity).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sum info */}
            <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
              <div className="flex justify-between text-[#B5B5B5]">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-500">
                  <span>Discount ({coupon.code})</span>
                  <span>-{discount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
                </div>
              )}
              <div className="flex justify-between text-[#B5B5B5]">
                <span>GST (18%)</span>
                <span>{estimatedTax.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[#B5B5B5]">
                <span>Shipping</span>
                <span className={deliveryCharge === 0 ? "text-green-500 font-bold" : ""}>
                  {deliveryCharge === 0 ? 'FREE SHIPPING' : deliveryCharge.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between text-sm uppercase tracking-wider font-bold">
                <span>Total Amount</span>
                <span className="text-[#FF4D00]">{grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Micro badges trust */}
            <div className="border-t border-white/5 pt-4 space-y-2 text-[9px] uppercase tracking-widest text-[#B5B5B5] font-bold">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#FF4D00]" />
                <span>SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-3.5 w-3.5 text-[#FF4D00]" />
                <span>Free Insured Cargo Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CheckoutPageContainer;
