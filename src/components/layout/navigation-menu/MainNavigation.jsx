"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LocationIcon,
  StrokeLocationIcon,
  MailIcon,
  StrokeMailIcon,
  SearchIcon,
  StrokeSearchIcon,
  ShoppingBagIcon,
  StrokeShoppingBagIcon,
  UserIcon,
  ListIcon,
} from "@/icons";
import Image from "next/image";
import Link from "next/link";
import HomeFilterContent from "@/components/ui/filter/HomeFilterContent";
import usePublicStore from "@/app/store/publicStore";
import { ProfileModal } from "@/components/modules/profile";
import { PopoverWithTrigger } from "@/components/ui/popover";
import { getToken } from "@/lib/server/cookies";
import { getUserProfile } from "@/lib/server/actions/profile";
import toast from "react-hot-toast";

const navLinks = [
  {
    id: "location",
    icon: <LocationIcon size={20} />,
    activeIcon: <StrokeLocationIcon size={20} />,
    href: "/",
  },
  {
    id: "cart",
    icon: <ShoppingBagIcon size={20} />,
    activeIcon: <StrokeShoppingBagIcon size={20} />,
    href: "/cart",
  },
  {
    id: "support",
    icon: <MailIcon size={20} />,
    activeIcon: <StrokeMailIcon size={20} />,
    href: "/support",
  },
  {
    id: "search",
    icon: <SearchIcon size={20} />,
    activeIcon: <StrokeSearchIcon size={20} />,
  },
];

const LONG_PRESS_MS = 500;

