/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getCustomerByIdAction } from '@/features/catalog/actions/customerAdmin';
import { AdminPageHeader, AdminCard, AdminSection } from '@/components/admin/AdminLayoutPrimitives';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';
import { ArrowLeft, User, ShoppingBag, MapPin, Activity, Tag, Star, Heart } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface CustomerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminCustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const userId = resolvedParams.id;

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadCustomer() {
      try {
        const res = await getCustomerByIdAction(userId);
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          toast.error(res.error?.message || 'Failed to locate customer profile');
          router.push('/admin/customers');
        }
      } catch (err) {
        toast.error('Failed to communicate with customer directory database');
      } finally {
        setLoading(false);
      }
    }
    loadCustomer();
  }, [userId, router]);

  if (loading) {
    return <AdminLoading />;
  }

  const profile = user.customerProfile || {};
  const fullName = profile.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : 'Anonymous customer';
  const orders = user.orders || [];
  const spend = orders.reduce((acc: number, cur: any) => acc + Number(cur.totalAmount), 0);
  const defaultShipping = user.customerAddresses?.find((addr: any) => addr.isDefaultShipping);
  const defaultBilling = user.customerAddresses?.find((addr: any) => addr.isDefaultBilling);

  return (
    <div className="space-y-8 text-white text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            <Link href="/admin/customers" className="hover:text-white transition-colors">
              Customer Directory
            </Link>
            <span>/</span>
            <span className="text-[#FF4D00]">Details</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-white mt-1">
            {fullName}
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider">
          <Link
            href="/admin/customers"
            className="px-4 py-2.5 border border-white/10 hover:border-white rounded-xl transition-all flex items-center space-x-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Profile Card, Addresses */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Profile Card */}
          <AdminCard className="space-y-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-20 w-20 rounded-full bg-[#FF4D00]/10 border-2 border-[#FF4D00]/30 flex items-center justify-center font-bold text-2xl text-[#FF4D00]">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <span className="text-base font-bold text-white block">{fullName}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">{user.email}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-zinc-500">Account Type:</span>
                <span className="font-bold text-[#FF4D00] capitalize">{user.type || 'Customer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Registration Status:</span>
                <span className="font-bold text-zinc-300">
                  {user.passwordHash ? 'Registered Customer' : 'Guest Customer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Gender:</span>
                <span className="font-bold text-zinc-300 capitalize">{profile.gender || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Date of Birth:</span>
                <span className="font-bold text-zinc-300">{profile.dob || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Customer Since:</span>
                <span className="font-bold text-zinc-300">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 text-zinc-400">
                <span>Lifetime Revenue:</span>
                <span className="font-bold text-white font-num">${spend.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Lifetime Orders:</span>
                <span className="font-bold text-white font-num">{orders.length} orders</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Average Order Value (AOV):</span>
                <span className="font-bold text-white font-num">
                  ${Number(orders.length > 0 ? spend / orders.length : 0).toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Last Login Activity:</span>
                <span className="font-bold text-zinc-300">
                  {user.activityLogs?.[0] ? new Date(user.activityLogs[0].createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 text-green-500 font-bold">
                <span>Reward Points Balance:</span>
                <span className="font-num">500 pts</span>
              </div>
            </div>
          </AdminCard>

          {/* Addresses Card */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex items-center space-x-1.5">
              <MapPin className="h-4 w-4 text-[#FF4D00]" />
              <span>Addresses Ledger</span>
            </h4>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Default Shipping</span>
                {defaultShipping ? (
                  <p className="text-zinc-300 leading-relaxed font-light font-mono">
                    {defaultShipping.street}, {defaultShipping.city}, {defaultShipping.state}, {defaultShipping.country} - {defaultShipping.zipCode}
                  </p>
                ) : (
                  <span className="text-zinc-500 italic">No default shipping address</span>
                )}
              </div>
              
              <div className="space-y-1 border-t border-white/5 pt-3">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Default Billing</span>
                {defaultBilling ? (
                  <p className="text-zinc-300 leading-relaxed font-light font-mono">
                    {defaultBilling.street}, {defaultBilling.city}, {defaultBilling.state}, {defaultBilling.country} - {defaultBilling.zipCode}
                  </p>
                ) : (
                  <span className="text-zinc-500 italic">No default billing address</span>
                )}
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Center & Right Columns: Orders list, Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Activity counts summary strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', val: orders.length, icon: ShoppingBag },
              { label: 'Promo Coupons', val: user.couponUsages?.length || 0, icon: Tag },
              { label: 'Reviews Submitted', val: user.reviews?.length || 0, icon: Star },
              { label: 'Wishlist items', val: user.wishlist?.wishlistItems?.length || 0, icon: Heart },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="p-4 border border-white/5 bg-[#0a0a0a] rounded-2xl flex items-center space-x-3 text-left">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-[#FF4D00]">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-num text-lg font-black text-white">{metric.val}</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block mt-0.5">{metric.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orders History list */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Orders History
            </h4>
            {orders.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                No orders placed by this customer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                      <th className="p-3">Invoice Ref</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Order Date</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o: any) => (
                      <tr key={o.id} className="hover:bg-white/5 transition-all">
                        <td className="p-3 font-mono text-zinc-300">{o.invoiceRef}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${
                            o.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 font-num font-bold text-white">${Number(o.totalAmount).toLocaleString('en-US')}</td>
                        <td className="p-3 text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="text-[#FF4D00] hover:underline text-[10px] uppercase font-bold tracking-wider"
                          >
                            View Order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>

          {/* Activity Logs */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex items-center space-x-1.5">
              <Activity className="h-4 w-4 text-[#FF4D00]" />
              <span>Customer Activity Log</span>
            </h4>
            <div className="space-y-3">
              {user.activityLogs?.length > 0 ? (
                user.activityLogs.map((log: any) => (
                  <div key={log.id} className="flex justify-between items-start text-[10px] border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <div className="space-y-0.5">
                      <span className="font-bold text-zinc-300 block">{log.action}</span>
                      <span className="text-zinc-500 font-light block">{log.description}</span>
                    </div>
                    <div className="text-right text-zinc-500 font-medium font-num">
                      <span className="block">{log.ipAddress}</span>
                      <span className="text-[8px] font-light block mt-0.5">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                  No log entries for this customer.
                </div>
              )}
            </div>
          </AdminCard>

          {/* Active Wishlist */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Active Wishlist
            </h4>
            {user.wishlist?.wishlistItems?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {user.wishlist.wishlistItems.map((item: any) => {
                  const product = item.variant?.product || {};
                  return (
                    <div key={item.id} className="border border-white/5 bg-black p-2.5 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-zinc-300 block truncate" title={product.title}>
                        {product.title}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#FF4D00] font-black block">
                        SKU: {item.variant?.sku}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                No products in wishlist.
              </div>
            )}
          </AdminCard>

          {/* Recently Viewed Products */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Recently Viewed Products
            </h4>
            {user.recentlyViewedProducts?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {user.recentlyViewedProducts.map((item: any) => {
                  const product = item.product || {};
                  return (
                    <div key={item.id} className="border border-white/5 bg-black p-2.5 rounded-xl space-y-1.5 text-xs">
                      <span className="font-bold text-zinc-300 block truncate" title={product.title}>
                        {product.title}
                      </span>
                      <span className="text-[8px] text-zinc-500 block">
                        Viewed: {new Date(item.viewedAt).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                No viewed products history.
              </div>
            )}
          </AdminCard>

          {/* Reviews History */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Review Ratings History
            </h4>
            {user.reviews?.length > 0 ? (
              <div className="space-y-3">
                {user.reviews.map((rev: any) => (
                  <div key={rev.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-200">{rev.product?.title}</span>
                      <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${
                        rev.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {rev.status}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500 space-x-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3 w-3 ${idx < rev.rating ? 'fill-current' : 'text-zinc-700'}`}
                        />
                      ))}
                    </div>
                    {rev.title && <span className="font-bold text-zinc-400 block">{rev.title}</span>}
                    <p className="text-zinc-500 font-light text-[10px] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                No reviews posted.
              </div>
            )}
          </AdminCard>
        </div>

      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
