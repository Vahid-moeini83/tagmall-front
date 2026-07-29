"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  ChevronDownIcon,
  ClockIcon,
  LocationIcon,
  StoreIcon,
  StrokeArrowLeftIcon,
  SupportIcon,
  VerifyIcon,
} from "@/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/client/utils";
import ProductCardMobile, {
  ProductCardSellerHeader,
} from "./ProductCardMobile";
import usePublicStore from "@/app/store/publicStore";
import { SearchResultBox } from "@/components/ui/search";
import {
  DrawerProductCardSkeleton,
  DrawerEmptyState,
} from "@/components/ui/loading";
import { getToken } from "@/lib/server/cookies";
import { createConversation } from "@/lib/server/actions/support";
import { buildSupportConversation } from "@/components/modules/support/utils/conversation";
import toast from "react-hot-toast";

const SHOP_IMAGES = [
  "/assets/images/home/sampleMap.jpg",
  "/assets/images/home/sampleMap.jpg",
  "/assets/images/home/sampleMap.jpg",
];

const SNAP_CLOSED_DEFAULT_HEIGHT = 320;
const SNAP_CLOSED_SELLER_DETAILS_HEIGHT = 340;
const SNAP_CLOSED_WITH_SEARCH_HEIGHT = 375;
const SNAP_CLOSED_SELLER_DETAILS_WITH_SEARCH_HEIGHT = 400;
const SNAP_CLOSED_WITH_ORDERS_HEIGHT = 470;
const SNAP_CLOSED_WITH_ORDERS_AND_SEARCH_HEIGHT = 525;
const SNAP_CLOSED_LOADING_EXTRA_BOTTOM_PX = 5;
const SNAP_OPEN_MAX_RATIO = 0.96;
const SNAP_FALLBACK_VIEWPORT_HEIGHT = 812;
const MOBILE_DRAWER_BOTTOM_OFFSET_PX = 120;
const MOBILE_NAV_BOTTOM_OFFSET_CLASS = `data-[vaul-drawer-direction=bottom]:mb-[calc(${MOBILE_DRAWER_BOTTOM_OFFSET_PX}px+env(safe-area-inset-bottom))]!`;

function getDrawerSnapPoints(
  withSearch = false,
  showSellerDetails = false,
  withOrders = false,
  isLoading = false,
) {
  let closedDefault;

  // Seller details and loading use their own compact heights — never dual-card height
  if (showSellerDetails) {
    closedDefault = withSearch
      ? SNAP_CLOSED_SELLER_DETAILS_WITH_SEARCH_HEIGHT
      : SNAP_CLOSED_SELLER_DETAILS_HEIGHT;
  } else if (withOrders) {
    closedDefault = withSearch
      ? SNAP_CLOSED_WITH_ORDERS_AND_SEARCH_HEIGHT
      : SNAP_CLOSED_WITH_ORDERS_HEIGHT;
  } else {
    closedDefault = withSearch
      ? SNAP_CLOSED_WITH_SEARCH_HEIGHT
      : SNAP_CLOSED_DEFAULT_HEIGHT;
  }

  if (isLoading && !showSellerDetails) {
    closedDefault += SNAP_CLOSED_LOADING_EXTRA_BOTTOM_PX;
  }

  const vh =
    typeof window !== "undefined" && window.innerHeight > 0
      ? window.innerHeight
      : SNAP_FALLBACK_VIEWPORT_HEIGHT;

  const closedHeight = Math.min(closedDefault, vh * 0.9);
  return [closedHeight / vh, SNAP_OPEN_MAX_RATIO];
}

// Chrome subtracted from closed snap height to fit exactly one vertical slide
const DRAWER_HANDLE_CHROME_PX = 40;
const DRAWER_INNER_BOTTOM_PADDING_PX = 8;
const DRAWER_SEARCH_BLOCK_PX = 52;

