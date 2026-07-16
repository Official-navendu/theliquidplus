'use client';

import * as React from 'react';
import { getBlogPostsAction, deleteBlogPostAction } from '@/features/catalog/actions/cms';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Plus, Trash, Edit3, Eye, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import Link from 'next/link';

export default function AdminBlogPostsPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadBlogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBlogPostsAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to query blog posts');
      }
    } catch (err) {
      toast.error('Failed to communicate with CMS database ledger');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteBlogPostAction(deleteTarget);
      if (res.success) {
        toast.success('Blog post deleted successfully');
        loadBlogs();
      } else {
        toast.error(res.error?.message || 'Failed to delete blog post');
      }
    } catch (err) {
      toast.error('Network request failed');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      status: b.status,
      category: b.category?.name || 'Uncategorized',
      publishedAt: b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : 'Draft',
      raw: b,
    }));
  }, [data]);

  return (
    <div className="space-y-8 text-white text-left">
      <AdminPageHeader
        title="CRM Blog Articles"
        description="Write professional automotive detailing articles, detail instructions guides, and product updates."
        actions={
          <Link
            href="/admin/blog/new"
            className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Article</span>
          </Link>
        }
      />

      <AdminCard>
        <AdminTable<any>
          isLoading={loading}
          columns={[
            { key: 'title', label: 'Article Title', sortable: true },
            { key: 'category', label: 'Category', sortable: true },
            { key: 'slug', label: 'Slug Url' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => {
                const colors: any = {
                  PUBLISHED: 'bg-green-500/10 border-green-500/20 text-green-500',
                  DRAFT: 'bg-zinc-800 border-white/5 text-zinc-500',
                  SCHEDULED: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
                };
                return (
                  <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${colors[row.status] || colors.DRAFT}`}>
                    {row.status}
                  </span>
                );
              },
            },
            { key: 'publishedAt', label: 'Publish Date', sortable: true },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/blog/${row.id}`}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="View Article"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/admin/blog/${row.id}/edit`}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="Edit Article"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(row.id)}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-red-500 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                    title="Delete Article"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ),
            },
          ]}
          data={tableData}
          searchPlaceholder="Search blog articles..."
        />
      </AdminCard>

      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Article"
        message="Are you sure you want to delete this blog post? Any active storefront links mapped to this post will return a 404 error."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
export const dynamic = 'force-dynamic';
