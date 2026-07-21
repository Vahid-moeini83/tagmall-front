"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ReceiptIcon, VerifyIcon } from "@/icons";
import { cn, formatRelativeTime } from "@/lib/client/utils";
import usePublicStore from "@/app/store/publicStore";

function formatOrderQuantityLine(quantity, productName) {
  if (quantity === 1) {
    return `تعداد یک ${productName}`;
  }

  return `تعداد ${quantity} عدد ${productName}`;
}

export default function SupportOrderCard({ order, isLast = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const items = order.items || [];
  const openReceiptDrawer = usePublicStore((s) => s.openReceiptDrawer);

  const handleOpenReceipt = () => {
    openReceiptDrawer({
      orderId: order.order_id ?? order.id ?? null,
      status: order.items?.[0]?.status ?? "نامشخص",
      lastUpdate: formatRelativeTime(order.created_at),
      itemsCount: items.length,
      seller: {
        sellerName: order.store_name ?? "نامشخص",
        sellerAvatar:
          order.store_avatar ?? "/assets/images/fallback/avatar.png",
      },
      items: items.map((item) => ({
        id: String(item.id),
        product_name: item.product_name,
        quantity: item.quantity ?? 1,
        image: item.image ?? "/assets/images/fallback/no-photo.jpg",
        status: item.status ?? "نامشخص",
        updated_at: item.updated_at ?? order.created_at,
      })),
    });
  };

  const handleBulletClick = (index) => {
    swiperRef.current?.slideTo(index);
    setActiveIndex(index);
  };

  return (
    <div className={`w-full ${isLast ? "" : "border-b-4 border-gray-200"}`}>
      {/* Content keeps side padding; border sits on full-width wrapper */}
      <div className="px-[10px] pb-[10px]">
        <div className="flex items-center justify-between mb-[5px] px-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-[50px] h-[50px] shrink-0 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={order.store_avatar ?? "/assets/images/fallback/avatar.png"}
                alt={order.store_name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-bold text-sm text-gray-600 truncate">
              {order.store_name}
            </span>
            <VerifyIcon size={20} className="shrink-0" />
          </div>

          <button
            type="button"
            onClick={handleOpenReceipt}
            className="cursor-pointer"
            aria-label="نمایش رسید تحویل"
          >
            <ReceiptIcon size={20} className="shrink-0 ml-[10px]" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 p-[5px] w-full overflow-hidden">
          <Swiper
            dir="rtl"
            nested
            slidesPerView={1}
            spaceBetween={0}
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
                <div className="flex items-center gap-4">
                  <div className="relative w-[100px] h-[100px] shrink-0 rounded-xl overflow-hidden bg-gray-50">
                    <Image
                      src={item.image ?? "/assets/images/fallback/no-photo.jpg"}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 text-right space-y-2">
                    <p className="font-bold text-xs text-gray-600 line-clamp-1">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatOrderQuantityLine(
                        item.quantity,
                        item.product_name,
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-bold">وضعیت</span> {item.status}{" "}
                      <span className="text-gray-400">
                        ( به روزرسانی{" "}
                        {formatRelativeTime(
                          item.updated_at ?? order.created_at,
                        )}{" "}
                        )
                      </span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {items.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-0">
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
      </div>
    </div>
  );
}
