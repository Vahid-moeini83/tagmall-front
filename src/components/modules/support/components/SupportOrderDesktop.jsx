"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ReceiptIcon, VerifyIcon } from "@/icons";
import { cn, formatRelativeTime } from "@/lib/client/utils";
import usePublicStore from "@/app/store/publicStore";

export default function SupportOrderDesktop({ order }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const items = order.items || [];
  const openReceiptDrawer = usePublicStore((s) => s.openReceiptDrawer);

  const handleOpenReceipt = () => {
    openReceiptDrawer({
      orderId: order.order_id ?? order.id ?? null,
      status: order.items?.[0]?.status ?? "آماده تحویل",
      lastUpdate: formatRelativeTime(order.created_at),
      itemsCount: items.length,
      seller: {
        sellerName: order.store_name ?? "فروشگاه",
        sellerAvatar: order.store_avatar ?? "/assets/images/fallback/avatar.png",
      },
      items: items.map((item) => ({
        id: String(item.id),
        product_name: item.product_name,
        quantity: item.quantity ?? 1,
        image: item.image ?? "/assets/images/fallback/no-photo.jpg",
        status: item.status ?? "آماده تحویل",
        updated_at: item.updated_at ?? order.created_at,
      })),
    });
  };

  const handleBulletClick = (index) => {
    swiperRef.current?.slideTo(index);
    setActiveIndex(index);
  };

  return (
    <div className="w-full">
      <Swiper
        dir="rtl"
        nested
        slidesPerView={1}
        spaceBetween={5}
        centeredSlides={false}
        grabCursor={items.length > 1}
        allowTouchMove={items.length > 1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full overflow-hidden"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="w-full! overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="flex justify-center items-center">
                <div className="relative w-50 h-50 rounded-lg overflow-hidden">
                  <Image
                    src={
                      item.image ?? "/assets/images/fallback/no-photo.jpg"
                    }
                    fill
                    sizes="200px"
                    alt={item.product_name}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap-8 pl-8">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        order.store_avatar ??
                        "/assets/images/fallback/avatar.png"
                      }
                      width={48}
                      height={48}
                      alt="seller"
                      className="rounded-lg object-cover"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {order.store_name}
                      </span>
                      <VerifyIcon size={20} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenReceipt}
                    className="cursor-pointer"
                    aria-label="نمایش رسید تحویل"
                  >
                    <ReceiptIcon size={20} />
                  </button>
                </div>

                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-600 line-clamp-1 mb-0!">
                      {item.product_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="font-bold">تعداد</span>
                    <span>{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">وضعیت</span>
                      <span>{item.status}</span>
                    </div>
                    <span className="text-gray-400">
                      بروزرسانی{" "}
                      {formatRelativeTime(
                        item.updated_at ?? order.created_at,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {items.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleBulletClick(idx)}
              aria-label={`محصول ${idx + 1}`}
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
