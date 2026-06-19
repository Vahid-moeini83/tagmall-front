"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  NoteIcon,
  ReceiptIcon,
  SquarePlusIcon2,
  StarIcon,
  VerifyIcon,
} from "@/icons";
import { DialogWrapper } from "@/components/ui/dialog";
import { cn } from "@/lib/client/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── اسلایدر افقی محصولات ───────────────────────────────────────────────────
function HorizontalProductSlider({ products, isSpecialSale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

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
          <SwiperSlide key={product.id} className="flex items-center !h-auto">
            <div
              className={cn(
                "flex flex-col gap-3 items-center p-[10px] border-3 border-gray-200 rounded-xl transition-all duration-300 w-full",
                activeIndex === idx ? "h-full" : "h-[90%]",
              )}
            >
              {/* محتوای داخلی فقط در اسلاید فعال نمایش داده میشه */}
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
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-gray-600">
                      <span className="font-bold">وضعیت</span>:{" "}
                      {product.orderHistory?.statusLabel ?? "نامشخص"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-bold">تعداد</span>: ۱ عدد
                    </p>
                    <div className="flex items-center gap-2 text-primary">
                      <NoteIcon size={20} />
                      یادداشت
                    </div>
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

      {/* Dots pagination */}
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

      {/* دکمه رسید تحویل — فقط در accordion سفارشات */}
      {!isSpecialSale && (
        <Link
          href="#"
          className="mt-3 mx-[50px] py-2 text-primary rounded-full border-2 border-primary hover:bg-primary/5 transition text-center flex items-center justify-center gap-2"
          style={{ width: "calc(100% - 100px)" }}
        >
          <ReceiptIcon size={20} />
          <span>رسید تحویل</span>
        </Link>
      )}
    </div>
  );
}

function StoreSlideCard({ store, storeIdx, activeIndex, isSpecialSale, remainingTime }) {
  const scrollContainerRef = useRef(null);
  const purchasedSectionRef = useRef(null);

  const specialProducts = useMemo(
    () => store.products.filter((p) => p.isSpecialSale),
    [store.products],
  );

  const nonSpecialProducts = useMemo(
    () => store.products.filter((p) => !p.isSpecialSale),
    [store.products],
  );

  const scrollToPurchasedSection = useCallback(() => {
    const container = scrollContainerRef.current;
    const section = purchasedSectionRef.current;
    if (!container || !section) return;

    const top =
      section.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;

    container.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handlePurchasedAccordionChange = useCallback(
    (value) => {
      if (value !== "purchased") return;

      // Wait for accordion expand animation before scrolling
      requestAnimationFrame(() => {
        setTimeout(scrollToPurchasedSection, 220);
      });
    },
    [scrollToPurchasedSection],
  );

  const isSlideActive = activeIndex === storeIdx;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border-3 border-gray-200 flex flex-col overflow-hidden transition-all duration-300 origin-center",
        isSlideActive ? "w-full h-full" : "mx-auto w-[80%] h-[90%]",
      )}
    >
      <div
        className={cn(
          "flex flex-col h-full min-h-0 transition-opacity duration-300",
          isSlideActive ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between px-[50px] pt-[32px] shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative w-[50px] h-[50px] rounded-lg overflow-hidden">
              <Image
                src={
                  store.seller.profileImage ||
                  "/assets/images/fallback/no-photo.jpg"
                }
                fill
                alt={store.seller.name}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-gray-700">
                  {store.storeName || store.seller.name}
                </span>
                <VerifyIcon size={15} />
              </div>
            </div>
          </div>
          {isSpecialSale && remainingTime && (
            <span className="text-error-medium text-lg font-bold tabular-nums">
              {remainingTime}
            </span>
          )}
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {specialProducts.length > 0 && (
          <Accordion type="single" collapsible defaultValue="special">
            <AccordionItem value="special">
              <AccordionTrigger className="flex items-center justify-between pr-[50px] pl-[64px]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-1">
                    <StarIcon className="text-yellow-600 w-3 h-3 mt-0.5" />
                    <span>
                      {store.seller.rating}
                      <span className="text-gray-400 text-sm">/5</span>
                    </span>
                  </div>
                  <span className="text-gray-400">
                    آرا {store.seller.totalReviews}
                  </span>
                </div>
                <span className="font-bold text-error-medium text-lg pl-5">
                  فروش ویژه
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <HorizontalProductSlider
                  products={specialProducts}
                  isSpecialSale={true}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {nonSpecialProducts.length > 0 && (
          <div className="w-[82%] h-[2.5px] bg-gray-200 mx-auto my-3" />
        )}

        {nonSpecialProducts.length > 0 && (
          <div ref={purchasedSectionRef}>
            <Accordion
              type="single"
              collapsible
              onValueChange={handlePurchasedAccordionChange}
            >
              <AccordionItem value="purchased">
                <AccordionTrigger className="flex items-center justify-between pr-[50px] pl-[64px] mb-2">
                  <div></div>
                  <span className="font-bold text-base text-primary pr-4">
                    سفارشات{" "}
                    <span className="font-extralight">(خرید حضوری)</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <HorizontalProductSlider
                    products={nonSpecialProducts}
                    isSpecialSale={false}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

// ─── کامپوننت اصلی ProductsSlider ──────────────────────────────────────────
export default function ProductsSlider({
  storeProducts,
  onProductChange,
  activeSellerId,
  purchasedProducts,
  filterMode,
  remainingTime,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const verticalSwiperRef = useRef(null);

  // فیلتر کردن فروشگاه‌ها براساس filterMode
  const filteredStores = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) return [];

    if (filterMode === "visit") {
      return storeProducts.filter((store) =>
        purchasedProducts.some((p) => p.storeId === store.storeId),
      );
    }

    if (filterMode === "special") {
      return storeProducts.filter((store) =>
        store.products.some((p) => p.isSpecialSale),
      );
    }

    return storeProducts;
  }, [storeProducts, filterMode, purchasedProducts]);

  const storeCount = filteredStores.length;
  const isSpecialSale = filterMode === "special" || filterMode === "all";

  const filteredStoresRef = useRef(filteredStores);
  useEffect(() => {
    filteredStoresRef.current = filteredStores;
  });

  // Keep slider aligned when active store changes from map marker click
  useEffect(() => {
    if (!verticalSwiperRef.current || !activeSellerId) return;
    const idx = filteredStores.findIndex(
      (store) => store.storeId === activeSellerId,
    );
    if (idx < 0 || verticalSwiperRef.current.realIndex === idx) return;
    verticalSwiperRef.current.slideTo(idx, 300);
  }, [activeSellerId, filteredStores]);

  // Reset slide when filter hides the currently active store
  useEffect(() => {
    if (!verticalSwiperRef.current || filteredStores.length === 0) return;
    const isActiveVisible = filteredStores.some(
      (store) => store.storeId === activeSellerId,
    );
    if (isActiveVisible) return;

    verticalSwiperRef.current.slideTo(0, 0);
    const firstStore = filteredStores[0];
    if (firstStore?.products?.length > 0) {
      onProductChange?.(firstStore.products[0]);
    }
  }, [filterMode, filteredStores, activeSellerId, onProductChange]);

  useEffect(() => {
    if (verticalSwiperRef.current && filteredStores.length > 0) {
      verticalSwiperRef.current.update();
    }
  }, [filteredStores]);

  const handleSlideChange = useCallback(
    (swiper) => {
      const idx = swiper.realIndex;
      setActiveIndex(idx);
      const store = filteredStoresRef.current[idx];
      if (store?.products?.length > 0) {
        onProductChange?.(store.products[0]);
      }
    },
    [onProductChange],
  );

  if (storeCount === 0) return null;

  return (
    <div className="flex flex-col h-full">
      <Swiper
        direction="vertical"
        slidesPerView={storeCount === 1 ? 1.04 : 1.16}
        spaceBetween={5}
        centeredSlides={true}
        onSwiper={(swiper) => {
          verticalSwiperRef.current = swiper;
          const stores = filteredStoresRef.current;

          if (activeSellerId) {
            const idx = stores.findIndex(
              (store) => store.storeId === activeSellerId,
            );
            if (idx >= 0) {
              swiper.slideTo(idx, 0);
              return;
            }
          }

          const firstStore = stores[0];
          if (firstStore?.products?.length > 0) {
            onProductChange?.(firstStore.products[0]);
          }
        }}
        onSlideChange={handleSlideChange}
        className="w-full h-full py-2"
      >
        {filteredStores.map((store, storeIdx) => (
          <SwiperSlide key={store.storeId} className="flex items-center">
            <StoreSlideCard
              store={store}
              storeIdx={storeIdx}
              activeIndex={activeIndex}
              isSpecialSale={isSpecialSale}
              remainingTime={remainingTime}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <DialogWrapper
        title={"اسم محصول"}
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
      >
        یادداشت کاربر: لطفا محصول را در بسته بندی تیره قرار دهید. ممنون!
      </DialogWrapper>
    </div>
  );
}
