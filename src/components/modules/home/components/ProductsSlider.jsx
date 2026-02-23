"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, ChevronUpIcon, NoteIcon } from "@/icons";
import Dialog from "@/components/ui/dialog";

export default function ProductsSlider({
  products,
  onProductChange,
  activeProductId,
  purchasedProducts,
  activeSellerInfo,
  filterMode,
  scrollContainerRef,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPurchasedSlide, setCurrentPurchasedSlide] = useState(0);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isPurchasedSectionOpen, setIsPurchasedSectionOpen] = useState(false);
  const containerRef = useRef(null);
  const purchasedSectionRef = useRef(null);

  const isProgrammaticRef = useRef(false);
  const targetIndexRef = useRef(null);

  const activeProduct = activeProductId
    ? products.find((p) => p.id === activeProductId)
    : null;
  const activeSellerId = activeProduct?.seller?.id || null;

  const activeSellerPurchasedProducts = purchasedProducts.filter(
    (p) => p.seller.id === activeSellerId,
  );
  const hasPurchasedProducts = activeSellerPurchasedProducts.length > 0;
  const isSpecialSale = products.length > 0 ? products[0].isSpecialSale : true;

  const [sliderRef, slider] = useKeenSlider({
    rtl: true,
    loop: true,
    breakpoints: {
      "(min-width: 1024px)": {
        slides: { perView: 1.1, spacing: 10, origin: "center" },
      },
      "(min-width: 1280px)": {
        slides: { perView: 1.4, spacing: 5, origin: "center" },
      },
    },
    created(s) {
      setCurrentSlide(s.track.details.rel);
    },
    slideChanged(s) {
      const idx = s.track.details.rel;

      // ⛔ وسط راه فروشنده رو عوض نکن
      if (isProgrammaticRef.current) return;

      setCurrentSlide(idx);
      onProductChange(products[idx]);
    },

    animationEnded() {
      if (!isProgrammaticRef.current) return;

      // ✅ sync فقط در مقصد
      const idx = targetIndexRef.current;
      if (products[idx]) {
        onProductChange(products[idx]);
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
    },
    slideChanged(s) {
      const newIndex = s.track.details.rel;
      setCurrentPurchasedSlide(newIndex);
    },
  });

  const handleOpenPurchasedSlider = () => {
    if (!hasPurchasedProducts) return;
    setIsPurchasedSectionOpen((prev) => !prev);
  };

  const handleClickBulletPoints = (index) => {
    setCurrentSlide(index);

    if (products[index]) {
      onProductChange(products[index]);
    }

    isProgrammaticRef.current = true;
    targetIndexRef.current = index;

    slider.current?.moveToIdx(index, true);
  };

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
        container.scrollTo({
          top,
          behavior: "smooth",
        });
      });
    }
  }, [isPurchasedSectionOpen]);

  // Update slider when products list changes (e.g. filter change)
  useEffect(() => {
    if (slider.current && products.length > 0) {
      slider.current.update();
    }
  }, [products]);

  // Sync slider to show active product when activeProductId or products change
  useEffect(() => {
    if (!slider.current || !products.length || !activeProductId) return;

    const targetIndex = products.findIndex((p) => p.id === activeProductId);
    if (targetIndex === -1) return;

    const s = slider.current;
    const currentIndex = s.track.details.rel;
    if (currentIndex === targetIndex) return;

    isProgrammaticRef.current = true;
    targetIndexRef.current = targetIndex;

    // 🔥 اکتیو ظاهری فوری
    setCurrentSlide(targetIndex);

    // 🎞️ انیمیشن حفظ می‌شه
    s.moveToIdx(targetIndex, true);
  }, [activeProductId, products]);

  return (
    <div ref={containerRef} className="flex flex-col overflow-y-auto">
      <div className="relative">
        <div
          className={`keen-slider ${filterMode === "visit" ? "h-[460px] xl:h-[480px]" : "h-[440px] xl:h-[460px]"}`}
          ref={sliderRef}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="keen-slider__slide flex items-center justify-center"
            >
              <div
                className={`bg-white flex flex-col gap-3 items-center transition-all justify-center rounded-lg py-2 px-3 w-full ${
                  currentSlide === index ? "h-full max-w-[360px]" : "h-[80%]"
                }`}
              >
                <div className="relative rounded-md overflow-hidden">
                  <Image
                    src={product.img || "/assets/images/fallback/phone.png"}
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
                      <span className="font-bold text-gray-600">
                        {Number(product.finalPrice).toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="text-gray-400 line-through text-sm">
                          {Number(product.price).toLocaleString("fa-IR")} تومان
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full bg-gray-50 rounded-lg text-sm py-2 px-4 text-gray-600 mt-2 cursor-pointer">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-4 font-bold ">
                          وضعیت: {product.orderHistory?.statusLabel}
                        </div>
                        <div className="flex items-center justify-center gap-4 font-bold ">
                          تعداد: 1 عدد
                        </div>
                      </div>
                      {product.orderHistory?.userNote && (
                        <div
                          onClick={() => setIsNoteOpen(true)}
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
                    className="w-full py-2 text-primary font-bold rounded-lg hover:bg-blue-100 transition text-center text-sm"
                  >
                    ثبت سفارش
                  </Link>
                ) : (
                  <Link
                    href="#"
                    className="w-full py-2 text-green-700 font-bold rounded-lg hover:bg-green-100 transition text-center text-sm flex items-center justify-center gap-1"
                  >
                    رسید تحویل سفارش
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bullet points - fixed position, appears on active card */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10 pointer-events-none">
          {products.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleClickBulletPoints(idx)}
              className={`h-3 rounded-full transition-all cursor-pointer pointer-events-auto ${
                currentSlide === idx
                  ? "bg-primary w-6"
                  : "bg-gray-300 w-3 hover:bg-gray-400"
              }`}
              aria-label={`اسلاید ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {filterMode !== "visit" && (
        <div className="mt-4 shrink-0">
          <div
            className={`flex items-center justify-between border-t-3 border-white pt-4 shrink-0 hover:bg-white/10 transition-colors rounded-b-md px-2 ${
              hasPurchasedProducts ? "cursor-pointer" : ""
            }`}
            onClick={handleOpenPurchasedSlider}
          >
            <div className="flex items-center gap-1">
              <span
                className={`font-bold text-sm xl:text-base ${
                  hasPurchasedProducts ? "text-primary" : "text-gray-600"
                }`}
              >
                {hasPurchasedProducts
                  ? `سفارشات از ${activeSellerInfo.name}`
                  : `سفارشی از ${activeSellerInfo.name} ندارید`}
              </span>
              <span className="text-gray-400">(بروزرسانی 1 دقیقه پیش)</span>
            </div>
            {hasPurchasedProducts ? (
              isPurchasedSectionOpen ? (
                <ChevronUpIcon className="text-primary" />
              ) : (
                <ChevronDownIcon className="text-primary" />
              )
            ) : null}
          </div>
        </div>
      )}

      {isPurchasedSectionOpen && (
        <div ref={purchasedSectionRef} className="shrink-0 mt-6">
          <div
            className="keen-slider h-[440px] xl:h-[460px]"
            ref={purchasedSliderRef}
          >
            {activeSellerPurchasedProducts.map((product, index) => (
              <div
                key={product.id}
                className="keen-slider__slide flex items-center justify-center"
                isolation="isolate"
              >
                <div
                  className={`bg-white flex flex-col gap-3 items-center justify-center rounded-xl py-2 px-3 w-full transition-all ${
                    currentPurchasedSlide === index
                      ? "h-full mx-6 max-w-[396px]"
                      : "h-[80%]"
                  }`}
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={product.img || "/assets/images/fallback/phone.png"}
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
                        <div className="flex items-center justify-center gap-4 font-bold ">
                          وضعیت: {product.orderHistory?.statusLabel}
                        </div>
                        <div className="flex items-center justify-center gap-4 font-bold ">
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
                    className="w-full py-2 text-green-700 font-bold rounded-lg hover:bg-green-100 transition text-center text-sm flex items-center justify-center gap-1"
                  >
                    رسید تحویل سفارش
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        title={"اسم محصول"}
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
      >
        یادداشت کاربر: لطفا محصول را در بسته بندی تیره قرار دهید. ممنون!
      </Dialog>
    </div>
  );
}
