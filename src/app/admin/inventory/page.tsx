'use client';

import * as React from 'react';
import { getInventoryAction, updateStockAction } from '@/features/catalog/actions/inventory';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Edit3, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminInventoryPage() {
  const [data, setData] = React.useState<SafeAny[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editQty, setEditQty] = React.useState<number>(0);
  const [saving, setSaving] = React.useState(false);

  const loadInventory = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getInventoryAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to query inventory ledger');
      }
    } catch {
      toast.error('Failed to communicate with inventory database ledger');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleEdit = (id: string, currentQty: number) => {
    setEditingId(id);
    setEditQty(currentQty);
  };

  const handleSave = async (variantId: string) => {
    setSaving(true);
    try {
      const res = await updateStockAction(variantId, editQty);
      if (res.success) {
        toast.success('Stock count adjusted successfully');
        setEditingId(null);
        loadInventory();
      } else {
        toast.error(res.error?.message || 'Failed to update stock');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSaving(false);
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((v) => ({
      id: v.id,
      sku: v.sku,
      productName: v.product?.title || 'Unknown Product',
      price: v.price,
      stock: v.inventoryItem?.quantity || 0,
    }));
  }, [data]);

  return (
    <div className="space-y-8 text-left text-white">
      <AdminPageHeader
        title="Stock & Inventory Control"
        description="Monitor real-time warehouse stock reserves, adjust product quantities, and audit variants allocations."
      />

      <AdminCard>
        <AdminTable<SafeAny>
          isLoading={loading}
          columns={[
            { key: 'sku', label: 'SKU Code', sortable: true },
            { key: 'productName', label: 'Product Name', sortable: true },
            {
              key: 'price',
              label: 'Price',
              sortable: true,
              render: (row) => (
                <span className="font-num">${Number(row.price).toLocaleString()}</span>
              ),
            },
            {
              key: 'stock',
              label: 'Stock Quantity',
              sortable: true,
              render: (row) => (
                <div className="flex items-center space-x-3">
                  {editingId === row.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editQty}
                        onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-20 rounded border border-white/20 bg-black px-2 py-1 text-xs text-white outline-none"
                      />
                      <button
                        onClick={() => handleSave(row.id)}
                        disabled={saving}
                        className="cursor-pointer rounded border-0 bg-[#FF4D00] p-1 text-white hover:bg-[#E04400] disabled:opacity-50"
                        title="Save Stock"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        disabled={saving}
                        className="cursor-pointer rounded border border-white/10 bg-zinc-900 p-1 text-zinc-400 hover:text-white"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`font-num font-bold ${row.stock <= 5 ? 'text-[#FF4D00]' : 'text-zinc-300'}`}
                      >
                        {row.stock} units
                      </span>
                      <button
                        onClick={() => handleEdit(row.id, row.stock)}
                        className="cursor-pointer rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-500 transition-all hover:border-white hover:text-white"
                        title="Adjust Quantity"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ),
            },
          ]}
          data={tableData}
          searchPlaceholder="Search inventory by SKU or product name..."
        />
      </AdminCard>
    </div>
  );
}
export const dynamic = 'force-dynamic';
