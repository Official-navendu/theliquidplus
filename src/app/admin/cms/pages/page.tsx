'use client';

import * as React from 'react';
import { getPagesAction, deletePageAction } from '@/features/catalog/actions/cms';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Plus, Trash, Edit3, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import Link from 'next/link';

export default function AdminCmsPagesPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadPages = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPagesAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to query CMS pages');
      }
    } catch (err) {
      toast.error('Failed to communicate with CMS database ledger');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPages();
  }, [loadPages]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deletePageAction(deleteTarget);
      if (res.success) {
        toast.success('Page deleted successfully');
        loadPages();
      } else {
        toast.error(res.error?.message || 'Failed to delete page');
      }
    } catch (err) {
      toast.error('Network request failed');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.isActive ? 'Active' : 'Inactive',
      raw: p,
    }));
  }, [data]);

  return (
    <div className="space-y-8 text-white text-left">
      <AdminPageHeader
        title="CRM Static Pages"
        description="Configure company profiles, policy pages, terms statements and custom landing pages."
        actions={
          <Link
            href="/admin/cms/pages/new"
            className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Page</span>
          </Link>
        }
      />

      <AdminCard>
        <AdminTable<any>
          isLoading={loading}
          columns={[
            { key: 'title', label: 'Page Title', sortable: true },
            { key: 'slug', label: 'Slug Url' },
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
                  <Link
                    href={`/admin/cms/pages/${row.id}`}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="View Page Content"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/admin/cms/pages/${row.id}/edit`}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="Edit Page"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(row.id)}
                    className="p-1.5 bg-zinc-900 border border-white/5 hover:border-red-500 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                    title="Delete Page"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ),
            },
          ]}
          data={tableData}
          searchPlaceholder="Search static pages catalog..."
        />
      </AdminCard>

      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Static Page"
        message="Are you sure you want to delete this static page? Any active storefront links mapped to this slug URL will return a 404 error."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
export const dynamic = 'force-dynamic';