function getClosedVerticalSliderHeightPx(
  withSearch = false,
  viewportHeight = SNAP_FALLBACK_VIEWPORT_HEIGHT,
  withOrders = false,
) {
  const closedDefault = withOrders
    ? withSearch
      ? SNAP_CLOSED_WITH_ORDERS_AND_SEARCH_HEIGHT
      : SNAP_CLOSED_WITH_ORDERS_HEIGHT
    : withSearch
      ? SNAP_CLOSED_WITH_SEARCH_HEIGHT
      : SNAP_CLOSED_DEFAULT_HEIGHT;

  const closedHeight = Math.min(closedDefault, viewportHeight * 0.9);
  const searchOffset = withSearch ? DRAWER_SEARCH_BLOCK_PX : 0;

  return Math.max(
    closedHeight -
      DRAWER_HANDLE_CHROME_PX -
      DRAWER_INNER_BOTTOM_PADDING_PX -
      searchOffset,
    160,
  );
}

// Matches ProductCardMobile layout inside the closed drawer

function DrawerSliderPlaceholder({ isLoading, isListMode = false }) {
  return (
    <div className="w-full shrink-0 pt-2">
      {isLoading ? (
        <DrawerProductCardSkeleton />
      ) : (
        <DrawerEmptyState isListMode={isListMode} />
      )}
    </div>
  );
}

