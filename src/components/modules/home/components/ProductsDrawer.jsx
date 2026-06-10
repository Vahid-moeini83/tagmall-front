"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  ClockIcon,
  LocationIcon,
  StoreIcon,
  StrokeArrowLeftIcon,
  VerifyIcon,
} from "@/icons";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/client/utils";
import ProductCardMobile from "./ProductCardMobile";
import usePublicStore from "@/app/store/publicStore";
import { SearchResultBox } from "@/components/ui/search";

const SHOP_IMAGES = [
  "/assets/images/home/sampleMap.jpg",
  "/assets/images/home/sampleMap.jpg",
  "/assets/images/home/sampleMap.jpg",
];

const SNAP_CLOSED_DEFAULT_HEIGHT = 260;
const SNAP_CLOSED_WITH_SEARCH_HEIGHT = 320;
const SNAP_OPEN_MAX_RATIO = 0.92;

function SellerHorizontalSlider({
  products,
  variant,
  onSellerClick,
  isListMode,
  setIsReviewsModalOpen,
  isActive,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef(null);

  // کنترل fade-in: اسلاید فعال از ابتدا visible، بقیه hidden
  const [isVisible, setIsVisible] = useState(() => isActive !== false);

  const [sliderRef, sliderInstance] = useKeenSlider(
    {
      rtl: true,
      drag: true,
      mode: "snap",
      rubberband: false,
      slides: { perView: 1, spacing: 10 },
    },
    [
      (slider) => {
        slider.on("created", () => setCurrentSlide(slider.track.details.rel));
        slider.on("slideChanged", () =>
          setCurrentSlide(slider.track.details.rel),
        );
      },
    ],
  );

  useEffect(() => {
    if (isActive === false) {
      // اسلاید غیرفعال: مخفی بشه (بدون delay)
      setIsVisible(false);
      return;
    }

    // dimensions رو فوری update کن (layout بعد از animationEnded آماده‌ست)
    sliderInstance.current?.update();

    // fade-in در اولین frame بعد از update — بدون تاخیر مصنوعی
    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!products || products.length === 0) return null;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 w-full min-w-0 transition-opacity duration-150",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        ref={sliderRef}
        className="keen-slider overflow-hidden w-full"
        style={{ touchAction: "pan-x" }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (touch) {
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
          }
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (!touch || !touchStartRef.current) return;

          // delta حرکت نسبت به نقطه شروع، نه مختصات مطلق صفحه
          const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
          const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

          // فقط swipe افقی رو متوقف کن تا به اسلایدر عمودی نرسه
          if (deltaX > deltaY) {
            e.stopPropagation();
          }
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="keen-slider__slide !w-full min-w-0 overflow-hidden"
          >
            <ProductCardMobile
              product={product}
              variant={variant}
              onSellerClick={onSellerClick}
              isListMode={isListMode}
              setIsReviewsModalOpen={setIsReviewsModalOpen}
            />
          </div>
        ))}
      </div>
      {products.length > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[168px] flex justify-center gap-2 z-10">
          {products.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sliderInstance.current?.moveToIdx(idx)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all cursor-pointer",
                currentSlide === idx
                  ? "bg-primary w-6"
                  : "bg-gray-400 hover:bg-gray-400",
              )}
              aria-label={`اسلاید ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsDrawer({
  storeProducts,
  purchasedProducts = [],
  activeSellerId,
  onProductChange,
  onSellerGoToMap,
  setIsReviewsModalOpen,
}) {
  const showSearchResultBox = usePublicStore((s) => s.showSearchResultBox);
  const filterMode = usePublicStore((s) => {
    const { homeFilterSpecial, homeFilterVisit } = s;
    if (homeFilterSpecial && homeFilterVisit) return "all";
    if (homeFilterSpecial) return "special";
    return "visit";
  });

  const drawerContentRef = useRef(null);

  const [snapPoints, setSnapPoints] = useState(() => {
    const vh = typeof window !== "undefined" ? window.innerHeight : null;
    const closedHeight = Math.min(SNAP_CLOSED_DEFAULT_HEIGHT, vh * 0.9);
    return [closedHeight / vh, SNAP_OPEN_MAX_RATIO];
  });

  const [activeSnapPoint, setActiveSnapPoint] = useState(snapPoints[0]);
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  const [showShopImagesGallery, setShowShopImagesGallery] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const showSellerDetailsRef = useRef(false);
  const [galleryCurrentSlide, setGalleryCurrentSlide] = useState(0);
  const homeFilterPopoverOpen = usePublicStore((s) => s.homeFilterPopoverOpen);
  const syncingFromSellerRef = useRef(false);

  // ساخت closedStateProducts از storeProducts
  const closedStateProducts = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) return [];

    const allProducts = [];
    storeProducts.forEach((store) => {
      store.products.forEach((product) => {
        if (filterMode === "special" && product.isSpecialSale) {
          allProducts.push(product);
        } else if (filterMode === "visit" && product.orderHistory) {
          allProducts.push(product);
        } else if (filterMode === "all") {
          allProducts.push(product);
        }
      });
    });

    return allProducts;
  }, [storeProducts, filterMode]);

  const closedStateProductsBySeller = useMemo(() => {
    const result = closedStateProducts.reduce((acc, product) => {
      const storeId = product.storeId; // استفاده از storeId به جای sellerId
      if (!acc[storeId]) acc[storeId] = [];
      acc[storeId].push(product);
      return acc;
    }, {});

    return result;
  }, [closedStateProducts]);

  // برای حالت لیست - فروشگاه‌محور با استفاده از storeId
  const listModeProductsBySeller = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) return {};

    const byStore = {};
    storeProducts.forEach((store) => {
      const storeId = store.storeId;
      const specialProducts = store.products.filter((p) => p.isSpecialSale);
      if (specialProducts.length > 0) {
        byStore[storeId] = specialProducts;
      }
    });

    if (!activeSellerId) return byStore;

    // فروشگاه فعال رو اول بذار
    const activeStoreId = String(activeSellerId);
    const entries = Object.entries(byStore);
    const activeEntry = entries.find(([id]) => id === activeStoreId);
    const restEntries = entries.filter(([id]) => id !== activeStoreId);
    return Object.fromEntries(
      activeEntry ? [activeEntry, ...restEntries] : entries,
    );
  }, [storeProducts, activeSellerId]);

  const activeSellerPurchasedProducts = useMemo(() => {
    if (!activeSellerId) return [];
    return purchasedProducts.filter((p) => p.storeId === activeSellerId);
  }, [purchasedProducts, activeSellerId]);

  const closedStateVariant = useMemo(() => {
    return closedStateProducts.some((p) => p.isSpecialSale)
      ? "product"
      : "order";
  }, [closedStateProducts]);

  const isListMode = activeSnapPoint === snapPoints[1] && !showSellerDetails;

  const [ordersCurrentSlide, setOrdersCurrentSlide] = useState(0);
  const [ordersSliderRef, ordersSliderInstance] = useKeenSlider(
    {
      rtl: true,
      drag: true,
      mode: "snap",
      slides: { perView: 1, spacing: 12 },
    },
    [
      (slider) => {
        slider.on("created", () => {
          setOrdersCurrentSlide(slider.track.details.rel);
        });
        slider.on("slideChanged", () => {
          setOrdersCurrentSlide(slider.track.details.rel);
        });
      },
    ],
  );

  // تعداد فروشگاه‌ها برای محاسبه range
  const storeCount = Object.keys(closedStateProductsBySeller).length;

  // ردیابی اسلاید عمودی فعال برای پاس دادن به SellerHorizontalSlider
  const [currentVerticalSlide, setCurrentVerticalSlide] = useState(0);

  // اسلایدر عمودی - جابجایی بین فروشگاه‌ها
  const [productsSliderRef, productsSliderInstance] = useKeenSlider(
    {
      vertical: true,
      rubberband: false,
      drag: true,
      loop: false,
      dragSpeed: 1,
      slides: {
        perView: 1,
        spacing: 0,
      },
      mode: "snap",
      slideChanged(s) {
        const idx = s.track.details.rel;
        // setCurrentVerticalSlide اینجا نیست - به animationEnded منتقل شد
        // تا re-render در وسط انیمیشن اتفاق نیفته و اسلاید روون بمونه

        const storeIds = Object.keys(closedStateProductsBySeller);
        if (idx >= storeIds.length) return;

        const storeId = storeIds[idx];
        if (!storeId) return;

        const products = closedStateProductsBySeller[storeId];
        if (!products || products.length === 0) return;

        if (syncingFromSellerRef.current) {
          syncingFromSellerRef.current = false;
          onProductChange?.(products[0]);
          return;
        }

        onProductChange?.(products[0]);
      },
    },
    [
      (slider) => {
        slider.on("created", () => {
          setCurrentVerticalSlide(slider.track.details.rel ?? 0);
        });
        // state update بعد از پایان انیمیشن - جلوگیری از stutter حین slide
        slider.on("animationEnded", () => {
          setCurrentVerticalSlide(slider.track.details.rel ?? 0);
        });
      },
    ],
  );

  const [gallerySliderRef, galleryInstanceRef] = useKeenSlider(
    {
      rtl: true,
      loop: true,
      slides: { perView: 1, spacing: 10 },
    },
    [
      (slider) => {
        slider.on("created", () => {
          setGalleryCurrentSlide(slider.track.details.rel);
        });
        slider.on("slideChanged", () => {
          setGalleryCurrentSlide(slider.track.details.rel);
        });
      },
    ],
  );

  const handleSellerClick = useCallback(
    (product) => {
      // ارسال storeId به جای seller.id
      onSellerGoToMap(product.storeId);

      if (isListMode) {
        const firstProductOfSeller = closedStateProducts.find(
          (p) => p.storeId === product.storeId,
        );
        if (firstProductOfSeller) {
          onProductChange?.(firstProductOfSeller, false);
        }
        setActiveSnapPoint(snapPoints[0]);
        return;
      }

      if (product?.storeId) {
        // ساخت یک آبجکت store-based برای نمایش جزئیات فروشگاه
        const storeInfo = {
          id: product.storeId,
          name: product.seller.storeName || product.seller.name,
          profileImage: product.seller.profileImage,
          address: product.seller.address,
          workingHours: product.seller.workingHours,
          isVerified: product.seller.isVerified,
        };
        setSelectedSeller(storeInfo);
        setShowSellerDetails(true);
        setActiveSnapPoint(snapPoints[1]);
      }
    },
    [
      isListMode,
      onProductChange,
      snapPoints,
      closedStateProducts,
      onSellerGoToMap,
      setActiveSnapPoint,
    ],
  );

  const handleBackToProducts = useCallback(() => {
    setShowSellerDetails(false);
    setActiveSnapPoint(snapPoints[0]);
  }, [snapPoints]);

  useEffect(() => {
    const vh = typeof window !== "undefined" ? window.innerHeight : null;
    const closedHeight = showSearchResultBox
      ? Math.min(SNAP_CLOSED_WITH_SEARCH_HEIGHT, vh * 0.9)
      : Math.min(SNAP_CLOSED_DEFAULT_HEIGHT, vh * 0.9);

    setSnapPoints([closedHeight / vh, SNAP_OPEN_MAX_RATIO]);
  }, [showSearchResultBox]);

  useEffect(() => {
    setActiveSnapPoint(snapPoints[0]);
  }, [snapPoints]);

  useEffect(() => {
    if (!productsSliderInstance.current) return;

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        try {
          productsSliderInstance.current?.refreshOptions({});
        } catch (e) {
          // slider ممکن است هنوز آماده نباشد
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [snapPoints, showSearchResultBox, productsSliderInstance]);

  useEffect(() => {
    showSellerDetailsRef.current = showSellerDetails;
  }, [showSellerDetails]);

  // هنگام بسته شدن لیست، اسلایدر رو refresh کن و به index درست برو
  useEffect(() => {
    if (!isListMode) {
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          try {
            productsSliderInstance.current?.refreshOptions({});
          } catch (e) {
            // slider ممکن است آماده نباشد
          }

          if (activeSellerId) {
            const storeIds = Object.keys(closedStateProductsBySeller);
            const idx = storeIds.findIndex(
              (id) => id === String(activeSellerId),
            );
            if (idx >= 0) {
              productsSliderInstance.current?.moveToIdx(idx);
            }
          }
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [
    activeSnapPoint,
    showSellerDetails,
    showSearchResultBox,
    productsSliderInstance,
    isListMode,
    activeSellerId,
    closedStateProductsBySeller,
  ]);

  useEffect(() => {
    if (
      isListMode &&
      activeSellerPurchasedProducts.length > 0 &&
      ordersSliderInstance.current
    ) {
      requestAnimationFrame(() => {
        try {
          ordersSliderInstance.current?.refreshOptions({});
        } catch (e) {
          // slider ممکن است آماده نباشد
        }
      });
    }
  }, [isListMode, activeSellerPurchasedProducts.length, ordersSliderInstance]);

  useEffect(() => {
    if (!productsSliderInstance.current || !activeSellerId || isListMode)
      return;

    const storeIds = Object.keys(closedStateProductsBySeller);
    const idx = storeIds.findIndex((id) => id === String(activeSellerId));

    if (idx < 0) return;

    const currentIdx = productsSliderInstance.current?.track?.details?.rel;
    if (currentIdx === undefined || currentIdx === idx) return;

    syncingFromSellerRef.current = true;
    requestAnimationFrame(() => {
      productsSliderInstance.current?.moveToIdx(idx);
    });
  }, [
    activeSellerId,
    closedStateProductsBySeller,
    productsSliderInstance,
    isListMode,
  ]);

  if (!storeProducts || storeProducts.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-10 bg-gray-200/20 backdrop-blur-sm transition-opacity ${isListMode ? "opacity-100 visible" : "opacity-0 invisible"}`}
      ></div>
      <Drawer
        open
        direction="bottom"
        snapPoints={snapPoints}
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
        dismissible={false}
        modal={false}
      >
        <DrawerContent
          className={cn(
            "rounded-t-xl pt-0 px-0! border-0! lg:hidden bg-gray-200/20! backdrop-blur-sm outline-none!",
            showSellerDetails
              ? `data-[vaul-drawer-direction=bottom]:mb-[calc(32px+env(safe-area-inset-bottom))]!`
              : `data-[vaul-drawer-direction=bottom]:mb-[calc(64px+env(safe-area-inset-bottom))]!`,
            "data-[vaul-drawer-direction=bottom]:max-h-[calc(100svh-2rem-env(safe-area-inset-bottom))]!",
            "data-[vaul-drawer-direction=bottom]:left-1/2 data-[vaul-drawer-direction=bottom]:right-auto data-[vaul-drawer-direction=bottom]:-translate-x-1/2",
            "data-[vaul-drawer-direction=bottom]:w-full data-[vaul-drawer-direction=bottom]:max-w-[640px]",
          )}
          overlayClassName="lg:hidden"
          dragHandleClassName="pb-3!"
          dragHandleLineClassName="bg-white!"
        >
          <div
            ref={drawerContentRef}
            className={cn(
              "rounded-t-xl flex flex-col overflow-hidden pb-4 px-4 transition-[background-color,backdrop-filter]",
              homeFilterPopoverOpen ? "bg-gray-200/60 backdrop-blur-md" : "",
            )}
            data-vaul-no-drag
          >
            {showSearchResultBox && (
              <div className="mb-3">
                <SearchResultBox />
              </div>
            )}
            <div
              className={cn(
                "flex-1 min-h-0",
                isListMode
                  ? "overflow-y-auto scroll-hidden"
                  : "overflow-hidden",
                !isListMode && !showSellerDetails ? "flex" : "",
              )}
            >
              {showSellerDetails && selectedSeller ? (
                <div className="min-h-[25vh] pb-22 flex flex-col">
                  <div className="w-full text-start flex items-center justify-between gap-2 py-1.5 px-1 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 relative shrink-0 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={
                            selectedSeller.profileImage ||
                            "/assets/images/fallback/no-photo.jpg"
                          }
                          fill
                          alt={selectedSeller.name}
                          className="object-cover"
                        />
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        className="font-medium text-gray-700 truncate text-sm cursor-pointer"
                        onClick={handleSellerClick}
                      >
                        {selectedSeller.name}
                      </span>
                      <VerifyIcon
                        size={20}
                        uniqueId={`store-${selectedSeller.id}`}
                        className="shrink-0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleBackToProducts}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                      aria-label="برگشت به لیست محصولات"
                    >
                      <StrokeArrowLeftIcon size={20} color="currentColor" />
                    </button>
                  </div>
                  <div className="rounded-lg bg-white p-3 flex flex-col gap-3 mt-2 shrink-0 shadow-sm">
                    <div className="flex flex-col gap-2 text-sm text-start">
                      {selectedSeller.workingHours && (
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-5 h-5" />
                          <div className="flex flex-col gap-2">
                            <span className="font-semibold text-gray-700">
                              زمان فعالیت فروشگاه
                            </span>
                            <span className="text-gray-600">
                              معمولا {selectedSeller.workingHours}
                            </span>
                          </div>
                        </div>
                      )}
                      {selectedSeller.address && (
                        <>
                          <div className="w-full h-[2px] bg-gray-200 mr-7" />
                          <div className="flex items-center gap-2">
                            <LocationIcon className="w-5 h-5" />
                            <div className="flex flex-col gap-2">
                              <span className="font-semibold text-gray-700">
                                موقعیت فروشگاه
                              </span>
                              <span className="text-gray-600">
                                {selectedSeller.address}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="w-full h-[2px] bg-gray-200 mr-7" />
                      <button
                        type="button"
                        onClick={() => setShowShopImagesGallery(true)}
                        className="w-full flex items-center gap-2 pt-2 pb-1 text-primary hover:opacity-90 transition-opacity text-start"
                      >
                        <StoreIcon className="w-5 h-5 shrink-0" color="#000" />
                        <span>تصاویر فروشگاه</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : isListMode ? (
                <div className="flex-1 min-h-0 overflow-y-auto pb-12 scroll-hidden flex flex-col gap-3">
                  {filterMode === "all" &&
                    activeSellerPurchasedProducts.length > 0 && (
                      <div className="shrink-0 w-full flex flex-col gap-2">
                        {!showSearchResultBox && (
                          <span className="text-center pt-1 text-gray-600">
                            فروش ویژه و سفارشات آماده تحویل
                          </span>
                        )}
                        <div
                          ref={ordersSliderRef}
                          className="keen-slider min-h-0"
                        >
                          {activeSellerPurchasedProducts.map((product) => (
                            <div
                              key={product.id}
                              className="keen-slider__slide !w-full relative flex flex-col gap-2"
                            >
                              <ProductCardMobile
                                product={product}
                                variant="order"
                                onSellerClick={handleSellerClick}
                                isListMode={isListMode}
                              />
                              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex justify-center gap-2">
                                {activeSellerPurchasedProducts.map((_, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() =>
                                      ordersSliderInstance.current?.moveToIdx(
                                        idx,
                                      )
                                    }
                                    className={cn(
                                      "w-2 h-2 rounded-full transition-all cursor-pointer",
                                      ordersCurrentSlide === idx
                                        ? "bg-primary w-6"
                                        : "bg-gray-400 hover:bg-gray-400",
                                    )}
                                    aria-label={`اسلاید ${idx + 1}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  {/* فروشگاه‌محور - برای هر فروشگاه یک SellerHorizontalSlider */}
                  {Object.entries(listModeProductsBySeller).map(
                    ([storeId, products]) => (
                      <div key={storeId} className="shrink-0">
                        <SellerHorizontalSlider
                          products={products}
                          variant={closedStateVariant}
                          onSellerClick={handleSellerClick}
                          isListMode={isListMode}
                          setIsReviewsModalOpen={setIsReviewsModalOpen}
                        />
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div
                  key={filterMode}
                  ref={productsSliderRef}
                  className="keen-slider flex-1 min-h-0 overflow-hidden"
                  style={{ touchAction: "pan-y" }}
                >
                  {Object.entries(closedStateProductsBySeller).map(
                    ([storeId, products], index) => (
                      <div
                        key={storeId}
                        className="keen-slider__slide flex flex-col min-h-0 overflow-hidden"
                      >
                        <SellerHorizontalSlider
                          products={products}
                          variant={closedStateVariant}
                          onSellerClick={handleSellerClick}
                          isListMode={isListMode}
                          setIsReviewsModalOpen={setIsReviewsModalOpen}
                          isActive={index === currentVerticalSlide}
                        />
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {showShopImagesGallery && (
        <div className="fixed inset-0 z-1000 flex flex-col bg-gray-200/20 backdrop-blur-sm">
          <Image
            src="/assets/images/logo/main-logo.svg"
            width={110}
            height={40}
            alt="Logo"
            className="absolute right-2.5 top-6"
          />
          <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden px-3 py-4">
            <div
              ref={gallerySliderRef}
              className="keen-slider rounded-lg overflow-hidden shadow-md max-h-64 sm:max-h-72 max-w-full"
            >
              {SHOP_IMAGES.map((src, i) => (
                <div key={i} className="keen-slider__slide">
                  <Image
                    src={src}
                    alt={`فروشگاه ${i + 1}`}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {SHOP_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => galleryInstanceRef.current?.moveToIdx(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all cursor-pointer",
                    galleryCurrentSlide === idx
                      ? "bg-primary w-6"
                      : "bg-gray-400 hover:bg-gray-400",
                  )}
                  aria-label={`اسلاید ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center px-4 py-4 pb-8">
            <StrokeArrowLeftIcon
              onClick={() => setShowShopImagesGallery(false)}
              size={20}
              className="absolute right-6"
            />
            <span className="text-primary font-semibold text-sm hover:opacity-90 cursor-pointer transition-opacity">
              ارتباط با واحد پشتیبانی
            </span>
          </div>
        </div>
      )}
    </>
  );
}
