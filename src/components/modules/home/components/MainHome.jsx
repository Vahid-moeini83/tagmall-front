"use client";

import dynamic from "next/dynamic";
import {
  ProductsDrawer,
  ProductsList,
  ProductsSlider,
  SellerDetails,
} from "@/components/modules/home";
import {
  ArrowUpDownIcon,
  StarIcon,
  VerifyIcon,
  VerticalListIcon,
} from "@/icons";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import usePublicStore from "@/app/store/publicStore";
import { formatPrice } from "@/lib/client/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import HomeFilterContent from "@/components/ui/filter/HomeFilterContent";
import { SearchResultBox } from "@/components/ui/search";
import { mockSellerReviewsData } from "@/lib/client/mockReviewsData";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SellerReviewsContent from "../../seller-reviews/components/SellerReviewsContent";
import { getHomePageData } from "@/lib/server/actions/home";
import {
  HomeSliderEmptyState,
  HomeSliderSkeleton,
} from "@/components/ui/loading";

const Map = dynamic(() => import("@/components/modules/home/components/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100" />,
});

export default function MainHome({ initialData }) {
  const homeFilterSpecial = usePublicStore((s) => s.homeFilterSpecial);
  const homeFilterVisit = usePublicStore((s) => s.homeFilterVisit);
  const scrollContainerRef = useRef(null);

  // Regional store data — SSR seed, then refreshed on map move (CSR)
  const [dynamicData, setDynamicData] = useState(initialData);
  const [isStoresLoading, setIsStoresLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const pendingMoveRef = useRef(null);
  const lastFetchParamsRef = useRef(null);
  const [storeDataVersion, setStoreDataVersion] = useState(0);
  const prevStoreIdsRef = useRef(
    initialData?.stores
      ? new Set(
          initialData.stores.map((s) => s.store?.id).filter(Boolean),
        )
      : null,
  );
  // Suppress programmatic map pan after slider remount or bulk data refresh
  const suppressMapPanRef = useRef(false);

  const filterMode =
    homeFilterSpecial && homeFilterVisit
      ? "all"
      : homeFilterSpecial
        ? "special"
        : "visit";

  const [remainingTime, setRemainingTime] = useState("00:00:00");

  const parseWorkingHours = useCallback((workingDays) => {
    if (
      !workingDays ||
      !Array.isArray(workingDays) ||
      workingDays.length === 0
    ) {
      return "نامشخص";
    }

    const dayNames = [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
    ];

    const schedules = workingDays.map((schedule) => {
      const { days, opening_time, closing_time } = schedule;

      if (!days || days.length === 0) return null;

      // Sort weekday indices and merge consecutive ranges
      const sortedDays = [...days].sort((a, b) => a - b);

      // Build contiguous day ranges for display
      let ranges = [];
      let start = sortedDays[0];
      let end = sortedDays[0];

      for (let i = 1; i < sortedDays.length; i++) {
        if (sortedDays[i] === end + 1) {
          end = sortedDays[i];
        } else {
          ranges.push({ start, end });
          start = sortedDays[i];
          end = sortedDays[i];
        }
      }
      ranges.push({ start, end });

      // Format day labels
      const daysText = ranges
        .map((range) => {
          if (range.start === range.end) {
            return dayNames[range.start];
          }
          return `${dayNames[range.start]} تا ${dayNames[range.end]}`;
        })
        .join(" و ");

      return `${daysText} از ساعت ${opening_time} تا ${closing_time}`;
    });

    return schedules.filter(Boolean).join(" | ");
  }, []);

  useEffect(() => {
    const seconds = initialData?.featured_sale_remainings_seconds;

    if (!seconds || seconds <= 0) {
      return;
    }

    let currentSeconds = seconds;

    const updateTimer = () => {
      if (currentSeconds <= 0) {
        setRemainingTime("00:00:00");
        return;
      }

      const hours = Math.floor(currentSeconds / 3600);
      const minutes = Math.floor((currentSeconds % 3600) / 60);
      const secs = currentSeconds % 60;

      setRemainingTime(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
      );

      currentSeconds--;
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [initialData?.featured_sale_remainings_seconds]);

  // Normalize API payload for map markers and vertical slider
  const {
    specialProducts,
    purchasedProducts,
    sellers: transformedSellers,
    storeProducts,
  } = useMemo(() => {
    if (!dynamicData?.stores || !Array.isArray(dynamicData.stores)) {
      return {
        specialProducts: [],
        purchasedProducts: [],
        sellers: [],
        storeProducts: [],
      };
    }

    const special = [];
    const purchased = [];
    const sellersData = [];
    const storesData = [];

    dynamicData.stores.forEach((storeData) => {
      const { store, seller, products } = storeData;

      const hasSpecialProducts =
        storeData.has_featured_products === true ||
        products.pickup?.some((p) => p.is_featured) ||
        products.shipping?.some((p) => p.is_featured);

      const hasReadyDelivery =
        Array.isArray(products.pickup) && products.pickup.length > 0;

      const sellerObj = {
        id: seller.id,
        storeId: store.id,
        name: seller.seller_name || seller.business_name,
        storeName: store.name ?? "نامشخص",
        rating: seller.rating || 0,
        workingHours: parseWorkingHours(store.working_days),
        address: store.address || "",
        location: {
          lat: parseFloat(store.latitude) || 0,
          lng: parseFloat(store.longitude) || 0,
        },
        profileImage:
          seller.attachments?.[0]?.full_url ||
          "/assets/images/fallback/no-photo.jpg",
        isVerified: seller.is_verified || false,
        totalReviews: seller.total_reviews || 0,
        hasSpecialSale: hasSpecialProducts,
        hasReadyDelivery,
      };

      sellersData.push(sellerObj);

      const storeProductsList = [];

      // Pickup products (in-store ready delivery)
      if (products.pickup && Array.isArray(products.pickup)) {
        products.pickup.forEach((product) => {
          const singlePrice = product.price_range?.single_price || 0;
          const formattedPrice = singlePrice > 0 ? formatPrice(singlePrice) : 0;

          const productObj = {
            id: `${store.id}-pickup-${product.id}`,
            storeId: store.id,
            sellerId: seller.id,
            name: product.name,
            img:
              product.attachments?.[0]?.full_url ||
              "/assets/images/fallback/no-photo.jpg",
            price: singlePrice,
            discountPercent: 0,
            finalPrice: singlePrice,
            formattedPrice: formattedPrice,
            deliveryType: "pickup",
            isSpecialSale: product.is_featured || false,
            rating: parseFloat(product.rating) || 0,
            totalReviews: product.total_reviews || 0,
            totalSales: product.total_sales || 0,
            brand: product.brand?.name || "",
            category: product.category?.name || "",
            seller: sellerObj,
          };

          storeProductsList.push(productObj);

          if (productObj.isSpecialSale) {
            special.push(productObj);
          }
        });
      }

      // Shipping products
      if (products.shipping && Array.isArray(products.shipping)) {
        products.shipping.forEach((product) => {
          const singlePrice = product.price_range?.single_price || 0;
          const formattedPrice = singlePrice > 0 ? formatPrice(singlePrice) : 0;

          const productObj = {
            id: `${store.id}-shipping-${product.id}`,
            storeId: store.id,
            sellerId: seller.id,
            name: product.name,
            img:
              product.attachments?.[0]?.full_url ||
              "/assets/images/fallback/no-photo.jpg",
            price: singlePrice,
            discountPercent: 0,
            finalPrice: singlePrice,
            formattedPrice: formattedPrice,
            deliveryType: "shipping",
            isSpecialSale: product.is_featured || false,
            rating: parseFloat(product.rating) || 0,
            totalReviews: product.total_reviews || 0,
            totalSales: product.total_sales || 0,
            brand: product.brand?.name || "",
            category: product.category?.name || "",
            seller: sellerObj,
          };

          storeProductsList.push(productObj);

          if (productObj.isSpecialSale) {
            special.push(productObj);
          }
        });
      }

      storesData.push({
        storeId: store.id,
        seller: sellerObj,
        products: storeProductsList,
      });
    });

    return {
      specialProducts: special,
      purchasedProducts: purchased,
      sellers: sellersData,
      storeProducts: storesData,
    };
  }, [dynamicData, parseWorkingHours]);

  const sliderProducts = useMemo(() => {
    if (filterMode === "special") return specialProducts;
    if (filterMode === "visit") return purchasedProducts;
    return specialProducts;
  }, [filterMode, specialProducts, purchasedProducts]);

  const filteredSpecialForList = useMemo(
    () => (filterMode === "visit" ? [] : specialProducts),
    [filterMode, specialProducts],
  );

  const filteredPurchasedForList = useMemo(
    () => (filterMode === "special" ? [] : purchasedProducts),
    [filterMode, purchasedProducts],
  );

  const filteredStoreProducts = useMemo(() => {
    if (!storeProducts?.length) return [];

    if (filterMode === "visit") {
      return storeProducts.filter((store) =>
        filteredPurchasedForList.some((p) => p.storeId === store.storeId),
      );
    }

    if (filterMode === "special") {
      return storeProducts.filter((store) =>
        store.products.some((p) => p.isSpecialSale),
      );
    }

    return storeProducts;
  }, [storeProducts, filterMode, filteredPurchasedForList]);

  const hasSliderStores = filteredStoreProducts.length > 0;

  const [activeSellerId, setActiveSellerId] = useState(
    () => initialData?.stores?.[0]?.store?.id ?? null,
  );
  const [viewMode, setViewMode] = useState("slider");

  // Derive active store card info from regional store list
  const activeSellerInfo = useMemo(() => {
    if (activeSellerId) {
      const activeStore = storeProducts.find(
        (s) => s.storeId === activeSellerId,
      );
      if (activeStore) {
        return {
          storeId: activeStore.storeId,
          name: activeStore.seller.storeName || activeStore.seller.name,
          sellerName: activeStore.seller.name,
          rating: activeStore.seller.rating,
          reviews: activeStore.seller.totalReviews || 1000,
          address: activeStore.seller.address,
          workingHours: activeStore.seller.workingHours,
          profileImage: activeStore.seller.profileImage,
        };
      }
    }

    if (storeProducts.length > 0) {
      const firstStore = storeProducts[0];
      return {
        storeId: firstStore.storeId,
        name: firstStore.seller.storeName || firstStore.seller.name,
        sellerName: firstStore.seller.name,
        rating: firstStore.seller.rating,
        reviews: firstStore.seller.totalReviews || 1000,
        address: firstStore.seller.address,
        workingHours: firstStore.seller.workingHours,
        profileImage: firstStore.seller.profileImage,
      };
    }

    return {
      storeId: null,
      name: "فروشگاه یافت نشد",
      sellerName: "",
      rating: 5,
      reviews: 1000,
      address: "",
      workingHours: "",
      profileImage: "/assets/images/fallback/no-photo.jpg",
    };
  }, [activeSellerId, storeProducts]);

  const [isProductsListOpen, setIsProductsListOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const mapActionsRef = useRef(null);

  const buildFetchKey = useCallback((lat, lng, radius) => {
    return `${Number(lat).toFixed(4)}:${Number(lng).toFixed(4)}:${radius}`;
  }, []);

  // Fetch stores for the visible map viewport — queued to avoid parallel requests
  const handleMapMove = useCallback(
    async (lat, lng, radius) => {
      const fetchKey = buildFetchKey(lat, lng, radius);

      if (isLoadingRef.current) {
        pendingMoveRef.current = { lat, lng, radius };
        return;
      }

      if (lastFetchParamsRef.current === fetchKey) {
        return;
      }

      isLoadingRef.current = true;
      setIsStoresLoading(true);
      try {
        const { homePageRes } = await getHomePageData(lat, lng, radius);
        if (homePageRes?.data) {
          lastFetchParamsRef.current = fetchKey;
          const newData = homePageRes.data;
          const newStoreIds = newData.stores?.map((s) => s.store?.id) ?? [];
          const newStoreIdsSet = new Set(newStoreIds);

          const prevIds = prevStoreIdsRef.current;
          const storesChanged =
            !prevIds ||
            prevIds.size !== newStoreIdsSet.size ||
            newStoreIds.some((id) => !prevIds.has(id));

          setDynamicData(newData);

          if (storesChanged) {
            prevStoreIdsRef.current = newStoreIdsSet;
            suppressMapPanRef.current = true;
            setTimeout(() => {
              suppressMapPanRef.current = false;
            }, 500);
            setStoreDataVersion((v) => v + 1);
            if (newStoreIds.length > 0) {
              setActiveSellerId((prev) =>
                newStoreIdsSet.has(prev) ? prev : newStoreIds[0],
              );
            } else {
              setActiveSellerId(null);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching stores for map area:", err);
      } finally {
        isLoadingRef.current = false;
        setIsStoresLoading(false);
        if (pendingMoveRef.current) {
          const pending = pendingMoveRef.current;
          pendingMoveRef.current = null;
          handleMapMove(pending.lat, pending.lng, pending.radius);
        }
      }
    },
    [buildFetchKey],
  );

  const handleSellerSelect = useCallback((storeId) => {
    setActiveSellerId(storeId);
  }, []);

  const handleProductChange = useCallback((product) => {
    if (product?.storeId) {
      setActiveSellerId(product.storeId);
    }
  }, []);

  const handleSellerGoToMap = useCallback((storeId) => {
    if (suppressMapPanRef.current) return;
    if (mapActionsRef.current) {
      mapActionsRef.current.panToSeller(storeId);
    }
  }, []);

  const handleSellerNameClick = useCallback((storeId) => {
    setViewMode("seller-details");
    if (suppressMapPanRef.current) return;
    if (mapActionsRef.current) {
      mapActionsRef.current.panToSeller(storeId);
    }
  }, []);

  const toggleProductsList = useCallback(() => {
    setIsProductsListOpen(!isProductsListOpen);
  }, [isProductsListOpen]);

  const handleBackToSlider = useCallback(() => {
    setViewMode("slider");
  }, []);

  return (
    <div className="h-screen flex flex-row-reverse relative">
      {isProductsListOpen && (
        <ProductsList
          isOpen={isProductsListOpen}
          onClose={toggleProductsList}
          specialProducts={filteredSpecialForList}
          purchasedProducts={filteredPurchasedForList}
        />
      )}
      {isDesktop ? (
        isReviewsModalOpen && (
          <div className="fixed inset-0 z-1000 bg-white h-screen">
            <SellerReviewsContent
              onClose={() => setIsReviewsModalOpen(false)}
              sellerData={mockSellerReviewsData}
            />
          </div>
        )
      ) : (
        <Drawer
          open={isReviewsModalOpen}
          onOpenChange={() => setIsReviewsModalOpen(false)}
        >
          <DrawerContent
            className="z-100! px-[10px] h-[96%]!"
            overlayClassName="z-100 lg:hidden"
          >
            <SellerReviewsContent sellerData={mockSellerReviewsData} />
          </DrawerContent>
        </Drawer>
      )}
      <div className="hidden lg:block">
        <SearchResultBox isMobile={false} />
      </div>
      <div className="w-full h-full relative lg:fixed lg:inset-0">
        <Map
          activeSellerId={activeSellerId}
          onSellerSelect={handleSellerSelect}
          sellers={transformedSellers}
          onMapReady={(actions) => {
            mapActionsRef.current = actions;
          }}
          onMapMove={handleMapMove}
          skipInitialAreaFetch={Boolean(initialData?.stores?.length)}
        />
      </div>
      <div className="lg:hidden" data-drawer-wrapper>
        <ProductsDrawer
          storeProducts={storeProducts}
          specialProducts={filteredSpecialForList}
          purchasedProducts={filteredPurchasedForList}
          activeSellerId={activeSellerId}
          onProductChange={handleProductChange}
          onSellerGoToMap={handleSellerGoToMap}
          setIsReviewsModalOpen={setIsReviewsModalOpen}
          remainingTime={remainingTime}
          isStoresLoading={isStoresLoading}
          hasSliderStores={hasSliderStores}
        />
      </div>
      <div className="hidden lg:flex lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-[40%] xl:w-[44%] max-w-200 lg:px-4 lg:mr-24 xl:px-8 2xl:px-16 bg-gray-200/50 backdrop-blur-sm rounded-l-lg flex-col z-10">
        <div
          ref={scrollContainerRef}
          className="flex-1 relative overflow-y-auto"
        >
          {viewMode === "slider" &&
            (isStoresLoading ? (
              <HomeSliderSkeleton variant="desktop" />
            ) : !hasSliderStores ? (
              <HomeSliderEmptyState variant="desktop" />
            ) : (
              <ProductsSlider
                key={`${filterMode}-${storeDataVersion}`}
                storeProducts={storeProducts}
                onProductChange={handleProductChange}
                activeSellerId={activeSellerId}
                purchasedProducts={filteredPurchasedForList}
                activeSellerInfo={activeSellerInfo}
                filterMode={filterMode}
                scrollContainerRef={scrollContainerRef}
                remainingTime={remainingTime}
              />
            ))}

          {viewMode === "seller-details" && hasSliderStores && (
            <SellerDetails
              activeSellerInfo={activeSellerInfo}
              viewMode={viewMode}
              onBackToSlider={handleBackToSlider}
            />
          )}
        </div>
      </div>
    </div>
  );
}
