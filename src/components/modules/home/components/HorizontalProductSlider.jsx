"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { NoteIcon, ReceiptIcon, SquarePlusIcon2 } from "@/icons";
import { cn } from "@/lib/client/utils";
import usePublicStore from "@/app/store/publicStore";
import { buildReceiptDataFromStore } from "@/lib/client/receiptData";

export default function HorizontalProductSlider({
  products,
  isSpecialSale,
  store,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const openReceiptDrawer = usePublicStore((s) => s.openReceiptDrawer);

  if (!products?.length) {
    return (
      <p className="text-center text-gray-400 text-sm py-6">
        محصولی موجود نیست
      </p>
    );
  }

  return (
    <div className="w-full">
      <Swiper
        dir="rtl"
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={8}
        grabCursor={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="py-1"
      >
        {products.map((product, idx) => (
          <SwiperSlide
            key={product.id}
            className="flex! items-center! justify-center! h-auto!"
          >
            <div
              className={cn(
                "flex flex-col gap-3 items-center p-[10px] border-3 border-gray-200 rounded-xl transition-all duration-300 w-full",
                activeIndex === idx ? "h-full" : "h-[90%]",
              )}
            >
              <div
                className={cn(
                  "transition-opacity duration-300 flex flex-col gap-3 items-center w-full",
                  activeIndex === idx ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="relative w-[200px] h-[200px]">
                  <Image
                    src={product.img || "/assets/images/fallback/no-photo.jpg"}
                    fill
                    alt={product.name}
                    className="object-cover rounded-md"
                  />
                  {isSpecialSale && product?.discountPercent > 0 && (
                    <span className="absolute bottom-2 left-2 bg-error-medium text-white text-sm font-bold px-2 py-0.5 rounded-full">
                      {product.discountPercent}٪
                    </span>
                  )}
                </div>

                <div className="w-[80%] h-[2.5px] bg-gray-200" />

                <p className="font-bold text-gray-600 text-center line-clamp-1">
                  {product.name}
                </p>

                {isSpecialSale ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <span className="text-gray-400 line-through">
                      از {Number(product.price).toLocaleString("fa-IR")} تومان
                    </span>
                    <span className="font-bold text-gray-600">
                      از{" "}
                      {product.formattedPrice ||
                        Number(product.finalPrice).toLocaleString("fa-IR")}{" "}
                      تومان
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <p className="text-gray-600">
                      <span className="font-bold">وضعیت</span>:{" "}
                      {product.orderHistory?.statusLabel ?? "نامشخص"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-bold">تعداد</span>: ۱ عدد
                    </p>
                    <button className="flex justify-center items-center gap-2 text-primary border-2 border-gray-200 rounded-full py-2 w-full">
                      <NoteIcon size={20} />
                      یادداشت
                    </button>
                  </div>
                )}

                {isSpecialSale && (
                  <Link
                    href="#"
                    className="w-full py-2 text-primary rounded-full border-2 border-primary hover:bg-primary/5 transition text-center flex items-center justify-center gap-2"
                  >
                    <SquarePlusIcon2 size={20} />
                    <span>ثبت سفارش</span>
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {products.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {products.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => swiperRef.current?.slideTo(idx)}
              className={cn(
                "h-3 rounded-full transition-all",
                activeIndex === idx ? "bg-primary w-6" : "bg-gray-300 w-3",
              )}
              aria-label={`محصول ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {!isSpecialSale && (
        <button
          type="button"
          onClick={() =>
            openReceiptDrawer(buildReceiptDataFromStore(store, products))
          }
          className="mx-[50px] mt-3 flex w-[calc(100%-100px)] items-center justify-center gap-2 rounded-full border-2 border-primary py-2 text-center text-primary transition hover:bg-primary/5"
        >
          <ReceiptIcon size={20} />
          <span>رسید تحویل</span>
        </button>
      )}
    </div>
  );
}
