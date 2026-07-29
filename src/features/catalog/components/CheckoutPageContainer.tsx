'use client';

import * as React from 'react';
import { useCartStore } from '../hooks/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Truck,
  ChevronRight,
  Lock,
  RotateCcw,
  Award,
  CreditCard,
  Minus,
  Plus,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '../constants/products';
import { createStorefrontOrderAction, getTaxRateAction } from '../actions/storefront';

export function CheckoutPageContainer() {
  const { cart, coupon, clearCart, updateQuantity, removeFromCart, applyCoupon, removeCoupon } =
    useCartStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);

  // Coupon Section State
  const [couponCodeInput, setCouponCodeInput] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccess, setCouponSuccess] = React.useState('');
  const [couponLoading, setCouponLoading] = React.useState(false);

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
    country: 'United States',
    state: '',
    city: '',
    zip: '',
    address: '',
    apartment: '',
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

  // Calculate pricing
  const subtotal = React.useMemo(() => {
    return activeCart.reduce((sum, item) => {
      const sizeMultiplier =
        item.selectedSize === '1 Litre' ? 1.8 : item.selectedSize === '5 Litres' ? 6.5 : 1.0;
      return sum + item.product.price * sizeMultiplier * item.quantity;
    }, 0);
  }, [activeCart]);

  const discount = React.useMemo(() => {
    if (!coupon) return 0;
    return subtotal * (coupon.discountPercent / 100);
  }, [subtotal, coupon]);

  // Shipping logic: if subtotal >= $50, FREE shipping. Otherwise, $10 standard.
  const deliveryCharge = React.useMemo(() => {
    if (subtotal === 0) return 0;
    if (formData.deliveryMethod === 'express') {
      return 15.0;
    }
    return subtotal >= 50 ? 0 : 10.0;
  }, [subtotal, formData.deliveryMethod]);

  // Location-based tax calculation (Sales Tax triggers after country, state, zip are filled out)
  const [taxRate, setTaxRate] = React.useState<number | null>(null);
  const hasShippingDetails = !!(
    formData.country.trim() &&
    formData.state.trim() &&
    formData.zip.trim()
  );

  React.useEffect(() => {
    let active = true;
    async function fetchTax() {
      if (!hasShippingDetails) {
        if (active) setTaxRate(null);
        return;
      }
      const rate = await getTaxRateAction(formData.country, formData.state);
      if (active) {
        setTaxRate(rate);
      }
    }
    fetchTax();
    return () => {
      active = false;
    };
  }, [formData.country, formData.state, formData.zip, hasShippingDetails]);

  const estimatedTax = React.useMemo(() => {
    if (taxRate === null) return 0;
    return (subtotal - discount) * (taxRate / 100);
  }, [subtotal, discount, taxRate]);

  const grandTotal = React.useMemo(() => {
    return subtotal - discount + estimatedTax + deliveryCharge;
  }, [subtotal, discount, estimatedTax, deliveryCharge]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleApplyCoupon = () => {
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');
    setTimeout(() => {
      const success = applyCoupon(couponCodeInput);
      setCouponLoading(false);
      if (success) {
        setCouponSuccess(`Coupon "${couponCodeInput.toUpperCase()}" applied successfully!`);
        setCouponCodeInput('');
      } else {
        setCouponError('Invalid coupon. Try DETAIL20 or CERAMIC10.');
      }
    }, 500);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
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
    } catch (err: SafeAny) {
      alert(err.message || 'Error placing order.');
      setIsPlacingOrder(false);
    }
  };

  if (activeCart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-20 text-center">
        <span className="text-5xl">🛒</span>
        <h2 className="text-zinc-850 mt-4 text-lg font-bold tracking-[0.2em] uppercase">
          Checkout Invalid
        </h2>
        <p className="mt-2 max-w-xs text-xs leading-relaxed font-light text-zinc-500">
          Your shopping cart is currently empty. Add premium products to proceed.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block cursor-pointer rounded-xl bg-[#FF4D00] px-8 py-3.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:scale-105 hover:bg-[#E04400] hover:shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Validate step navigation
  const validateStep = (step: number) => {
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert('Please complete the contact information details before proceeding.');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.address || !formData.city || !formData.state || !formData.zip) {
        alert('Please enter your shipping address details to continue.');
        return false;
      }
    }
    return true;
  };

  const handleStepChange = (targetStep: number) => {
    if (targetStep > currentStep) {
      // Validate all intermediate steps
      for (let s = currentStep + 1; s <= targetStep; s++) {
        if (!validateStep(s)) return;
      }
    }
    setCurrentStep(targetStep);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 text-left text-zinc-800">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[10px] tracking-widest text-zinc-400 uppercase">
          <Link href="/cart" className="transition-colors hover:text-zinc-800">
            Bag
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-[#FF4D00]">Checkout</span>
        </div>

        {/* Step Indicator Header (Progress bar) */}
        <div className="grid max-w-3xl grid-cols-4 gap-4 border-b border-zinc-200 pb-6">
          {[
            { step: 1, label: 'Customer Info' },
            { step: 2, label: 'Shipping' },
            { step: 3, label: 'Payment' },
            { step: 4, label: 'Review' },
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => handleStepChange(item.step)}
              className={`flex cursor-pointer flex-col space-y-1 text-left select-none ${
                currentStep >= item.step ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span className="text-zinc-450 text-[9px] font-bold tracking-wider uppercase">
                Step 0{item.step}
              </span>
              <span
                className={`text-[10px] font-black tracking-widest uppercase ${
                  currentStep === item.step ? 'text-[#FF4D00]' : 'text-zinc-850'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Collapsible Order Summary Trigger for Mobile */}
        <div
          onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 select-none lg:hidden"
        >
          <span className="flex items-center space-x-2 text-xs font-bold text-zinc-700">
            <span>🛒</span>
            <span>
              {isSummaryOpen ? 'Hide' : 'Show'} Order Summary (
              {activeCart.reduce((acc, c) => acc + c.quantity, 0)} items)
            </span>
          </span>
          <span className="flex items-center space-x-1 text-xs font-black text-[#FF4D00]">
            <span>
              {grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>
            <span>{isSummaryOpen ? '▲' : '▼'}</span>
          </span>
        </div>

        {/* Master Content Split Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Interactive Multi-Step checkout forms */}
          <div className="space-y-8 lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 rounded-[24px] border border-zinc-200/80 bg-white p-6 text-left shadow-sm sm:p-8"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF4D00]/10 text-xs font-bold text-[#FF4D00]">
                      1
                    </span>
                    <h3 className="text-xs font-black tracking-wider text-zinc-800 uppercase">
                      Customer Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                      placeholder="Detailing Studio Inc."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleStepChange(2)}
                      className="cursor-pointer rounded-xl border border-transparent bg-zinc-950 px-8 py-3.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-zinc-900"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 rounded-[24px] border border-zinc-200/80 bg-white p-6 text-left shadow-sm sm:p-8"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF4D00]/10 text-xs font-bold text-[#FF4D00]">
                      2
                    </span>
                    <h3 className="text-xs font-black tracking-wider text-zinc-800 uppercase">
                      Shipping & Delivery
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-800 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                      >
                        <option value="United States">United States</option>
                        <option value="India">India</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="Canada">Canada</option>
                        <option value="France">France</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        State / Region
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="California"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="Los Angeles"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        Postal / Zip Code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="90001"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="123 detailing lane"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                        Apartment, Suite (Optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-xs text-zinc-800 placeholder-zinc-400 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                        placeholder="Apt 4B"
                      />
                    </div>
                  </div>

                  {/* Billing address toggle */}
                  <div className="space-y-4 border-t border-zinc-100 pt-4">
                    <label className="flex cursor-pointer items-center space-x-3 text-xs text-zinc-500 select-none">
                      <input
                        type="checkbox"
                        name="sameAsShipping"
                        checked={formData.sameAsShipping}
                        onChange={handleInputChange}
                        className="h-4 w-4 cursor-pointer rounded border-zinc-200 bg-zinc-50 text-[#FF4D00] focus:ring-0"
                      />
                      <span>Billing address is same as shipping</span>
                    </label>

                    {!formData.sameAsShipping && (
                      <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                        <h4 className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                          Billing Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="billingFirstName"
                            placeholder="First Name"
                            value={formData.billingFirstName}
                            onChange={handleInputChange}
                            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-800 outline-none"
                          />
                          <input
                            type="text"
                            name="billingLastName"
                            placeholder="Last Name"
                            value={formData.billingLastName}
                            onChange={handleInputChange}
                            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-800 outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          name="billingAddress"
                          placeholder="Billing Street Address"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-800 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Delivery Options */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                      Select Delivery Method
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Standard */}
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                          formData.deliveryMethod === 'standard'
                            ? 'border-[#FF4D00] bg-[#FF4D00]/5'
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 text-left">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="standard"
                            checked={formData.deliveryMethod === 'standard'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#FF4D00]"
                          />
                          <div>
                            <span className="block text-xs font-semibold text-zinc-800">
                              Standard Delivery
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              Est. 4-6 business days
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-zinc-700">
                          {subtotal >= 50 ? 'FREE' : '$10.00'}
                        </span>
                      </label>

                      {/* Express */}
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                          formData.deliveryMethod === 'express'
                            ? 'border-[#FF4D00] bg-[#FF4D00]/5'
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 text-left">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="express"
                            checked={formData.deliveryMethod === 'express'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#FF4D00]"
                          />
                          <div>
                            <span className="block text-xs font-semibold text-zinc-800">
                              Express Shipping
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              Est. 1-2 business days
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-zinc-700">$15.00</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => handleStepChange(1)}
                      className="text-zinc-650 cursor-pointer rounded-xl border border-zinc-200 px-6 py-3.5 text-[10px] font-black tracking-widest uppercase transition-colors hover:border-zinc-400"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepChange(3)}
                      className="cursor-pointer rounded-xl bg-zinc-950 px-8 py-3.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-zinc-900"
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
                  className="space-y-6 rounded-[24px] border border-zinc-200/80 bg-white p-6 text-left shadow-sm sm:p-8"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF4D00]/10 text-xs font-bold text-[#FF4D00]">
                      3
                    </span>
                    <h3 className="text-xs font-black tracking-wider text-zinc-800 uppercase">
                      Select Payment Method
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      {
                        id: 'credit_card',
                        label: 'Credit Card',
                        desc: 'Secure payment via Stripe/SSL',
                      },
                      {
                        id: 'upi',
                        label: 'UPI Option',
                        desc: 'Instant VPA transfer (GPay, PhonePe)',
                      },
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay with cash upon arrival' },
                    ].map((payment) => (
                      <label
                        key={payment.id}
                        className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                          formData.paymentMethod === payment.id
                            ? 'border-[#FF4D00] bg-[#FF4D00]/5'
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex w-full items-start justify-between">
                          <span className="text-xs font-bold text-zinc-800">{payment.label}</span>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={payment.id}
                            checked={formData.paymentMethod === payment.id}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#FF4D00]"
                          />
                        </div>
                        <p className="mt-3 text-[9px] leading-relaxed font-light text-zinc-500">
                          {payment.desc}
                        </p>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === 'credit_card' && (
                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                      <h4 className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                        Card Credentials
                      </h4>
                      <div className="space-y-2 text-xs">
                        <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-800 outline-none focus:border-[#FF4D00]"
                        />
                      </div>
                      <div className="space-y-2 text-xs">
                        <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-800 outline-none focus:border-[#FF4D00]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-800 outline-none focus:border-[#FF4D00]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="***"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-800 outline-none focus:border-[#FF4D00]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                      <h4 className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                        UPI Address
                      </h4>
                      <div className="space-y-2 text-xs">
                        <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                          UPI VPA
                        </label>
                        <input
                          type="text"
                          placeholder="john@okaxis"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-800 outline-none focus:border-[#FF4D00]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => handleStepChange(2)}
                      className="text-zinc-650 cursor-pointer rounded-xl border border-zinc-200 px-6 py-3.5 text-[10px] font-black tracking-widest uppercase transition-colors hover:border-zinc-400"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepChange(4)}
                      className="cursor-pointer rounded-xl bg-zinc-950 px-8 py-3.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-zinc-900"
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
                  className="space-y-6 rounded-[24px] border border-zinc-200/80 bg-white p-6 text-left shadow-sm sm:p-8"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF4D00]/10 text-xs font-bold text-[#FF4D00]">
                      4
                    </span>
                    <h3 className="text-xs font-black tracking-wider text-zinc-800 uppercase">
                      Final Review & Confirmation
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-xs sm:grid-cols-2 sm:space-y-0">
                    <div className="space-y-2 text-left">
                      <h4 className="text-[9px] font-bold tracking-widest text-[#FF4D00] uppercase">
                        Shipping To
                      </h4>
                      <p className="text-zinc-850 font-bold">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="leading-relaxed text-zinc-500">
                        {formData.address}, {formData.apartment && `${formData.apartment}, `}
                        {formData.city}, {formData.state} - {formData.zip}
                      </p>
                      <p className="font-medium text-zinc-500">Phone: {formData.phone}</p>
                    </div>

                    <div className="space-y-2 text-left">
                      <h4 className="text-[9px] font-bold tracking-widest text-[#FF4D00] uppercase">
                        Payment Overview
                      </h4>
                      <p className="text-zinc-850 font-bold uppercase">
                        {formData.paymentMethod.replace('_', ' ')}
                      </p>
                      <p className="font-medium text-zinc-500">
                        Delivery Speed:{' '}
                        <span className="capitalize">{formData.deliveryMethod}</span>
                      </p>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="space-y-2 text-xs">
                    <label className="block text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="orderNotes"
                      rows={2}
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-800 transition-colors outline-none focus:border-[#FF4D00] focus:bg-white"
                      placeholder="Special instructions for delivery, gates, etc."
                    />
                  </div>

                  {/* Terms and conditions */}
                  <div className="space-y-3 pt-2">
                    <label className="flex cursor-pointer items-start space-x-3 text-xs text-zinc-500 select-none">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-zinc-200 bg-zinc-50 text-[#FF4D00] focus:ring-0"
                      />
                      <span>
                        I agree to the Terms of Service, Privacy Policy, and return guidelines of
                        The Liquid Plus.
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start space-x-3 text-xs text-zinc-500 select-none">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-zinc-200 bg-zinc-50 text-[#FF4D00] focus:ring-0"
                      />
                      <span>
                        Subscribe to our exclusive detailing updates and promo code releases.
                      </span>
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => handleStepChange(3)}
                      className="text-zinc-650 cursor-pointer rounded-xl border border-zinc-200 px-6 py-3.5 text-[10px] font-black tracking-widest uppercase transition-colors hover:border-zinc-400"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isPlacingOrder}
                      onClick={handlePlaceOrder}
                      className="flex cursor-pointer items-center space-x-2 rounded-xl bg-[#FF4D00] px-10 py-4 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-[#E04400] hover:shadow-md disabled:opacity-60"
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
          <div className="space-y-6 lg:col-span-4">
            {/* Order Summary Card */}
            <div
              className={`${isSummaryOpen ? 'block' : 'hidden lg:block'} space-y-6 rounded-[24px] border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8`}
            >
              <h3 className="border-b border-zinc-100 pb-3 text-xs font-black tracking-widest text-zinc-800 uppercase">
                Order Summary
              </h3>

              {/* Cart Items list */}
              <div className="max-h-[260px] space-y-4 divide-y divide-zinc-100 overflow-y-auto pr-1">
                {activeCart.map((item, index) => {
                  const sizeMultiplier =
                    item.selectedSize === '1 Litre'
                      ? 1.8
                      : item.selectedSize === '5 Litres'
                        ? 6.5
                        : 1.0;
                  const itemPrice = item.product.price * sizeMultiplier;
                  const lineTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-4 ${index > 0 ? 'pt-4' : ''}`}
                    >
                      <div className="relative flex h-14 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized={item.product.image?.startsWith('data:')}
                        />
                      </div>
                      <div className="flex-grow space-y-1 text-left">
                        <h4 className="line-clamp-1 text-[10px] font-bold text-zinc-800">
                          {item.product.name}
                        </h4>
                        <div className="text-[8px] tracking-wider text-zinc-400 uppercase">
                          Size: {item.selectedSize}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex w-max items-center space-x-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50 px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="cursor-pointer px-1 text-[10px] font-black text-zinc-400 transition-colors hover:text-[#FF4D00]"
                          >
                            <Minus className="h-2 w-2" />
                          </button>
                          <span className="w-3 text-center text-[9px] font-black text-zinc-700">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="cursor-pointer px-1 text-[10px] font-black text-zinc-400 transition-colors hover:text-[#FF4D00]"
                          >
                            <Plus className="h-2 w-2" />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove Action */}
                      <div className="flex h-14 flex-col items-end justify-between text-right">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="cursor-pointer text-[9px] font-bold tracking-wider text-zinc-300 uppercase transition-colors hover:text-red-500"
                        >
                          Remove
                        </button>
                        <span className="text-[10px] font-black text-zinc-800">
                          {lineTotal.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Promo Form */}
              <div className="space-y-2 border-t border-zinc-100 pt-4">
                <label className="block text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                  Promo Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. DETAIL20"
                    value={couponCodeInput}
                    onChange={(e) => {
                      setCouponCodeInput(e.target.value);
                      setCouponError('');
                    }}
                    className="flex-grow rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-center text-xs font-bold text-zinc-800 uppercase placeholder-zinc-400 outline-none focus:border-[#FF4D00]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="cursor-pointer rounded-xl bg-zinc-900 px-4 py-2 text-[10px] font-black tracking-widest text-white uppercase transition-colors hover:bg-black"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-center text-[9px] font-medium text-red-500">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-center text-[9px] font-medium text-green-600">
                    {couponSuccess}
                  </p>
                )}

                {coupon && (
                  <div className="mt-2 flex items-center justify-between rounded-xl border border-green-200/80 bg-green-50 px-3 py-2 text-[9px] font-semibold text-green-700">
                    <span>
                      Code: {coupon.code} (-{coupon.discountPercent}%)
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="cursor-pointer text-[8px] font-black tracking-widest text-green-700 uppercase hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-3 border-t border-zinc-100 pt-4 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-800">
                    {subtotal.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                {coupon && (
                  <div className="flex justify-between font-medium text-green-600">
                    <span>Discount ({coupon.code})</span>
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

                {/* Location-based Tax Block */}
                <div className="flex justify-between text-zinc-500">
                  <span>Estimated Tax</span>
                  {taxRate === null ? (
                    <span className="text-[10px] font-light text-zinc-400">
                      Calculated after ZIP Code
                    </span>
                  ) : (
                    <span className="font-bold text-zinc-800">
                      {estimatedTax.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </div>

                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  {deliveryCharge === 0 ? (
                    <span className="flex items-center space-x-1 text-[10px] font-black text-green-600 uppercase">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
                      <span>FREE</span>
                    </span>
                  ) : (
                    <span className="font-bold text-zinc-800">Standard Shipping ($10.00)</span>
                  )}
                </div>

                <div className="flex justify-between border-t border-zinc-100 pt-3 text-sm font-bold tracking-wider text-zinc-900 uppercase">
                  <span>Total Amount</span>
                  <span className="text-lg font-black text-[#FF4D00]">
                    {grandTotal.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges Card below Order Summary */}
            <div className="space-y-4 rounded-[24px] border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h4 className="border-zinc-150 border-b pb-2 text-[10px] font-black tracking-widest text-zinc-800 uppercase">
                Checkout Trust & Guarantee
              </h4>
              <div className="grid grid-cols-1 gap-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                <div className="flex items-center space-x-2.5">
                  <Lock className="h-4 w-4 text-[#FF4D00]" />
                  <span>Secure SSL Checkout</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#FF4D00]" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Truck className="h-4 w-4 text-[#FF4D00]" />
                  <span>Fast U.S. Shipping</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <RotateCcw className="h-4 w-4 text-[#FF4D00]" />
                  <span>Easy 30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Award className="h-4 w-4 text-[#FF4D00]" />
                  <span>Order Protection & 256-bit Encryption</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CreditCard className="h-4 w-4 text-[#FF4D00]" />
                  <span>Trusted Payment Methods Accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CheckoutPageContainer;