function MainNavigation({ isHomePage = false, hasSearchBox = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = usePublicStore((state) => state.userInfo);
  const accessToken = usePublicStore((state) => state.token);
  const setUserInfo = usePublicStore((state) => state.setUserInfo);
  const setLoginOpen = usePublicStore((state) => state.setLoginOpen);
  const cartItemsCount = usePublicStore((state) => state.cartItemsCount);
  const toggleHomeProductsListOpen = usePublicStore(
    (state) => state.toggleHomeProductsListOpen,
  );

  // فیلتر کردن ایکن سرچ در دسکتاپ اگر صفحه دارای سرچ باکس باشد
  const filteredNavLinks = hasSearchBox
    ? navLinks.filter((item) => item.id !== "search")
    : navLinks;

  const [leftLinks, rightLinks] = [
    filteredNavLinks.slice(0, 2),
    filteredNavLinks.slice(2, 4),
  ];
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

    if (!token) return;

    const { userProfileRes, userProfileErr } = await getUserProfile(token);
    if (userProfileRes) {
      setUserInfo(userProfileRes?.data?.user);
    } else if (userProfileErr) {
      toast.error("خطا در دریافت اطلاعات کاربر");
    }
  };

  // Open modal if user is logged in
  const handleAvatarClick = async () => {
    // چک کردن token برای تشخیص لاگین بودن
    const token = await getToken();

    if (token || accessToken) {
      setIsProfileOpen(true);
    } else {
      setLoginOpen(true);
    }
  };

  // Get active button ID
  function getActiveButtonId() {
    // When profile is open, return a special ID to hide/move indicator
    if (isProfileOpen) return "profile";
    if (searchBoxOpen) return "search";
    // Check if we're on a search page
    if (pathname.startsWith("/search")) return "search";
    const activeLink = navLinks.find((item) => item.href === pathname);
    return activeLink?.id || "location";
  }

  const activeButtonId = getActiveButtonId();

  // Calculate indicator position for desktop
  const indicatorStyle = useMemo(() => {
    // When profile is open, hide the indicator by moving it out of view
    if (activeButtonId === "profile") {
      return {
        opacity: 0,
        pointerEvents: "none",
      };
    }
    const buttonIndex = filteredNavLinks.findIndex(
      (item) => item.id === activeButtonId,
    );
    return {
      transform: `translateY(${buttonIndex * -56}px)`,
      opacity: 1,
    };
  }, [activeButtonId, filteredNavLinks]);

  // Function to check if button is active
  function isButtonActive(item) {
    // When profile is open, no nav link should be active
    if (isProfileOpen) {
      return false;
    }
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
    setIsProfileOpen(false);
    setSearchBoxOpen(!searchBoxOpen);
  }

  function handleOtherButtonClick() {
    setIsProfileOpen(false);
    if (searchBoxOpen) {
      setSearchBoxOpen(false);
    }
  }

  async function handleProtectedNavClick(e, href) {
    e.preventDefault();
    handleOtherButtonClick();

    const token = await getToken();
    if (!token && !accessToken) {
      setLoginOpen(true);
      return;
    }

    router.push(href);
  }

  // Update indicator position for mobile
  useEffect(() => {
    // When profile is open, hide the indicator
    if (activeButtonId === "profile") {
      setMobileIndicatorStyle({
        opacity: 0,
        pointerEvents: "none",
      });
      return;
    }

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
        opacity: 1,
      });
    }
  }, [activeButtonId, searchBoxOpen]);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      getUserData();
    }
  }, []);

  const avatarElement = (
    <div
      onClick={handleAvatarClick}
      className="w-12 h-12 cursor-pointer relative z-10"
    >
      {user.avatar ? (
        <div className="w-full h-full relative flex items-center justify-center rounded-lg overflow-hidden border border-gray-200">
          <Image src={user.avatar} fill alt="avatar" className="object-cover" />
        </div>
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center rounded-lg transition-colors duration-300 ${
            isProfileOpen ? "text-primary" : "text-black"
          }`}
        >
          <UserIcon />
        </div>
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
        <div className="hidden lg:flex flex-col items-center gap-2">
          <div className="flex flex-col-reverse relative gap-2">
            {/* Animated background indicator */}
            <div
              className="absolute bottom-0 w-12 h-12 bg-gray-200 shadow-inner border border-white rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
              style={indicatorStyle}
            />
            {filteredNavLinks.map((item) => {
              const Component = item.href ? Link : "button";
              const isActive = isButtonActive(item);
              const icon = isActive ? item.activeIcon : item.icon;
              const isProtected = item.id === "cart" || item.id === "support";

              return (
                <Component
                  key={item.id}
                  ref={(el) => (buttonRefs.current[item.id] = el)}
                  href={item.href}
                  onClick={
                    item.id === "search"
                      ? handleSearchClick
                      : isProtected
                        ? (e) => handleProtectedNavClick(e, item.href)
                        : handleOtherButtonClick
                  }
                  className={`relative flex items-center justify-center w-12 h-12 rounded-lg z-10 transition-colors duration-300 ${
                    isActive ? "text-primary!" : "text-black"
                  }`}
                >
                  {icon}
                  {item.id === "location" && (
                    <span className="block absolute w-1.5 h-1.5 bg-success-medium rounded-full top-2 right-2"></span>
                  )}
                  {item.id === "support" && (
                    <span className="block absolute w-1.5 h-1.5 bg-error-medium rounded-full top-2 right-2"></span>
                  )}
                  {item.id === "cart" && cartItemsCount > 0 && (
                    <span className="block absolute w-1.5 h-1.5 bg-error-medium rounded-full top-2 right-2"></span>
                  )}
                </Component>
              );
            })}
          </div>
          <div className="relative">
            {/* Background indicator for avatar when profile is open and no avatar image */}
            {isProfileOpen && !user.avatar && (
              <div className="absolute inset-0 w-12 h-12 bg-gray-200 shadow-inner rounded-lg pointer-events-none" />
            )}
            {avatarElement}
          </div>
        </div>
      )}

      {/* Desktop: fixed sidebar on the right (hidden on new desktop home layout) */}
      {isHomePage && (
        <div
          className={`hidden lg:hidden lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-24 lg:px-6 xl:px-16 flex-col items-center justify-end pb-8 z-10 bg-gray-200/50 backdrop-blur-sm`}
        >
          <button
            type="button"
            onClick={toggleHomeProductsListOpen}
            className="absolute top-8 left-1/2 -translate-x-1/2 w-[50px] h-[50px] bg-white rounded-lg flex items-center justify-center shrink-0 z-10 hover:opacity-90 transition-opacity cursor-pointer"
            aria-label="لیست محصولات"
          >
            <ListIcon size={24} />
          </button>
          <div
            className={`relative flex flex-col items-center ${user?.avatar ? "gap-4" : "gap-2"}`}
          >
            <div className="flex flex-col-reverse relative gap-2">
              {/* Animated background indicator */}
              <div
                className="absolute bottom-0 w-12 h-12 bg-white shadow-inner border border-white rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
                style={indicatorStyle}
              />
              {filteredNavLinks.map((item) => {
                const Component = item.href ? Link : "button";
                const isActive = isButtonActive(item);
                const icon = isActive ? item.activeIcon : item.icon;
                const isProtected = item.id === "cart" || item.id === "support";

                return (
                  <Component
                    key={item.id}
                    ref={(el) => (buttonRefs.current[item.id] = el)}
                    href={item.href}
                    onClick={
                      item.id === "search"
                        ? handleSearchClick
                        : isProtected
                          ? (e) => handleProtectedNavClick(e, item.href)
                          : handleOtherButtonClick
                    }
                    className={`relative flex items-center justify-center w-12 h-12 rounded-lg z-10 transition-colors duration-300 ${
                      isActive ? "text-primary!" : "text-black"
                    }`}
                  >
                    {icon}
                    {item.id === "cart" && cartItemsCount > 0 && (
                      <span className="block absolute w-1.5 h-1.5 bg-error-medium rounded-full top-2 right-2"></span>
                    )}
                    {item.id === "location" ? (
                      <span className="block absolute w-1.5 h-1.5 bg-success-medium rounded-full top-2 right-2"></span>
                    ) : null}
                    {item.id === "support" && (
                      <span className="block absolute w-1.5 h-1.5 bg-error-medium rounded-full top-2 right-2"></span>
                    )}
                  </Component>
                );
              })}
            </div>
            <div className="relative">
              {/* Background indicator for avatar when profile is open and no avatar image */}
              {isProfileOpen && !user.avatar && (
                <div className="absolute inset-0 w-12 h-12 bg-white shadow-inner border border-white rounded-lg pointer-events-none" />
              )}
              {avatarElement}
            </div>
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
          popoverClassName="bottom-20 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[608px] bg-white rounded-lg shadow-lg lg:hidden animate-slide-up-simple"
        >
          <span
            onClick={() => setFilterPopoverOpen(false)}
            className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-1 block bg-gray-300 rounded-full"
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
              : "bg-gray-200/20 backdrop-blur-sm border-t-2 border-white"
            : "bg-white border-t border-gray-200"
        } ${isProfileOpen ? "bg-white! border-t-2! border-gray-200!" : ""} ${filterPopoverOpen ? "z-80" : "z-100"}`}
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
            const icon = isActive ? item.activeIcon : item.icon;

            if (item.id === "location" && isHomePage) {
              return (
                <Link
                  key={item.id}
                  ref={(el) => (buttonRefs.current[item.id] = el)}
                  href={item.href}
                  onClick={handleOtherButtonClick}
                  className={`relative flex items-center justify-center w-12 h-12 shrink-0 rounded-lg focus:outline-none touch-none z-10 transition-colors duration-300 ${
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
                  {item.id === "location" ? (
                    <span className="block absolute w-1.5 h-1.5 bg-success-medium rounded-full top-2 right-2"></span>
                  ) : null}
                </Link>
              );
            }

            const Component = item.href ? Link : "button";
            const isProtected = item.id === "cart" || item.id === "support";

            return (
              <Component
                key={item.id}
                ref={(el) => (buttonRefs.current[item.id] = el)}
                href={item.href}
                onClick={
                  isProtected
                    ? (e) => handleProtectedNavClick(e, item.href)
                    : handleOtherButtonClick
                }
                className={`relative flex items-center justify-center w-12 h-12 shrink-0 rounded-lg z-10 transition-colors duration-300 ${
                  isActive ? "text-primary!" : "text-black"
                }`}
              >
                {icon}
                {item.id === "cart" && cartItemsCount > 0 && (
                  <span className="block absolute w-1.5 h-1.5 bg-error-medium rounded-full top-2 right-2"></span>
                )}
              </Component>
            );
          })}
          <div className="shrink-0 relative">
            {/* Background indicator for avatar when profile is open and no avatar image */}
            {isProfileOpen && !user.avatar && (
              <div className="absolute inset-0 w-12 h-12 rounded-lg pointer-events-none bg-gray-200 shadow-inner border border-gray-200" />
            )}
            {avatarElement}
          </div>
          {rightLinks.map((item) => {
            const Component = item.href ? Link : "button";
            const isActive = isButtonActive(item);
            const icon = isActive ? item.activeIcon : item.icon;
            const isProtected = item.id === "cart" || item.id === "support";

            return (
              <Component
                key={item.id}
                ref={(el) => (buttonRefs.current[item.id] = el)}
                href={item.href}
                onClick={
                  item.id === "search"
                    ? handleSearchClick
                    : isProtected
                      ? (e) => handleProtectedNavClick(e, item.href)
                      : handleOtherButtonClick
                }
                className={`relative flex items-center justify-center w-12 h-12 shrink-0 rounded-lg z-10 transition-colors duration-300 ${
                  isActive ? "text-primary!" : "text-black"
                }`}
              >
                {icon}
                {item.id === "support" && (
                  <span className="block absolute w-1.5 h-1.5 bg-error-medium rounded-full top-2 right-2"></span>
                )}
              </Component>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default MainNavigation;
