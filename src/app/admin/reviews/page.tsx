'use client';

import * as React from 'react';
import { getReviewsAction, updateReviewStatusAction, deleteReviewAction } from '@/features/catalog/actions/review';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Check, X, Trash, Star, MessageSquare, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ReviewStatus } from '@prisma/client';

export default function AdminReviewsPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Filter values
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<ReviewStatus | 'ALL'>('ALL');

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      toast.error('Network request failed');
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((rev) => {
      const profile = rev.user?.customerProfile || {};
      const reviewer = profile.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : rev.user?.email || 'Anonymous Reviewer';
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
    <div className="space-y-8 text-white text-left">
      <AdminPageHeader
        title="Product Reviews & Ratings"
        description="Audit storefront customer feedback comments, approve verified user ratings, and inspect media galleries."
      />

      <AdminCard>
        <AdminTable<any>
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
                <div className="space-y-1 max-w-sm">
                  <span className="font-bold text-zinc-300 block">{row.title}</span>
                  <p className="text-zinc-500 font-light text-[10px] leading-relaxed line-clamp-2">
                    {row.comment}
                  </p>
                  {row.images.length > 0 && (
                    <div className="flex items-center space-x-1 mt-1 text-zinc-600">
                      <ImageIcon className="h-3 w-3" />
                      <span className="text-[8px] uppercase tracking-wider font-bold">
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
                const colors: any = {
                  APPROVED: 'bg-green-500/10 border-green-500/20 text-green-500',
                  REJECTED: 'bg-red-500/10 border-red-500/20 text-red-500',
                  PENDING: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
                };
                return (
                  <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${colors[row.status] || colors.PENDING}`}>
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
                        className="p-1 bg-green-950/20 border border-green-500/30 hover:border-green-500 text-green-500 rounded cursor-pointer"
                        title="Approve Review"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(row.id, ReviewStatus.REJECTED)}
                        className="p-1 bg-red-950/20 border border-red-500/30 hover:border-red-500 text-red-500 rounded cursor-pointer"
                        title="Reject Review"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="p-1 bg-zinc-900 border border-white/5 hover:border-red-500 rounded text-zinc-400 hover:text-red-500 cursor-pointer"
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
