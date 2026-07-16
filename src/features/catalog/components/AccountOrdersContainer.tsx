'use client';

import * as React from 'react';
import { getOrdersAction } from '../actions/customer';
import { Search, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  invoiceRef: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: Date;
  itemsCount: number;
}

export function AccountOrdersContainer() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [sortOrder, setSortOrder] = React.useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  React.useEffect(() => {
    async function loadData() {
      const res = await getOrdersAction();
      if (res.success && res.data) {
        setOrders(res.data);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredOrders = React.useMemo(() => {
    return orders
      .filter((o) => {
        const matchesSearch = o.invoiceRef.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [orders, search, statusFilter, sortOrder]);

  const paginatedOrders = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="border border-white/5 bg-[#0a0a0a] p-8 rounded-xl space-y-6 text-left animate-pulse">
        <div className="h-4 bg-white/5 w-1/4 rounded" />
        <div className="h-10 bg-white/5 w-full rounded" />
        <div className="h-10 bg-white/5 w-full rounded" />
      </div>
    );
  }

  const statuses = ['ALL', ...Array.from(new Set(orders.map((o) => o.status)))];

  return (
    <div className="border border-white/5 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl space-y-6 text-left text-white">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">My Purchase Orders</h3>
        <p className="text-[10px] text-[#B5B5B5] font-light mt-1">Review your invoices, download receipts, and track dispatch transit states.</p>
      </div>

      {/* Search, Filter, Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch sm:items-center text-xs">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#B5B5B5]" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black border border-white/10 text-white pl-10 pr-4 py-3 rounded outline-none focus:border-[#FF4D00]"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-black border border-white/10 text-white px-4 py-3 rounded outline-none focus:border-[#FF4D00] cursor-pointer"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Statuses' : status}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="bg-black border border-white/10 text-white px-4 py-3 rounded outline-none flex items-center space-x-1.5 cursor-pointer hover:border-[#FF4D00]"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Date: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-[#B5B5B5] border border-dashed border-white/5 rounded-xl">
          No matching orders found.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-[#B5B5B5]">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Order Date</th>
                  <th className="pb-3 font-bold">Order Status</th>
                  <th className="pb-3 font-bold">Payment</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-[#E5E5E5]">{order.invoiceRef}</td>
                    <td className="py-4 text-[#B5B5B5]">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-black uppercase tracking-wider ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                          : 'bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[#FF4D00]'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-[#B5B5B5]">{order.paymentStatus}</td>
                    <td className="py-4 font-bold text-[#E5E5E5]">
                      {order.total.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-block py-1.5 px-3 border border-white/10 hover:border-[#FF4D00] rounded text-[9px] tracking-wider uppercase font-bold text-[#B5B5B5] hover:text-white transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[10px] uppercase font-bold tracking-wider text-[#B5B5B5]">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="py-2 px-4 border border-white/10 hover:border-white disabled:opacity-30 disabled:hover:border-white/10 rounded transition-all cursor-pointer bg-transparent text-white"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="py-2 px-4 border border-white/10 hover:border-white disabled:opacity-30 disabled:hover:border-white/10 rounded transition-all cursor-pointer bg-transparent text-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default AccountOrdersContainer;
