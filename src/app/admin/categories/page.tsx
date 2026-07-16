'use client';

import * as React from 'react';
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/features/catalog/actions/category';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Plus, Trash, Edit3, ShieldAlert, Folder, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import { useForm } from 'react-hook-form';

export default function AdminCategoriesPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any>(null);
  
  // Confirm delete states
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { register, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      parentId: '',
      status: true,
      sortOrder: 0,
      seoTitle: '',
      seoDescription: '',
    },
  });

  const watchName = watch('name');

  // Auto slug
  React.useEffect(() => {
    if (watchName && !editingCategory) {
      setValue('slug', watchName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [watchName, setValue, editingCategory]);

  const loadCategories = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategoriesAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to query categories taxonomy');
      }
    } catch (err) {
      toast.error('Failed to communicate with catalog categories database');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleEditClick = (cat: any) => {
    setEditingCategory(cat);
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      parentId: cat.parentId || '',
      status: cat.status !== undefined ? cat.status : true,
      sortOrder: cat.sortOrder || 0,
      seoTitle: cat.seo?.metaTitle || '',
      seoDescription: cat.seo?.metaDescription || '',
    });
    setEditorOpen(true);
  };

  const handleCreateClick = () => {
    setEditingCategory(null);
    reset({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      parentId: '',
      status: true,
      sortOrder: 0,
      seoTitle: '',
      seoDescription: '',
    });
    setEditorOpen(true);
  };

  const onSubmit = async (formValues: any) => {
    try {
      const payload = {
        ...formValues,
        parentId: formValues.parentId === '' ? null : formValues.parentId,
        sortOrder: Number(formValues.sortOrder) || 0,
      };

      let res;
      if (editingCategory) {
        res = await updateCategoryAction(editingCategory.id, payload);
      } else {
        res = await createCategoryAction(payload);
      }

      if (res.success) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
        setEditorOpen(false);
        loadCategories();
      } else {
        toast.error(res.error?.message || 'Failed to save category product details');
      }
    } catch (err) {
      toast.error('Error submitting category details to ledger');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteCategoryAction(deleteTarget);
      if (res.success) {
        toast.success('Category deleted successfully');
        loadCategories();
      } else {
        toast.error(res.error?.message || 'Failed to delete category');
      }
    } catch (err) {
      toast.error('Network request failed');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parent: cat.parent?.name || 'Root Category',
      sortOrder: cat.sortOrder,
      productCount: cat._count?.productCategories || 0,
      status: cat.status ? 'Active' : 'Inactive',
      raw: cat,
    }));
  }, [data]);

  return (
    <div className="space-y-8 text-white text-left">
      <AdminPageHeader
        title="Product Categories"
        description="Configure dynamic nested product taxonomies, hierarchies and routing configurations."
        actions={
          <button
            onClick={handleCreateClick}
            className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Table View */}
        <div className="lg:col-span-2">
          <AdminCard>
            <AdminTable<any>
              isLoading={loading}
              columns={[
                { key: 'name', label: 'Category Name', sortable: true },
                { key: 'slug', label: 'Slug Url' },
                { key: 'parent', label: 'Parent Layer', sortable: true },
                {
                  key: 'productCount',
                  label: 'Linked Products',
                  sortable: true,
                  render: (row) => <span className="font-num font-semibold">{row.productCount} products</span>,
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${row.status === 'Active' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-zinc-800 border-white/5 text-zinc-500'}`}>
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
                        className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(row.id)}
                        className="p-1.5 bg-zinc-900 border border-white/5 hover:border-red-500 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={tableData}
              searchPlaceholder="Search categories catalog..."
            />
          </AdminCard>
        </div>

        {/* Right 1 Column: Slider / Inline Editor Panel */}
        {editorOpen ? (
          <div className="lg:col-span-1 border border-white/5 bg-[#0a0a0a] p-6 rounded-2xl space-y-6">
            <div className="border-b border-white/5 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setEditorOpen(false)}
                className="text-[9px] uppercase tracking-wider text-zinc-400 hover:text-white cursor-pointer bg-transparent border-0"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Category Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00]"
                  placeholder="Ceramic Coatings"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Slug URL</label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Parent Category</label>
                <select
                  {...register('parentId')}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none cursor-pointer"
                >
                  <option value="">None (Root Category)</option>
                  {data
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Description</label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Sort Order</label>
                  <input
                    type="number"
                    {...register('sortOrder')}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Status</label>
                  <select
                    {...register('status', {
                      setValueAs: (val) => val === 'true',
                    })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* SEO Sub-section */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-black">Search Engine Optimization</span>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-zinc-400 font-bold">Meta Title</label>
                  <input
                    type="text"
                    {...register('seoTitle')}
                    className="w-full bg-black border border-white/10 text-white px-3 py-1.5 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-zinc-400 font-bold">Meta Description</label>
                  <textarea
                    {...register('seoDescription')}
                    rows={2}
                    className="w-full bg-black border border-white/10 text-white px-3 py-1.5 rounded-lg resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 mt-2"
              >
                Save Category
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-1 border border-dashed border-white/10 bg-black/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 text-zinc-500">
            <Folder className="h-8 w-8 text-zinc-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Select a category to edit, or click add category to configure taxonomies</span>
          </div>
        )}
      </div>

      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category Layer"
        message="Are you sure you want to delete this category? This action is permanent and will delete child sub-categories as well. Linked products will lose this category reference."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
export const dynamic = 'force-dynamic';
