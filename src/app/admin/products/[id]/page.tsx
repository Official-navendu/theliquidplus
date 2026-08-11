'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getProductByIdAction, deleteProductAction } from '@/features/catalog/actions/product';
import { AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminLoading, AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import { Edit3, Trash, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminProductDetailsPage({ params }: ProductDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [loading, setLoading] = React.useState(true);
  const [product, setProduct] = React.useState<SafeAny>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [_isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    async function loadProduct() {
      try {
        const res = await getProductByIdAction(productId);
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          toast.error(res.error?.message || 'Failed to locate product ledger record');
          router.push('/admin/products');
        }
      } catch {
        toast.error('Failed to communicate with catalog database ledger');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteProductAction(productId, true);
      if (res.success) {
        toast.success('Product archived successfully (Soft Deleted)');
        router.push('/admin/products');
      } else {
        toast.error(res.error?.message || 'Failed to archive product');
      }
    } catch {
      toast.error('Error submitting product deletion request');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  const baseVariant = product.variants?.[0] || {};
  const _stockQty = baseVariant.inventoryItem?.quantity || 0;
  const categoriesList =
    product.productCategories?.map((pc: SafeAny) => pc.category?.name).join(', ') ||
    'Uncategorized';
  const collectionsList =
    product.productCollections?.map((pc: SafeAny) => pc.collection?.name).join(', ') || 'None';

  return (
    <div className="space-y-8 text-left text-white">
      <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
            <Link href="/admin/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <span>/</span>
            <span className="text-[#FF4D00]">Details</span>
          </div>
          <h2 className="mt-1 text-xl font-light tracking-widest text-white uppercase sm:text-2xl">
            {product.title}
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-bold tracking-wider uppercase">
          <Link
            href="/admin/products"
            className="flex items-center space-x-1.5 rounded-xl border border-white/10 px-4 py-2.5 transition-all hover:border-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <Link
            href={`/admin/products/${productId}/edit`}
            className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-white transition-all hover:border-white"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Product</span>
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="flex cursor-pointer items-center space-x-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-2.5 text-red-500 transition-all hover:border-red-500"
          >
            <Trash className="h-4 w-4" />
            <span>Archive</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Visual Media, Details, Variants */}
        <div className="space-y-8 lg:col-span-2">
          {/* Images Section */}
          <AdminCard className="space-y-4">
            <h4 className="border-b border-white/5 pb-2 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
              Product Images Gallery
            </h4>
            {product.images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {product.images.map((img: SafeAny, idx: number) => (
                  <div
                    key={img.id || idx}
                    className="rounded-xl border border-white/10 bg-black p-2"
                  >
                    <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-[#111]">
                      <img
                        src={img.url}
                        alt={img.altText || ''}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    {img.altText && (
                      <span className="mt-1.5 block truncate text-center text-[9px] text-zinc-500">
                        {img.altText}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/5 bg-black/10 py-8 text-center text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                No visual assets linked to this product.
              </div>
            )}
          </AdminCard>

          {/* Variants Table Matrix */}
          <AdminCard className="space-y-4">
            <h4 className="border-b border-white/5 pb-2 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
              Variants Dimensional Matrix
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                    <th className="p-3">SKU</th>
                    <th className="p-3">Attributes</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {product.variants?.map((v: SafeAny) => {
                    const attrs =
                      v.variantAttributes
                        ?.map(
                          (va: SafeAny) =>
                            `${va.attributeValue?.attribute?.name}: ${va.attributeValue?.value}`,
                        )
                        .join(', ') || 'Base Option';
                    return (
                      <tr key={v.id} className="transition-all hover:bg-white/5">
                        <td className="p-3 font-mono text-zinc-300">{v.sku}</td>
                        <td className="p-3 font-semibold text-zinc-400">{attrs}</td>
                        <td className="font-num p-3 font-bold text-[#FF4D00]">
                          ${Number(v.price).toLocaleString('en-US')}
                        </td>
                        <td className="font-num p-3 font-bold text-zinc-300">
                          {v.inventoryItem?.quantity || 0} units
                        </td>
                        <td className="p-3">
                          <span
                            className={`rounded-[3px] px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${v.isActive ? 'border border-green-500/20 bg-green-500/10 text-green-500' : 'border border-white/5 bg-zinc-800 text-zinc-500'}`}
                          >
                            {v.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AdminCard>

          {/* Audit Logs Placeholder */}
          <AdminCard className="space-y-4">
            <h4 className="border-b border-white/5 pb-2 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
              Configuration Audit Trail
            </h4>
            <div className="space-y-3">
              {[
                {
                  action: 'Product Created',
                  user: 'Admin Ledger',
                  date: new Date(product.createdAt).toLocaleString(),
                  desc: 'Initial database record instantiation and schema seeding.',
                },
                {
                  action: 'Variants Synced',
                  user: 'Inventory Ledger',
                  date: new Date(product.updatedAt).toLocaleString(),
                  desc: 'Updated stock reserves and pricing adjustments.',
                },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between border-b border-white/5 pb-3 text-[10px] last:border-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <span className="block font-bold text-zinc-300">{log.action}</span>
                    <span className="block font-light text-zinc-500">{log.desc}</span>
                  </div>
                  <div className="text-right font-medium text-zinc-500">
                    <span className="block">{log.user}</span>
                    <span className="mt-0.5 block text-[8px] font-light">{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Right 1 Column: General Info, Pricing, Inventory Summary, SEO */}
        <div className="space-y-8 lg:col-span-1">
          {/* General Metadata Info Card */}
          <AdminCard className="space-y-4">
            <h4 className="border-b border-white/5 pb-2 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
              Product Summary
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className="font-black tracking-wider text-[#FF4D00] uppercase">
                  {product.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Brand Name:</span>
                <span className="font-bold text-zinc-300">{product.brand?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Categories:</span>
                <span
                  className="max-w-[150px] truncate text-right font-bold text-zinc-300"
                  title={categoriesList}
                >
                  {categoriesList}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Collections:</span>
                <span
                  className="max-w-[150px] truncate text-right font-bold text-zinc-300"
                  title={collectionsList}
                >
                  {collectionsList}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Physical Type:</span>
                <span className="font-bold text-zinc-300">
                  {product.isPhysical ? 'Physical Asset' : 'Digital Product'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Featured Placement:</span>
                <span className="font-bold text-zinc-300">
                  {product.isFeatured ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </AdminCard>

          {/* Pricing Analysis */}
          <AdminCard className="space-y-4">
            <h4 className="border-b border-white/5 pb-2 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
              Commercial Ledger
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Base Price:</span>
                <span className="font-num font-bold text-white">
                  ${Number(baseVariant.price || 0).toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Compare Price:</span>
                <span className="font-num font-bold text-zinc-400 line-through">
                  {baseVariant.comparePrice
                    ? `$${Number(baseVariant.comparePrice).toLocaleString('en-US')}`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Cost Price:</span>
                <span className="font-num font-bold text-zinc-300">
                  {baseVariant.costPrice
                    ? `$${Number(baseVariant.costPrice).toLocaleString('en-US')}`
                    : 'N/A'}
                </span>
              </div>
              {baseVariant.price && baseVariant.costPrice && (
                <div className="flex justify-between border-t border-white/5 pt-2 font-bold text-[#FF4D00]">
                  <span>Gross Profit Margin:</span>
                  <span className="font-num">
                    {Math.round(
                      ((baseVariant.price - baseVariant.costPrice) / baseVariant.price) * 100,
                    )}
                    %
                  </span>
                </div>
              )}
            </div>
          </AdminCard>

          {/* SEO Performance Options */}
          <AdminCard className="space-y-4">
            <h4 className="border-b border-white/5 pb-2 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
              SEO Engine Metadata
            </h4>
            {product.seo ? (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase">
                    Meta Title
                  </span>
                  <span className="block font-semibold text-zinc-300">
                    {product.seo.metaTitle || 'N/A'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase">
                    Meta Description
                  </span>
                  <span className="block leading-relaxed font-light text-zinc-400">
                    {product.seo.metaDescription || 'N/A'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase">
                    Canonical Link
                  </span>
                  <span
                    className="block truncate font-mono text-[10px] text-zinc-500"
                    title={product.seo.canonicalUrl}
                  >
                    {product.seo.canonicalUrl || 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/5 bg-black/10 py-4 text-center text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                No custom SEO indexing rules defined.
              </div>
            )}
          </AdminCard>
        </div>
      </div>

      {/* Confirmation delete modal */}
      <AdminConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
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
