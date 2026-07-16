'use client';

import * as React from 'react';
import { getOrdersAction, updateOrderStatusAction } from '@/features/catalog/actions/order';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Eye, ShieldAlert, ShoppingBag, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  // Filters state
  const [search, setSearch] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus | 'ALL'>('ALL');
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(50); // Fetch all to allow AdminTable client filters/sorting/search

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrdersAction({
        search,
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        page,
        limit,
      });

      if (res.success && res.data) {
        setData(res.data.items);
        setTotal(res.data.total);
      } else {
        toast.error(res.error?.message || 'Failed to query orders ledger');
      }
    } catch (err) {
      toast.error('Failed to communicate with orders database ledger');
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus, page, limit]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleBulkStatus = async (selectedIds: Set<string>, status: OrderStatus) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      let succeeded = 0;
      for (const id of ids) {
        const res = await updateOrderStatusAction(id, status, `Bulk state update to ${status.toLowerCase()}`);
        if (res.success) succeeded++;
      }
      toast.success(`Successfully updated status of ${succeeded} orders to ${status.toLowerCase()}`);
      loadOrders();
    } catch (err) {
      toast.error('Failed to perform bulk operations');
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((order) => {
      const profile = order.customer?.customerProfile || {};
      const customerName = profile.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : order.guestEmail || 'Guest Checkouts';
      const payment = order.payments?.[0] || {};
      return {
        id: order.id,
        invoiceRef: order.invoiceRef,
        customerName,
        itemsCount: `${order.orderItems?.length || 0} products`,
        totalAmount: Number(order.totalAmount) || 0,
        paymentStatus: payment.status || 'PENDING',
        status: order.status,
        createdAt: new Date(order.createdAt).toLocaleDateString(),
        raw: order,
      };
    });
  }, [data]);

  return (
    <div className="space-y-8 text-white text-left">
      <AdminPageHeader
        title="Store Orders Ledger"
        description="Inspect storefront transaction requests, track dispatch fulfillment packages, and update order statuses."
      />

      <AdminCard>
        <AdminTable<any>
          isLoading={loading}
          columns={[
            { key: 'invoiceRef', label: 'Invoice Reference', sortable: true },
            { key: 'customerName', label: 'Client / Email', sortable: true },
            { key: 'itemsCount', label: 'Items quantity' },
            {
              key: 'totalAmount',
              label: 'Total Amount',
              sortable: true,
              render: (row) => (
                <span className="font-num font-bold text-[#FF4D00]">
                  ${Number(row.totalAmount).toLocaleString('en-US')}
                </span>
              ),
            },
            {
              key: 'paymentStatus',
              label: 'Payment Status',
              render: (row) => {
                const colors: any = {
                  COMPLETED: 'bg-green-500/10 border-green-500/20 text-green-500',
                  FAILED: 'bg-red-500/10 border-red-500/20 text-red-500',
                  PENDING: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
                };
                return (
                  <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${colors[row.paymentStatus] || colors.PENDING}`}>
                    {row.paymentStatus}
                  </span>
                );
              },
            },
            {
              key: 'status',
              label: 'Order Status',
              render: (row) => {
                const colors: any = {
                  DELIVERED: 'bg-green-500/10 border-green-500/20 text-green-500',
                  SHIPPED: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                  CONFIRMED: 'bg-zinc-800 border-white/5 text-zinc-300',
                  PENDING: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
                  CANCELLED: 'bg-red-500/10 border-red-500/20 text-red-500',
                };
                return (
                  <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${colors[row.status] || colors.PENDING}`}>
                    {row.status}
                  </span>
                );
              },
            },
            { key: 'createdAt', label: 'Order Date', sortable: true },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/orders/${row.id}`}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="View Details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ),
            },
          ]}
          data={tableData}
          searchPlaceholder="Search order invoice refs, client emails..."
          bulkActions={(selectedIds, clearSelection) => (
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider">
              <button
                onClick={async () => {
                  await handleBulkStatus(selectedIds, OrderStatus.CONFIRMED);
                  clearSelection();
                }}
                className="px-2.5 py-1 bg-zinc-900 border border-white/10 hover:border-white text-white rounded cursor-pointer"
              >
                Confirm Selected
              </button>
              <button
                onClick={async () => {
                  await handleBulkStatus(selectedIds, OrderStatus.SHIPPED);
                  clearSelection();
                }}
                className="px-2.5 py-1 bg-zinc-900 border border-white/10 hover:border-white text-white rounded cursor-pointer"
              >
                Ship Selected
              </button>
              <button
                onClick={async () => {
                  await handleBulkStatus(selectedIds, OrderStatus.DELIVERED);
                  clearSelection();
                }}
                className="px-2.5 py-1 bg-zinc-900 border border-white/10 hover:border-white text-[#FF4D00] rounded cursor-pointer"
              >
                Deliver Selected
              </button>
            </div>
          )}
        />
      </AdminCard>
    </div>
  );
}
export const dynamic = 'force-dynamic';
