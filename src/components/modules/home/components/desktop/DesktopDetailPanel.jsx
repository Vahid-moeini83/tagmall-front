"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  BasketShoppingIcon,
  UserIcon,
  CloseCircleIcon,
} from "@/icons";
import DesktopStoreCard from "./DesktopStoreCard";
import DesktopSellerDetails from "./DesktopSellerDetails";
import usePublicStore from "@/app/store/publicStore";
import { ProfileModal } from "@/components/modules/profile";
import { HomeSliderSkeleton, HomeSliderEmptyState } from "@/components/ui/loading";

export default function DesktopDetailPanel({
  storeProducts = [],
  activeSellerId,
  remainingTime,
  isStoresLoading,
  viewMode = "slider",
  activeSellerInfo,
  onSelectStore,
  onAddToCart,
  onSellerNameClick,
  onBackToSlider,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartItemsCount = usePublicStore((state) => state.cartItemsCount || 0);
  const token = usePublicStore((state) => state.token);
  const setLoginOpen = usePublicStore((state) => state.setLoginOpen);

  const handleProfileClick = () => {
    if (!token) {
      setLoginOpen(true);
    } else {
      setIsProfileOpen(true);
    }
  };

  // Filter stores by search query if typed
  const displayedStores = searchQuery.trim()
    ? storeProducts.filter((s) => {
        const storeName = s.seller?.storeName || s.seller?.name || "";
        const matchesStore = storeName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesProduct = s.products?.some((p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        return matchesStore || matchesProduct;
      })
    : storeProducts;

  const isSellerDetails = viewMode === "seller-details";

  return (
    <aside className="absolute top-5 right-5 bottom-5 w-146.75 z-20 flex flex-col bg-surface border border-border-default rounded-2xl shadow-card p-6 overflow-hidden">
      {/* Top Header: Logo on right, Actions on left (Exact Figma 515x84) */}
      <header className="flex items-center justify-between py-5 border-b border-border-subtle shrink-0">
        {/* Right side: Logo */}
        <Link href="/" className="block">
          <Image
            src="/assets/images/logo/main-logo.svg"
            width={133}
            height={40}
            alt="تگ‌مال"
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Left side: Profile & Cart Actions */}
        <div className="flex items-center gap-3">
          {/* Profile Button */}
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="پروفایل کاربری"
            className="size-11 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-center text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <UserIcon size={24} />
          </button>

          {/* Cart Button with Badge */}
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative size-11 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-center text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <BasketShoppingIcon size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute top-2 right-2 size-3 bg-error rounded-circle" />
            )}
          </Link>
        </div>
      </header>

      {isSellerDetails ? (
        <DesktopSellerDetails
          activeSellerInfo={activeSellerInfo}
          onBackToSlider={onBackToSlider}
        />
      ) : (
        <>
          {/* Search Bar (Exact Figma 515x64, rounded-xl, bg-surface-subtle) */}
          <div className="mt-4 h-16 rounded-xl bg-surface-subtle border border-border-default px-3 py-3 flex items-center justify-between gap-3 shrink-0 focus-within:border-primary transition-colors">
            <div className="text-text-primary shrink-0">
              <SearchIcon size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="گروه کالایی، برند، کالا، لوازم جانبی، قطعات"
              className="flex-1 bg-transparent text-small text-text-primary placeholder:text-text-muted focus:outline-none text-right"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-text-muted hover:text-text-primary cursor-pointer shrink-0"
                aria-label="پاک کردن جستجو"
              >
                <CloseCircleIcon size={20} />
              </button>
            )}
          </div>

          {/* Stores List (Vertical Scroll, 24px gap matching Frame 2147226177) */}
          <div className="mt-6 flex-1 min-h-0 overflow-y-auto pr-1 space-y-6 scrollbar-thin scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary scrollbar-track-transparent">
            {isStoresLoading ? (
              <HomeSliderSkeleton variant="desktop" />
            ) : displayedStores.length === 0 ? (
              <HomeSliderEmptyState variant="desktop" />
            ) : (
              displayedStores.map((store) => (
                <DesktopStoreCard
                  key={store.storeId}
                  store={store}
                  isActive={String(store.storeId) === String(activeSellerId)}
                  remainingTime={remainingTime}
                  onSelectStore={() => onSelectStore?.(store.storeId)}
                  onAddToCart={onAddToCart}
                  onSellerNameClick={onSellerNameClick}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Profile Modal when opened */}
      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </aside>
  );
}
