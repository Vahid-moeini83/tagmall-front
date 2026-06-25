"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DialogWrapper } from "@/components/ui/dialog";
import StoreSlideCard from "./StoreSlideCard";

function normalizeStoreId(id) {
  return id == null ? null : String(id);
}

export default function ProductsSlider({
  storeProducts,
  onProductChange,
  activeSellerId,
  purchasedProducts,
  filterMode,
  remainingTime,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const verticalSwiperRef = useRef(null);
  const internalActiveStoreIdRef = useRef(null);
  const onProductChangeRef = useRef(onProductChange);
  const prevFilteredStoreIdsRef = useRef("");

  const filteredStores = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) return [];

    if (filterMode === "visit") {
      return storeProducts.filter((store) =>
        purchasedProducts.some(
          (p) =>
            normalizeStoreId(p.storeId) === normalizeStoreId(store.storeId),
        ),
      );
    }

    if (filterMode === "special") {
      return storeProducts.filter((store) =>
        store.products.some((p) => p.isSpecialSale),
      );
    }

    return storeProducts;
  }, [storeProducts, filterMode, purchasedProducts]);

  const storeCount = filteredStores.length;
  const isSpecialSale = filterMode === "special" || filterMode === "all";

  useEffect(() => {
    onProductChangeRef.current = onProductChange;
  }, [onProductChange]);

  // Marker click / external selection
  useEffect(() => {
    if (!verticalSwiperRef.current || !activeSellerId) return;

    const activeId = normalizeStoreId(activeSellerId);
    const idx = filteredStores.findIndex(
      (store) => normalizeStoreId(store.storeId) === activeId,
    );

    if (internalActiveStoreIdRef.current === activeId) {
      internalActiveStoreIdRef.current = null;
      return;
    }

    if (idx < 0 || verticalSwiperRef.current.realIndex === idx) return;

    verticalSwiperRef.current.slideTo(idx, 300);
  }, [activeSellerId, filteredStores]);

  // When filter or store list changes, reset only if active store is no longer visible
  useEffect(() => {
    if (!verticalSwiperRef.current || filteredStores.length === 0) return;
    if (!activeSellerId) {
      internalActiveStoreIdRef.current = null;
      return;
    }

    const activeId = normalizeStoreId(activeSellerId);
    const isActiveVisible = filteredStores.some(
      (store) => normalizeStoreId(store.storeId) === activeId,
    );

    if (isActiveVisible) return;

    verticalSwiperRef.current.slideTo(0, 0);

    const firstStore = filteredStores[0];
    if (firstStore?.products?.length > 0) {
      internalActiveStoreIdRef.current = normalizeStoreId(firstStore.storeId);
      onProductChangeRef.current?.(firstStore.products[0]);
    }
  }, [filterMode, filteredStores, activeSellerId]);

  useEffect(() => {
    const idsKey = filteredStores
      .map((store) => normalizeStoreId(store.storeId))
      .join("|");
    if (idsKey === prevFilteredStoreIdsRef.current) return;

    prevFilteredStoreIdsRef.current = idsKey;

    if (verticalSwiperRef.current) {
      verticalSwiperRef.current.update();
    }
  }, [filteredStores]);

  const handleSlideChange = useCallback(
    (swiper) => {
      const idx = swiper.realIndex;
      const store = filteredStores[idx];
      const storeId = store ? normalizeStoreId(store.storeId) : null;

      setActiveIndex(idx);

      if (store?.products?.length > 0) {
        internalActiveStoreIdRef.current = storeId;
        onProductChangeRef.current?.(store.products[0]);
      }
    },
    [filteredStores],
  );

  const handleScrollEdge = useCallback(
    (direction) => {
      const swiper = verticalSwiperRef.current;
      if (!swiper) return;

      const nextIndex =
        direction === "down"
          ? Math.min(swiper.realIndex + 1, storeCount - 1)
          : Math.max(swiper.realIndex - 1, 0);

      if (nextIndex === swiper.realIndex) return;

      swiper.slideTo(nextIndex, 300);
    },
    [storeCount],
  );

  if (storeCount === 0) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Swiper
        direction="vertical"
        slidesPerView={1.1}
        spaceBetween={5}
        centeredSlides
        grabCursor
        nested
        touchReleaseOnEdges
        onSwiper={(swiper) => {
          verticalSwiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);

          const stores = filteredStores;
          const activeId = normalizeStoreId(activeSellerId);

          if (activeId) {
            const idx = stores.findIndex(
              (store) => normalizeStoreId(store.storeId) === activeId,
            );
            if (idx >= 0) {
              internalActiveStoreIdRef.current = activeId;
              swiper.slideTo(idx, 0);
              setActiveIndex(idx);
              return;
            }
          }

          const firstStore = stores[0];
          if (firstStore?.products?.length > 0) {
            internalActiveStoreIdRef.current = normalizeStoreId(
              firstStore.storeId,
            );
            onProductChangeRef.current?.(firstStore.products[0]);
          }
        }}
        onSlideChange={handleSlideChange}
        className="h-full w-full py-2"
      >
        {filteredStores.map((store, storeIdx) => (
          <SwiperSlide key={store.storeId} className="flex! items-center!">
            <div className="h-full w-full overflow-hidden">
              <StoreSlideCard
                store={store}
                storeIdx={storeIdx}
                activeIndex={activeIndex}
                isSpecialSale={isSpecialSale}
                remainingTime={remainingTime}
                onScrollEdge={handleScrollEdge}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <DialogWrapper
        title={"اسم محصول"}
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
      >
        یادداشت کاربر: لطفا محصول را در بسته بندی تیره قرار دهید. ممنون!
      </DialogWrapper>
    </div>
  );
}
