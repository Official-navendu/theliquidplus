'use client';

import * as React from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: { url: string }[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  const defaultImage = 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600';
  const mainImageUrl = images[activeIndex]?.url || defaultImage;

  return (
    <div className="space-y-4">
      {/* Main Image in 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] w-full bg-white border border-zinc-200/80 rounded-[20px] overflow-hidden shadow-sm flex items-center justify-center p-6">
        <Image
          src={mainImageUrl}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                type="button"
                className={`relative aspect-[4/5] bg-white border rounded-xl overflow-hidden p-2 transition-all cursor-pointer outline-none ${
                  isActive
                    ? 'border-[#FF4D00] shadow-[0_0_0_2px_rgba(255,77,0,0.15)] scale-98'
                    : 'border-zinc-200/80 hover:border-zinc-400'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.url}
                    alt={`Gallery ${idx}`}
                    fill
                    sizes="(max-width: 640px) 25vw, 10vw"
                    className="object-contain"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
