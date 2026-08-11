'use client';

import * as React from 'react';
import {
  getBrandsAction,
  createBrandAction,
  updateBrandAction,
  deleteBrandAction,
} from '@/features/catalog/actions/brand';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Plus, Trash, Edit3, Image as ImageIcon, Award } from 'lucide-react';
import { toast } from 'sonner';
import { AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import { useForm } from 'react-hook-form';

export default function AdminBrandsPage() {
  const [data, setData] = React.useState<SafeAny[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<SafeAny>(null);

  // Confirm delete states
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [_isDeleting, setIsDeleting] = React.useState(false);

  const { register, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      logoUrl: '',
      description: '',
      isActive: true,
      seoTitle: '',
      seoDescription: '',
    },
  });

  const watchName = watch('name');

  // Auto slug
  React.useEffect(() => {
    if (watchName && !editingBrand) {
      setValue(
        'slug',
        watchName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      );
    }
  }, [watchName, setValue, editingBrand]);

  const loadBrands = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBrandsAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to query brands catalog');
      }
    } catch {
      toast.error('Failed to communicate with catalog database ledger');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const handleEditClick = (brand: SafeAny) => {
    setEditingBrand(brand);
    reset({
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl || '',
      description: brand.description || '',
      isActive: brand.isActive !== undefined ? brand.isActive : true,
      seoTitle: brand.seoTitle || '',
      seoDescription: brand.seoDescription || '',
    });
    setEditorOpen(true);
  };

  const handleCreateClick = () => {
    setEditingBrand(null);
    reset({
      name: '',
      slug: '',
      logoUrl: '',
      description: '',
      isActive: true,
      seoTitle: '',
      seoDescription: '',
    });
    setEditorOpen(true);
  };

  const onSubmit = async (formValues: SafeAny) => {
    try {
      let res;
      if (editingBrand) {
        res = await updateBrandAction(editingBrand.id, formValues);
      } else {
        res = await createBrandAction(formValues);
      }

      if (res.success) {
        toast.success(editingBrand ? 'Brand updated successfully' : 'Brand created successfully');
        setEditorOpen(false);
        loadBrands();
      } else {
        toast.error(res.error?.message || 'Failed to save brand details');
      }
    } catch {
      toast.error('Error submitting brand details to ledger');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteBrandAction(deleteTarget);
      if (res.success) {
        toast.success('Brand deleted successfully');
        loadBrands();
      } else {
        toast.error(res.error?.message || 'Failed to delete brand');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Simulate logo file selection
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setValue('logoUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const tableData = React.useMemo(() => {
    return data.map((brand) => ({
      id: brand.id,
      logoUrl: brand.logoUrl || '',
      name: brand.name,
      slug: brand.slug,
      productCount: brand.products?.length || 0,
      status: brand.isActive ? 'Active' : 'Inactive',
      raw: brand,
    }));
  }, [data]);

  return (
    <div className="space-y-8 text-left text-white">
      <AdminPageHeader
        title="Automotive Brands"
        description="Manage premium laboratory manufacturers and partner detailers catalog lists."
        actions={
          <button
            onClick={handleCreateClick}
            className="flex cursor-pointer items-center space-x-1.5 rounded-xl border-0 bg-[#FF4D00] px-5 py-2.5 text-[10px] font-bold tracking-wider text-white uppercase transition-all hover:bg-[#E04400]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Brand</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Table list */}
        <div className="lg:col-span-2">
          <AdminCard>
            <AdminTable<SafeAny>
              isLoading={loading}
              columns={[
                {
                  key: 'logoUrl',
                  label: 'Logo',
                  render: (row) => (
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-zinc-900">
                      {row.logoUrl ? (
                        <img
                          src={row.logoUrl}
                          alt={row.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4.5 w-4.5 text-zinc-600" />
                      )}
                    </div>
                  ),
                },
                { key: 'name', label: 'Brand Name', sortable: true },
                { key: 'slug', label: 'Slug Url' },
                {
                  key: 'productCount',
                  label: 'Products',
                  sortable: true,
                  render: (row) => (
                    <span className="font-num font-semibold text-zinc-300">
                      {row.productCount} products
                    </span>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => (
                    <span
                      className={`rounded-[3px] border px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${row.status === 'Active' ? 'border-green-500/20 bg-green-500/10 text-green-500' : 'border-white/5 bg-zinc-800 text-zinc-500'}`}
                    >
                      {row.status}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(row.raw)}
                        className="cursor-pointer rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 transition-all hover:border-white hover:text-white"
                        title="Edit Brand"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(row.id)}
                        className="cursor-pointer rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 transition-all hover:border-red-500 hover:text-red-500"
                        title="Delete Brand"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={tableData}
              searchPlaceholder="Search automotive brands..."
            />
          </AdminCard>
        </div>

        {/* Right 1 Column: Inline Editor Panel */}
        {editorOpen ? (
          <div className="space-y-6 rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 lg:col-span-1">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                {editingBrand ? 'Edit Brand' : 'Create Brand'}
              </h3>
              <button
                onClick={() => setEditorOpen(false)}
                className="cursor-pointer border-0 bg-transparent text-[9px] tracking-wider text-zinc-400 uppercase hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Brand Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[#FF4D00]"
                  placeholder="CarPro"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Slug URL
                </label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Brand Logo
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-zinc-900">
                    {watch('logoUrl') ? (
                      <img
                        src={watch('logoUrl')!}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-zinc-600" />
                    )}
                  </div>
                  <label className="cursor-pointer rounded border border-white/10 bg-zinc-900 px-3 py-1.5 text-[9px] font-bold tracking-wider text-white uppercase select-none hover:border-white">
                    <span>Choose Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Status
                </label>
                <select
                  {...register('isActive', {
                    setValueAs: (val) => val === 'true',
                  })}
                  className="w-full cursor-pointer rounded-lg border border-white/10 bg-black px-3 py-2 text-white outline-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* SEO Tags */}
              <div className="space-y-3 border-t border-white/5 pt-3">
                <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">
                  Search Engine Optimization
                </span>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase">Meta Title</label>
                  <input
                    type="text"
                    {...register('seoTitle')}
                    className="w-full rounded-lg border border-white/10 bg-black px-3 py-1.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase">
                    Meta Description
                  </label>
                  <textarea
                    {...register('seoDescription')}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-white/10 bg-black px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full cursor-pointer rounded-xl border-0 bg-[#FF4D00] py-2.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-[#E04400]"
              >
                Save Brand
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-zinc-500 lg:col-span-1">
            <Award className="h-8 w-8 text-zinc-600" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Select a partner manufacturer to edit, or click add brand to link new formulas
            </span>
          </div>
        )}
      </div>

      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Partner Manufacturer"
        message="Are you sure you want to delete this brand? This will remove all catalog brand links. Products using this brand will fall back to 'Unbranded'."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
export const dynamic = 'force-dynamic';
