/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  getOrderByIdAction,
  updateOrderStatusAction,
  updateOrderTrackingAction,
  updateOrderPaymentAction,
  saveOrderNoteAction,
} from '@/features/catalog/actions/order';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';
import { ArrowLeft, CreditCard, Truck, FileText, CheckCircle, Package, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import Link from 'next/link';

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.id;

  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState<any>(null);
  
  // Local form inputs
  const [carrier, setCarrier] = React.useState('');
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [isUpdatingTracking, setIsUpdatingTracking] = React.useState(false);
  const [adminNote, setAdminNote] = React.useState('');
  const [isSavingNote, setIsSavingNote] = React.useState(false);

  const loadOrder = React.useCallback(async () => {
    try {
      const res = await getOrderByIdAction(orderId);
      if (res.success && res.data) {
        setOrder(res.data);
        const shipment = res.data.shipments?.[0] || {};
        setCarrier(shipment.carrier || '');
        setTrackingNumber(shipment.trackingNumber || '');
        const notesObj = res.data.orderStatusHistory?.[0] || {}; // We can read order notes from orderStatusHistory or orderNotes
        const firstNote = res.data.orderNotes?.[0] || {};
        setAdminNote(firstNote.note || '');
      } else {
        toast.error(res.error?.message || 'Failed to locate order details');
        router.push('/admin/orders');
      }
    } catch (err) {
      toast.error('Failed to communicate with orders catalog');
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  React.useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      const res = await updateOrderStatusAction(orderId, status, `Manual update to ${status}`);
      if (res.success) {
        toast.success(`Order status set to ${status}`);
        loadOrder();
      } else {
        toast.error(res.error?.message || 'Failed to update order status');
      }
    } catch (err) {
      toast.error('Network request failed');
    }
  };

  const handlePaymentChange = async (status: PaymentStatus) => {
    try {
      const res = await updateOrderPaymentAction(orderId, status);
      if (res.success) {
        toast.success(`Payment status set to ${status}`);
        loadOrder();
      } else {
        toast.error(res.error?.message || 'Failed to update payment status');
      }
    } catch (err) {
      toast.error('Network request failed');
    }
  };

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrier || !trackingNumber) {
      toast.error('Carrier name and tracking ID are required');
      return;
    }
    setIsUpdatingTracking(true);
    try {
      const res = await updateOrderTrackingAction(orderId, carrier, trackingNumber);
      if (res.success) {
        toast.success('Tracking coordinates updated successfully');
        loadOrder();
      } else {
        toast.error(res.error?.message || 'Failed to update tracking');
      }
    } catch (err) {
      toast.error('Network request failed');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    try {
      const res = await saveOrderNoteAction(orderId, adminNote);
      if (res.success) {
        toast.success('Admin order note updated successfully');
        loadOrder();
      } else {
        toast.error(res.error?.message || 'Failed to update order notes');
      }
    } catch (err) {
      toast.error('Network request failed');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleSimulateRefund = async () => {
    try {
      const res = await updateOrderStatusAction(orderId, OrderStatus.CANCELLED, 'Order cancelled and refund initiated.');
      if (res.success) {
        await updateOrderPaymentAction(orderId, PaymentStatus.PENDING); // set payment back or failed
        toast.success('Refund simulated successfully: Order marked CANCELLED');
        loadOrder();
      }
    } catch (err) {
      toast.error('Failed to simulate refund');
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const doc = new jsPDF();

      const primaryColor = [10, 10, 10]; 
      const accentColor = [255, 77, 0];  
      const textGray = [120, 120, 120];

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text('THE LIQUID PLUS', 20, 25);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      doc.text([
        'Premium Detailing Garage & Chemicals',
        '100 Feet Ring Road, Bangalore, KA, India',
        'Email: support@theliquidplus.com',
        'Web: www.theliquidplus.com'
      ], 20, 32);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('INVOICE', 140, 25);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Invoice Ref: ${order.invoiceRef}`, 140, 32);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 37);
      doc.text(`Order Status: ${order.status}`, 140, 42);
      doc.text(`Payment Status: ${payment.status || 'PENDING'}`, 140, 47);

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, 55, 190, 55);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('BILL TO:', 20, 65);
      doc.text('SHIP TO:', 105, 65);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      
      const shippingStr = shippingAddress.street ? 
        `${shippingAddress.street}\n${shippingAddress.city}, ${shippingAddress.state}\n${shippingAddress.country} - ${shippingAddress.zipCode}` : 
        'Guest Checkout Address / N/A';
      
      const billingStr = billingAddress.street ? 
        `${billingAddress.street}\n${billingAddress.city}, ${billingAddress.state}\n${billingAddress.country} - ${billingAddress.zipCode}` : 
        shippingAddress.street ? 
          `${shippingAddress.street}\n${shippingAddress.city}, ${shippingAddress.state}\n${shippingAddress.country} - ${shippingAddress.zipCode}` : 
          'Guest Checkout Address / N/A';

      doc.text([
        customerName,
        order.guestEmail || order.customer?.email || '',
        order.guestPhone || profile.phone || '',
        '',
        billingStr
      ], 20, 71);

      doc.text([
        customerName,
        order.guestEmail || order.customer?.email || '',
        order.guestPhone || profile.phone || '',
        '',
        shippingStr
      ], 105, 71);

      let y = 115;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(20, y, 170, 8, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('Product Item / Variant', 22, y + 5.5);
      doc.text('SKU', 90, y + 5.5);
      doc.text('Qty', 130, y + 5.5);
      doc.text('Unit Price', 150, y + 5.5);
      doc.text('Total', 172, y + 5.5);

      y += 8;
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);

      order.orderItems?.forEach((item: any, idx: number) => {
        const prod = item.variant?.product || {};
        const title = prod.title || 'Unmapped product';
        const sku = item.variant?.sku || 'N/A';
        const qty = item.quantity;
        const price = Number(item.price);
        const itemTotal = price * qty;

        if (idx % 2 === 1) {
          doc.setFillColor(248, 248, 248);
          doc.rect(20, y, 170, 8, 'F');
        }
        
        doc.text(title.substring(0, 36), 22, y + 5.5);
        doc.text(sku, 90, y + 5.5);
        doc.text(qty.toString(), 132, y + 5.5);
        doc.text(`$${price.toFixed(2)}`, 150, y + 5.5);
        doc.text(`$${itemTotal.toFixed(2)}`, 172, y + 5.5);
        
        y += 8;
      });

      doc.setDrawColor(220, 220, 220);
      doc.line(20, y + 2, 190, y + 2);
      y += 8;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);

      doc.text('Subtotal:', 130, y);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(`$${Number(order.subtotalAmount).toFixed(2)}`, 170, y);
      y += 5;

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Tax (18% GST):', 130, y);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(`$${Number(order.taxAmount).toFixed(2)}`, 170, y);
      y += 5;

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Shipping cost:', 130, y);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(`$${Number(order.shippingAmount).toFixed(2)}`, 170, y);
      y += 5;

      if (order.couponCode) {
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Coupon (${order.couponCode}):`, 130, y);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(40, 150, 40);
        doc.text(`-$${Number(order.discountAmount).toFixed(2)}`, 170, y);
        y += 5;
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(130, y + 1, 190, y + 1);
      y += 6;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text('Grand Total (USD):', 130, y);
      doc.text(`$${Number(order.totalAmount).toFixed(2)}`, 170, y);

      y += 15;
      doc.setFillColor(245, 245, 245);
      doc.rect(20, y, 170, 20, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('PAYMENT INFORMATION', 24, y + 6);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`Payment Gateway: ${payment.provider || 'Razorpay Checkout'}`, 24, y + 11);
      doc.text(`Transaction Ref: ${payment.id ? `TXN_${payment.id.substring(0, 8).toUpperCase()}` : 'N/A'}`, 24, y + 15);
      doc.text(`Payment Status: ${payment.status || 'PENDING'}`, 110, y + 11);
      doc.text(`Fulfillment Stage: ${order.status}`, 110, y + 15);

      y += 30;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Notes / Instructions:', 20, y);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Please verify matching specifications and user guides before surface application.', 20, y + 5);
      doc.text('If you have any questions about this invoice, contact support@theliquidplus.com', 20, y + 9);

      doc.save(`invoice_${order.invoiceRef}.pdf`);
      toast.success('Professional PDF Invoice downloaded!');
    } catch (err: any) {
      toast.error(`PDF generation failed: ${err.message}`);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  const profile = order.customer?.customerProfile || {};
  const customerName = profile.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : order.guestEmail || 'Guest Checkouts';
  const payment = order.payments?.[0] || {};
  const shippingAddress = order.customer?.customerAddresses?.find((addr: any) => addr.isDefaultShipping) || {};
  const billingAddress = order.customer?.customerAddresses?.find((addr: any) => addr.isDefaultBilling) || {};

  return (
    <div className="space-y-8 text-white text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            <Link href="/admin/orders" className="hover:text-white transition-colors">
              Orders
            </Link>
            <span>/</span>
            <span className="text-[#FF4D00]">Fulfillment Details</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-white mt-1">
            Invoice ref: {order.invoiceRef}
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 border border-white/10 hover:border-white rounded-xl transition-all flex items-center space-x-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <button
            onClick={handleDownloadInvoice}
            className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-white text-white rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Export Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Products details, Invoice metrics */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order items */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex items-center space-x-2">
              <Package className="h-4 w-4 text-[#FF4D00]" />
              <span>Fulfillment Items Ledger</span>
            </h4>
            <div className="divide-y divide-white/5">
              {order.orderItems?.map((item: any) => {
                const product = item.variant?.product || {};
                const name = product.title || 'Unmapped product';
                return (
                  <div key={item.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-zinc-200 block">{name}</span>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
                        SKU: {item.variant?.sku || 'N/A'} (Qty: {item.quantity})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-num text-xs font-bold text-white">
                        ${Number(item.price * item.quantity).toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminCard>

          {/* Pricing Ledger summary */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Financial Breakdown
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal:</span>
                <span className="font-bold text-zinc-300 font-num">${Number(order.subtotalAmount).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tax Levy (GST):</span>
                <span className="font-bold text-zinc-300 font-num">${Number(order.taxAmount).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping Fees:</span>
                <span className="font-bold text-zinc-300 font-num">${Number(order.shippingAmount).toLocaleString('en-US')}</span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between text-green-500 font-semibold">
                  <span>Coupon discount ({order.couponCode}):</span>
                  <span className="font-num">-${Number(order.discountAmount).toLocaleString('en-US')}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/5 pt-2 text-[#FF4D00] font-black text-sm">
                <span>Grand Total:</span>
                <span className="font-num">${Number(order.totalAmount).toLocaleString('en-US')}</span>
              </div>
            </div>
          </AdminCard>

          {/* Order Timeline History */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Fulfillment Log & Timeline
            </h4>
            <div className="space-y-4">
              {order.orderTimeline?.length > 0 ? (
                order.orderTimeline.map((evt: any) => (
                  <div key={evt.id} className="flex items-start space-x-3 text-xs text-left">
                    <div className="h-2 w-2 rounded-full bg-[#FF4D00] mt-1.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-zinc-200 block">{evt.status}</span>
                      <p className="text-zinc-500 font-light leading-relaxed">{evt.description}</p>
                      <span className="text-[8px] text-zinc-600 block mt-0.5">
                        {new Date(evt.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                  No timeline markers recorded.
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        {/* Right 1 Column: Shipment tracking inputs, Status updates */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Order Status Controller */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Fulfillment Status
            </h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Update order stage</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg cursor-pointer outline-none focus:border-[#FF4D00] text-xs font-bold uppercase tracking-wider"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="CONFIRMED">Packed / Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              <div className="space-y-1 border-t border-white/5 pt-3">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Update payment ledger status</span>
                <select
                  value={payment.status || 'PENDING'}
                  onChange={(e) => handlePaymentChange(e.target.value as PaymentStatus)}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg cursor-pointer outline-none focus:border-[#FF4D00] text-xs font-bold uppercase tracking-wider"
                >
                  <option value="PENDING">Pending / Unpaid</option>
                  <option value="COMPLETED">Paid / Settled</option>
                  <option value="FAILED">Declined / Failed</option>
                </select>
              </div>
            </div>
          </AdminCard>

          {/* Shipment coordinates */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex items-center space-x-1.5">
              <Truck className="h-4 w-4 text-[#FF4D00]" />
              <span>Shipment Tracking</span>
            </h4>
            
            <form onSubmit={handleTrackingSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Carrier</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white px-3 py-1.5 rounded-lg outline-none"
                  placeholder="Delhivery, Bluedart..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Tracking ID</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white px-3 py-1.5 rounded-lg outline-none"
                  placeholder="987654321..."
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingTracking}
                className="w-full py-2 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 disabled:opacity-50"
              >
                {isUpdatingTracking ? 'Saving...' : 'Register Tracking'}
              </button>
            </form>
          </AdminCard>

          {/* Customer profile summary */}
          <AdminCard className="space-y-3 text-xs">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex justify-between items-center">
              <span>Customer Profile</span>
              <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${
                order.customer?.passwordHash ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
              }`}>
                {order.customer?.passwordHash ? 'Registered' : 'Guest'}
              </span>
            </h4>
            <div className="space-y-2">
              <span className="text-white font-bold block">{customerName}</span>
              <span className="text-zinc-500 block">{order.guestEmail || order.customer?.email}</span>
              {order.guestPhone || profile.phone ? (
                <span className="text-zinc-500 block font-num">{order.guestPhone || profile.phone}</span>
              ) : null}
            </div>

            <div className="border-t border-white/5 pt-3 space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Shipping Address</span>
              <p className="text-zinc-300 leading-relaxed font-light">
                {shippingAddress.street ? (
                  `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country} - ${shippingAddress.zipCode}`
                ) : (
                  'Guest Checkout Details / N/A'
                )}
              </p>
            </div>

            <div className="border-t border-white/5 pt-3 space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Billing Address</span>
              <p className="text-zinc-300 leading-relaxed font-light">
                {billingAddress.street ? (
                  `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.country} - ${billingAddress.zipCode}`
                ) : shippingAddress.street ? (
                  `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country} - ${shippingAddress.zipCode}`
                ) : (
                  'Guest Checkout Details / N/A'
                )}
              </p>
            </div>
          </AdminCard>

          {/* Payment Details */}
          <AdminCard className="space-y-3 text-xs">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Payment Parameters
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Method:</span>
                <span className="font-bold text-zinc-300">{payment.provider || 'Razorpay Checkout'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Transaction ID:</span>
                <span className="font-mono text-zinc-400 text-[10px]">
                  {payment.id ? `TXN_${payment.id.substring(0, 8).toUpperCase()}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Status:</span>
                <span className="font-bold text-zinc-300 uppercase">{payment.status || 'PENDING'}</span>
              </div>
            </div>
            
            {payment.status === 'COMPLETED' && (
              <button
                onClick={handleSimulateRefund}
                className="w-full py-2 bg-red-950/20 border border-red-500/30 hover:border-red-500 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 mt-3"
              >
                Simulate Refund
              </button>
            )}
          </AdminCard>

          {/* Admin Notes */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Admin Notes
            </h4>
            <div className="space-y-3">
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                placeholder="Enter internal admin notes..."
                className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00] text-xs resize-none"
              />
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="w-full py-2 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 disabled:opacity-50"
              >
                {isSavingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </AdminCard>

        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
