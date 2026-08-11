'use client';

import * as React from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 bg-black px-6 text-center text-white">
      <span className="text-6xl font-light text-[#FF4D00]">500</span>
      <h1 className="text-2xl font-light tracking-widest text-zinc-200 uppercase">
        Something Went Wrong
      </h1>
      <p className="max-w-sm text-xs leading-relaxed font-light text-zinc-500">
        An unexpected error occurred while loading this page.
      </p>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => reset()}
          className="cursor-pointer rounded bg-[#FF4D00] px-6 py-3 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-[#FF4D00]/90"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded border border-white/10 px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white/10"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
