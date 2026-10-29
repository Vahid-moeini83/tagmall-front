"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  VerifyIcon,
  StarIcon,
  AngleLeftCircleIcon,
  ReceiptTextIcon,
} from "@/icons";
import DesktopProductCard from "./DesktopProductCard";
import { cn } from "@/lib/client/utils";

export default function DesktopStoreCard({
  store,
  isActive,
  remainingTime,
  onSelectStore,
  onAddToCart,
  onSellerNameClick,
}) {
  const [activeTab, setActiveTab] = useState("special"); // "special" | "orders"
  const [activePageIndex, setActivePageIndex] = useState(0);
  const sliderRef = useRef(null);

  const seller = store.seller;
  const storeName = seller.storeName || seller.name || "فروشگاه";
  const ratingText = seller.rating ? `${seller.rating}/۵` : "۴.۹/۵";

  // Split timer into HH, MM, SS
  const [hours, minutes, seconds] = useMemo(() => {
    if (!remainingTime) return ["۰۰", "۰۰", "۰۰"];
    const parts = remainingTime.split(":");
    return [parts[0] || "۰۰", parts[1] || "۰۰", parts[2] || "۰۰"];
  }, [remainingTime]);

  const specialProducts = useMemo(
    () => store.products?.filter((p) => p.isSpecialSale) || [],
    [store.products],
  );

  const purchasedProducts = useMemo(
    () => store.products?.filter((p) => !p.isSpecialSale) || [],
    [store.products],
  );

  const currentProducts =
    activeTab === "special" ? specialProducts : purchasedProducts;

  // Track active slide index on scroll
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollPos = Math.abs(el.scrollLeft);
      const cardWidth = 252; // 240 + 12 gap
      const index = Math.round(scrollPos / cardWidth);
      setActivePageIndex(Math.min(index, 3));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 252;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      onClick={onSelectStore}
      className={cn(
        "bg-surface-subtle border rounded-xl p-3 py-4 flex flex-col gap-3 transition-all duration-300 cursor-pointer",
        isActive
          ? "border-primary shadow-card ring-1 ring-primary/20"
          : "border-border-default hover:border-border-strong",
      )}
    >
      {/* Store Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle h-12.5">
        {/* Right side: Store Avatar & Title */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSellerNameClick?.(store.storeId);
          }}
          className="flex items-center gap-3 hover:opacity-85 transition-opacity cursor-pointer"
          title="مشاهده جزئیات فروشگاه"
        >
          <div className="size-12.5 rounded-xl border border-border-default overflow-hidden relative shrink-0">
            <Image
              src={seller.profileImage || "/assets/images/fallback/no-photo.jpg"}
              alt={storeName}
              width={50}
              height={50}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-h5 font-semibold text-text-primary">
              {storeName}
            </h3>
            {seller.isVerified && <VerifyIcon size={19} />}
          </div>
        </div>

        {/* Left side: Badges */}
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <div className="bg-surface-muted rounded-pill px-2.5 py-1.5 text-label text-text-secondary font-normal">
            باز است
          </div>
          {/* Rating badge */}
          <div className="bg-surface-muted rounded-pill px-2.5 py-1.5 text-label text-text-secondary font-normal flex items-center gap-1">
            <StarIcon size={15} className="text-warning" />
            <span className="font-semibold">{ratingText}</span>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="bg-surface-muted rounded-xl p-1.5 flex gap-2 h-12">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("special");
          }}
          className={cn(
            "flex-1 py-2 px-3 rounded-lg text-small text-center transition-all cursor-pointer font-medium",
            activeTab === "special"
              ? "bg-surface shadow-card text-primary"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          فروش ویژه این فروشگاه
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("orders");
          }}
          className={cn(
            "flex-1 py-2 px-3 rounded-lg text-small text-center transition-all cursor-pointer font-medium",
            activeTab === "orders"
              ? "bg-surface shadow-card text-primary"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          سفارشات جاری شما
        </button>
      </div>

      {/* Countdown Timer Row (Special sale only, exact Figma structure) */}
      {activeTab === "special" && (
        <div className="flex items-center justify-between px-1 h-8">
          <span className="text-small font-medium text-error">
            مانده تا پایان فروش ویژه:
          </span>
          <div className="flex items-center gap-2" dir="rtl">
            <div className="size-8 rounded-md bg-error text-surface flex items-center justify-center font-bold text-small shrink-0">
              {seconds}
            </div>
            <span className="text-small text-text-primary font-normal">
              ثانیه
            </span>
            <span className="text-small text-text-primary font-bold">:</span>
            <div className="size-8 rounded-md bg-error text-surface flex items-center justify-center font-bold text-small shrink-0">
              {minutes}
            </div>
            <span className="text-small text-text-primary font-normal">
              دقیقه
            </span>
            <span className="text-small text-text-primary font-bold">:</span>
            <div className="size-8 rounded-md bg-error text-surface flex items-center justify-center font-bold text-small shrink-0">
              {hours}
            </div>
            <span className="text-small text-text-primary font-normal">
              ساعت
            </span>
          </div>
        </div>
      )}

      {/* Product Slider / List */}
      {currentProducts.length > 0 ? (
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex items-stretch gap-3 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth"
          >
            {currentProducts.map((product) => (
              <DesktopProductCard
                key={product.id}
                product={product}
                mode={activeTab}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* Slider navigation & pagination controls matching Figma */}
          <div className="flex items-center justify-center gap-3 mt-3 h-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollSlider("right");
              }}
              aria-label="قبلی"
              className="text-text-muted hover:text-primary transition-colors cursor-pointer rotate-180 flex items-center justify-center"
            >
              <AngleLeftCircleIcon size={24} />
            </button>

            {/* Pagination dots */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((idx) =>
                idx === activePageIndex ? (
                  <div
                    key={idx}
                    className="w-5 h-2.5 rounded-pill bg-primary transition-all duration-300"
                  />
                ) : (
                  <div
                    key={idx}
                    className="size-2.5 rounded-circle bg-border-strong transition-all duration-300"
                  />
                ),
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollSlider("left");
              }}
              aria-label="بعدی"
              className="text-primary hover:text-primary-600 transition-colors cursor-pointer flex items-center justify-center"
            >
              <AngleLeftCircleIcon size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-text-muted text-small">
          {activeTab === "special"
            ? "محصول فروش ویژه‌ای در این فروشگاه یافت نشد."
            : "سفارش جاری در این فروشگاه ندارید."}
        </div>
      )}

      {/* Order Receipt Button (When orders tab active and has items) */}
      {activeTab === "orders" && purchasedProducts.length > 0 && (
        <Link
          href="/receipt"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 w-full h-11.5 px-8 rounded-xl bg-success text-surface text-small font-normal flex items-center justify-center gap-2 hover:bg-success/90 transition-colors cursor-pointer"
        >
          <ReceiptTextIcon size={20} className="text-surface" />
          <span>رسید تحویل</span>
        </Link>
      )}
    </div>
  );
}
