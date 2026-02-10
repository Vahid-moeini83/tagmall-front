"use client";

import { useRef, useCallback } from "react";
import { LocationIcon, MailIcon, SearchIcon, ShoppingBagIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import HomeFilterContent from "@/components/ui/filter/HomeFilterContent";
import usePublicStore from "@/app/store/publicStore";

const navLinks = [
  { id: "location", icon: <LocationIcon color="currentColor" />, href: "#" },
  { id: "shop", icon: <ShoppingBagIcon color="black" />, href: "#" },
  { id: "mail", icon: <MailIcon color="black" />, href: "#" },
  { id: "search", icon: <SearchIcon color="black" />, href: "#" },
];

const LONG_PRESS_MS = 500;

function MainNavigation() {
  const [leftLinks, rightLinks] = [navLinks.slice(0, 2), navLinks.slice(2, 4)];
  const longPressTimerRef = useRef(null);

  const filterPopoverOpen = usePublicStore((s) => s.homeFilterPopoverOpen);
  const setFilterPopoverOpen = usePublicStore(
    (s) => s.setHomeFilterPopoverOpen,
  );
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleLocationPointerDown = useCallback(() => {
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      setFilterPopoverOpen(true);
    }, LONG_PRESS_MS);
  }, [clearLongPressTimer]);

  const handleLocationPointerUp = useCallback(() => {
    clearLongPressTimer();
  }, [clearLongPressTimer]);

  const handleLocationPointerLeave = useCallback(() => {
    clearLongPressTimer();
  }, [clearLongPressTimer]);

  const handleSearchClick = useCallback(
    (e) => {
      e.preventDefault();
      setSearchBoxOpen(true);
    },
    [setSearchBoxOpen],
  );

  return (
    <>
      {/* Desktop: fixed sidebar on the right */}
      <div className="hidden lg:flex lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-24 px-6 xl:pr-10 flex-col justify-end pb-8 bg-gray-200/50 backdrop-blur-sm z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col-reverse gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={item.id === "search" ? handleSearchClick : undefined}
                className={`relative text-gray-600 flex items-center justify-center w-12 h-12 rounded-lg ${
                  item.id === "location"
                    ? "bg-white shadow-inner border border-white text-primary"
                    : ""
                }`}
              >
                {item.icon}
                {/* If there is ready orders it should be shown */}
                {item.id === "location" ? (
                  <span className="block absolute w-1.5 h-1.5 bg-success-medium rounded-full top-1 right-1"></span>
                ) : null}
              </Link>
            ))}
          </div>
          <div className="w-12 h-12 relative">
            <Image
              src="/assets/images/fallback/avatar.png"
              fill
              alt="avatar"
              className="bg-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Mobile: fixed bottom nav bar */}
      {filterPopoverOpen && (
        <>
          <div
            className="fixed inset-0 z-90 bg-gray-200/50 backdrop-blur-md lg:hidden animate-fade-in"
            onClick={() => setFilterPopoverOpen(false)}
          />
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-100 w-[calc(100vw-2rem)] max-w-[608px] bg-white rounded-lg p-2 shadow-lg lg:hidden animate-slide-up-simple">
            <HomeFilterContent onClose={() => setFilterPopoverOpen(false)} />
          </div>
        </>
      )}

      {/* Location button - always on top when filter is open */}
      {filterPopoverOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-100 w-full max-w-[640px] mx-auto lg:hidden pointer-events-none">
          <div className="flex flex-row items-center justify-around gap-4 py-3 px-4 w-full">
            <Link
              href="#"
              type="button"
              className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg bg-white shadow-inner border border-white text-shade-500 focus:outline-none touch-none pointer-events-auto"
              aria-label="فیلتر موقعیت و نوع نمایش (با نگه داشتن باز می‌شود)"
              onPointerDown={handleLocationPointerDown}
              onPointerUp={handleLocationPointerUp}
              onPointerLeave={handleLocationPointerLeave}
              onPointerCancel={handleLocationPointerUp}
              onContextMenu={(e) => e.preventDefault()}
            >
              <LocationIcon color="currentColor" />
            </Link>
            {/* Spacer for shop icon */}
            <div className="w-12 h-12 shrink-0" />
            {/* Spacer for avatar */}
            <div className="w-12 h-12 shrink-0" />
            {/* Spacer for mail icon */}
            <div className="w-12 h-12 shrink-0" />
            {/* Spacer for search icon */}
            <div className="w-12 h-12 shrink-0" />
          </div>
        </div>
      )}

      <div
        className={`flex lg:hidden fixed bottom-0 left-0 right-0 w-full max-w-[640px] mx-auto bg-gray-200/50 border-t-2 border-white backdrop-blur-sm ${filterPopoverOpen ? "z-80" : "z-100"}`}
      >
        <nav className="flex flex-row items-center justify-around gap-4 py-3 px-4 w-full">
          {leftLinks.map((item) =>
            item.id === "location" ? (
              <Link
                key={item.id}
                href="#"
                type="button"
                className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg bg-white shadow-inner border border-white text-shade-500 focus:outline-none touch-none"
                aria-label="فیلتر موقعیت و نوع نمایش (با نگه داشتن باز می‌شود)"
                onPointerDown={handleLocationPointerDown}
                onPointerUp={handleLocationPointerUp}
                onPointerLeave={handleLocationPointerLeave}
                onPointerCancel={handleLocationPointerUp}
                onContextMenu={(e) => e.preventDefault()}
              >
                {item.icon}
              </Link>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg text-gray-600"
              >
                {item.icon}
              </Link>
            ),
          )}
          <div className="w-12 h-12 relative shrink-0">
            <Image
              src="/assets/images/fallback/avatar.png"
              fill
              alt="avatar"
              className="bg-white rounded-lg"
            />
          </div>
          {rightLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={item.id === "search" ? handleSearchClick : undefined}
              className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg text-gray-600"
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export default MainNavigation;
