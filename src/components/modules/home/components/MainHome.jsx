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

const Map = dynamic(() => import("@/components/modules/home/components/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100" />,
});

export default function MainHome({ initialData }) {
  const homeFilterSpecial = usePublicStore((s) => s.homeFilterSpecial);
  const homeFilterVisit = usePublicStore((s) => s.homeFilterVisit);
  const scrollContainerRef = useRef(null);

  // Dynamic stores to show on map and slider
  const [dynamicData, setDynamicData] = useState(initialData);
  const isLoadingRef = useRef(false);
  const pendingMoveRef = useRef(null);
  const [storeDataVersion, setStoreDataVersion] = useState(0);
  const prevStoreIdsRef = useRef(null);
  /**
   * وقتی دیتای جدید از API میاد و slider remount می‌شه،
   * اولین slide یه onProductChange fire می‌کنه که باعث می‌شه
   * نقشه ناخواسته روی اولین فروشگاه pan کنه.
   * این ref برای چند فریم، panToSeller رو در handleProductChange خاموش می‌کنه
   * تا فقط انتخاب دستی کاربر باعث حرکت نقشه بشه.
   */
  const suppressMapPanRef = useRef(false);

  const filterMode =
    homeFilterSpecial && homeFilterVisit
      ? "all"
      : homeFilterSpecial
        ? "special"
        : "visit";

  const [remainingTime, setRemainingTime] = useState("00:00:00");

  // تابع برای پارس کردن ساعات کاری
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

      // مرتب کردن روزها
      const sortedDays = [...days].sort((a, b) => a - b);

      // پیدا کردن بازه‌های پیوسته
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

      // ساخت متن روزها
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

  // تبدیل داده‌های API به فرمت مورد نیاز — هم SSR اولیه هم CSR به‌روزرسانی‌ها
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

      // بررسی اینکه آیا این فروشنده محصول ویژه داره
      const hasSpecialProducts =
        products.pickup?.some((p) => p.is_featured) ||
        false ||
        products.shipping?.some((p) => p.is_featured) ||
        false;

      // ساخت seller object
      const sellerObj = {
        id: seller.id,
        storeId: store.id,
        name: seller.seller_name || seller.business_name,
        storeName: store.name || seller.seller_name || seller.business_name, // نام فروشگاه
        rating: seller.rating || 0,
        workingHours: parseWorkingHours(store.working_days), // پارس ساعات کاری
        address: store.address || "",
        location: {
          lat: store.latitude || 0,
          lng: store.longitude || 0,
        },
        profileImage:
          seller.attachments?.[0]?.full_url ||
          "/assets/images/fallback/no-photo.jpg",
        isVerified: seller.is_verified || false,
        totalReviews: seller.total_reviews || 0,
        hasSpecialSale: hasSpecialProducts,
        hasReadyDelivery: false, // فعلاً false چون در API نیست
      };

      sellersData.push(sellerObj);

      const storeProductsList = [];

      // پردازش محصولات pickup
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
            formattedPrice: formattedPrice, // قیمت فرمت شده
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

      // پردازش محصولات shipping
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
            formattedPrice: formattedPrice, // قیمت فرمت شده
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

      // اضافه کردن فروشگاه با محصولاتش
      // همیشه فروشگاه رو اضافه کن، حتی اگر محصولی نداشته باشه
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

  const mapProducts = useMemo(() => {
    if (filterMode === "all") {
      return [...specialProducts, ...purchasedProducts];
    }
    return sliderProducts;
  }, [filterMode, specialProducts, purchasedProducts, sliderProducts]);

  const filteredSpecialForList = useMemo(
    () => (filterMode === "visit" ? [] : specialProducts),
    [filterMode, specialProducts],
  );

  const filteredPurchasedForList = useMemo(
    () => (filterMode === "special" ? [] : purchasedProducts),
    [filterMode, purchasedProducts],
  );

  const initialSellerId =
    sliderProducts.length > 0 ? sliderProducts[0].storeId : null;

  const [activeSellerId, setActiveSellerId] = useState(initialSellerId);
  const [viewMode, setViewMode] = useState("slider");

  // محاسبه activeSellerInfo با useMemo - بر اساس storeId
  const activeSellerInfo = useMemo(() => {
    if (activeSellerId) {
      // پیدا کردن فروشگاه فعال از storeProducts بر اساس storeId
      const activeStore = storeProducts.find(
        (s) => s.storeId === activeSellerId,
      );
      if (activeStore) {
        return {
          storeId: activeStore.storeId,
          name: activeStore.seller.storeName || activeStore.seller.name, // نام فروشگاه
          sellerName: activeStore.seller.name, // نام فروشنده
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

  // فچ فروشگاه‌های منطقه جدید — با الگوی pending برای جلوگیری از درخواست‌های موازی
  const handleMapMove = useCallback(async (lat, lng, radius) => {
    if (isLoadingRef.current) {
      pendingMoveRef.current = { lat, lng, radius };
      return;
    }

    isLoadingRef.current = true;
    try {
      const { homePageRes } = await getHomePageData(lat, lng, radius);
      if (homePageRes?.data) {
        const newData = homePageRes.data;
        const newStoreIds = newData.stores?.map((s) => s.store?.id) ?? [];
        const newStoreIdsSet = new Set(newStoreIds);

        // فقط اگر لیست فروشگاه‌ها واقعاً عوض شده، اسلایدر رو ریست کن
        const prevIds = prevStoreIdsRef.current;
        const storesChanged =
          !prevIds ||
          prevIds.size !== newStoreIdsSet.size ||
          newStoreIds.some((id) => !prevIds.has(id));

        // React 18 این سه setState رو در یک render اجرا می‌کنه (auto-batching)
        setDynamicData(newData);

        if (storesChanged) {
          prevStoreIdsRef.current = newStoreIdsSet;
          // قبل از remount اسلایدر، pan رو موقتاً خاموش کن
          // تا اولین onProductChange اسلایدر باعث پریدن نقشه نشه
          suppressMapPanRef.current = true;
          setTimeout(() => {
            suppressMapPanRef.current = false;
          }, 500);
          // اسلایدر رو remount کن تا Swiper state قدیمی پاک بشه
          setStoreDataVersion((v) => v + 1);
          // activeSellerId رو همزمان با دیتا ریست کن (نه با useEffect جداگانه)
          if (newStoreIds.length > 0) {
            setActiveSellerId((prev) =>
              newStoreIdsSet.has(prev) ? prev : newStoreIds[0],
            );
          }
        }
      }
    } catch (err) {
      console.error("Error fetching stores for map area:", err);
    } finally {
      isLoadingRef.current = false;
      if (pendingMoveRef.current) {
        const pending = pendingMoveRef.current;
        pendingMoveRef.current = null;
        handleMapMove(pending.lat, pending.lng, pending.radius);
      }
    }
  }, []);

  const handleSellerSelect = useCallback((storeId) => {
    setActiveSellerId(storeId);
  }, []);

  const handleProductChange = useCallback((product) => {
    if (product?.storeId) {
      setActiveSellerId(product.storeId);

      // فقط اگه کاربر دستی انتخاب کرده (نه remount اتوماتیک اسلایدر) پن بزن
      if (!suppressMapPanRef.current && mapActionsRef.current) {
        mapActionsRef.current.panToSeller(product.storeId);
      }
    }
  }, []);

  const handleSellerGoToMap = useCallback((storeId) => {
    if (mapActionsRef.current) {
      mapActionsRef.current.panToSeller(storeId);
    }
  }, []);

  const toggleProductsList = useCallback(() => {
    setIsProductsListOpen(!isProductsListOpen);
  }, [isProductsListOpen]);

  const handleSellerNameClick = useCallback((storeId) => {
    setViewMode("seller-details");
    if (mapActionsRef.current) {
      mapActionsRef.current.panToSeller(storeId);
    }
  }, []);

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
          filteredProducts={mapProducts}
          sellers={transformedSellers}
          onMapReady={(actions) => {
            mapActionsRef.current = actions;
          }}
          onMapMove={handleMapMove}
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
        />
      </div>
      <div className="hidden lg:flex lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-[40%] xl:w-[44%] max-w-200 lg:px-4 lg:mr-24 xl:px-8 2xl:px-16 bg-gray-200/50 backdrop-blur-sm rounded-l-lg flex-col z-10">
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-[50px] h-[50px]">
                <Image
                  src={
                    activeSellerInfo.profileImage ||
                    "/assets/images/fallback/no-photo.jpg"
                  }
                  fill
                  alt="avatar"
                  objectFit="contain"
                  className="bg-white rounded-md"
                />
              </div>
              <div className="flex items-center gap-0.5">
                <span
                  className="text-gray-600 cursor-pointer select-none"
                  onClick={() => handleSellerNameClick(activeSellerId)}
                >
                  {activeSellerInfo.name}
                </span>
                <VerifyIcon size={20} />
              </div>
            </div>
            {viewMode === "slider" && specialProducts.length > 0 && (
              <div className="text-error-medium">{remainingTime}</div>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div
              onClick={() => setIsReviewsModalOpen(true)}
              className="flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-1">
                <StarIcon className="text-yellow-500 w-[15px] h-[15px]" />
                <span>
                  {activeSellerInfo.rating}
                  <span className="text-xs text-gray-600/70">/5</span>
                </span>
              </div>
              <span className="text-gray-600/70">
                آرا {activeSellerInfo.reviews}
              </span>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 relative overflow-y-auto mt-2"
        >
          {viewMode === "slider" && (
            <ProductsSlider
              key={`${filterMode}-${storeDataVersion}`}
              storeProducts={storeProducts}
              onProductChange={handleProductChange}
              activeSellerId={activeSellerId}
              purchasedProducts={filteredPurchasedForList}
              activeSellerInfo={activeSellerInfo}
              filterMode={filterMode}
              scrollContainerRef={scrollContainerRef}
            />
          )}

          {viewMode === "seller-details" && (
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
