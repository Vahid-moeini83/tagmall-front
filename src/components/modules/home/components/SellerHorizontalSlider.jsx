"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { cn } from "@/lib/client/utils";
import ProductCardMobile, {
  ProductCardSellerHeader,
} from "./ProductCardMobile";

export default function SellerHorizontalSlider({
  products,
  closedStateVariant,
  isListMode,
  onSellerClick,
  setIsReviewsModalOpen,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null);
  const sellerProduct = products?.[0];

  if (!products || products.length === 0) return null;

  if (products.length === 1) {
    return (
      <div className="w-full h-full">
        <ProductCardMobile
          product={products[0]}
          variant={closedStateVariant}
          onSellerClick={onSellerClick}
          isListMode={isListMode}
          setIsReviewsModalOpen={setIsReviewsModalOpen}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-2">
      <ProductCardSellerHeader
        product={sellerProduct}
        onSellerClick={onSellerClick}
        isListMode={isListMode}
        setIsReviewsModalOpen={setIsReviewsModalOpen}
      />
      <Swiper
        dir="rtl"
        slidesPerView={1}
        spaceBetween={5}
        grabCursor
        className="w-full h-full min-h-0"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setCurrentSlide(swiper.realIndex);
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex);
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-full! min-h-0">
            <ProductCardMobile
              product={product}
              variant={closedStateVariant}
              onSellerClick={onSellerClick}
              isListMode={isListMode}
              setIsReviewsModalOpen={setIsReviewsModalOpen}
              hideSellerHeader
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-[10px] z-10 flex justify-center gap-2 pointer-events-none">
        {products.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => swiperRef.current?.slideTo(idx)}
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
