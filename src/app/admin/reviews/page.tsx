'use client';

import * as React from 'react';
import {
  getReviewsAction,
  updateReviewStatusAction,
  deleteReviewAction,
} from '@/features/catalog/actions/review';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Check, X, Trash, Star, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ReviewStatus } from '@prisma/client';

export default function AdminReviewsPage() {
  const [data, setData] = React.useState<SafeAny[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Filter values
  const [search, _setSearch] = React.useState('');
  const [status, _setStatus] = React.useState<ReviewStatus | 'ALL'>('ALL');

  const loadReviews = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReviewsAction({
        status: status === 'ALL' ? undefined : status,
        search,
      });

      if (res.success && res.data) {
        setData(res.data.items);
      } else {
        toast.error(res.error?.message || 'Failed to query product reviews');
      }
    } catch {
      toast.error('Failed to communicate with reviews database ledger');
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  React.useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleUpdateStatus = async (id: string, newStatus: ReviewStatus) => {
    try {
      const res = await updateReviewStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Review ${newStatus.toLowerCase()} successfully`);
        loadReviews();
      } else {
        toast.error(res.error?.message || 'Failed to update review status');
      }
    } catch {
      toast.error('Network request failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteReviewAction(id);
      if (res.success) {
        toast.success('Review deleted successfully from catalog');
        loadReviews();
      } else {
        toast.error(res.error?.message || 'Failed to delete review');
      }
    } catch {
      toast.error('Network request failed');
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((rev) => {
      const profile = rev.user?.customerProfile || {};
      const reviewer = profile.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`.trim()
        : rev.user?.email || 'Anonymous Reviewer';
      return {
        id: rev.id,
        reviewer,
        productName: rev.product?.title || 'Unknown Product',
        rating: rev.rating,
        title: rev.title || 'N/A',
        comment: rev.comment || '',
        status: rev.status,
        createdAt: new Date(rev.createdAt).toLocaleDateString(),
        images: rev.media || [],
        raw: rev,
      };
    });
  }, [data]);

  return (
    <div className="space-y-8 text-left text-white">
      <AdminPageHeader
        title="Product Reviews & Ratings"
        description="Audit storefront customer feedback comments, approve verified user ratings, and inspect media galleries."
      />

      <AdminCard>
        <AdminTable<SafeAny>
          isLoading={loading}
          columns={[
            { key: 'reviewer', label: 'Reviewer', sortable: true },
            { key: 'productName', label: 'Product Item', sortable: true },
            {
              key: 'rating',
              label: 'Rating',
              sortable: true,
              render: (row) => (
                <div className="flex items-center space-x-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3 w-3 ${idx < row.rating ? 'fill-current' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
              ),
            },
            {
              key: 'details',
              label: 'Feedback Comments',
              render: (row) => (
                <div className="max-w-sm space-y-1">
                  <span className="block font-bold text-zinc-300">{row.title}</span>
                  <p className="line-clamp-2 text-[10px] leading-relaxed font-light text-zinc-500">
                    {row.comment}
                  </p>
                  {row.images.length > 0 && (
                    <div className="mt-1 flex items-center space-x-1 text-zinc-600">
                      <ImageIcon className="h-3 w-3" />
                      <span className="text-[8px] font-bold tracking-wider uppercase">
                        {row.images.length} photos linked
                      </span>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => {
                const colors: SafeAny = {
                  APPROVED: 'bg-green-500/10 border-green-500/20 text-green-500',
                  REJECTED: 'bg-red-500/10 border-red-500/20 text-red-500',
                  PENDING: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
                };
                return (
                  <span
                    className={`rounded-[3px] border px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${colors[row.status] || colors.PENDING}`}
                  >
                    {row.status}
                  </span>
                );
              },
            },
            { key: 'createdAt', label: 'Date Posted', sortable: true },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex items-center space-x-2">
                  {row.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(row.id, ReviewStatus.APPROVED)}
                        className="cursor-pointer rounded border border-green-500/30 bg-green-950/20 p-1 text-green-500 hover:border-green-500"
                        title="Approve Review"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(row.id, ReviewStatus.REJECTED)}
                        className="cursor-pointer rounded border border-red-500/30 bg-red-950/20 p-1 text-red-500 hover:border-red-500"
                        title="Reject Review"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="cursor-pointer rounded border border-white/5 bg-zinc-900 p-1 text-zinc-400 hover:border-red-500 hover:text-red-500"
                    title="Delete Review"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ),
            },
          ]}
          data={tableData}
          searchPlaceholder="Search reviewer, products or ratings comments..."
        />
      </AdminCard>
    </div>
  );
}
export const dynamic = 'force-dynamic';
