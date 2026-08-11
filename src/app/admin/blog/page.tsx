'use client';

import * as React from 'react';
import { getBlogPostsAction, deleteBlogPostAction } from '@/features/catalog/actions/cms';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Plus, Trash, Edit3, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import Link from 'next/link';

export default function AdminBlogPostsPage() {
  const [data, setData] = React.useState<SafeAny[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [_isDeleting, setIsDeleting] = React.useState(false);

  const loadBlogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBlogPostsAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to query blog posts');
      }
    } catch {
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
    } catch {
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
    <div className="space-y-8 text-left text-white">
      <AdminPageHeader
        title="CRM Blog Articles"
        description="Write professional automotive detailing articles, detail instructions guides, and product updates."
        actions={
          <Link
            href="/admin/blog/new"
            className="flex cursor-pointer items-center space-x-1.5 rounded-xl border-0 bg-[#FF4D00] px-5 py-2.5 text-[10px] font-bold tracking-wider text-white uppercase transition-all hover:bg-[#E04400]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Article</span>
          </Link>
        }
      />

      <AdminCard>
        <AdminTable<SafeAny>
          isLoading={loading}
          columns={[
            { key: 'title', label: 'Article Title', sortable: true },
            { key: 'category', label: 'Category', sortable: true },
            { key: 'slug', label: 'Slug Url' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => {
                const colors: SafeAny = {
                  PUBLISHED: 'bg-green-500/10 border-green-500/20 text-green-500',
                  DRAFT: 'bg-zinc-800 border-white/5 text-zinc-500',
                  SCHEDULED: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
                };
                return (
                  <span
                    className={`rounded-[3px] border px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${colors[row.status] || colors.DRAFT}`}
                  >
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
                    className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 transition-all hover:border-white hover:text-white"
                    title="View Article"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/admin/blog/${row.id}/edit`}
                    className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 transition-all hover:border-white hover:text-white"
                    title="Edit Article"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(row.id)}
                    className="cursor-pointer rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 transition-all hover:border-red-500 hover:text-red-500"
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
