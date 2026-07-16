'use client';

import * as React from 'react';
import { getOrderDetailsAction } from '../actions/customer';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface AccountOrderDetailsContainerProps {
  orderId: string;
}

interface OrderDetail {
  id: string;
  invoiceRef: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  subtotalAmount: number;
  createdAt: Date;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingZipCode: string;
  items: Array<{
    id: string;
    name: string;
    variantName: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  timelines: Array<{
    status: string;
    description: string;
    createdAt: Date;
  }>;
}

export function AccountOrderDetailsContainer({ orderId }: AccountOrderDetailsContainerProps) {
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const res = await getOrderDetailsAction(orderId);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        toast.error('Failed to load order details');
      }
      setIsLoading(false);
    }
    loadData();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="border border-white/5 bg-[#0a0a0a] p-8 rounded-xl space-y-6 text-left animate-pulse">
        <div className="h-4 bg-white/5 w-1/4 rounded" />
        <div className="h-12 bg-white/5 w-full rounded" />
        <div className="h-24 bg-white/5 w-full rounded" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="border border-white/5 bg-[#0a0a0a] p-8 rounded-xl text-center text-[#B5B5B5] text-xs animate-fade-in">
        Order not found or access denied.
      </div>
    );
  }

  return (
    <div className="border border-white/5 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl space-y-8 text-left text-white animate-fade-in">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="text-[10px] tracking-widest uppercase text-[#B5B5B5] flex items-center space-x-1">
            <Link href="/account/orders" className="hover:text-white">Orders</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#FF4D00] font-medium">{order.invoiceRef}</span>
          </div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase mt-2 text-white">Order Specification details</h3>
        </div>
        <button
          onClick={() => toast.success('Invoice download will begin shortly (placeholder)')}
          className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white py-2.5 px-5 text-[9px] tracking-widest font-black uppercase transition-all rounded-xl cursor-pointer"
        >
          Download PDF Invoice
        </button>
      </div>

      {/* Transit timeline */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">Order Delivery Timeline</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold uppercase tracking-wider text-center">
          <div className={`p-3 border rounded ${order.status === 'PENDING' || order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'border-[#FF4D00]/20 bg-[#FF4D00]/5 text-[#FF4D00]' : 'border-white/5 bg-black text-[#B5B5B5]'}`}>
            <span>✓ Order Placed</span>
            <span className="text-[9px] text-[#B5B5B5] block font-light mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className={`p-3 border rounded ${order.paymentStatus === 'PAID' ? 'border-[#FF4D00]/20 bg-[#FF4D00]/5 text-[#FF4D00]' : 'border-white/5 bg-black text-[#B5B5B5]'}`}>
            <span>✓ Paid Verified</span>
            <span className="text-[9px] text-[#B5B5B5] block font-light mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className={`p-3 border rounded ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'border-[#FF4D00]/20 bg-[#FF4D00]/5 text-[#FF4D00]' : 'border-white/5 bg-black text-[#B5B5B5]'}`}>
            <span>In Transit</span>
            <span className="text-[9px] text-[#B5B5B5] block font-light mt-0.5">{order.status === 'SHIPPED' ? 'On the way' : 'Pending dispatch'}</span>
          </div>
          <div className={`p-3 border rounded ${order.status === 'DELIVERED' ? 'border-green-500/20 bg-green-500/5 text-green-500' : 'border-white/5 bg-black text-[#B5B5B5]'}`}>
            <span>Delivered</span>
            <span className="text-[9px] text-[#B5B5B5] block font-light mt-0.5">{order.status === 'DELIVERED' ? 'Completed' : 'Pending delivery'}</span>
          </div>
        </div>
      </div>

      {/* Address & Payment Info Split */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-white/5 py-6 text-xs">
        <div className="space-y-2 text-left">
          <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#FF4D00]">Shipping address</h4>
          <p className="font-semibold text-white">{order.street}</p>
          <p className="text-[#B5B5B5]">{order.city}, {order.state} - {order.zipCode}</p>
          <p className="text-[#B5B5B5]">{order.country}</p>
        </div>
        <div className="space-y-2 text-left">
          <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#FF4D00]">Billing details</h4>
          <p className="font-semibold text-white">Payment Status: {order.paymentStatus}</p>
          <p className="text-[#B5B5B5]">Invoice Reference: {order.invoiceRef}</p>
        </div>
      </div>

      {/* Purchased items list */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">Items Purchased</h4>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded-lg text-xs">
              <div className="space-y-0.5 text-left">
                <span className="font-semibold text-[#E5E5E5] block">{item.name}</span>
                <span className="text-[9px] text-[#B5B5B5] uppercase tracking-widest">{item.variantName} • Qty: {item.quantity}</span>
              </div>
              <span className="font-bold text-[#E5E5E5]">
                {item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order cost breakdown summary */}
      <div className="border-t border-white/5 pt-4 text-xs space-y-2.5 max-w-sm ml-auto">
        <div className="flex justify-between text-[#B5B5B5]">
          <span>Subtotal</span>
          <span className="text-[#E5E5E5]">
            {order.subtotalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex justify-between text-[#B5B5B5]">
          <span>GST (18%)</span>
          <span className="text-[#E5E5E5]">
            {order.taxAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex justify-between text-[#B5B5B5]">
          <span>Shipping Charges</span>
          <span className="text-[#E5E5E5]">
            {order.shippingAmount === 0 ? 'Free' : order.shippingAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="border-t border-white/5 pt-2 flex justify-between font-bold text-sm">
          <span>Grand Total</span>
          <span className="text-[#FF4D00]">
            {order.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
}
export default AccountOrderDetailsContainer;
