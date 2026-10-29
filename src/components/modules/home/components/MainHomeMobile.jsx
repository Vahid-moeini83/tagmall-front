"use client";

import dynamic from "next/dynamic";
import {
  ProductsDrawer,
  ProductsList,
  ProductsSlider,
  SellerDetails,
} from "@/components/modules/home";
import { useRef } from "react";
import { cn } from "@/lib/client/utils";
import { SearchResultBox } from "@/components/ui/search";
import { mockSellerReviewsData } from "@/lib/client/mockReviewsData";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SellerReviewsContent from "../../seller-reviews/components/SellerReviewsContent";
import {
  HomeSliderEmptyState,
  HomeSliderSkeleton,
} from "@/components/ui/loading";

const Map = dynamic(() => import("@/components/modules/home/components/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100" />,
});

export default function MainHomeMobile({ initialData, homeMain }) {
  const {
    isStoresLoading,
    filterMode,
    remainingTime,
    transformedSellers,
    storeProducts,
    filteredSpecialForList,
    filteredPurchasedForList,
    hasSliderStores,
    activeSellerId,
    viewMode,
    activeSellerInfo,
    isProductsListOpen,
    closeProductsList,
    isReviewsModalOpen,
    setIsReviewsModalOpen,
    mapActionsRef,
    handleMapMove,
    handleSellerSelect,
    handleProductChange,
    handleSellerGoToMap,
    handleBackToSlider,
  } = homeMain;

  const scrollContainerRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="h-screen flex flex-row-reverse relative">
      {isDesktop && isProductsListOpen && (
        <ProductsList
          onClose={closeProductsList}
          specialProducts={filteredSpecialForList}
          purchasedProducts={filteredPurchasedForList}
          filterMode={filterMode}
          remainingTime={remainingTime}
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
            className="z-100! h-[96%]!"
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
        {!isDesktop && (
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
        )}
      </div>
      <div className="hidden lg:flex lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-[40%] xl:w-[44%] max-w-200 lg:px-4 lg:mr-24 xl:px-8 2xl:px-16 bg-gray-200/50 backdrop-blur-sm rounded-l-lg flex-col z-10">
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex-1 relative min-h-0",
            viewMode === "slider" ? "overflow-hidden" : "overflow-y-auto",
          )}
        >
          {viewMode === "slider" &&
            (isStoresLoading ? (
              <HomeSliderSkeleton variant="desktop" />
            ) : !hasSliderStores ? (
              <HomeSliderEmptyState variant="desktop" />
            ) : (
              <div className="h-full min-h-0">
                <ProductsSlider
                  key={filterMode}
                  storeProducts={storeProducts}
                  onProductChange={handleProductChange}
                  activeSellerId={activeSellerId}
                  purchasedProducts={filteredPurchasedForList}
                  activeSellerInfo={activeSellerInfo}
                  filterMode={filterMode}
                  scrollContainerRef={scrollContainerRef}
                  remainingTime={remainingTime}
                />
              </div>
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
