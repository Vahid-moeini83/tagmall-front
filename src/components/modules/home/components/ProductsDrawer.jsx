"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  ArrowRightIcon,
  ClockIcon,
  ImageIcon,
  LocationIcon,
  StrokeArrowLeftIcon,
  VerifyIcon,
} from "@/icons";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ProductCardMobile from "./ProductCardMobile";
import usePublicStore from "@/app/store/publicStore";
import { SearchResultBox } from "@/components/ui/search";

const SHOP_IMAGES = [
  "/assets/images/home/sampleMap.jpg",
  "/assets/images/home/sampleMap.jpg",
  "/assets/images/home/sampleMap.jpg",
];

// Maximum heights in pixels for snap points
const MAX_SNAP_HEIGHT_DEFAULT = 228;
const MAX_SNAP_HEIGHT_WITH_SEARCH = 280;
const SNAP_POINT_FULL = 0.9;
const LONG_PRESS_MS = 500;

// Calculate snap point using a stable viewport height.
// We intentionally avoid "dynamic" viewport changes (mobile browser bars) to prevent snap jumps.
const calculateSnapPoint = ({ maxHeight, viewportHeight }) => {
  if (!viewportHeight) return 0.39;

  // Drawer is offset from bottom by 72px (navigation bar).
  // Keep this consistent with DrawerContent bottom offset.
  const availableHeight = Math.max(viewportHeight - 72, 1);

  // Calculate ratio, ensuring it doesn't exceed 39% of available height
  const calculatedRatio = maxHeight / availableHeight;
  return Math.min(calculatedRatio, 0.39);
};

