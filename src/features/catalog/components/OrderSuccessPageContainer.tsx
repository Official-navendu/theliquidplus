'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, Mail } from 'lucide-react';
import Link from 'next/link';

export function OrderSuccessPageContainer() {
  const searchParams = useSearchParams();
  const rawTotal = searchParams.get('total');
  const total = rawTotal ? Number(rawTotal) : 4899;

  const [orderId, setOrderId] = React.useState('TLP-PENDING');
  const [deliveryDate, setDeliveryDate] = React.useState('Calculating...');

  React.useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setOrderId(`TLP-${result}`);

    const date = new Date();
    date.setDate(date.getDate() + 4);
    setDeliveryDate(date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  return (
    <div className="bg-black text-white min-h-screen py-20 flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-8 rounded-xl space-y-6">
        
        {/* Animated Checkmark */}
        <div className="flex justify-center">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-full text-green-500">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FF4D00] font-bold">Payment Verified</span>
          <h1 className="text-2xl font-light uppercase tracking-wider text-white">Order Placed Successfully!</h1>
          <p className="text-xs text-[#B5B5B5] font-light leading-relaxed">
            Thank you for choosing The Liquid Plus. Your premium products have been queued for dispatch processing.
          </p>
        </div>

        {/* Order Details box */}
        <div className="bg-black border border-white/5 p-4 rounded text-left text-xs space-y-2.5 font-light">
          <div className="flex justify-between">
            <span className="text-[#B5B5B5]">Order ID:</span>
            <span className="font-semibold text-[#E5E5E5]">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#B5B5B5]">Amount Paid:</span>
            <span className="font-semibold text-[#FF4D00]">
              {total.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#B5B5B5]">Status:</span>
            <span className="text-green-500 font-semibold uppercase tracking-wider text-[10px]">Processing Dispatch</span>
          </div>
        </div>

        {/* Estimated delivery */}
        <div className="flex items-center space-x-3 bg-[#1A1A1A] p-4 border border-white/5 rounded text-left">
          <Calendar className="h-5 w-5 text-[#FF4D00] flex-shrink-0" />
          <div className="text-xs">
            <span className="text-[#B5B5B5] block uppercase tracking-wider text-[9px] font-bold">Estimated Delivery</span>
            <span className="text-[#E5E5E5] font-semibold">{deliveryDate}</span>
          </div>
        </div>

        {/* Micro guidelines */}
        <div className="text-[10px] text-[#B5B5B5] font-light flex items-center justify-center space-x-1.5 pt-2">
          <Mail className="h-3.5 w-3.5" />
          <span>A copy of invoice details has been sent to your email.</span>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/shop"
            className="py-3.5 bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white text-[10px] tracking-widest font-bold uppercase transition-all text-center cursor-pointer rounded-xl"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="py-3.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] tracking-widest font-black uppercase transition-all text-center cursor-pointer rounded-xl hover:scale-105 hover:shadow-[0_0_15px_rgba(255,77,0,0.4)]"
          >
            View Orders
          </Link>
        </div>

      </div>
    </div>
  );
}
export default OrderSuccessPageContainer;