function SellerHorizontalSlider({
  products,
  variant,
  onSellerClick,
  isListMode,
  setIsReviewsModalOpen,
  isActive,
  nested = false,
  hideSellerHeader = false,
  cardClassName,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null);
  const sellerProduct = products?.[0];
  const showHeader = !hideSellerHeader && products?.length > 1;

  useEffect(() => {
    if (isActive === false) return;
    swiperRef.current?.update();
  }, [isActive, products]);

  if (!products || products.length === 0) return null;

  if (products.length === 1) {
    return (
      <div className="relative w-full min-w-0">
        <ProductCardMobile
          product={products[0]}
          variant={variant}
          onSellerClick={onSellerClick}
          isListMode={isListMode}
          setIsReviewsModalOpen={setIsReviewsModalOpen}
          hideSellerHeader={hideSellerHeader}
          cardClassName={cardClassName}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0">
      {showHeader ? (
        <ProductCardSellerHeader
          product={sellerProduct}
          onSellerClick={onSellerClick}
          isListMode={isListMode}
          setIsReviewsModalOpen={setIsReviewsModalOpen}
        />
      ) : null}
      <Swiper
        dir="rtl"
        nested={nested}
        slidesPerView={1}
        spaceBetween={5}
        className="w-full overflow-hidden"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex);
        }}
      >
        {products.map((product) => (
          <SwiperSlide
            key={product.id}
            className="w-full! min-w-0 overflow-hidden"
          >
            <ProductCardMobile
              product={product}
              variant={variant}
              onSellerClick={onSellerClick}
              isListMode={isListMode}
              setIsReviewsModalOpen={setIsReviewsModalOpen}
              hideSellerHeader
              cardClassName={cardClassName}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[10px] z-10 flex justify-center gap-2 pointer-events-none">
        {(() => {
          const total = products.length;
          const MAX = 4;
          // پنجره ۴تایی حول اسلاید فعلی
          let start = Math.max(0, currentSlide - Math.floor(MAX / 2));
          const end = Math.min(total, start + MAX);
          start = Math.max(0, end - MAX);
          return Array.from({ length: end - start }, (_, i) => {
            const idx = start + i;
            return (
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
            );
          });
        })()}
      </div>
    </div>
  );
}

function SellerStoreClosedSlide({
  specialProducts,
  orderProducts = [],
  onSellerClick,
  isListMode,
  setIsReviewsModalOpen,
  isActive,
  nested = false,
}) {
  const hasOrders = orderProducts.length > 0;
  const sellerProduct = specialProducts?.[0] || orderProducts[0];

  if (!hasOrders) {
    return (
      <SellerHorizontalSlider
        products={specialProducts}
        variant="product"
        onSellerClick={onSellerClick}
        isListMode={isListMode}
        setIsReviewsModalOpen={setIsReviewsModalOpen}
        isActive={isActive}
        nested={nested}
      />
    );
  }

  return (
    <div className="relative w-full min-w-0">
      <ProductCardSellerHeader
        product={sellerProduct}
        onSellerClick={onSellerClick}
        isListMode={isListMode}
        setIsReviewsModalOpen={setIsReviewsModalOpen}
      />
      <div className="flex flex-col gap-[5px]">
        <SellerHorizontalSlider
          products={specialProducts}
          variant="product"
          onSellerClick={onSellerClick}
          isListMode={isListMode}
          setIsReviewsModalOpen={setIsReviewsModalOpen}
          isActive={isActive}
          nested={nested}
          hideSellerHeader
          cardClassName="rounded-t-lg rounded-b-none"
        />
        <SellerHorizontalSlider
          products={orderProducts}
          variant="order"
          onSellerClick={onSellerClick}
          isListMode={isListMode}
          setIsReviewsModalOpen={setIsReviewsModalOpen}
          isActive={isActive}
          nested={nested}
          hideSellerHeader
          cardClassName="rounded-b-lg rounded-t-none"
        />
      </div>
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
  isStoresLoading = false,
  hasSliderStores = true,
}) {
  const showSearchResultBox = usePublicStore((s) => s.showSearchResultBox);
  const setLoginOpen = usePublicStore((s) => s.setLoginOpen);
  const openConversation = usePublicStore((s) => s.openConversation);
  const filterMode = usePublicStore((s) => {
    const { homeFilterSpecial, homeFilterVisit } = s;
    if (homeFilterSpecial && homeFilterVisit) return "all";
    if (homeFilterSpecial) return "special";
    return "visit";
  });

  const drawerContentRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== "undefined" && window.innerHeight > 0
      ? window.innerHeight
      : SNAP_FALLBACK_VIEWPORT_HEIGHT,
  );

  const [snapPoints, setSnapPoints] = useState(() =>
    getDrawerSnapPoints(false),
  );

  const [activeSnapPoint, setActiveSnapPoint] = useState(
    () => getDrawerSnapPoints(false)[0],
  );
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
        if (product.isSpecialSale) {
          allProducts.push(product);
        }
      });
    });

    return allProducts;
  }, [storeProducts]);

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
    return purchasedProducts.filter(
      (p) => String(p.storeId) === String(activeSellerId),
    );
  }, [purchasedProducts, activeSellerId]);

  const purchasedProductsBySeller = useMemo(() => {
    return purchasedProducts.reduce((acc, product) => {
      const storeId = String(product.storeId);
      if (!acc[storeId]) acc[storeId] = [];
      acc[storeId].push(product);
      return acc;
    }, {});
  }, [purchasedProducts]);

  const hasAnyStoreWithOrders = useMemo(() => {
    return Object.keys(closedStateProductsBySeller).some(
      (storeId) => (purchasedProductsBySeller[storeId]?.length ?? 0) > 0,
    );
  }, [closedStateProductsBySeller, purchasedProductsBySeller]);

  const closedStateVariant = useMemo(() => {
    return closedStateProducts.some((p) => p.isSpecialSale)
      ? "product"
      : "order";
  }, [closedStateProducts]);

  const isListMode = activeSnapPoint === snapPoints[1] && !showSellerDetails;
  const hasClosedSliderStores =
    Object.keys(closedStateProductsBySeller).length > 0;
  const showSliderPlaceholder =
    isStoresLoading || !hasSliderStores || !hasClosedSliderStores;

  // Dual-card taller closed height only while the product slider is visible
  const useDualCardClosedHeight =
    hasAnyStoreWithOrders && !showSellerDetails && !showSliderPlaceholder;

  const closedVerticalSliderHeightPx = useMemo(
    () =>
      getClosedVerticalSliderHeightPx(
        showSearchResultBox,
        viewportHeight,
        useDualCardClosedHeight,
      ),
    [showSearchResultBox, viewportHeight, useDualCardClosedHeight],
  );

  const closedStateProductsBySellerRef = useRef(closedStateProductsBySeller);
  useEffect(() => {
    closedStateProductsBySellerRef.current = closedStateProductsBySeller;
  }, [closedStateProductsBySeller]);

  const [ordersCurrentSlide, setOrdersCurrentSlide] = useState(0);
  const ordersSwiperRef = useRef(null);

  const [currentVerticalSlide, setCurrentVerticalSlide] = useState(0);
  const verticalSwiperRef = useRef(null);

  const gallerySwiperRef = useRef(null);

  const handleVerticalSlideChange = useCallback(
    (swiper) => {
      const idx = swiper.realIndex;
      setCurrentVerticalSlide(idx);

      const storeIds = Object.keys(closedStateProductsBySellerRef.current);
      const storeId = storeIds[idx];
      if (!storeId) return;

      const products = closedStateProductsBySellerRef.current[storeId];
      if (!products || products.length === 0) return;

      if (syncingFromSellerRef.current) {
        syncingFromSellerRef.current = false;
        onProductChange?.(products[0]);
        return;
      }

      onProductChange?.(products[0]);
    },
    [onProductChange],
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
        setActiveSnapPoint(snapPoints[0]);
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

  const handleSupport = useCallback(async () => {
    const token = await getToken();

    if (!token) {
      setLoginOpen(true);
      return;
    }

    const bodyData = {
      department: 2,
    };

    const { createConversationRes, createConversationErr } =
      await createConversation(token, bodyData);

    if (createConversationRes) {
      const conversationId = createConversationRes.data?.id;

      if (conversationId) {
        openConversation(buildSupportConversation(conversationId));
      } else {
        toast.error("خطا در برقراری ارتباط با پشتیبانی");
      }
    } else if (createConversationErr) {
      toast.error("خطا در برقراری ارتباط با پشتیبانی");
    }
  }, [openConversation, setLoginOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerHeight > 0) {
        setViewportHeight(window.innerHeight);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!verticalSwiperRef.current || showSliderPlaceholder) return;
    verticalSwiperRef.current.update();
  }, [
    closedStateProductsBySeller,
    closedVerticalSliderHeightPx,
    showSliderPlaceholder,
    useDualCardClosedHeight,
  ]);

  useEffect(() => {
    const points = getDrawerSnapPoints(
      showSearchResultBox,
      showSellerDetails,
      useDualCardClosedHeight,
      showSliderPlaceholder,
    );
    setSnapPoints(points);
    setActiveSnapPoint(points[0]);
  }, [
    showSearchResultBox,
    showSellerDetails,
    useDualCardClosedHeight,
    showSliderPlaceholder,
  ]);

  useEffect(() => {
    if (!verticalSwiperRef.current || showSliderPlaceholder) return;

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        verticalSwiperRef.current?.update();
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [snapPoints, showSearchResultBox, showSliderPlaceholder]);

  useEffect(() => {
    showSellerDetailsRef.current = showSellerDetails;
  }, [showSellerDetails]);

  // Refresh vertical slider when returning to closed drawer with data
  useEffect(() => {
    if (showSliderPlaceholder || isListMode) return;

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        verticalSwiperRef.current?.update();

        if (activeSellerId) {
          const storeIds = Object.keys(closedStateProductsBySeller);
          const idx = storeIds.findIndex((id) => id === String(activeSellerId));
          if (idx >= 0) {
            verticalSwiperRef.current?.slideTo(idx, 0);
          }
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [
    activeSnapPoint,
    showSellerDetails,
    showSearchResultBox,
    isListMode,
    activeSellerId,
    closedStateProductsBySeller,
    showSliderPlaceholder,
  ]);

  useEffect(() => {
    if (
      showSliderPlaceholder ||
      !isListMode ||
      activeSellerPurchasedProducts.length === 0 ||
      !ordersSwiperRef.current
    ) {
      return;
    }

    requestAnimationFrame(() => {
      ordersSwiperRef.current?.update();
    });
  }, [isListMode, activeSellerPurchasedProducts.length, showSliderPlaceholder]);

  useEffect(() => {
    if (
      showSliderPlaceholder ||
      !verticalSwiperRef.current ||
      !activeSellerId ||
      isListMode
    ) {
      return;
    }

    const storeIds = Object.keys(closedStateProductsBySeller);
    const idx = storeIds.findIndex((id) => id === String(activeSellerId));

    if (idx < 0) return;

    const currentIdx = verticalSwiperRef.current?.realIndex;
    if (currentIdx === idx) return;

    syncingFromSellerRef.current = true;
    requestAnimationFrame(() => {
      verticalSwiperRef.current?.slideTo(idx, 300);
    });
  }, [
    activeSellerId,
    closedStateProductsBySeller,
    isListMode,
    showSliderPlaceholder,
  ]);

  // Reset drawer sub-views while regional data is loading or empty
  useEffect(() => {
    if (!showSliderPlaceholder) return;

    setShowSellerDetails(false);
    setSelectedSeller(null);
    setCurrentVerticalSlide(0);
  }, [showSliderPlaceholder]);

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
          data-home-products-drawer=""
          data-drawer-closed={
            activeSnapPoint === snapPoints[0] ? "" : undefined
          }
          className={cn(
            "group/home-drawer rounded-t-xl pt-0 px-0! border-0! lg:hidden bg-gray-200/20! backdrop-blur-sm outline-none! overflow-visible!",
            MOBILE_NAV_BOTTOM_OFFSET_CLASS,
            `data-[vaul-drawer-direction=bottom]:max-h-[calc(100svh-${MOBILE_DRAWER_BOTTOM_OFFSET_PX}px-env(safe-area-inset-bottom))]!`,
            "data-[vaul-drawer-direction=bottom]:min-h-[98svh]!",
            "data-[vaul-drawer-direction=bottom]:left-1/2 data-[vaul-drawer-direction=bottom]:right-auto data-[vaul-drawer-direction=bottom]:-translate-x-1/2",
            "data-[vaul-drawer-direction=bottom]:w-full data-[vaul-drawer-direction=bottom]:max-w-[640px]",
          )}
          overlayClassName="lg:hidden"
          // dragHandleClassName="pb-1"
          dragHandleLineClassName="bg-gray-800!"
        >
          <div
            ref={drawerContentRef}
            className={cn(
              "rounded-t-xl flex flex-col flex-1 min-h-0 overflow-hidden pb-2 px-[10px] transition-[background-color,backdrop-filter]",
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
                "flex-1 min-h-0 flex flex-col",
                isListMode
                  ? "overflow-y-auto scroll-hidden"
                  : "overflow-hidden",
              )}
            >
              {showSellerDetails && selectedSeller ? (
                <div className="flex flex-col shrink-0 w-full">
                  <div className="w-full text-start flex items-center justify-between gap-2 py-1.5 pl-0.5 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-[50px] h-[50px] relative shrink-0 rounded-lg overflow-hidden bg-white">
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
                        className="font-bold text-gray-600 truncate text-sm cursor-pointer"
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
                      aria-label="برگشت به لیست محصولات"
                    >
                      <StrokeArrowLeftIcon
                        size={20}
                        color="currentColor"
                        className="ml-[14px]"
                      />
                    </button>
                  </div>
                  <div className="rounded-lg bg-white py-[10px] px-[10px] flex flex-col gap-3 shrink-0 shadow-sm">
                    <div className="flex flex-col gap-2 text-sm text-start">
                      {selectedSeller.workingHours && (
                        <div className="flex items-center gap-5 mr-[5px]">
                          <ClockIcon size={20} />
                          <div className="flex flex-col gap-2 py-2">
                            <span className="font-bold text-gray-600">
                              زمان فعالیت فروشگاه:{" "}
                              <span className="text-gray-600 font-extralight">
                                معمولا {selectedSeller.workingHours}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                      {selectedSeller.address && (
                        <>
                          <div className="w-full h-[2px] bg-gray-200 mr-11" />
                          <div className="flex items-center gap-5 mr-[7px]">
                            <LocationIcon size={22} />
                            <div className="flex flex-col gap-2">
                              <span className="font-bold text-gray-600 mr-0.5">
                                موقعیت فروشگاه:{" "}
                                <span className="text-gray-600 font-extralight">
                                  {selectedSeller.address}
                                </span>
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="w-full h-[2px] bg-gray-200 mr-11" />
                      <button
                        type="button"
                        onClick={() => setShowShopImagesGallery(true)}
                        className="w-full flex items-center gap-5 py-2 text-primary mr-[5px] text-start"
                      >
                        <StoreIcon size={22} className={"text-gray-800"} />
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold">تصاویر فروشگاه</span>
                          <ChevronDownIcon
                            size={20}
                            className={"rotate-90 text-gray-800 ml-4"}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : isListMode ? (
                <div
                  className="flex-1 min-h-0 overflow-y-auto scroll-hidden flex flex-col gap-2"
                  style={{
                    paddingBottom: `calc(${MOBILE_DRAWER_BOTTOM_OFFSET_PX}px + env(safe-area-inset-bottom))`,
                  }}
                >
                  {showSliderPlaceholder ? (
                    <DrawerSliderPlaceholder
                      isLoading={isStoresLoading}
                      isListMode
                    />
                  ) : (
                    <>
                      {(() => {
                        // آیا کارت سفارش بالای اولین فروش ویژه نمایش داده می‌شه؟
                        const showOrdersAboveFirstSpecial =
                          filterMode === "all" &&
                          activeSellerPurchasedProducts.length > 0;

                        // storeId اولین فروشگاه در لیست فروش ویژه
                        const firstSpecialStoreId = Object.keys(
                          listModeProductsBySeller,
                        )[0];
                        const firstStoreHasOrders =
                          firstSpecialStoreId &&
                          (purchasedProductsBySeller[firstSpecialStoreId]
                            ?.length ?? 0) > 0;

                        // آیا باید دو کارت بهم چسبیده باشن؟
                        const joinOrderAndSpecial =
                          showOrdersAboveFirstSpecial && firstStoreHasOrders;

                        return (
                          <>
                            {showOrdersAboveFirstSpecial && (
                              <div
                                className={cn(
                                  "relative shrink-0 w-full flex flex-col gap-2",
                                  // اگه فروش ویژه همون فروشگاه زیرشه، margin-bottom رو حذف کن
                                  joinOrderAndSpecial ? "mb-0" : "",
                                )}
                              >
                                {!showSearchResultBox && (
                                  <span className="text-center text-base pt-3 text-gray-600">
                                    فروش ویژه و سفارشات آماده تحویل
                                  </span>
                                )}
                                <Swiper
                                  dir="rtl"
                                  slidesPerView={1}
                                  spaceBetween={10}
                                  grabCursor
                                  className="min-h-0 w-full"
                                  onSwiper={(swiper) => {
                                    ordersSwiperRef.current = swiper;
                                  }}
                                  onSlideChange={(swiper) => {
                                    setOrdersCurrentSlide(swiper.realIndex);
                                  }}
                                >
                                  {activeSellerPurchasedProducts.map(
                                    (product) => (
                                      <SwiperSlide
                                        key={product.id}
                                        className="w-full! overflow-hidden"
                                      >
                                        <ProductCardMobile
                                          product={product}
                                          variant="order"
                                          onSellerClick={handleSellerClick}
                                          isListMode={isListMode}
                                          // پایین کارت سفارش rounded-none بشه وقتی فروش ویژه همون فروشگاه زیرشه
                                          cardClassName={
                                            joinOrderAndSpecial
                                              ? "rounded-t-lg rounded-b-none"
                                              : undefined
                                          }
                                        />
                                      </SwiperSlide>
                                    ),
                                  )}
                                </Swiper>
                                {activeSellerPurchasedProducts.length > 1 && (
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[10px] z-10 flex justify-center gap-2 pointer-events-none">
                                    {activeSellerPurchasedProducts.map(
                                      (_, idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() =>
                                            ordersSwiperRef.current?.slideTo(
                                              idx,
                                            )
                                          }
                                          className={cn(
                                            "w-2 h-2 rounded-full transition-all cursor-pointer pointer-events-auto",
                                            ordersCurrentSlide === idx
                                              ? "bg-primary w-6"
                                              : "bg-gray-400 hover:bg-gray-400",
                                          )}
                                          aria-label={`اسلاید ${idx + 1}`}
                                        />
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {Object.entries(listModeProductsBySeller).map(
                              ([storeId, products], index) => {
                                const storeHasOrders =
                                  (purchasedProductsBySeller[storeId]?.length ??
                                    0) > 0;
                                const hideFirstSpecialHeader =
                                  index === 0 && storeHasOrders;
                                // بالای کارت فروش ویژه rounded-none بشه وقتی کارت سفارش همون فروشگاه بالاشه
                                const specialCardClassName =
                                  joinOrderAndSpecial && index === 0
                                    ? "rounded-b-lg rounded-t-none"
                                    : undefined;

                                return (
                                  <div
                                    key={storeId}
                                    className="shrink-0"
                                    style={
                                      joinOrderAndSpecial && index === 0
                                        ? { marginTop: "5px" }
                                        : undefined
                                    }
                                  >
                                    <SellerHorizontalSlider
                                      products={products}
                                      variant={closedStateVariant}
                                      onSellerClick={handleSellerClick}
                                      isListMode={isListMode}
                                      setIsReviewsModalOpen={
                                        setIsReviewsModalOpen
                                      }
                                      hideSellerHeader={hideFirstSpecialHeader}
                                      cardClassName={specialCardClassName}
                                    />
                                  </div>
                                );
                              },
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              ) : showSliderPlaceholder ? (
                <div
                  className="w-full shrink-0 overflow-hidden"
                  style={{ height: closedVerticalSliderHeightPx }}
                >
                  <DrawerSliderPlaceholder isLoading={isStoresLoading} />
                </div>
              ) : (
                <div
                  className="w-full shrink-0 overflow-hidden"
                  style={{ height: closedVerticalSliderHeightPx }}
                >
                  <Swiper
                    key={filterMode}
                    direction="vertical"
                    nested
                    slidesPerView={1}
                    spaceBetween={5}
                    grabCursor
                    className="h-full w-full overflow-hidden"
                    onSwiper={(swiper) => {
                      verticalSwiperRef.current = swiper;
                      setCurrentVerticalSlide(swiper.realIndex);

                      if (activeSellerId) {
                        const storeIds = Object.keys(
                          closedStateProductsBySeller,
                        );
                        const idx = storeIds.findIndex(
                          (id) => id === String(activeSellerId),
                        );
                        if (idx >= 0) {
                          swiper.slideTo(idx, 0);
                          return;
                        }
                      }

                      const storeIds = Object.keys(closedStateProductsBySeller);
                      const firstStoreId = storeIds[0];
                      const firstProducts =
                        closedStateProductsBySeller[firstStoreId];
                      if (firstProducts?.length > 0) {
                        onProductChange?.(firstProducts[0]);
                      }
                    }}
                    onSlideChange={(swiper) => {
                      handleVerticalSlideChange(swiper);
                      requestAnimationFrame(() => {
                        swiper.update();
                      });
                    }}
                  >
                    {Object.entries(closedStateProductsBySeller).map(
                      ([storeId, products], index) => (
                        <SwiperSlide
                          key={storeId}
                          className="flex flex-col h-full! w-full overflow-hidden"
                        >
                          <SellerStoreClosedSlide
                            specialProducts={products}
                            orderProducts={
                              purchasedProductsBySeller[storeId] || []
                            }
                            onSellerClick={handleSellerClick}
                            isListMode={isListMode}
                            setIsReviewsModalOpen={setIsReviewsModalOpen}
                            isActive={index === currentVerticalSlide}
                            nested
                          />
                        </SwiperSlide>
                      ),
                    )}
                  </Swiper>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {showShopImagesGallery && (
        <div className="fixed inset-0 z-1000 flex flex-col bg-gray-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-[10px] pt-6">
            <Image
              src="/assets/images/logo/main-logo.svg"
              width={130}
              height={50}
              alt="Logo"
              className="object-cover"
            />
            <StrokeArrowLeftIcon
              onClick={() => setShowShopImagesGallery(false)}
              size={20}
              className={"ml-4"}
            />
          </div>
          <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden px-3 py-4">
            <Swiper
              dir="rtl"
              loop
              slidesPerView={1}
              spaceBetween={10}
              grabCursor
              className="rounded-lg overflow-hidden h-100 max-w-full"
              onSwiper={(swiper) => {
                gallerySwiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setGalleryCurrentSlide(swiper.realIndex);
              }}
            >
              {SHOP_IMAGES.map((src, i) => (
                <SwiperSlide key={i}>
                  <Image
                    src={src}
                    alt={`فروشگاه ${i + 1}`}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex justify-center gap-2 -mt-6 z-10">
              {SHOP_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => gallerySwiperRef.current?.slideTo(idx)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all cursor-pointer",
                    galleryCurrentSlide === idx ? "bg-primary w-6" : "bg-white",
                  )}
                  aria-label={`اسلاید ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center px-[10px] py-4 pb-8">
            <button
              type="button"
              onClick={handleSupport}
              className="flex items-center justify-center gap-4 font-bold w-full text-primary border-2 border-primary rounded-full py-2"
            >
              <SupportIcon size={20} />
              ارتباط با واحد پشتیبانی
            </button>
          </div>
        </div>
      )}
    </>
  );
}
