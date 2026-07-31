"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { StarIcon, VerifyIcon } from "@/icons";
import { cn } from "@/lib/client/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HorizontalProductSlider from "./HorizontalProductSlider";

export default function StoreSlideCard({
  store,
  storeIdx,
  activeIndex,
  isSpecialSale,
  remainingTime,
  onScrollEdge,
}) {
  const scrollContainerRef = useRef(null);
  const purchasedSectionRef = useRef(null);

  const specialProducts = useMemo(
    () => store.products.filter((p) => p.isSpecialSale),
    [store.products],
  );

  const nonSpecialProducts = useMemo(
    () => store.products.filter((p) => !p.isSpecialSale),
    [store.products],
  );

  const scrollToPurchasedSection = useCallback(() => {
    const container = scrollContainerRef.current;
    const section = purchasedSectionRef.current;
    if (!container || !section) return;

    const top =
      section.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;

    container.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handlePurchasedAccordionChange = useCallback(
    (value) => {
      if (value !== "purchased") return;

      // Wait for accordion expand animation before scrolling into view
      requestAnimationFrame(() => {
        setTimeout(scrollToPurchasedSection, 280);
      });
    },
    [scrollToPurchasedSection],
  );

  const isSlideActive = activeIndex === storeIdx;

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isSlideActive || !onScrollEdge) return;

    const edgeTolerance = 2;

    const handleWheel = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const canScroll = scrollHeight > clientHeight + edgeTolerance;
      const isAtTop = scrollTop <= edgeTolerance;
      const isAtBottom =
        scrollTop + clientHeight >= scrollHeight - edgeTolerance;

      if (!canScroll) {
        event.preventDefault();
        if (event.deltaY > 0) {
          onScrollEdge("down");
        } else if (event.deltaY < 0) {
          onScrollEdge("up");
        }
        return;
      }

      if (event.deltaY > 0 && isAtBottom) {
        event.preventDefault();
        onScrollEdge("down");
        return;
      }

      if (event.deltaY < 0 && isAtTop) {
        event.preventDefault();
        onScrollEdge("up");
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, [isSlideActive, onScrollEdge]);

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border-3 border-gray-200 bg-white transition-all duration-300 origin-center",
        isSlideActive ? "w-full" : "mx-auto w-[80%] h-[90%]",
      )}
    >
      <div
        className={cn(
          "flex h-full min-h-0 flex-col transition-opacity duration-300",
          isSlideActive ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-[50px] pt-[32px]">
          <div className="flex items-center gap-2">
            <div className="relative h-[50px] w-[50px] overflow-hidden rounded-lg">
              <Image
                src={
                  store.seller.profileImage ||
                  "/assets/images/fallback/no-photo.jpg"
                }
                fill
                alt={store.seller.name}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">
                  {store.seller.storeName || store.seller.name}
                </span>
                <VerifyIcon size={20} />
              </div>
            </div>
          </div>
          {isSpecialSale && remainingTime && (
            <span className="text-lg font-bold tabular-nums text-error-medium">
              {remainingTime}
            </span>
          )}
        </div>

        <div
          ref={scrollContainerRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          {specialProducts.length > 0 && (
            <Accordion type="single" collapsible defaultValue="special">
              <AccordionItem value="special">
                <AccordionTrigger className="flex items-center justify-between pr-[50px] pl-[64px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-1">
                      <StarIcon size={12} className="mt-1 text-yellow-600" />
                      <span className="text-base text-gray-600">
                        {store.seller.rating}
                        <span className="text-xs text-gray-400">/5</span>
                      </span>
                    </div>
                    <span className="text-gray-400">
                      آرا {store.seller.totalReviews}
                    </span>
                  </div>
                  <span className="pl-5 text-lg font-bold text-error-medium">
                    فروش ویژه
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <HorizontalProductSlider
                    products={specialProducts}
                    isSpecialSale={true}
                    store={store}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {nonSpecialProducts.length > 0 && (
            <div className="mx-auto my-3 h-[2.5px] w-[82%] bg-gray-200" />
          )}

          {nonSpecialProducts.length > 0 && (
            <div ref={purchasedSectionRef}>
              <Accordion
                type="single"
                collapsible
                onValueChange={handlePurchasedAccordionChange}
              >
                <AccordionItem value="purchased">
                  <AccordionTrigger className="mb-2 flex items-center justify-between pr-[50px] pl-[64px]">
                    <div></div>
                    <span className="pr-4 text-base font-bold text-primary">
                      سفارشات{" "}
                      <span className="font-extralight">(خرید حضوری)</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <HorizontalProductSlider
                      products={nonSpecialProducts}
                      isSpecialSale={false}
                      store={store}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
