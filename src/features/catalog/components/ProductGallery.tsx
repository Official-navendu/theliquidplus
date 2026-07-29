'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image Viewport */}
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a] select-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {/* Zoomed State */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: isZoomed ? 1 : 0,
            backgroundImage: `url(${images[activeIndex]})`,
            backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
            backgroundSize: '200%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Regular Image */}
        <Image
          src={images[activeIndex]}
          alt="Product Detail Main Shot"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover"
          unoptimized={images[activeIndex]?.startsWith('data:')}
        />

        {/* Controls */}
        <div className="absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="rounded-full border border-white/10 bg-black/60 p-3 text-white hover:border-[#FF4D00]/30 hover:bg-[#FF4D00]/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="rounded-full border border-white/10 bg-black/60 p-3 text-white hover:border-[#FF4D00]/30 hover:bg-[#FF4D00]/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Lightbox Launcher */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute right-4 bottom-4 z-20 rounded-full border border-white/10 bg-black/60 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:border-[#FF4D00]/30 hover:bg-[#FF4D00]/20"
          aria-label="View Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnail Gallery (Supports 8+ Images) */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square w-full overflow-hidden rounded-md border bg-[#0a0a0a] transition-all ${
              activeIndex === index ? 'border-[#FF4D00]' : 'border-white/5 hover:border-white/20'
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover opacity-80 transition-opacity hover:opacity-100"
              unoptimized={img?.startsWith('data:')}
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 rounded-full border border-white/10 p-2 text-zinc-400 transition-colors hover:text-white"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Slider Controls */}
            <button
              onClick={prevImage}
              className="absolute left-8 rounded-full border border-white/10 bg-white/5 p-4 text-white transition-colors hover:border-[#FF4D00]/20 hover:bg-[#FF4D00]/10"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-8 rounded-full border border-white/10 bg-white/5 p-4 text-white transition-colors hover:border-[#FF4D00]/20 hover:bg-[#FF4D00]/10"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Lightbox Image Container */}
            <div className="relative h-[80vh] w-full max-w-4xl">
              <Image
                src={images[activeIndex]}
                alt="Fullscreen Product View"
                fill
                className="object-contain"
                unoptimized={images[activeIndex]?.startsWith('data:')}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ProductGallery;
