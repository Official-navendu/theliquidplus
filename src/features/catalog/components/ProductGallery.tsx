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
        className="relative aspect-square w-full bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group select-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {/* Zoomed State */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
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
        />

        {/* Controls */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="p-3 bg-black/60 hover:bg-[#FF4D00]/20 text-white border border-white/10 hover:border-[#FF4D00]/30 rounded-full"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="p-3 bg-black/60 hover:bg-[#FF4D00]/20 text-white border border-white/10 hover:border-[#FF4D00]/30 rounded-full"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Lightbox Launcher */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 z-20 p-3 bg-black/60 hover:bg-[#FF4D00]/20 text-white border border-white/10 hover:border-[#FF4D00]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="View Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnail Gallery (Supports 8+ Images) */}
      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square w-full rounded-md overflow-hidden bg-[#0a0a0a] border transition-all ${
              activeIndex === index ? 'border-[#FF4D00]' : 'border-white/5 hover:border-white/20'
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover opacity-80 hover:opacity-100 transition-opacity"
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
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 text-zinc-400 hover:text-white p-2 border border-white/10 rounded-full transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Slider Controls */}
            <button
              onClick={prevImage}
              className="absolute left-8 p-4 bg-white/5 hover:bg-[#FF4D00]/10 border border-white/10 hover:border-[#FF4D00]/20 rounded-full text-white transition-colors"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-8 p-4 bg-white/5 hover:bg-[#FF4D00]/10 border border-white/10 hover:border-[#FF4D00]/20 rounded-full text-white transition-colors"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Lightbox Image Container */}
            <div className="relative w-full max-w-4xl h-[80vh]">
              <Image
                src={images[activeIndex]}
                alt="Fullscreen Product View"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ProductGallery;
