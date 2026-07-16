'use client';

import * as React from 'react';
import { ShoppingBag, Heart, MapPin, CreditCard, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../constants/products';
import { ProductCard } from './ProductCard';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getProfileData, getAddressesAction, getOrdersAction } from '../actions/customer';
import { useCartStore } from '../hooks/useCartStore';

export function AccountDashboardContainer() {
  const { data: session } = useSession();
  const { wishlist } = useCartStore();
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalSpent: 0,
    savedAddresses: 0,
    rewardPoints: 450,
  });
  const [displayName, setDisplayName] = React.useState('Customer');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const [profileRes, addrRes, orderRes] = await Promise.all([
        getProfileData(),
        getAddressesAction(),
        getOrdersAction(),
      ]);

      let ordersCount = 0;
      let spentTotal = 0;
      let addressesCount = 0;
      let rewards = 450;

      if (profileRes.success && profileRes.data) {
        const profile = profileRes.data;
        const namePart = profile.firstName ? `${profile.firstName} ${profile.lastName}`.trim() : '';
        setDisplayName(namePart || session?.user?.email?.split('@')[0] || 'Customer');
        rewards = profile.rewardPoints;
      }

      if (addrRes.success && addrRes.data) {
        addressesCount = addrRes.data.length;
      }

      if (orderRes.success && orderRes.data) {
        ordersCount = orderRes.data.length;
        spentTotal = orderRes.data.reduce((sum, o) => sum + o.total, 0);
      }

      setStats({
        totalOrders: ordersCount,
        totalSpent: spentTotal,
        savedAddresses: addressesCount,
        rewardPoints: rewards,
      });

      setIsLoading(false);
    }

    loadData();
  }, [session]);

  const recommended = React.useMemo(() => {
    return PRODUCTS.slice(0, 2);
  }, []);

  if (isLoading) {
    return (
      <div className="border border-white/5 bg-[#0a0a0a] p-8 rounded-xl space-y-6 text-left animate-pulse">
        <div className="h-4 bg-white/5 w-1/4 rounded" />
        <div className="h-10 bg-white/5 w-full rounded" />
        <div className="h-10 bg-white/5 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="relative border border-white/5 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D00]/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-light uppercase tracking-wider text-white">
            Welcome back, <span className="text-[#FF4D00] font-normal">{displayName}</span>
          </h2>
          <p className="text-xs text-[#B5B5B5] font-light leading-relaxed max-w-md">
            Inspect your recent glaze products, track dispatch states, and check elite member benefits.
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-2 bg-[#FF4D00]/10 border border-[#FF4D00]/20 px-3 py-2 rounded text-[#FF4D00] text-[10px] uppercase tracking-widest font-black self-start sm:self-auto">
          <Sparkles className="h-4 w-4" />
          <span>Platinum Level</span>
        </div>
      </div>

      {/* Customer Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag },
          { label: 'Total Spent', value: stats.totalSpent.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }), icon: CreditCard },
          { label: 'Wishlist Count', value: wishlist.length.toString(), icon: Heart },
          { label: 'Saved Addresses', value: stats.savedAddresses.toString(), icon: MapPin },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="border border-white/5 bg-[#0a0a0a] p-4 rounded-xl space-y-3 relative group overflow-hidden">
              <div className="flex justify-between items-center text-[#B5B5B5]">
                <span className="text-[9px] uppercase tracking-widest font-bold">{stat.label}</span>
                <Icon className="h-4 w-4 text-[#B5B5B5] group-hover:text-[#FF4D00] transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#E5E5E5]">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Reward Points Placeholder */}
      <div className="border border-white/5 bg-[#0a0a0a] p-6 rounded-xl flex justify-between items-center">
        <div>
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#B5B5B5]">Reward Points Balance</h4>
          <p className="text-2xl font-bold text-[#E5E5E5] mt-1">{stats.rewardPoints} Points</p>
        </div>
        <span className="text-[8px] bg-amber-500/15 text-amber-500 border border-amber-500/20 px-2 py-1 rounded uppercase font-black tracking-widest">
          10% Off Next Order
        </span>
      </div>

      {/* Quick Actions */}
      <div className="border border-white/5 bg-[#0a0a0a] p-6 rounded-xl space-y-4">
        <h4 className="text-xs font-semibold tracking-[0.2em] uppercase border-b border-white/5 pb-3 text-white">Quick Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs uppercase tracking-wider font-bold">
          <Link href="/account/orders" className="p-3 border border-white/10 hover:border-[#FF4D00] hover:bg-[#FF4D00]/5 text-center rounded transition-colors text-[#E5E5E5] hover:text-white">
            Track Recent Order
          </Link>
          <Link href="/account/profile" className="p-3 border border-white/10 hover:border-[#FF4D00] hover:bg-[#FF4D00]/5 text-center rounded transition-colors text-[#E5E5E5] hover:text-white">
            Modify Profile Settings
          </Link>
          <Link href="/shop" className="p-3 border border-[#FF4D00]/30 bg-[#FF4D00]/10 text-white text-center rounded hover:bg-[#FF4D00]/20 transition-colors">
            Shop New Formulas
          </Link>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white">Premium Formulas Recommended For You</h4>
          <Link href="/shop" className="text-[10px] text-[#B5B5B5] hover:text-[#FF4D00] uppercase tracking-widest">
            View Shop
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default AccountDashboardContainer;
