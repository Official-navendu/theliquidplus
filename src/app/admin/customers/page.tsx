'use client';

import * as React from 'react';
import {
  getCustomersAction,
  updateCustomerStatusAction,
} from '@/features/catalog/actions/customerAdmin';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Eye, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { UserStatus } from '@prisma/client';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const [data, setData] = React.useState<SafeAny[]>([]);
  const [_total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  // Filters state
  const [search, _setSearch] = React.useState('');
  const [selectedStatus, _setSelectedStatus] = React.useState<UserStatus | 'ALL'>('ALL');
  const [page, _setPage] = React.useState(1);
  const [limit] = React.useState(50); // Fetch all to allow AdminTable client filters/sorting/search

  const loadCustomers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomersAction({
        search,
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        page,
        limit,
      });

      if (res.success && res.data) {
        setData(res.data.items);
        setTotal(res.data.total);
      } else {
        toast.error(res.error?.message || 'Failed to query customer directory');
      }
    } catch {
      toast.error('Failed to communicate with customer directory ledger');
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus, page, limit]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleStatusToggle = async (userId: string, currentStatus: UserStatus) => {
    const nextStatus =
      currentStatus === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE;
    try {
      const res = await updateCustomerStatusAction(userId, nextStatus);
      if (res.success) {
        toast.success(`Customer status set to ${nextStatus.toLowerCase()}`);
        loadCustomers();
      } else {
        toast.error(res.error?.message || 'Failed to update customer status');
      }
    } catch {
      toast.error('Network request failed');
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((user) => {
      const profile = user.customerProfile || {};
      const fullName = profile.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`.trim()
        : 'Anonymous customer';
      const ordersCount = profile.totalOrdersCount || user.orders?.length || 0;
      const lifetimeSpend =
        Number(profile.lifetimeSpend) ||
        user.orders?.reduce((acc: number, cur: SafeAny) => acc + Number(cur.totalAmount), 0) ||
        0;
      const aov = ordersCount > 0 ? lifetimeSpend / ordersCount : 0;
      const wishlistCount = user.wishlist?._count?.wishlistItems || 0;
      const reviewsCount = user._count?.reviews || 0;

      return {
        id: user.id,
        avatar: fullName.charAt(0).toUpperCase() || 'U',
        fullName,
        email: user.email,
        phone: profile.phone || 'N/A',
        ordersCount,
        lifetimeSpend,
        aov,
        wishlistCount,
        reviewsCount,
        couponsCount: user.couponUsages?.length || 0,
        status: user.status,
        createdAt: new Date(user.createdAt).toLocaleDateString(),
        raw: user,
      };
    });
  }, [data]);

  return (
    <div className="space-y-8 text-left text-white">
      <AdminPageHeader
        title="Customer Directory"
        description="Inspect registered customer profiles, total transaction values, reward accounts, and orders count."
      />

      <AdminCard>
        <AdminTable<SafeAny>
          isLoading={loading}
          columns={[
            {
              key: 'avatar',
              label: 'User',
              render: (row) => (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF4D00]/20 bg-[#FF4D00]/10 text-xs font-bold text-[#FF4D00]">
                  {row.avatar}
                </div>
              ),
            },
            { key: 'fullName', label: 'Full Name', sortable: true },
            { key: 'email', label: 'Email Address', sortable: true },
            { key: 'phone', label: 'Phone Number' },
            {
              key: 'ordersCount',
              label: 'Orders Count',
              sortable: true,
              render: (row) => (
                <span className="font-num font-semibold">{row.ordersCount} transactions</span>
              ),
            },
            {
              key: 'lifetimeSpend',
              label: 'Lifetime Spend',
              sortable: true,
              render: (row) => (
                <span className="font-num font-bold text-[#FF4D00]">
                  ${Number(row.lifetimeSpend).toLocaleString('en-US')}
                </span>
              ),
            },
            {
              key: 'aov',
              label: 'Average Order Value',
              sortable: true,
              render: (row) => (
                <span className="font-num font-bold text-zinc-300">
                  ${Number(row.aov).toLocaleString('en-US')}
                </span>
              ),
            },
            {
              key: 'wishlistCount',
              label: 'Wishlist items',
              sortable: true,
              render: (row) => (
                <span className="font-num font-semibold">{row.wishlistCount} items</span>
              ),
            },
            {
              key: 'reviewsCount',
              label: 'Reviews',
              sortable: true,
              render: (row) => (
                <span className="font-num font-semibold">{row.reviewsCount} reviews</span>
              ),
            },
            {
              key: 'couponsCount',
              label: 'Coupons Used',
              sortable: true,
              render: (row) => (
                <span className="font-num font-semibold">{row.couponsCount} claims</span>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => {
                const colors: SafeAny = {
                  ACTIVE: 'bg-green-500/10 border-green-500/20 text-green-500',
                  SUSPENDED: 'bg-red-500/10 border-red-500/20 text-red-500',
                  INACTIVE: 'bg-zinc-800 border-white/5 text-zinc-500',
                };
                return (
                  <span
                    className={`rounded-[3px] border px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${colors[row.status] || colors.INACTIVE}`}
                  >
                    {row.status}
                  </span>
                );
              },
            },
            { key: 'createdAt', label: 'Customer Since', sortable: true },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/customers/${row.id}`}
                    className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 transition-all hover:border-white hover:text-white"
                    title="View Details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleStatusToggle(row.id, row.status)}
                    className="cursor-pointer rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 transition-all hover:border-white hover:text-white"
                    title={row.status === UserStatus.ACTIVE ? 'Suspend User' : 'Activate User'}
                  >
                    {row.status === UserStatus.ACTIVE ? (
                      <UserX className="h-3.5 w-3.5 text-red-500" />
                    ) : (
                      <UserCheck className="h-3.5 w-3.5 text-green-500" />
                    )}
                  </button>
                </div>
              ),
            },
          ]}
          data={tableData}
          searchPlaceholder="Search customers by name or email..."
        />
      </AdminCard>
    </div>
  );
}
export const dynamic = 'force-dynamic';
