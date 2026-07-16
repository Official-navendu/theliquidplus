'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getProductByIdAction, deleteProductAction } from '@/features/catalog/actions/product';
import { AdminPageHeader, AdminCard, AdminSection } from '@/components/admin/AdminLayoutPrimitives';
import { AdminLoading, AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import { Edit3, Trash, ArrowLeft, Image as ImageIcon, Percent, ShieldCheck, Layers, FileText } from 'lucide-react';
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
  const [product, setProduct] = React.useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
      } catch (err) {
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
    } catch (err) {
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
  const stockQty = baseVariant.inventoryItem?.quantity || 0;
  const categoriesList = product.productCategories?.map((pc: any) => pc.category?.name).join(', ') || 'Uncategorized';
  const collectionsList = product.productCollections?.map((pc: any) => pc.collection?.name).join(', ') || 'None';

  return (
    <div className="space-y-8 text-white text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            <Link href="/admin/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-[#FF4D00]">Details</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-white mt-1">
            {product.title}
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 border border-white/10 hover:border-white rounded-xl transition-all flex items-center space-x-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <Link
            href={`/admin/products/${productId}/edit`}
            className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-white text-white rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Product</span>
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="px-4 py-2.5 bg-red-950/20 border border-red-500/30 hover:border-red-500 text-red-500 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash className="h-4 w-4" />
            <span>Archive</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Visual Media, Details, Variants */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Images Section */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Product Images Gallery
            </h4>
            {product.images?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {product.images.map((img: any, idx: number) => (
                  <div key={img.id || idx} className="border border-white/10 bg-black p-2 rounded-xl">
                    <div className="h-28 w-full relative bg-[#111] rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={img.url} alt={img.altText || ''} className="h-full w-full object-contain" />
                    </div>
                    {img.altText && (
                      <span className="text-[9px] text-zinc-500 truncate block mt-1.5 text-center">
                        {img.altText}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-white/5 bg-black/10 rounded-xl text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                No visual assets linked to this product.
              </div>
            )}
          </AdminCard>

          {/* Variants Table Matrix */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Variants Dimensional Matrix
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                    <th className="p-3">SKU</th>
                    <th className="p-3">Attributes</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {product.variants?.map((v: any) => {
                    const attrs = v.variantAttributes?.map((va: any) => `${va.attributeValue?.attribute?.name}: ${va.attributeValue?.value}`).join(', ') || 'Base Option';
                    return (
                      <tr key={v.id} className="hover:bg-white/5 transition-all">
                        <td className="p-3 font-mono text-zinc-300">{v.sku}</td>
                        <td className="p-3 text-zinc-400 font-semibold">{attrs}</td>
                        <td className="p-3 font-num font-bold text-[#FF4D00]">${Number(v.price).toLocaleString('en-US')}</td>
                        <td className="p-3 font-num font-bold text-zinc-300">{v.inventoryItem?.quantity || 0} units</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider ${v.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-zinc-800 text-zinc-500 border border-white/5'}`}>
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
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Configuration Audit Trail
            </h4>
            <div className="space-y-3">
              {[
                { action: 'Product Created', user: 'Admin Ledger', date: new Date(product.createdAt).toLocaleString(), desc: 'Initial database record instantiation and schema seeding.' },
                { action: 'Variants Synced', user: 'Inventory Ledger', date: new Date(product.updatedAt).toLocaleString(), desc: 'Updated stock reserves and pricing adjustments.' },
              ].map((log, idx) => (
                <div key={idx} className="flex justify-between items-start text-[10px] border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-300 block">{log.action}</span>
                    <span className="text-zinc-500 font-light block">{log.desc}</span>
                  </div>
                  <div className="text-right text-zinc-500 font-medium">
                    <span className="block">{log.user}</span>
                    <span className="text-[8px] block mt-0.5 font-light">{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Right 1 Column: General Info, Pricing, Inventory Summary, SEO */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* General Metadata Info Card */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Product Summary
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className="font-black text-[#FF4D00] uppercase tracking-wider">{product.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Brand Name:</span>
                <span className="font-bold text-zinc-300">{product.brand?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Categories:</span>
                <span className="font-bold text-zinc-300 text-right max-w-[150px] truncate" title={categoriesList}>
                  {categoriesList}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Collections:</span>
                <span className="font-bold text-zinc-300 text-right max-w-[150px] truncate" title={collectionsList}>
                  {collectionsList}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Physical Type:</span>
                <span className="font-bold text-zinc-300">{product.isPhysical ? 'Physical Asset' : 'Digital Product'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Featured Placement:</span>
                <span className="font-bold text-zinc-300">{product.isFeatured ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </AdminCard>

          {/* Pricing Analysis */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              Commercial Ledger
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Base Price:</span>
                <span className="font-bold text-white font-num">${Number(baseVariant.price || 0).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Compare Price:</span>
                <span className="font-bold text-zinc-400 line-through font-num">
                  {baseVariant.comparePrice ? `$${Number(baseVariant.comparePrice).toLocaleString('en-US')}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Cost Price:</span>
                <span className="font-bold text-zinc-300 font-num">
                  {baseVariant.costPrice ? `$${Number(baseVariant.costPrice).toLocaleString('en-US')}` : 'N/A'}
                </span>
              </div>
              {baseVariant.price && baseVariant.costPrice && (
                <div className="flex justify-between border-t border-white/5 pt-2 text-[#FF4D00] font-bold">
                  <span>Gross Profit Margin:</span>
                  <span className="font-num">
                    {Math.round(((baseVariant.price - baseVariant.costPrice) / baseVariant.price) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </AdminCard>

          {/* SEO Performance Options */}
          <AdminCard className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
              SEO Engine Metadata
            </h4>
            {product.seo ? (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">Meta Title</span>
                  <span className="text-zinc-300 block font-semibold">{product.seo.metaTitle || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">Meta Description</span>
                  <span className="text-zinc-400 block font-light leading-relaxed">{product.seo.metaDescription || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">Canonical Link</span>
                  <span className="text-zinc-500 block truncate font-mono text-[10px]" title={product.seo.canonicalUrl}>
                    {product.seo.canonicalUrl || 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center border border-dashed border-white/5 bg-black/10 rounded-xl text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
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
