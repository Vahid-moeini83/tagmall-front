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
import { sellers } from "@/lib/client/data";
import { useState, useEffect, useRef } from "react";
import usePublicStore from "@/app/store/publicStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import HomeFilterContent from "@/components/ui/filter/HomeFilterContent";
import { SearchResultBox } from "@/components/ui/search";
import { mockSellerReviewsData } from "@/lib/client/mockReviewsData";

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

  const initialSellerId =
    sliderProducts.length > 0 ? sliderProducts[0].seller.id : null;

  const [activeSellerId, setActiveSellerId] = useState(initialSellerId);
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
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(false);
  const mapActionsRef = useRef(null);

  const handleSellerSelect = (sellerId) => {
    setActiveSellerId(sellerId);
  };

  const handleProductChange = (product) => {
    if (product?.seller?.id) {
      setActiveSellerId(product.seller.id);

      if (mapActionsRef.current) {
        mapActionsRef.current.panToSeller(product.seller.id);
      }
    }
  };

  const handleSellerGoToMap = (sellerId) => {
    if (mapActionsRef.current) {
      mapActionsRef.current.panToSeller(sellerId);
    }
  };

  const toggleProductsList = () => {
    setIsProductsListOpen(!isProductsListOpen);
  };

  const handleSellerNameClick = (sellerId) => {
    setViewMode("seller-details");
    handleSellerGoToMap(sellerId);
  };

  const handleBackToSlider = () => {
    setViewMode("slider");
  };

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
          activeSellerId={activeSellerId}
          onProductChange={handleProductChange}
          onSellerGoToMap={handleSellerGoToMap}
          setIsReviewsModalOpen={setIsReviewsModalOpen}
        />
      </div>
      <div className="hidden lg:flex lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-[40%] xl:w-[44%] max-w-200 lg:px-4 lg:mr-24 xl:px-8 2xl:px-16 py-8 bg-gray-200/50 backdrop-blur-sm rounded-l-lg flex-col z-10">
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/fallback/avatar.png"
                width={48}
                height={48}
                alt="avatar"
                className="bg-white rounded-md"
              />
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
                  className="min-w-44 rounded-md p-2 z-50 bg-white"
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
              onClick={() => setIsReviewsModalOpen(true)}
              className="flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity"
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
              <div className="text-error-medium pl-10">02:19:11</div>
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
