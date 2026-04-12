"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  LocationIcon,
  StrokeLocationIcon,
  MailIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@/icons";
import Image from "next/image";
import Link from "next/link";
import HomeFilterContent from "@/components/ui/filter/HomeFilterContent";
import usePublicStore from "@/app/store/publicStore";
import { ProfileModal } from "@/components/modules/profile";
import { PopoverWithTrigger } from "@/components/ui/popover";
import { getToken, getUser } from "@/lib/server/cookies";
import { getUserProfile } from "@/lib/server/actions/profile";
import toast from "react-hot-toast";

const navLinks = [
  { id: "location", icon: <LocationIcon size={20} />, href: "/" },
  { id: "shop", icon: <ShoppingBagIcon size={20} />, href: "#" },
  { id: "mail", icon: <MailIcon size={20} />, href: "#" },
  { id: "search", icon: <SearchIcon size={20} /> },
];

const LONG_PRESS_MS = 500;

function MainNavigation({ isHomePage = false }) {
  const pathname = usePathname();
  const globalUser = usePublicStore((state) => state.user);

  const [user, setUser] = useState(globalUser ?? {});
  const [leftLinks, rightLinks] = [navLinks.slice(0, 2), navLinks.slice(2, 4)];
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileIndicatorStyle, setMobileIndicatorStyle] = useState({});

  const longPressTimerRef = useRef(null);
  const buttonRefs = useRef({});
  const navContainerRef = useRef(null);

  const filterPopoverOpen = usePublicStore((s) => s.homeFilterPopoverOpen);
  const setFilterPopoverOpen = usePublicStore(
    (s) => s.setHomeFilterPopoverOpen,
  );
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);

  const getUserData = async () => {
    const token = await getToken();

    const { userProfileRes, userProfileErr } = await getUserProfile(token);
    if (userProfileRes) {
      setUser(userProfileRes?.data?.user);
    } else if (userProfileErr) {
      toast.error("خطا در دریافت اطلاعات کاربر");
    }
  };

  // Get active button ID
  function getActiveButtonId() {
    if (searchBoxOpen) return "search";
    // Check if we're on a search page
    if (pathname.startsWith("/search")) return "search";
    const activeLink = navLinks.find((item) => item.href === pathname);
    return activeLink?.id || "location";
  }

  const activeButtonId = getActiveButtonId();

  // Calculate indicator position for desktop
  const indicatorStyle = useMemo(() => {
    const buttonIndex = navLinks.findIndex(
      (item) => item.id === activeButtonId,
    );
    return {
      transform: `translateY(${buttonIndex * -56}px)`,
    };
  }, [activeButtonId]);

  // Function to check if button is active
  function isButtonActive(item) {
    // When search box is open, only search button is active
    if (searchBoxOpen) {
      return item.id === "search";
    }
    // Search button: active when search box is open OR on search pages
    if (item.id === "search") {
      return pathname.startsWith("/search");
    }
    // Link buttons: active based on current route
    if (item.href) {
      return pathname === item.href;
    }
    return false;
  }

  function clearLongPressTimer() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function handleLocationPointerDown() {
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      setFilterPopoverOpen(true);
    }, LONG_PRESS_MS);
  }

  function handleLocationPointerUp() {
    clearLongPressTimer();
  }

  function handleLocationPointerLeave() {
    clearLongPressTimer();
  }

  function handleSearchClick(e) {
    e.preventDefault();
    setSearchBoxOpen(true);
  }

  function handleOtherButtonClick(e) {
    if (searchBoxOpen) {
      setSearchBoxOpen(false);
    }
  }

  // Update indicator position for mobile
  useEffect(() => {
    const activeButton = buttonRefs.current[activeButtonId];
    const container = navContainerRef.current;

    if (activeButton && container) {
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const left = buttonRect.left - containerRect.left;
      const top = buttonRect.top - containerRect.top;

      setMobileIndicatorStyle({
        left: `${left}px`,
        top: `${top}px`,
      });
    }
  }, [activeButtonId, searchBoxOpen]);

  useEffect(() => {
    getUserData();
  }, [user]);

  const avatarElement = (
    <div className="w-12 h-12 relative flex items-center justify-center">
      {/* user && user?.avatar */}
      {true ? (
        <Image
          src={user?.avatar}
          fill
          alt="avatar"
          onClick={() => setIsProfileOpen(true)}
          className="bg-white rounded-lg object-cover"
        />
      ) : (
        <UserIcon />
      )}
    </div>
  );

  return (
    <>
      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        triggerElement={avatarElement}
      />

      {/* Inline variant - simplified buttons without background indicator (Desktop only) */}
      {!isHomePage && (
        <div className="hidden lg:flex flex-col items-center gap-4">
          <div className="flex flex-col-reverse relative gap-2">
            {/* Animated background indicator */}
            <div
              className="absolute bottom-0 w-12 h-12 bg-gray-200 shadow-inner border border-white rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
              style={indicatorStyle}
            />
            {navLinks.map((item) => {
              const Component = item.href ? Link : "button";
              const isActive = isButtonActive(item);
              const icon =
                item.id === "location" && isActive ? (
                  <StrokeLocationIcon size={20} />
                ) : (
                  item.icon
                );
              return (
                <Component
                  key={item.id}
                  ref={(el) => (buttonRefs.current[item.id] = el)}
                  href={item.href}
                  onClick={
                    item.id === "search"
                      ? handleSearchClick
                      : handleOtherButtonClick
                  }
                  className={`relative flex items-center justify-center w-12 h-12 rounded-lg z-10 transition-colors duration-300 ${
                    isActive ? "text-primary" : "text-black"
                  }`}
                >
                  {icon}
                  {item.id === "location" && (
                    <span className="block absolute w-1.5 h-1.5 bg-success-medium rounded-full top-2 right-2"></span>
                  )}
                </Component>
              );
            })}
          </div>
          {avatarElement}
        </div>
      )}

      {/* Desktop: fixed sidebar on the right */}
      {isHomePage && (
        <div
          className={`hidden lg:flex lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-24 px-6 xl:pr-10 flex-col justify-end pb-8 z-10 bg-gray-200/50 backdrop-blur-sm`}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col-reverse relative gap-2">
              {/* Animated background indicator */}
              <div
                className="absolute bottom-0 w-12 h-12 bg-white shadow-inner border border-white rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
                style={indicatorStyle}
              />
              {navLinks.map((item, index) => {
                const Component = item.href ? Link : "button";
                const isActive = isButtonActive(item);
                const icon =
                  item.id === "location" && isActive ? (
                    <StrokeLocationIcon size={20} />
                  ) : (
                    item.icon
                  );
                return (
                  <Component
                    key={item.id}
                    ref={(el) => (buttonRefs.current[item.id] = el)}
                    href={item.href}
                    onClick={
                      item.id === "search"
                        ? handleSearchClick
                        : handleOtherButtonClick
                    }
                    className={`relative flex items-center justify-center w-12 h-12 rounded-lg z-10 transition-colors duration-300 ${
                      isActive ? "text-primary!" : "text-black"
                    }`}
                  >
                    {icon}
                    {/* If there is ready orders it should be shown */}
                    {item.id === "location" ? (
                      <span className="block absolute w-1.5 h-1.5 bg-success-medium rounded-full top-2 right-2"></span>
                    ) : null}
                  </Component>
                );
              })}
            </div>
            {avatarElement}
          </div>
        </div>
      )}

      {/* Mobile: Location filter popover */}
      {isHomePage && filterPopoverOpen && (
        <PopoverWithTrigger
          isOpen={filterPopoverOpen}
          onClose={() => setFilterPopoverOpen(false)}
          trigger={
            <Link
              href="#"
              type="button"
              className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg bg-white shadow-inner border border-white text-primary focus:outline-none touch-none pointer-events-auto"
              aria-label="فیلتر موقعیت و نوع نمایش (با نگه داشتن باز می‌شود)"
              onPointerDown={handleLocationPointerDown}
              onPointerUp={handleLocationPointerUp}
              onPointerLeave={handleLocationPointerLeave}
              onPointerCancel={handleLocationPointerUp}
              onContextMenu={(e) => e.preventDefault()}
            >
              <StrokeLocationIcon className="text-primary" size={20} />
            </Link>
          }
          triggerPosition="bottom-[calc(12px+env(safe-area-inset-bottom))] right-7 lg:hidden"
          popoverClassName="bottom-20 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[608px] bg-white rounded-lg p-2 shadow-lg lg:hidden animate-slide-up-simple"
        >
          <span
            onClick={() => setFilterPopoverOpen(false)}
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-1 block bg-black hover:bg-gray-600 transition-colors rounded-full"
          ></span>
          <HomeFilterContent onClose={() => setFilterPopoverOpen(false)} />
        </PopoverWithTrigger>
      )}

      {/* Mobile Navigation - Horizontal Layout */}
      <div
        className={`flex lg:hidden fixed bottom-0 left-0 right-0 w-full max-w-[640px] mx-auto ${
          isHomePage
            ? searchBoxOpen
              ? "bg-white border-t border-gray-200"
              : "bg-gray-200/50 backdrop-blur-sm border-t-2 border-white"
            : "bg-white border-t border-gray-200"
        } ${filterPopoverOpen ? "z-80" : "z-100"}`}
      >
        <nav
          ref={navContainerRef}
          className="flex flex-row items-center justify-around gap-4 py-3 px-4 w-full relative"
        >
          {/* Animated background indicator for mobile */}
          <div
            className={`absolute w-12 h-12 rounded-lg transition-all duration-300 ease-in-out pointer-events-none ${
              isHomePage
                ? searchBoxOpen
                  ? "bg-gray-200 shadow-inner border border-gray-200"
                  : "bg-white shadow-inner border border-white"
                : "bg-gray-200 shadow-inner border border-gray-200"
            }`}
            style={mobileIndicatorStyle}
          />
          {leftLinks.map((item) => {
            const isActive = isButtonActive(item);

            if (item.id === "location" && isHomePage) {
              const icon = isActive ? (
                <StrokeLocationIcon size={20} />
              ) : (
                item.icon
              );
              return (
                <Link
                  key={item.id}
                  ref={(el) => (buttonRefs.current[item.id] = el)}
                  href={item.href}
                  onClick={handleOtherButtonClick}
                  className={`flex items-center justify-center w-12 h-12 shrink-0 rounded-lg focus:outline-none touch-none z-10 transition-colors duration-300 ${
                    isActive ? "text-primary" : "text-black"
                  }`}
                  aria-label="فیلتر موقعیت و نوع نمایش (با نگه داشتن باز می‌شود)"
                  onPointerDown={handleLocationPointerDown}
                  onPointerUp={handleLocationPointerUp}
                  onPointerLeave={handleLocationPointerLeave}
                  onPointerCancel={handleLocationPointerUp}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {icon}
                </Link>
              );
            }

            const Component = item.href ? Link : "button";
            const icon =
              item.id === "location" && isActive ? (
                <StrokeLocationIcon size={20} />
              ) : (
                item.icon
              );
            return (
              <Component
                key={item.id}
                ref={(el) => (buttonRefs.current[item.id] = el)}
                href={item.href}
                onClick={handleOtherButtonClick}
                className={`flex items-center justify-center w-12 h-12 shrink-0 rounded-lg z-10 transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-black"
                }`}
              >
                {icon}
              </Component>
            );
          })}
          <div className="shrink-0">{avatarElement}</div>
          {rightLinks.map((item) => {
            const Component = item.href ? Link : "button";
            const isActive = isButtonActive(item);
            return (
              <Component
                key={item.id}
                ref={(el) => (buttonRefs.current[item.id] = el)}
                href={item.href}
                onClick={
                  item.id === "search"
                    ? handleSearchClick
                    : handleOtherButtonClick
                }
                className={`flex items-center justify-center w-12 h-12 shrink-0 rounded-lg z-10 transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-black"
                }`}
              >
                {item.icon}
              </Component>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default MainNavigation;
