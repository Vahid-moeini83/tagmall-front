"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { ChevronDownIcon, ChevronUpIcon, NoteIcon } from "@/icons";
import { DialogWrapper } from "@/components/ui/dialog";
import { cn } from "@/lib/client/utils";

// ─── کارت محصولات هر فروشگاه ─────────────────────────────────────────────────
function StoreProductsCardComponent({
  products,
  filterMode,
  isSpecialSale,
  onNoteOpen,
  isActive,
  sliderHeight,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dragStartY = useRef(null);
  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  const goTo = useCallback(
    (idx) => {
      const clamped = Math.max(0, Math.min(idx, products.length - 1));
      setCurrentIndex(clamped);
    },
    [products.length],
  );

  const handleDragStart = (clientY, clientX) => {
    dragStartY.current = clientY;
    dragStartX.current = clientX;
    isDragging.current = false;
  };

  const handleDragEnd = (clientY, clientX) => {
    if (dragStartY.current === null) return;
    const deltaY = dragStartY.current - clientY;
    const deltaX = Math.abs(dragStartX.current - clientX);

    // اگر حرکت بیشتر از 10 پیکسل بود، drag محسوب میشه
    if (Math.abs(deltaY) > 10 || deltaX > 10) {
      isDragging.current = true;
    }

    dragStartY.current = null;
    dragStartX.current = null;

    if (Math.abs(deltaY) < 30 || deltaX > Math.abs(deltaY)) return;
    if (deltaY > 0) goTo(currentIndex + 1);
    else goTo(currentIndex - 1);
  };

  const handleClick = (e) => {
    // اگر drag بود، لینک رو باز نکن
    if (isDragging.current) {
      e.preventDefault();
      isDragging.current = false;
    }
  };

  const cardHeight = isActive ? sliderHeight : Math.round(sliderHeight * 0.8);

  return (
    <Link
      href="/products/2"
      onClick={handleClick}
      className="relative w-full transition-all duration-300 flex items-center justify-center"
      style={{ height: cardHeight }}
    >
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ height: cardHeight }}
        onMouseDown={(e) => handleDragStart(e.clientY, e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientY, e.clientX)}
        onTouchStart={(e) =>
          handleDragStart(e.touches[0].clientY, e.touches[0].clientX)
        }
        onTouchEnd={(e) =>
          handleDragEnd(
            e.changedTouches[0].clientY,
            e.changedTouches[0].clientX,
          )
        }
      >
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateY(-${currentIndex * cardHeight}px)`,
            height: `${products.length * cardHeight}px`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-center"
              style={{ height: cardHeight }}
            >
              <div
                className="bg-white flex flex-col gap-3 items-center justify-center rounded-md py-2 px-3 w-full max-w-[360px]"
                style={{ height: cardHeight }}
              >
                <div className="relative rounded-md overflow-hidden">
                  <Image
                    src={product.img || "/assets/images/fallback/no-photo.jpg"}
                    width={124}
                    height={200}
                    alt={product.name}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col w-[85%] items-center justify-center gap-2 border-t border-gray-100 pt-3">
                  <p className="font-bold text-gray-600 text-center text-lg line-clamp-2">
                    {product.name}
                  </p>
                  {isSpecialSale ? (
                    <div className="flex flex-col items-center gap-1 mt-4">
                      {product.finalPrice > 0 ? (
                        <>
                          <span className="font-bold text-gray-600">
                            {product.formattedPrice ||
                              Number(product.finalPrice).toLocaleString(
                                "fa-IR",
                              )}{" "}
                            تومان
                          </span>
                          {product.discountPercent > 0 && (
                            <span className="text-gray-400 line-through text-sm">
                              {Number(product.price).toLocaleString("fa-IR")}{" "}
                              تومان
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="font-bold text-gray-600">
                          قیمت نامشخص
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full bg-gray-50 rounded-lg text-sm py-2 px-4 text-gray-600 mt-2 cursor-pointer">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-4 font-bold">
                          وضعیت: {product.orderHistory?.statusLabel}
                        </div>
                        <div className="flex items-center justify-center gap-4 font-bold">
                          تعداد: 1 عدد
                        </div>
                      </div>
                      {product.orderHistory?.userNote && (
                        <div
                          onClick={() => onNoteOpen?.()}
                          className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-gray-400"
                        >
                          <NoteIcon size={20} />
                          <span className="font-bold">یادداشت</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {isSpecialSale ? (
                  <Link
                    href="#"
                    className="w-full py-2 text-primary font-bold rounded-md hover:bg-primary/5 transition text-center text-sm"
                  >
                    ثبت سفارش
                  </Link>
                ) : (
                  <Link
                    href="#"
                    className="w-full py-2 text-success-medium font-bold rounded-md hover:bg-success-light transition text-center text-sm flex items-center justify-center gap-1"
                  >
                    رسید تحویل سفارش
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isActive && products.length > 1 && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {products.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "w-2.5 rounded-full transition-all cursor-pointer",
                currentIndex === idx
                  ? "bg-primary h-6"
                  : "bg-gray-300 h-2.5 hover:bg-gray-400",
              )}
              aria-label={`محصول ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </Link>
  );
}

