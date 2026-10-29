"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  VerifyIcon,
  StarIcon,
  AngleLeftIcon,
  ReceiptIcon,
} from "@/icons";
import DesktopProductCard from "./DesktopProductCard";
import { cn } from "@/lib/client/utils";

export default function DesktopStoreCard({
  store,
  isActive,
  remainingTime,
  onSelectStore,
  onAddToCart,
}) {
  const [activeTab, setActiveTab] = useState("special"); // "special" | "orders"
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

  const currentProducts = activeTab === "special" ? specialProducts : purchasedProducts;

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 260;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      onClick={onSelectStore}
      className={cn(
        "bg-surface-subtle border rounded-xl p-3 flex flex-col gap-3 transition-all duration-300 cursor-pointer",
        isActive
          ? "border-primary shadow-card ring-1 ring-primary/20"
          : "border-border-default hover:border-border-strong",
      )}
    >
      {/* Store Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        {/* Right side: Store Avatar & Title */}
        <div className="flex items-center gap-3">
          <div className="size-12.5 rounded-xl border border-border-default overflow-hidden relative shrink-0">
            <Image
              src={seller.profileImage || "/assets/images/fallback/no-photo.jpg"}
              alt={storeName}
              width={50}
              height={50}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="text-h5 font-semibold text-text-primary">
                {storeName}
              </h3>
              {seller.isVerified && <VerifyIcon size={18} />}
            </div>
            <span className="text-caption text-text-muted mt-0.5">
              {seller.workingHours || "ساعات کاری نامشخص"}
            </span>
          </div>
        </div>

        {/* Left side: Badges */}
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <div className="bg-surface-muted rounded-pill px-2.5 py-1 text-label text-text-secondary">
            باز است
          </div>
          {/* Rating badge */}
          <div className="bg-surface-muted rounded-pill px-2.5 py-1 text-label text-text-secondary flex items-center gap-1">
            <StarIcon size={14} className="text-warning" />
            <span className="font-semibold">{ratingText}</span>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="bg-surface-muted rounded-xl p-1.5 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("special");
          }}
          className={cn(
            "flex-1 py-2 px-3 rounded-lg text-small text-center transition-all cursor-pointer",
            activeTab === "special"
              ? "bg-surface shadow-card text-primary font-semibold"
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
            "flex-1 py-2 px-3 rounded-lg text-small text-center transition-all cursor-pointer",
            activeTab === "orders"
              ? "bg-surface shadow-card text-primary font-semibold"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          سفارشات جاری شما
        </button>
      </div>

      {/* Countdown Timer Row (Special sale only) */}
      {activeTab === "special" && (
        <div className="flex items-center justify-between px-2 py-1 bg-surface rounded-lg border border-border-subtle">
          <span className="text-small font-medium text-error">
            مانده تا پایان فروش ویژه:
          </span>
          <div className="flex items-center gap-1.5" dir="ltr">
            <div className="size-8 rounded-md bg-error text-surface flex items-center justify-center font-bold text-small">
              {seconds}
            </div>
            <span className="text-error font-bold">:</span>
            <div className="size-8 rounded-md bg-error text-surface flex items-center justify-center font-bold text-small">
              {minutes}
            </div>
            <span className="text-error font-bold">:</span>
            <div className="size-8 rounded-md bg-error text-surface flex items-center justify-center font-bold text-small">
              {hours}
            </div>
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

          {/* Slider navigation & pagination controls */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollSlider("right");
              }}
              aria-label="قبلی"
              className="size-6 rounded-circle bg-surface border border-border-default flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors cursor-pointer rotate-180"
            >
              <AngleLeftIcon size={16} />
            </button>

            {/* Pagination dots */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-2 rounded-pill bg-primary" />
              <div className="size-2 rounded-circle bg-primary-200" />
              <div className="size-2 rounded-circle bg-primary-200" />
              <div className="size-2 rounded-circle bg-primary-200" />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollSlider("left");
              }}
              aria-label="بعدی"
              className="size-6 rounded-circle bg-surface border border-border-default flex items-center justify-center text-primary border-primary transition-colors cursor-pointer"
            >
              <AngleLeftIcon size={16} />
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
          className="mt-2 w-full py-2.5 px-4 rounded-xl bg-success text-surface text-small font-medium flex items-center justify-center gap-2 hover:bg-success/90 transition-colors cursor-pointer"
        >
          <ReceiptIcon size={18} />
          <span>رسید تحویل</span>
        </Link>
      )}
    </div>
  );
}
