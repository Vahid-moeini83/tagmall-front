"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import usePublicStore from "@/app/store/publicStore";
import { formatPrice } from "@/lib/client/utils";
import { getHomePageData } from "@/lib/server/actions/home";

// Shared logic of MainHome; used by both mobile and desktop views
export function useMainHome(initialData) {
  const homeFilterSpecial = usePublicStore((s) => s.homeFilterSpecial);
  const homeFilterVisit = usePublicStore((s) => s.homeFilterVisit);

  // Regional store data — SSR seed, then refreshed on map move (CSR)
  const [dynamicData, setDynamicData] = useState(initialData);
  const [isStoresLoading, setIsStoresLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const pendingMoveRef = useRef(null);
  const lastFetchParamsRef = useRef(null);
  const prevStoreIdsRef = useRef(
    initialData?.stores
      ? new Set(initialData.stores.map((s) => s.store?.id).filter(Boolean))
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
        storeId: String(store.id),
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
            storeId: String(store.id),
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
          } else {
            purchased.push({
              ...productObj,
              orderHistory: {
                statusLabel: "آماده تحویل",
                userNote: product.user_note || null,
              },
            });
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
            storeId: String(store.id),
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
        storeId: String(store.id),
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

  const [activeSellerId, setActiveSellerId] = useState(() => {
    const id = initialData?.stores?.[0]?.store?.id;
    return id != null ? String(id) : null;
  });
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

  const isProductsListOpen = usePublicStore((s) => s.homeProductsListOpen);
  const setHomeProductsListOpen = usePublicStore(
    (s) => s.setHomeProductsListOpen,
  );
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(false);

  const mapActionsRef = useRef(null);
  const handleMapMoveRef = useRef(null);

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
            if (newStoreIds.length > 0) {
              const normalizedIds = newStoreIds.map((id) => String(id));
              const normalizedSet = new Set(normalizedIds);
              setActiveSellerId((prev) => {
                const prevId = prev != null ? String(prev) : null;
                return prevId && normalizedSet.has(prevId)
                  ? prevId
                  : normalizedIds[0];
              });
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
          handleMapMoveRef.current?.(pending.lat, pending.lng, pending.radius);
        }
      }
    },
    [buildFetchKey],
  );

  useEffect(() => {
    handleMapMoveRef.current = handleMapMove;
  }, [handleMapMove]);

  const handleSellerSelect = useCallback((storeId) => {
    setActiveSellerId(storeId != null ? String(storeId) : null);
  }, []);

  const handleProductChange = useCallback((product) => {
    if (product?.storeId != null) {
      setActiveSellerId(String(product.storeId));
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

  const closeProductsList = useCallback(() => {
    setHomeProductsListOpen(false);
  }, [setHomeProductsListOpen]);

  const handleBackToSlider = useCallback(() => {
    setViewMode("slider");
  }, []);

  return {
    dynamicData,
    setDynamicData,
    isStoresLoading,
    filterMode,
    remainingTime,
    specialProducts,
    purchasedProducts,
    transformedSellers,
    storeProducts,
    sliderProducts,
    filteredSpecialForList,
    filteredPurchasedForList,
    filteredStoreProducts,
    hasSliderStores,
    activeSellerId,
    setActiveSellerId,
    viewMode,
    setViewMode,
    activeSellerInfo,
    isProductsListOpen,
    closeProductsList,
    isReviewsModalOpen,
    setIsReviewsModalOpen,
    desktopFilterOpen,
    setDesktopFilterOpen,
    mapActionsRef,
    handleMapMove,
    handleSellerSelect,
    handleProductChange,
    handleSellerGoToMap,
    handleSellerNameClick,
    handleBackToSlider,
  };
}
