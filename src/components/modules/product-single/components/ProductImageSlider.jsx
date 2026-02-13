"use client";

import { useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function ProductImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
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
            <div className="relative w-full h-[480px]">
              <Image
                src={image}
                fill
                alt={`Product image ${index + 1}`}
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bullet Points */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => instanceRef.current?.moveToIdx(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? "bg-primary w-6" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