const StoreProductsCard = memo(StoreProductsCardComponent);
StoreProductsCard.displayName = "StoreProductsCard";

// ─── کامپوننت اصلی ────────────────────────────────────────────────────────────
export default function ProductsSlider({
  storeProducts,
  onProductChange,
  activeSellerId,
  purchasedProducts,
  activeSellerInfo,
  filterMode,
  scrollContainerRef,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPurchasedSlide, setCurrentPurchasedSlide] = useState(0);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isPurchasedSectionOpen, setIsPurchasedSectionOpen] = useState(false);
  const purchasedSectionRef = useRef(null);

  const isProgrammaticRef = useRef(false);
  const targetIndexRef = useRef(null);

  const sliderHeight = filterMode !== "all" ? 460 : 440;

  // فیلتر کردن فروشگاه‌ها براساس filterMode
  const filteredStores = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) {
      return [];
    }

    if (filterMode === "visit") {
      // فقط فروشگاه‌هایی که سفارش قبلی دارن
      return storeProducts.filter((store) => {
        const hasPurchased = purchasedProducts.some(
          (p) => p.storeId === store.storeId,
        );
        return hasPurchased;
      });
    }

    if (filterMode === "special") {
      // فقط فروشگاه‌هایی که محصول ویژه دارن
      return storeProducts.filter((store) =>
        store.products.some((p) => p.isSpecialSale),
      );
    }

    // all mode - همه فروشگاه‌ها
    return storeProducts;
  }, [storeProducts, filterMode, purchasedProducts]);

  const storeCount = filteredStores.length;
  const isSpecialSale = filterMode === "special" || filterMode === "all";

  const activeSellerPurchasedProducts = useMemo(() => {
    if (!activeSellerId) return [];
    return purchasedProducts.filter((p) => p.storeId === activeSellerId);
  }, [purchasedProducts, activeSellerId]);

  const hasPurchasedProducts = activeSellerPurchasedProducts.length > 0;

  // ── ref برای دسترسی به آخرین نسخه filteredStores در callbacks ──
  const filteredStoresRef = useRef(filteredStores);
  useEffect(() => {
    filteredStoresRef.current = filteredStores;
  });

  const [sliderRef, sliderInstance] = useKeenSlider({
    rtl: true,
    drag: true,
    mode: "snap",
    slides: {
      perView: 1.4,
      origin: "center",
    },
    slideChanged(s) {
      // ── drag توسط کاربر: programmatic نیست ──
      if (isProgrammaticRef.current) return;

      const idx = s.track.details.rel;
      setCurrentSlide(idx);
      const store = filteredStoresRef.current[idx];
      if (store?.products?.length > 0) {
        onProductChange?.(store.products[0]);
      }
    },
    animationEnded() {
      // ✅ sync در مقصد
      if (!isProgrammaticRef.current) return;

      const idx = targetIndexRef.current;
      const store = filteredStoresRef.current[idx];
      if (store?.products?.length > 0) {
        onProductChange?.(store.products[0]);
      }

      isProgrammaticRef.current = false;
      targetIndexRef.current = null;
    },
  });

  const [purchasedSliderRef] = useKeenSlider({
    rtl: true,
    loop: true,
    slides: {
      perView: activeSellerPurchasedProducts.length > 1 ? 1.2 : 1,
      origin: "center",
      spacing: 10,
    },
    slideChanged(s) {
      setCurrentPurchasedSlide(s.track.details.rel);
    },
  });

  // ✅ moveToIdx با true
  const handleClickBulletPoints = useCallback(
    (index) => {
      if (!sliderInstance.current) return;

      setCurrentSlide(index);
      const store = filteredStoresRef.current[index];
      if (store?.products?.length > 0) {
        onProductChange?.(store.products[0]);
      }

      isProgrammaticRef.current = true;
      targetIndexRef.current = index;

      sliderInstance.current.moveToIdx(index, true);
    },
    [sliderInstance, onProductChange],
  );

  // ── sync از خارج (activeSellerId تغییر کرد) ──────────────────────────────
  useEffect(() => {
    if (!sliderInstance.current || !activeSellerId) return;
    const idx = filteredStores.findIndex(
      (store) => store.storeId === activeSellerId,
    );
    if (idx < 0) return;
    const currentIdx = sliderInstance.current.track.details?.rel;
    if (currentIdx === idx) return;

    setCurrentSlide(idx);

    isProgrammaticRef.current = true;
    targetIndexRef.current = idx;

    sliderInstance.current.moveToIdx(idx, true);
  }, [activeSellerId, filteredStores, sliderInstance]);

  useEffect(() => {
    if (sliderInstance.current && filteredStores.length > 0) {
      sliderInstance.current.update();
    }
  }, [filteredStores, sliderInstance]);

  useEffect(() => {
    if (
      isPurchasedSectionOpen &&
      purchasedSectionRef.current &&
      scrollContainerRef?.current
    ) {
      const container = scrollContainerRef.current;
      const target = purchasedSectionRef.current;
      const top =
        target.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop;
      requestAnimationFrame(() => {
        container.scrollTo({ top, behavior: "smooth" });
      });
    }
  }, [isPurchasedSectionOpen, scrollContainerRef]);

  if (storeCount === 0) return null;

  return (
    <div className="flex flex-col overflow-y-auto">
      <div className="relative">
        <div
          ref={sliderRef}
          className="keen-slider items-center"
          style={{ height: sliderHeight }}
        >
          {filteredStores.map((store, index) => (
            <div
              key={store.storeId}
              className="keen-slider__slide flex items-center justify-center"
              style={{ height: sliderHeight }}
            >
              <StoreProductsCard
                products={store.products}
                filterMode={filterMode}
                isSpecialSale={isSpecialSale}
                onNoteOpen={() => setIsNoteOpen(true)}
                isActive={currentSlide === index}
                sliderHeight={sliderHeight}
              />
            </div>
          ))}
        </div>

        {storeCount > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10 pointer-events-none">
            {filteredStores.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleClickBulletPoints(idx)}
                className={cn(
                  "h-3 rounded-full transition-all cursor-pointer pointer-events-auto",
                  currentSlide === idx
                    ? "bg-primary w-6"
                    : "bg-gray-300 w-3 hover:bg-gray-400",
                )}
                aria-label={`فروشگاه ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {filterMode === "all" && (
        <div className="mt-4 shrink-0">
          <div
            className={cn(
              "flex items-center justify-between border-t-3 border-white pt-4 shrink-0 hover:bg-white/10 transition-colors rounded-b-md px-2",
              hasPurchasedProducts ? "cursor-pointer" : "",
            )}
            onClick={() => {
              if (!hasPurchasedProducts) return;
              setIsPurchasedSectionOpen((prev) => !prev);
            }}
          >
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "font-bold text-sm xl:text-base",
                  hasPurchasedProducts ? "text-primary" : "text-gray-400",
                )}
              >
                سفارشات از {activeSellerInfo.name}
              </span>
              {hasPurchasedProducts && (
                <span className="text-gray-400">(بروزرسانی 1 دقیقه پیش)</span>
              )}
            </div>
            {hasPurchasedProducts &&
              (isPurchasedSectionOpen ? (
                <ChevronUpIcon className="text-primary" />
              ) : (
                <ChevronDownIcon className="text-primary" />
              ))}
          </div>
        </div>
      )}

      {isPurchasedSectionOpen && (
        <div ref={purchasedSectionRef} className="shrink-0 mt-6">
          <div
            ref={purchasedSliderRef}
            className="keen-slider"
            style={{ height: 440 }}
          >
            {activeSellerPurchasedProducts.map((product, index) => (
              <div
                key={product.id}
                className="keen-slider__slide flex items-center justify-center"
                style={{ height: 440 }}
              >
                <div
                  className={cn(
                    "bg-white flex flex-col gap-3 items-center justify-center rounded-xl py-2 px-3 w-full transition-all",
                    currentPurchasedSlide === index
                      ? "h-full mx-6 max-w-[396px]"
                      : "h-[80%]",
                  )}
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={
                        product.img || "/assets/images/fallback/no-photo.jpg"
                      }
                      width={124}
                      height={200}
                      alt={product.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col w-[85%] items-center justify-center gap-2 border-t border-gray-100 pt-3">
                    <p className="font-bold text-gray-600 text-center text-lg line-clamp-2">
                      {product.name}
                    </p>
                    <div className="w-full bg-gray-50 rounded-lg text-sm py-2 px-4 text-gray-600 mt-2">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-4 font-bold">
                          وضعیت: {product.orderHistory?.statusLabel}
                        </div>
                        <div className="flex items-center justify-center gap-4 font-bold">
                          تعداد: 1 عدد
                        </div>
                      </div>
                      {product.orderHistory?.userNote && (
                        <div
                          onClick={() => setIsNoteOpen(true)}
                          className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-gray-400 cursor-pointer"
                        >
                          <NoteIcon size={20} />
                          <span className="font-bold">یادداشت</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href="#"
                    className="w-full py-2 text-success-medium font-bold rounded-md hover:bg-success-light transition text-center text-sm flex items-center justify-center gap-1"
                  >
                    رسید تحویل سفارش
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
