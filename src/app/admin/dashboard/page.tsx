/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminStatsCard, AdminChartCard } from '@/components/admin/DashboardWidgets';
import { AdminTable } from '@/components/admin/AdminTable';
import { getDashboardStatsAction } from '@/features/catalog/actions/dashboard';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, ShieldAlert, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface OrderRow {
  id: string;
  orderNumber: string;
  customer: string;
  total: string;
  status: string;
}

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  stock: number;
  price: string;
}

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  orders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchStats = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDashboardStatsAction();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to retrieve dashboard analytics');
      }
    } catch (err) {
      toast.error('Error fetching dashboard statistics from database');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col justify-center items-center text-zinc-500 text-xs font-bold uppercase tracking-widest space-y-3">
        <RefreshCw className="h-6 w-6 animate-spin text-[#FF4D00]" />
        <span>Loading live database metrics...</span>
      </div>
    );
  }

  const {
    totalRevenue,
    totalOrdersCount,
    activeProductsCount,
    totalCustomersCount,
    lowStockCount,
    pendingOrdersCount,
    recentOrders,
    topProducts,
    latestCustomers,
  } = stats || {};

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            <span>Enterprise Admin</span>
            <span>/</span>
            <span className="text-[#FF4D00]">Overview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-white mt-1">
            Operations Dashboard
          </h2>
        </div>

        <button
          onClick={fetchStats}
          className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-white text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer w-fit"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Live</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <AdminStatsCard
          label="Total Revenue"
          value={`$${Number(totalRevenue || 0).toLocaleString('en-US')}`}
          trend={{ value: 'Live Data', type: 'up' }}
          icon={DollarSign}
        />
        <AdminStatsCard
          label="Total Orders"
          value={String(totalOrdersCount || 0)}
          trend={{ value: 'PostgreSQL', type: 'up' }}
          icon={ShoppingBag}
        />
        <AdminStatsCard
          label="Active Products"
          value={String(activeProductsCount || 0)}
          description="Published"
          icon={Package}
        />
        <AdminStatsCard
          label="Total Customers"
          value={String(totalCustomersCount || 0)}
          trend={{ value: 'Accounts', type: 'up' }}
          icon={Users}
        />
        <AdminStatsCard
          label="Low Stock Items"
          value={String(lowStockCount || 0)}
          trend={{ value: lowStockCount > 0 ? 'Restock' : 'Good', type: lowStockCount > 0 ? 'down' : 'up' }}
          icon={AlertTriangle}
        />
        <AdminStatsCard
          label="Pending Orders"
          value={String(pendingOrdersCount || 0)}
          description="Action Required"
          icon={ShieldAlert}
        />
      </div>

      {/* Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminChartCard
          title="Revenue Dynamics"
          description="Monthly Gross Sales representation"
        />
        <AdminChartCard
          title="Fulfillment Volumes"
          description="Orders packaged and dispatched daily"
        />
        <AdminChartCard
          title="Traffic Channels"
          description="Admin session allocations"
        />
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <AdminCard className="space-y-4">
          <h4 className="text-xs font-semibold tracking-widest uppercase border-b border-white/5 pb-2 text-zinc-300">
            Recent Orders Ledger
          </h4>
          <AdminTable<OrderRow>
            columns={[
              { key: 'orderNumber', label: 'Order ID' },
              { key: 'customer', label: 'Customer' },
              { key: 'total', label: 'Amount' },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider ${
                    row.status === 'DELIVERED'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                      : row.status === 'CANCELLED'
                        ? 'bg-red-500/10 border border-red-500/20 text-red-500'
                        : 'bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[#FF4D00]'
                  }`}>
                    {row.status}
                  </span>
                ),
              },
            ]}
            data={recentOrders || []}
            searchPlaceholder="Filter recent orders..."
          />
        </AdminCard>

        {/* Top Selling Products */}
        <AdminCard className="space-y-4">
          <h4 className="text-xs font-semibold tracking-widest uppercase border-b border-white/5 pb-2 text-zinc-300">
            Inventory & Price Sheet
          </h4>
          <AdminTable<ProductRow>
            columns={[
              { key: 'sku', label: 'SKU' },
              { key: 'name', label: 'Product Name' },
              { key: 'price', label: 'Base Price' },
              {
                key: 'stock',
                label: 'Stock',
                render: (row) => (
                  <span className={`font-bold ${row.stock < 10 ? 'text-red-500' : 'text-zinc-300'}`}>
                    {row.stock} left
                  </span>
                ),
              },
            ]}
            data={topProducts || []}
            searchPlaceholder="Filter items..."
          />
        </AdminCard>

        {/* Latest Registered Customers */}
        <AdminCard className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-semibold tracking-widest uppercase border-b border-white/5 pb-2 text-zinc-300">
            User Accounts Directory
          </h4>
          <AdminTable<CustomerRow>
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email Address' },
              { key: 'orders', label: 'Orders Placed' },
            ]}
            data={latestCustomers || []}
            searchPlaceholder="Search customer list..."
          />
        </AdminCard>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
