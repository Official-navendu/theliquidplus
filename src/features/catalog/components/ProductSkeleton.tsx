'use client';

import * as React from 'react';

export function ProductSkeleton() {
  return (
    <div className="flex flex-col space-y-4 bg-[#0a0a0a] p-4 rounded-xl border border-white/5 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] w-full bg-zinc-800/40 rounded-lg" />

      {/* Info Skeletons */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-zinc-800/40 rounded" />
          <div className="h-3 w-20 bg-zinc-800/40 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-zinc-800/40 rounded" />
        <div className="h-3 w-full bg-zinc-800/40 rounded" />
        <div className="h-3 w-1/2 bg-zinc-800/40 rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 w-12 bg-zinc-800/40 rounded" />
          <div className="h-3 w-16 bg-zinc-800/40 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 w-24 bg-zinc-800/40 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-zinc-800/40 rounded" />
            <div className="h-3 w-5/6 bg-zinc-800/40 rounded" />
            <div className="h-3 w-4/5 bg-zinc-800/40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
export default ProductSkeleton;
