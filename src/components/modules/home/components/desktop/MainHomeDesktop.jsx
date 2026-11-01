"use client";

import dynamic from "next/dynamic";
import DesktopDetailPanel from "./DesktopDetailPanel";
import DesktopMapFAB from "./DesktopMapFAB";
import toast from "react-hot-toast";

const Map = dynamic(() => import("@/components/modules/home/components/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-muted" />,
});

export default function MainHomeDesktop({ initialData, homeMain }) {
  const {
    isStoresLoading,
    remainingTime,
    transformedSellers,
    storeProducts,
    activeSellerId,
    viewMode,
    activeSellerInfo,
    mapActionsRef,
    handleMapMove,
    handleSellerSelect,
    handleSellerGoToMap,
    handleSellerNameClick,
    handleBackToSlider,
  } = homeMain;

  const handleFabClick = () => {
    if (mapActionsRef.current?.toggleGps) {
      mapActionsRef.current.toggleGps();
    } else if (mapActionsRef.current?.resetMapView) {
      mapActionsRef.current.resetMapView();
    }
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name || "کالا"} به سبد خرید اضافه شد.`);
  };

  const handleStoreSelect = (storeId) => {
    handleSellerSelect(storeId);
    handleSellerGoToMap(storeId);
  };

  return (
    <div className="hidden lg:block lg:theme-new fixed inset-0 w-full h-full overflow-hidden">
      {/* Fullscreen Map Canvas */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Map
          activeSellerId={activeSellerId}
          onSellerSelect={handleSellerSelect}
          sellers={transformedSellers}
          onMapReady={(actions) => {
            mapActionsRef.current = actions;
          }}
          onMapMove={handleMapMove}
          skipInitialAreaFetch={Boolean(initialData?.stores?.length)}
          initialUserPosition={{
            lat: 35.6892,
            lng: 51.389,
            heading: 0,
          }}
          routeLine={
            activeSellerInfo?.location
              ? {
                  from: { lat: 35.6892, lng: 51.389 },
                  to: activeSellerInfo.location,
                }
              : null
          }
        />
      </div>

      {/* Floating GPS / Location FAB Button */}
      <DesktopMapFAB onClick={handleFabClick} />

      {/* Floating Right Detail Panel */}
      <DesktopDetailPanel
        storeProducts={storeProducts}
        activeSellerId={activeSellerId}
        remainingTime={remainingTime}
        isStoresLoading={isStoresLoading}
        viewMode={viewMode}
        activeSellerInfo={activeSellerInfo}
        onSelectStore={handleStoreSelect}
        onAddToCart={handleAddToCart}
        onSellerNameClick={handleSellerNameClick}
        onBackToSlider={handleBackToSlider}
      />
    </div>
  );
}
