"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { XmarkCircleIcon, AngleLeftCircleIcon } from "@/icons";

export default function DesktopStoreGalleryModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  currentIndex,
  onIndexChange,
}) {
  const activeIndex = currentIndex ?? initialIndex;

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    const nextIdx = (activeIndex - 1 + images.length) % images.length;
    onIndexChange?.(nextIdx);
  }, [activeIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    const nextIdx = (activeIndex + 1) % images.length;
    onIndexChange?.(nextIdx);
  }, [activeIndex, images.length, onIndexChange]);

  // Keyboard navigation & Esc listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="گالری تصاویر فروشگاه"
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-inverted/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close button at top-left (Figma 32x32 at x:64, y:64) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن گالری"
        className="absolute top-16 left-16 z-20 text-surface hover:opacity-80 transition-opacity cursor-pointer"
      >
        <XmarkCircleIcon size={32} className="text-surface" />
      </button>

      {/* Centered Gallery Card & Nav Controls (Figma 357x692) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-89.25 h-173 max-w-4xl max-h-full rounded-3xl border-2 border-surface overflow-hidden shadow-modal bg-surface flex flex-col items-center justify-center"
      >
        {/* Active Store Image */}
        <Image
          src={images[activeIndex] || "/assets/images/home/sampleMap.jpg"}
          alt={`تصویر فروشگاه ${activeIndex + 1}`}
          fill
          priority
          className="object-cover"
        />

        {/* Floating Prev / Next Arrow Controls */}
        <div className="absolute inset-x-[-4rem] top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none px-2">
          {/* Next / Left arrow (in RTL) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="تصویر قبلی"
            className="pointer-events-auto size-8 rounded-circle bg-surface/20 border border-surface/40 backdrop-blur-md flex items-center justify-center text-surface hover:bg-surface/40 transition-all cursor-pointer shadow-card"
          >
            <AngleLeftCircleIcon size={28} className="text-surface" />
          </button>

          {/* Prev / Right arrow (in RTL) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="تصویر بعدی"
            className="pointer-events-auto size-8 rounded-circle bg-surface/20 border border-surface/40 backdrop-blur-md flex items-center justify-center text-surface hover:bg-surface/40 transition-all cursor-pointer rotate-180 shadow-card"
          >
            <AngleLeftCircleIcon size={28} className="text-surface" />
          </button>
        </div>

        {/* Bottom Pagination Dots (Figma 65x10 at bottom of card) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-surface-inverted/40 backdrop-blur-xs px-3 py-1.5 rounded-pill">
          {images.map((_, idx) =>
            idx === activeIndex ? (
              <div
                key={idx}
                className="w-5 h-2.5 rounded-pill bg-surface transition-all duration-300"
              />
            ) : (
              <button
                key={idx}
                type="button"
                onClick={() => onIndexChange?.(idx)}
                aria-label={`رفتن به تصویر ${idx + 1}`}
                className="size-2.5 rounded-circle bg-text-muted hover:bg-surface transition-all duration-300 cursor-pointer"
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
