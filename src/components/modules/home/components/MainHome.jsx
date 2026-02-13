"use client";

import dynamic from "next/dynamic";
import {
  ProductsDrawer,
  ProductsList,
  ProductsSlider,
  SellerDetails,
} from "@/components/modules/home";
import { SellerReviewsModal } from "@/components/modules/seller-reviews";
import {
  ArrowUpDownIcon,
  StarIcon,
  VerifyIcon,
  VerticalListIcon,
} from "@/icons";
import Image from "next/image";
import { sellers } from "@/lib/data";
import { useState, useEffect, useRef } from "react";
import usePublicStore from "@/app/store/publicStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import HomeFilterContent from "@/components/ui/filter/HomeFilterContent";
import { SearchResultBox } from "@/components/ui/search";
import { mockSellerReviewsData } from "@/lib/mockReviewsData";

// Dynamic import for Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/modules/home/components/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100" />,
});

export default function MainHome() {
  const homeFilterSpecial = usePublicStore((s) => s.homeFilterSpecial);
  const homeFilterVisit = usePublicStore((s) => s.homeFilterVisit);
  const scrollContainerRef = useRef(null);

  const filterMode =
    homeFilterSpecial && homeFilterVisit
      ? "all"
      : homeFilterSpecial
        ? "special"
        : "visit";

  const specialProducts = [];
  const purchasedProducts = [];
  sellers.forEach((seller) => {
    seller.products.forEach((product) => {
      const productWithSeller = { ...product, seller };
      if (product.isSpecialSale) {
        specialProducts.push(productWithSeller);
      } else if (product.orderHistory) {
        purchasedProducts.push(productWithSeller);
      }
    });
  });

  const getSliderProducts = () => {
    if (filterMode === "special") return specialProducts;
    if (filterMode === "visit") return purchasedProducts;
    return specialProducts;
  };

  const sliderProducts = getSliderProducts();

  const getMapProducts = () => {
    if (filterMode === "all") {
      return [...specialProducts, ...purchasedProducts];
    }
    return sliderProducts;
  };

  const mapProducts = getMapProducts();

  const filteredSpecialForList = filterMode === "visit" ? [] : specialProducts;
  const filteredPurchasedForList =
    filterMode === "special" ? [] : purchasedProducts;

  // Initialize with first product ID
  const initialProductId =
    sliderProducts.length > 0 ? sliderProducts[0].id : null;

  const [activeProductId, setActiveProductId] = useState(initialProductId);
  const [viewMode, setViewMode] = useState("slider");
  const [activeSellerInfo, setActiveSellerInfo] = useState({
    name: "سیتی تل",
    rating: 5,
    reviews: 1000,
    address: "",
    workingHours: "",
  });
  const [isProductsListOpen, setIsProductsListOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const mapActionsRef = useRef(null);

  // Get active product from ID
  const activeProduct = activeProductId
    ? [...specialProducts, ...purchasedProducts].find(
        (p) => p.id === activeProductId,
      )
    : null;

  const activeSellerId = activeProduct?.seller?.id || null;

  // Keep activeSellerInfo in sync with activeSellerId
  useEffect(() => {
    if (activeSellerId) {
      const seller = sellers.find((s) => s.id === activeSellerId);

      if (seller) {
        setActiveSellerInfo({
          name: seller.name,
          rating: seller.rating,
          reviews: 1000,
          address: seller.address,
          workingHours: seller.workingHours,
        });
      }
    } else {
      setActiveSellerInfo({
        name: "سیتی تل",
        rating: 5,
        reviews: 1000,
        address: "",
        workingHours: "",
      });
    }
  }, [activeSellerId]);

  // When user clicks on map marker
  const handleSellerSelect = (sellerId) => {
    const products =
      filterMode === "visit"
        ? purchasedProducts
        : [...specialProducts, ...purchasedProducts];

    const firstProduct = products.find((p) => p.seller.id === sellerId);

    if (firstProduct) {
      setActiveProductId(firstProduct.id);
    }
  };

  // When user changes product (e.g. from slider/drawer)
  const handleProductChange = (product) => {
    if (product?.id) {
      setActiveProductId(product.id);
    }
  };

  // When user long-presses seller name in drawer, pan map to that seller
  const handleSellerGoToMap = (sellerId) => {
    if (mapActionsRef.current) {
      mapActionsRef.current.panToSeller(sellerId);
    }
  };

  const toggleProductsList = () => {
    setIsProductsListOpen(!isProductsListOpen);
  };

  const handleSellerNameClick = () => {
    setViewMode("seller-details");
  };

  const handleSellerNameLongPress = () => {
    if (mapActionsRef.current && activeSellerId) {
      mapActionsRef.current.panToSeller(activeSellerId);
    }
  };

  const longPressTimerRef = useRef(null);
  const isLongPressTriggeredRef = useRef(false);

  const handleSellerNameMouseDown = () => {
    isLongPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      handleSellerNameLongPress();
    }, 500);
  };

  const handleSellerNameMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressTriggeredRef.current) {
      handleSellerNameClick();
    }
  };

  const handleSellerNameMouseLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleBackToSlider = () => {
    setViewMode("slider");

    if (mapActionsRef.current) {
      mapActionsRef.current.resetMapView();
    }
  };

  const [desktopFilterOpen, setDesktopFilterOpen] = useState(false);

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
      <SellerReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        sellerData={mockSellerReviewsData}
      />
      <div className="hidden lg:block">
        <SearchResultBox isMobile={false} />
      </div>
      <div className="w-full h-full relative lg:fixed lg:inset-0">
        <Map
          activeSellerId={activeSellerId}
          onSellerSelect={handleSellerSelect}
          filteredProducts={mapProducts}
          onMapReady={(actions) => {
            mapActionsRef.current = actions;
          }}
        />
      </div>
      <div className="lg:hidden" data-drawer-wrapper>
        <ProductsDrawer
          specialProducts={filteredSpecialForList}
          purchasedProducts={filteredPurchasedForList}
          activeProductId={activeProductId}
          onProductChange={handleProductChange}
          onSellerGoToMap={handleSellerGoToMap}
        />
      </div>
      <div className="hidden lg:flex lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-[40%] xl:w-[44%] max-w-200 lg:px-4 lg:mr-24 xl:px-8 2xl:px-16 py-8 bg-gray-200/50 backdrop-blur-sm rounded-l-lg flex-col z-10">
        {/* Right side header: Desktop */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Image
                src="/assets/images/fallback/avatar.png"
                width={48}
                height={48}
                alt="avatar"
                className="bg-white rounded-lg"
              />
              <div className="flex items-center gap-0.5">
                <span
                  className="text-gray-600 cursor-pointer select-none"
                  onMouseDown={handleSellerNameMouseDown}
                  onMouseUp={handleSellerNameMouseUp}
                  onMouseLeave={handleSellerNameMouseLeave}
                >
                  {activeSellerInfo.name}
                </span>
                <VerifyIcon size={20} />
              </div>
            </div>
            <div className="flex items-center gap-4 2xl:gap-8">
              <Popover
                open={desktopFilterOpen}
                onOpenChange={setDesktopFilterOpen}
              >
                <PopoverTrigger
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-200/50 transition-colors duration-200 focus:outline-none"
                  aria-label="فیلتر موقعیت و نمایش کالاها"
                >
                  <ArrowUpDownIcon className="w-5 h-5" />
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  side="bottom"
                  sideOffset={6}
                  className="min-w-44 rounded-lg p-2 z-50 bg-white"
                >
                  <HomeFilterContent
                    onClose={() => setDesktopFilterOpen(false)}
                  />
                </PopoverContent>
              </Popover>
              <VerticalListIcon
                className="cursor-pointer w-5 h-5"
                onClick={toggleProductsList}
              />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div
              className="flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              // onClick={() => setIsReviewsModalOpen(true)}
            >
              <div className="flex items-center gap-1">
                <StarIcon className="text-yellow-500 w-4 h-4" />
                <span>
                  {activeSellerInfo.rating}
                  <span className="text-xs text-gray-600/70">/5</span>
                </span>
              </div>
              <span className="text-gray-600/70">
                آرا {activeSellerInfo.reviews}
              </span>
            </div>
            {viewMode === "slider" && (
              <div className="text-red-600 pl-10">02:19:11</div>
            )}
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 relative overflow-y-auto mt-2"
        >
          {viewMode === "slider" && (
            <ProductsSlider
              key={filterMode}
              products={sliderProducts}
              onProductChange={handleProductChange}
              activeProductId={activeProductId}
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