export default function ProductsDrawer({
  specialProducts,
  purchasedProducts = [],
  activeProductId,
  onProductChange,
  onSellerGoToMap,
}) {
  const showSearchResultBox = usePublicStore((s) => s.showSearchResultBox);
  const filterMode = usePublicStore((s) => {
    const { homeFilterSpecial, homeFilterVisit } = s;
    if (homeFilterSpecial && homeFilterVisit) return "all";
    if (homeFilterSpecial) return "special";
    return "visit";
  });

  // Keep the smallest viewport height observed, to avoid iOS/Chrome bar show/hide
  // causing snap-point ratios to shift on real devices.
  const stableViewportHeightRef = useRef(null);
  const drawerContentRef = useRef(null);

  const [snapPoints, setSnapPoints] = useState(() => [0.3, SNAP_POINT_FULL]);

  const [activeSnapPoint, setActiveSnapPoint] = useState(snapPoints[0]);
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  const [showShopImagesGallery, setShowShopImagesGallery] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const longPressTimerRef = useRef(null);
  const isLongPressTriggeredRef = useRef(false);
  const showSellerDetailsRef = useRef(false);
  const [galleryCurrentSlide, setGalleryCurrentSlide] = useState(0);
  const homeFilterPopoverOpen = usePublicStore((s) => s.homeFilterPopoverOpen);
  const syncingFromSellerRef = useRef(false);

  // Products in closed drawer case
  const closedStateProducts =
    filterMode === "special" || filterMode === "all"
      ? specialProducts
      : purchasedProducts;

  // Get active product and seller
  const activeProduct = activeProductId
    ? closedStateProducts.find((p) => p.id === activeProductId)
    : null;
  const activeSellerId = activeProduct?.seller?.id || null;

  // حالت list mode: می‌توانیم مرتب کنیم
  const listModeProducts = useMemo(() => {
    if (!activeSellerId) return specialProducts;
    const active = specialProducts.filter(
      (p) => p.seller.id === activeSellerId,
    );
    const rest = specialProducts.filter((p) => p.seller.id !== activeSellerId);
    return [...active, ...rest];
  }, [specialProducts, activeSellerId]);

  // محصولات خرید حضوری فقط از فروشنده فعال
  const activeSellerPurchasedProducts = useMemo(() => {
    if (!activeSellerId) return [];
    return purchasedProducts.filter((p) => p.seller.id === activeSellerId);
  }, [purchasedProducts, activeSellerId]);

  const closedStateVariant = specialProducts.length > 0 ? "product" : "order";

  const isListMode = activeSnapPoint === snapPoints[1] && !showSellerDetails;

  const [productsSliderRef, productsSliderInstance] = useKeenSlider({
    vertical: true,
    rubberband: false,
    drag: true,
    loop: isListMode ? false : true,
    slides: {
      perView: isListMode ? "auto" : 1,
      spacing: isListMode ? 12 : 0,
    },
    mode: isListMode ? "free" : "snap",
    slideChanged(s) {
      if (isListMode) return;

      const idx = s.track.details.rel;
      const product = closedStateProducts[idx];
      if (!product) return;

      if (syncingFromSellerRef.current) {
        // ✅ این بار اجازه می‌دیم seller sync بشه
        syncingFromSellerRef.current = false;
        onProductChange?.(product);
        return;
      }

      onProductChange?.(product);
    },
  });

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

  // Click only: show seller details in drawer; map does NOT move. Drawer opens and stays open for details.
  const handleSellerClick = useCallback(
    (product) => {
      if (isLongPressTriggeredRef.current) {
        isLongPressTriggeredRef.current = false;
        return;
      }

      // در حالت list mode، فقط محصول رو تغییر بده و به اسلایدر برو (بدون تغییر نقشه)
      if (isListMode) {
        // پیدا کردن اولین محصول این فروشنده در closedStateProducts
        const firstProductOfSeller = closedStateProducts.find(
          (p) => p.seller.id === product.seller.id,
        );

        if (firstProductOfSeller) {
          onProductChange?.(firstProductOfSeller, false);
        }
        setActiveSnapPoint(snapPoints[0]); // بستن drawer و برگشت به حالت اسلایدر
        return;
      }

      // در حالت عادی (drawer بسته)، جزئیات فروشنده رو نشون بده
      if (product?.seller) {
        setSelectedSeller(product.seller);
        setShowSellerDetails(true);
        setActiveSnapPoint(snapPoints[1]); // keep drawer open when showing details
      }
    },
    [isListMode, onProductChange, snapPoints, closedStateProducts],
  );

  const handleBackToProducts = useCallback(() => {
    setShowSellerDetails(false);
    setActiveSnapPoint(snapPoints[0]);
  }, [snapPoints]);

  // Long-press on seller name: pan map to seller; only close drawer when not in seller details view
  const handleSellerMouseDown = useCallback(
    (product) => {
      isLongPressTriggeredRef.current = false;
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        isLongPressTriggeredRef.current = true;
        if (!showSellerDetailsRef.current) {
          setActiveSnapPoint(snapPoints[0]);
        }
        onSellerGoToMap?.(product.seller.id);
      }, LONG_PRESS_MS);
    },
    [onSellerGoToMap, snapPoints],
  );

  const handleSellerMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleSellerMouseLeave = handleSellerMouseUp;

  // Update snap points when showSearchResultBox changes or viewport resizes
  useEffect(() => {
    const updateSnapPoints = () => {
      const currentViewportHeight =
        window.visualViewport?.height || window.innerHeight;

      if (
        !stableViewportHeightRef.current ||
        currentViewportHeight < stableViewportHeightRef.current
      ) {
        stableViewportHeightRef.current = currentViewportHeight;
      }

      const viewportHeight = stableViewportHeightRef.current;

      // Measure actual rendered height instead of using hardcoded values
      let maxHeight = MAX_SNAP_HEIGHT_DEFAULT;

      if (showSearchResultBox && drawerContentRef.current) {
        // Wait for SearchResultBox to render, then measure
        requestAnimationFrame(() => {
          if (drawerContentRef.current) {
            // Get the actual scrollHeight of the drawer content
            const actualHeight = drawerContentRef.current.scrollHeight;

            // Use measured height, but cap it at a reasonable maximum
            maxHeight = Math.min(actualHeight, MAX_SNAP_HEIGHT_WITH_SEARCH);

            const firstSnap = calculateSnapPoint({
              maxHeight,
              viewportHeight,
            });
            setSnapPoints([firstSnap, SNAP_POINT_FULL]);
          }
        });
        return; // Exit early, will update in requestAnimationFrame
      }

      const firstSnap = calculateSnapPoint({
        maxHeight,
        viewportHeight,
      });
      setSnapPoints([firstSnap, SNAP_POINT_FULL]);
    };

    updateSnapPoints();

    // Listen to visualViewport resize (more accurate for mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateSnapPoints);
    }

    // Fallback to window resize
    window.addEventListener("resize", updateSnapPoints);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateSnapPoints);
      }
      window.removeEventListener("resize", updateSnapPoints);
    };
  }, [showSearchResultBox]);

  // Update activeSnapPoint when snapPoints change
  useEffect(() => {
    setActiveSnapPoint(snapPoints[0]);
  }, [snapPoints]);

  // Update slider when snap points, search box, or view mode changes
  useEffect(() => {
    if (!productsSliderInstance.current) return;

    // Force reflow before update on mobile
    const forceUpdate = () => {
      if (productsSliderInstance.current) {
        // Trigger reflow
        void productsSliderInstance.current.container.offsetHeight;
        productsSliderInstance.current.update();
      }
    };

    // Wait for drawer animation and layout recalculation
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        forceUpdate();
        // Double update for mobile browsers that need extra time
        setTimeout(forceUpdate, 50);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [snapPoints, showSearchResultBox, productsSliderInstance]);

  useEffect(() => {
    showSellerDetailsRef.current = showSellerDetails;
  }, [showSellerDetails]);

  useEffect(() => {
    if (!productsSliderInstance.current) return;

    // Force reflow before update on mobile
    const forceUpdate = () => {
      if (productsSliderInstance.current) {
        // Trigger reflow
        void productsSliderInstance.current.container.offsetHeight;
        productsSliderInstance.current.update();
      }
    };

    requestAnimationFrame(() => {
      forceUpdate();
      // Double update for mobile browsers that need extra time
      setTimeout(forceUpdate, 50);
    });
  }, [
    activeSnapPoint,
    showSellerDetails,
    showSearchResultBox,
    productsSliderInstance,
  ]);

  useEffect(() => {
    if (
      isListMode &&
      activeSellerPurchasedProducts.length > 0 &&
      ordersSliderInstance.current
    ) {
      requestAnimationFrame(() => {
        ordersSliderInstance.current?.update();
      });
    }
  }, [isListMode, activeSellerPurchasedProducts.length, ordersSliderInstance]);

  useEffect(() => {
    if (!productsSliderInstance.current || !activeProductId) return;

    const idx = closedStateProducts.findIndex((p) => p.id === activeProductId);

    if (idx < 0) return;

    const currentIdx = productsSliderInstance.current.track.details?.rel;
    if (currentIdx === idx) return; // Already on this product

    requestAnimationFrame(() => {
      productsSliderInstance.current.moveToIdx(idx);
    });
  }, [
    activeProductId,
    closedStateProducts,
    productsSliderInstance,
    isListMode,
  ]);

  if (specialProducts.length === 0 && purchasedProducts.length === 0) {
    return null;
  }

  return (
    <>
      {/* List mode overlay */}
      <div
        className={`fixed inset-0 z-10 bg-gray-200/50 backdrop-blur-sm transition-opacity ${isListMode ? "opacity-100 visible" : "opacity-0 invisible"}`}
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
            "rounded-t-xl pt-0 border-0! lg:hidden",
            "data-[vaul-drawer-direction=bottom]:bottom-[calc(72px+env(safe-area-inset-bottom))]!",
            "data-[vaul-drawer-direction=bottom]:max-h-[calc(100svh-2rem-env(safe-area-inset-bottom))]!",
            "data-[vaul-drawer-direction=bottom]:left-1/2 data-[vaul-drawer-direction=bottom]:right-auto data-[vaul-drawer-direction=bottom]:-translate-x-1/2",
            "data-[vaul-drawer-direction=bottom]:w-full data-[vaul-drawer-direction=bottom]:max-w-[640px]",
          )}
          overlayClassName="lg:hidden"
        >
          <div
            ref={drawerContentRef}
            className={cn(
              "rounded-t-xl flex flex-col overflow-hidden px-3 pb-3 pt-2 transition-[background-color,backdrop-filter]",
              homeFilterPopoverOpen
                ? "bg-gray-200/60 backdrop-blur-md"
                : "bg-gray-200/50 backdrop-blur-sm",
            )}
            data-vaul-no-drag
          >
            {showSearchResultBox && (
              <div className="mb-3">
                <SearchResultBox isMobile={true} />
              </div>
            )}
            <div
              className={cn(
                "flex-1 min-h-0",
                isListMode ? "overflow-y-auto" : "overflow-hidden",
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
                            "/assets/images/fallback/avatar.png"
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
                        onMouseDown={() =>
                          handleSellerMouseDown({ seller: selectedSeller })
                        }
                        onMouseUp={handleSellerMouseUp}
                        onMouseLeave={handleSellerMouseLeave}
                        onTouchStart={() =>
                          handleSellerMouseDown({ seller: selectedSeller })
                        }
                        onTouchEnd={handleSellerMouseUp}
                        onTouchCancel={handleSellerMouseUp}
                      >
                        {selectedSeller.name}
                      </span>
                      <VerifyIcon
                        size={20}
                        uniqueId={selectedSeller.id}
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
                        <div className="flex items-center gap-2 border-t border-gray-300 pt-4">
                          <LocationIcon className="w-5 h-5" />
                          <div className="flex flex-col gap-2">
                            <span className="font-semibold text-gray-700">
                              موقعیت مکانی
                            </span>
                            <span className="text-gray-600">
                              {selectedSeller.address}
                            </span>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowShopImagesGallery(true)}
                        className="w-full flex items-center gap-2 border-t border-gray-300 pt-4 text-primary hover:opacity-90 transition-opacity text-start"
                      >
                        <ImageIcon className="w-5 h-5 shrink-0" />
                        <span>تصاویر فروشگاه</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : isListMode && filterMode === "all" ? (
                <div className="flex-1 min-h-0 overflow-y-auto pb-24 flex flex-col gap-3">
                  {activeSellerPurchasedProducts.length > 0 && (
                    <div className="shrink-0 w-full flex flex-col gap-2">
                      <span className="text-center pt-1 text-gray-600">
                        فروش ویژه و سفارشات آماده تحویل
                      </span>
                      <div
                        ref={ordersSliderRef}
                        className="keen-slider min-h-0"
                      >
                        {activeSellerPurchasedProducts.map((product) => (
                          <div
                            key={product.id}
                            className="keen-slider__slide relative flex flex-col gap-2"
                          >
                            <ProductCardMobile
                              product={product}
                              variant="order"
                              onSellerClick={handleSellerClick}
                              onSellerMouseDown={handleSellerMouseDown}
                              onSellerMouseUp={handleSellerMouseUp}
                              onSellerMouseLeave={handleSellerMouseLeave}
                              isListMode={isListMode}
                            />
                            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex justify-center gap-2">
                              {activeSellerPurchasedProducts.map((_, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() =>
                                    ordersSliderInstance.current?.moveToIdx(idx)
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
                  {listModeProducts.map((product) => (
                    <ProductCardMobile
                      key={product.id}
                      product={product}
                      onSellerClick={handleSellerClick}
                      onSellerMouseDown={handleSellerMouseDown}
                      onSellerMouseUp={handleSellerMouseUp}
                      onSellerMouseLeave={handleSellerMouseLeave}
                      isListMode={isListMode}
                    />
                  ))}
                </div>
              ) : (
                <div
                  key={filterMode}
                  ref={productsSliderRef}
                  className="keen-slider flex-1 min-h-0"
                >
                  {closedStateProducts.map((product) => (
                    <div key={product.id} className="keen-slider__slide h-full">
                      <ProductCardMobile
                        product={product}
                        variant={closedStateVariant}
                        onSellerClick={handleSellerClick}
                        onSellerMouseDown={handleSellerMouseDown}
                        onSellerMouseUp={handleSellerMouseUp}
                        onSellerMouseLeave={handleSellerMouseLeave}
                        isListMode={isListMode}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {showShopImagesGallery && (
        <div className="fixed inset-0 z-1000 flex flex-col bg-gray-200/50 backdrop-blur-sm">
          <Image
            src="/assets/images/logo/main-logo.svg"
            width={110}
            height={40}
            alt="Logo"
            className="absolute right-4 top-4"
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
