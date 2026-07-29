'use client';

import * as React from 'react';
import { Star, ChevronDown, Award, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductAccordionProps {
  description: string;
  reviews: SafeAny[];
  rating: number;
}

export function ProductAccordion({ description, reviews, rating }: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0); // First open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Calculate review rating stats
  const ratingBreakdown = React.useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const rate = Math.min(5, Math.max(1, r.rating || 5));
      counts[rate - 1]++;
    });
    return counts.reverse(); // 5 stars to 1 star
  }, [reviews]);

  return (
    <div className="space-y-4 pt-8">
      {/* 1. Description */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300">
        <button
          onClick={() => toggle(0)}
          type="button"
          className="flex w-full items-center justify-between px-6 py-5 text-left text-xs font-bold tracking-wider text-zinc-800 uppercase transition-colors outline-none hover:bg-zinc-50/50"
        >
          <div className="flex items-center space-x-2.5">
            <Sparkles className="h-4 w-4 text-[#FF4D00]" />
            <span>Product Description</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-zinc-500 transition-transform duration-300 ${openIndex === 0 ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {openIndex === 0 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-4 px-6 pt-2 pb-6 text-xs leading-relaxed font-light text-zinc-600 sm:text-sm">
                <p>{description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Customer Reviews */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300">
        <button
          onClick={() => toggle(1)}
          type="button"
          className="flex w-full items-center justify-between px-6 py-5 text-left text-xs font-bold tracking-wider text-zinc-800 uppercase transition-colors outline-none hover:bg-zinc-50/50"
        >
          <div className="flex items-center space-x-2.5">
            <Award className="h-4 w-4 text-[#FF4D00]" />
            <span>Customer Reviews ({reviews.length})</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-zinc-500 transition-transform duration-300 ${openIndex === 1 ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {openIndex === 1 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-6 px-6 pt-2 pb-6">
                {/* Rating summary layout */}
                <div className="flex flex-col gap-6 border-b border-zinc-100 pb-6 md:flex-row md:items-center">
                  <div className="space-y-1">
                    <span className="text-3xl font-black text-zinc-800">{rating.toFixed(1)}</span>
                    <div className="flex space-x-0.5 text-[#FF4D00]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-current' : 'text-zinc-200'}`}
                        />
                      ))}
                    </div>
                    <span className="block pt-1 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      Based on {reviews.length} reviews
                    </span>
                  </div>

                  {/* Stacking score bars */}
                  <div className="max-w-xs flex-grow space-y-1.5">
                    {ratingBreakdown.map((count, idx) => {
                      const stars = 5 - idx;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-[10px] font-semibold text-zinc-500"
                        >
                          <span className="w-3 text-right">{stars}</span>
                          <span className="text-zinc-300">★</span>
                          <div className="h-1.5 flex-grow overflow-hidden rounded-full bg-zinc-100">
                            <div
                              className="h-full bg-[#FF4D00]"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-6 text-left">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="py-8 text-center text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      No reviews yet for this product. Be the first to share your detailing results!
                    </div>
                  ) : (
                    reviews.map((rev: SafeAny) => {
                      const reviewer = rev.user?.customerProfile?.firstName
                        ? `${rev.user.customerProfile.firstName} ${rev.user.customerProfile.lastName || ''}`.trim()
                        : 'Verified Detailer';
                      return (
                        <div
                          key={rev.id}
                          className="space-y-2 rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-6 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-700">{reviewer}</span>
                            <span className="text-[10px] text-zinc-400">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="font-num flex space-x-0.5 text-[#FF4D00]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-200'}`}
                              />
                            ))}
                          </div>
                          {rev.title && (
                            <span className="block font-bold text-zinc-800">{rev.title}</span>
                          )}
                          <p className="leading-relaxed font-light text-zinc-500">{rev.comment}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. How To Use */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300">
        <button
          onClick={() => toggle(2)}
          type="button"
          className="flex w-full items-center justify-between px-6 py-5 text-left text-xs font-bold tracking-wider text-zinc-800 uppercase transition-colors outline-none hover:bg-zinc-50/50"
        >
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="h-4 w-4 text-[#FF4D00]" />
            <span>How To Use</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-zinc-500 transition-transform duration-300 ${openIndex === 2 ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {openIndex === 2 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-4 px-6 pt-2 pb-6 text-xs leading-relaxed font-light text-zinc-600 sm:text-sm">
                <p>For professional results, follow these application directions:</p>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Shake container thoroughly to mix formulation active agents.</li>
                  <li>Ensure the vehicle surface is completely washed, decontaminated, and dry.</li>
                  <li>Apply a few drops of product onto a microfiber applicator pad.</li>
                  <li>
                    Work in small, overlapping sections (e.g. 50cm x 50cm) to distribute evenly.
                  </li>
                  <li>
                    Allow 1-2 minutes to flash, then gently buff with a clean microfiber towel to a
                    high-gloss slick finish.
                  </li>
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
