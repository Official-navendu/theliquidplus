'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  getProductsAction,
  deleteProductAction,
  bulkDeleteProductsAction,
  bulkUpdateStatusAction,
  getBrandsAndCategoriesAction,
  duplicateProductAction,
  restoreProductAction,
} from '@/features/catalog/actions/product';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Plus, Download, Upload, Trash, FileSpreadsheet, Eye, Edit3, ShieldAlert, Copy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import Link from 'next/link';

export default function AdminProductsPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [setup, setSetup] = React.useState<any>({ brands: [], categories: [], collections: [] });

  // Filters state
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [selectedBrand, setSelectedBrand] = React.useState('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [sortBy, setSortBy] = React.useState('newest');
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(50); // Fetch all to allow AdminTable client filters/sorting/search

  // Confirm delete dialog state
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Load Setup and Products Data
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [setupRes, productsRes] = await Promise.all([
        getBrandsAndCategoriesAction(),
        getProductsAction({
          search,
          category: selectedCategory,
          brand: selectedBrand,
          status: selectedStatus === 'ALL' ? undefined : (selectedStatus as any),
          sortBy,
          page,
          limit,
        }),
      ]);

      if (setupRes.success && setupRes.data) {
        setSetup(setupRes.data);
      }
      if (productsRes.success && productsRes.data) {
        setData(productsRes.data.items);
        setTotal(productsRes.data.total);
      } else {
        toast.error(productsRes.error?.message || 'Failed to query product products ledger');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error retrieving administrative products details');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedBrand, selectedStatus, sortBy, page, limit]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await duplicateProductAction(id);
      if (res.success) {
        toast.success('Product duplicated successfully');
        loadData();
      } else {
        toast.error(res.error?.message || 'Failed to duplicate product');
      }
    } catch (err) {
      toast.error('Network error duplicating product');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await restoreProductAction(id);
      if (res.success) {
        toast.success('Product restored to Draft status');
        loadData();
      } else {
        toast.error(res.error?.message || 'Failed to restore product');
      }
    } catch (err) {
      toast.error('Network error restoring product');
    }
  };

  // Handle single soft delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteProductAction(deleteTarget, true);
      if (res.success) {
        toast.success('Product archived successfully (Soft Deleted)');
        loadData();
      } else {
        toast.error(res.error?.message || 'Failed to archive product');
      }
    } catch (err) {
      toast.error('Failed to communicate product deletion request');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Bulk actions handlers
  const handleBulkDelete = async (selectedIds: Set<string>) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      const res = await bulkDeleteProductsAction(ids);
      if (res.success) {
        toast.success(`Successfully archived ${ids.length} products`);
        loadData();
      } else {
        toast.error(res.error?.message || 'Failed to archive products');
      }
    } catch (err) {
      toast.error('Failed to perform bulk operations');
    }
  };

  const handleBulkStatusChange = async (selectedIds: Set<string>, status: string) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      const res = await bulkUpdateStatusAction(ids, status as any);
      if (res.success) {
        toast.success(`Successfully set status of ${ids.length} products to ${status}`);
        loadData();
      } else {
        toast.error(res.error?.message || 'Failed to update products status');
      }
    } catch (err) {
      toast.error('Failed to perform status adjustment');
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    if (data.length === 0) {
      toast.warning('No product records available for CSV export');
      return;
    }
    const headers = ['ID', 'Title', 'Slug', 'SKU', 'Brand', 'Price (USD)', 'Stock Quantity', 'Status', 'Featured'];
    const rows = data.map((item) => [
      item.id,
      item.title,
      item.slug,
      item.variants?.[0]?.sku || '',
      item.brand?.name || 'N/A',
      item.variants?.[0]?.price || '0',
      item.variants?.[0]?.inventoryItem?.quantity || '0',
      item.status,
      item.isFeatured ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `liquid_plus_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Successfully exported products catalog ledger');
  };

  // CSV Import simulation placeholder
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    toast.info(`CSV parsing simulated. Uploading "${files[0].name}" containing products...`);
    setTimeout(() => {
      toast.success('Mock import complete: Loaded 0 new variants from ledger');
    }, 1500);
  };

  // Format table data row representation
  const tableData = React.useMemo(() => {
    return data.map((item) => ({
      id: item.id,
      image: item.images?.[0]?.url || '',
      title: item.title,
      sku: item.variants?.[0]?.sku || 'N/A',
      brand: item.brand?.name || 'N/A',
      category: item.productCategories?.[0]?.category?.name || 'N/A',
      price: item.variants?.[0]?.price || 0,
      comparePrice: item.variants?.[0]?.comparePrice || null,
      stock: item.variants?.[0]?.inventoryItem?.quantity || 0,
      status: item.status,
      isFeatured: item.isFeatured,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [data]);

  return (
    <div className="space-y-8 text-white text-left">
      <AdminPageHeader
        title="Store Products Catalog"
        description="Configure detailing formulas, pricing strategies, inventory metrics, and variants matrix."
        actions={
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
            {/* Import file label button */}
            <label className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-white text-white rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer select-none">
              <Upload className="h-4 w-4" />
              <span>Import CSV</span>
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
            </label>

            {/* Export button */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-white text-white rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>

            {/* Create launcher link */}
            <Link
              href="/admin/products/new"
              className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Product</span>
            </Link>
          </div>
        }
      />

      <AdminCard>
        {/* Table wrapper */}
        <AdminTable<any>
          isLoading={loading}
          columns={[
            {
              key: 'image',
              label: 'Image',
              render: (row) => (
                <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-white/5 overflow-hidden flex items-center justify-center">
                  {row.image ? (
                    <img src={row.image} alt={row.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-zinc-600">No Img</span>
                  )}
                </div>
              ),
            },
            { key: 'title', label: 'Product Name', sortable: true },
            { key: 'sku', label: 'SKU', sortable: true },
            { key: 'brand', label: 'Brand' },
            { key: 'category', label: 'Category' },
            {
              key: 'price',
              label: 'Price',
              sortable: true,
              render: (row) => (
                <div className="font-num text-xs font-semibold text-white">
                  ${Number(row.price).toLocaleString('en-US')}
                </div>
              ),
            },
            {
              key: 'stock',
              label: 'Stock',
              sortable: true,
              render: (row) => (
                <span className={`font-num text-xs font-bold ${row.stock <= 5 ? 'text-[#FF4D00]' : 'text-zinc-300'}`}>
                  {row.stock} units
                </span>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => {
                const colorMap: any = {
                  ACTIVE: 'bg-green-500/10 border-green-500/20 text-green-500',
                  DRAFT: 'bg-zinc-800 border-white/5 text-zinc-500',
                  REVIEW: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
                  ARCHIVED: 'bg-red-500/10 border-red-500/20 text-red-500',
                };
                return (
                  <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${colorMap[row.status] || colorMap.DRAFT}`}>
                    {row.status}
                  </span>
                );
              },
            },
            { key: 'createdAt', label: 'Created Date', sortable: true },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/products/${row.id}`}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="View Details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/admin/products/${row.id}/edit`}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="Edit Product"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDuplicate(row.id)}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                    title="Duplicate Product"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {row.status === 'ARCHIVED' ? (
                    <button
                      onClick={() => handleRestore(row.id)}
                      className="p-1.5 bg-zinc-900 border border-white/5 hover:border-green-500 rounded-lg text-zinc-400 hover:text-green-500 transition-all cursor-pointer"
                      title="Restore Product"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeleteTarget(row.id)}
                      className="p-1.5 bg-zinc-900 border border-white/5 hover:border-red-500 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                      title="Archive (Soft Delete)"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
          data={tableData}
          searchPlaceholder="Search products by title, SKU, or brand name..."
          bulkActions={(selectedIds, clearSelection) => (
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider">
              <button
                onClick={async () => {
                  await handleBulkStatusChange(selectedIds, 'ACTIVE');
                  clearSelection();
                }}
                className="px-2.5 py-1 bg-zinc-900 border border-white/10 hover:border-white text-white rounded cursor-pointer"
              >
                Publish Selected
              </button>
              <button
                onClick={async () => {
                  await handleBulkStatusChange(selectedIds, 'DRAFT');
                  clearSelection();
                }}
                className="px-2.5 py-1 bg-zinc-900 border border-white/10 hover:border-white text-white rounded cursor-pointer"
              >
                Draft Selected
              </button>
              <button
                onClick={async () => {
                  await handleBulkStatusChange(selectedIds, 'ARCHIVED');
                  clearSelection();
                }}
                className="px-2.5 py-1 bg-zinc-900 border border-white/10 hover:border-white text-white rounded cursor-pointer"
              >
                Archive Selected
              </button>
              <button
                onClick={async () => {
                  await handleBulkDelete(selectedIds);
                  clearSelection();
                }}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer border-0"
              >
                Delete Selected
              </button>
            </div>
          )}
        />
      </AdminCard>

      {/* Confirmation modal */}
      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Archive Product Record"
        message="Are you sure you want to archive this product? This will move the item to 'Archived' status. It won't display to storefront customers but retains its order ledger references."
        confirmText="Archive Item"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
export const dynamic = 'force-dynamic';
