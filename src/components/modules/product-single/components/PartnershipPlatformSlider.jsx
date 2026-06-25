"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { cn } from "@/lib/client/utils";

export default function PartnershipPlatformSlider({
  platforms,
  affiliateLink,
  onPlatformSelect,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleShare = (platform) => {
    onPlatformSelect?.(platform);

    if (!affiliateLink || typeof window === "undefined") return;

    const shareUrl = platform.url?.includes("#")
      ? affiliateLink
      : platform.url || affiliateLink;

    if (navigator.share) {
      navigator.share({ title: platform.name, url: shareUrl }).catch(() => {});
      return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleBulletClick = (index) => {
    swiperRef.current?.slideTo(index);
    setActiveIndex(index);
  };

  return (
    <div
      className="w-full flex flex-col items-center gap-4 py-2 overflow-hidden touch-pan-x"
      data-vaul-no-drag
    >
      <Swiper
        dir="rtl"
        nested
        slidesPerView={1}
        spaceBetween={0}
        centeredSlides={false}
        grabCursor
        touchStartPreventDefault={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full overflow-hidden touch-pan-x"
      >
        {platforms.map((platform) => (
          <SwiperSlide
            key={platform.name}
            className="w-full! flex justify-center overflow-hidden"
          >
            <button
              type="button"
              onClick={() => handleShare(platform)}
              className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-full border-2 border-primary bg-white lg:max-w-[540px]"
            >
              <Image
                src={platform.logo}
                width={28}
                height={28}
                alt={platform.name}
                className="object-contain shrink-0"
              />
              <span className="text-gray-800 font-bold text-sm">
                {platform.name}
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {platforms.length > 1 && (
        <div
          className="flex justify-center items-center gap-2"
          data-vaul-no-drag
        >
          {platforms.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleBulletClick(idx)}
              aria-label={`بستر ${idx + 1}`}
              className={cn(
                "rounded-full transition-all cursor-pointer",
                activeIndex === idx
                  ? "bg-primary h-2.5 w-6"
                  : "bg-gray-300 h-2.5 w-2.5",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
