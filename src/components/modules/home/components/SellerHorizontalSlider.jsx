// SellerHorizontalSlider.jsx
"use client";

import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import { cn } from "@/lib/client/utils";
import ProductCardMobile from "./ProductCardMobile";

export default function SellerHorizontalSlider({
  products,
  closedStateVariant,
  isListMode,
  onSellerClick,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    rtl: true,
    drag: true,
    mode: "snap",
    slides: { perView: 1, spacing: 12 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  if (!products || products.length === 0) return null;

  if (products.length === 1) {
    return (
      <div className="w-full h-full">
        <ProductCardMobile
          product={products[0]}
          variant={closedStateVariant}
          onSellerClick={onSellerClick}
          isListMode={isListMode}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-2">
      <div
        ref={sliderRef}
        className="keen-slider w-full h-full"
        style={{ minHeight: 0 }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="keen-slider__slide"
            style={{ minHeight: 0 }}
          >
            <ProductCardMobile
              product={product}
              variant={closedStateVariant}
              onSellerClick={onSellerClick}
              isListMode={isListMode}
            />
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[10px] z-10 flex justify-center gap-2 pointer-events-none">
        {products.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all cursor-pointer pointer-events-auto",
              currentSlide === idx
                ? "bg-primary w-6"
                : "bg-gray-400 hover:bg-gray-400",
            )}
            aria-label={`اسلاید ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
