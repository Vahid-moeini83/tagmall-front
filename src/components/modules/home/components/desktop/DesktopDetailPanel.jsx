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
import usePublicStore from "@/app/store/publicStore";
import { ProfileModal } from "@/components/modules/profile";
import { HomeSliderSkeleton, HomeSliderEmptyState } from "@/components/ui/loading";

export default function DesktopDetailPanel({
  storeProducts = [],
  activeSellerId,
  remainingTime,
  isStoresLoading,
  onSelectStore,
  onAddToCart,
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
        const matchesStore = storeName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProduct = s.products?.some((p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        return matchesStore || matchesProduct;
      })
    : storeProducts;

  return (
    <aside className="absolute top-5 right-5 bottom-5 w-146.75 z-20 flex flex-col bg-surface border border-border-default rounded-2xl shadow-card p-6 overflow-hidden">
      {/* Top Header: Logo on right, Actions on left */}
      <header className="flex items-center justify-between pb-4 border-b border-border-subtle shrink-0">
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
            <UserIcon size={22} />
          </button>

          {/* Cart Button with Badge */}
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative size-11 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-center text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <BasketShoppingIcon size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 size-5 bg-error text-surface text-label font-bold rounded-circle flex items-center justify-center">
                {cartItemsCount > 99 ? "۹۹+" : cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="mt-4 h-16 rounded-xl bg-surface-subtle border border-border-default px-4 flex items-center justify-between gap-3 shrink-0 focus-within:border-primary transition-colors">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="گروه کالایی، برند، کالا، لوازم جانبی، قطعات"
          className="flex-1 bg-transparent text-body text-text-primary placeholder:text-text-muted focus:outline-none text-right"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-text-muted hover:text-text-primary cursor-pointer"
            aria-label="پاک کردن جستجو"
          >
            <CloseCircleIcon size={18} />
          </button>
        ) : (
          <div className="text-text-primary shrink-0">
            <SearchIcon size={20} />
          </div>
        )}
      </div>

      {/* Stores List (Vertical Scroll) */}
      <div className="mt-5 flex-1 min-h-0 overflow-y-auto pr-1 space-y-6 scrollbar-thin">
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
            />
          ))
        )}
      </div>

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
