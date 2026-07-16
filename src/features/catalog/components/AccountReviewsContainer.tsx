'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, ReviewInput } from '../schemas/customer';
import { getReviewsAction, submitReviewAction } from '../actions/customer';
import { toast } from 'sonner';
import { Star, MessageSquare } from 'lucide-react';
import { PRODUCTS } from '../constants/products';

interface Review {
  id: string;
  productName: string;
  rating: number;
  title: string;
  comment: string;
  status: string;
  createdAt: Date;
}

export function AccountReviewsContainer() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAddReview, setShowAddReview] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId: '',
      rating: 5,
      title: '',
      comment: '',
    },
  });

  const selectedRating = watch('rating');

  const loadReviews = React.useCallback(async () => {
    setIsLoading(true);
    const res = await getReviewsAction();
    if (res.success && res.data) {
      setReviews(res.data);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const onSubmit = async (data: ReviewInput) => {
    const res = await submitReviewAction(data);
    if (res.success) {
      toast.success('Review submitted successfully! Pending moderation approval.');
      setShowAddReview(false);
      reset();
      loadReviews();
    } else {
      toast.error(res.error?.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="border border-white/5 bg-[#0a0a0a] p-8 rounded-xl space-y-6 text-left animate-pulse">
        <div className="h-4 bg-white/5 w-1/4 rounded" />
        <div className="h-10 bg-white/5 w-full rounded" />
        <div className="h-10 bg-white/5 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="border border-white/5 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl space-y-6 text-left text-white animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">My Product Reviews</h3>
          <p className="text-[10px] text-[#B5B5B5] font-light mt-1">Manage your ratings, submit detailed comments, and edit feedback.</p>
        </div>
        <button
          onClick={() => setShowAddReview(!showAddReview)}
          className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white py-2.5 px-5 text-[9px] tracking-widest font-black uppercase transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer rounded-xl"
        >
          {showAddReview ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showAddReview && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-black p-5 border border-white/5 rounded-lg space-y-4 text-xs">
          <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">Write a Product Review</h4>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Select Product</label>
              <select
                {...register('productId')}
                className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white rounded outline-none focus:border-[#FF4D00] cursor-pointer"
              >
                <option value="">Choose a product from your orders...</option>
                {PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
              {errors.productId && <span className="text-[9px] text-red-500 block">{errors.productId.message}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5] block">Rating</label>
              <div className="flex space-x-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue('rating', star)}
                    className="p-1 text-[#B5B5B5] hover:text-amber-400 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <Star className={`h-6 w-6 ${star <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-[#B5B5B5]'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Review Title</label>
              <input
                type="text"
                placeholder="Summarize your experience..."
                {...register('title')}
                className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white rounded outline-none focus:border-[#FF4D00]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Review Comments</label>
              <textarea
                placeholder="Share your detailed feedback about the performance, glaze duration, or coating application..."
                rows={4}
                {...register('comment')}
                className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white rounded outline-none focus:border-[#FF4D00] resize-none"
              />
              {errors.comment && <span className="text-[9px] text-red-500 block">{errors.comment.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white py-3 text-[10px] tracking-widest font-black uppercase transition-colors rounded-xl cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-[#B5B5B5] text-xs flex flex-col items-center justify-center space-y-2">
          <MessageSquare className="h-6 w-6 text-[#B5B5B5]" />
          <span>You haven&apos;t written any reviews yet. Share your feedback on purchased products!</span>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="border border-white/5 bg-black p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#E5E5E5]">{rev.productName}</h4>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-[#B5B5B5]'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider ${
                  rev.status === 'APPROVED'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                    : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                }`}>
                  {rev.status}
                </span>
              </div>

              <div className="text-xs text-[#E5E5E5]">
                {rev.title && <p className="font-semibold text-white mb-1">{rev.title}</p>}
                <p className="font-light leading-relaxed">{rev.comment}</p>
              </div>

              <span className="text-[9px] text-[#B5B5B5] block uppercase">
                Submitted on {new Date(rev.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AccountReviewsContainer;
