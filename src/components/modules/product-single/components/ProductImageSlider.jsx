"use client";

import { useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function ProductImageSlider({
  gallery,
  hasUserImages,
  dotBgColor,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images =
    gallery && gallery.length > 0
      ? gallery
      : [
          "/assets/images/fallback/phone.png",
          "/assets/images/fallback/phone.png",
          "/assets/images/fallback/phone.png",
        ];

  const [sliderRef, instanceRef] = useKeenSlider({
    rtl: true,
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <div className="w-full">
      {/* Slider Container */}
      <div ref={sliderRef} className="keen-slider">
        {images.map((image, index) => (
          <div key={index} className="keen-slider__slide">
            <div className="relative w-full h-[280px] lg:h-[480px]">
              <Image
                src={image}
                fill
                alt={`Product image ${index + 1}`}
                className="object-contain"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bullet Points */}
      <div className="-translate-y-4 flex items-center justify-center gap-2 lg:gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => instanceRef.current?.moveToIdx(index)}
            className={`w-[10px] h-[10px] lg:w-3 lg:h-3 rounded-full transition-all ${
              currentSlide === index
                ? "bg-primary w-5! lg:w-6!"
                : `${dotBgColor ?? "bg-gray-400"}`
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      {hasUserImages && (
        <button className="block lg:hidden text-primary w-full text-center mt-4">
          تصاویر ارسال شده توسط کاربران
        </button>
      )}
    </div>
  );
}
