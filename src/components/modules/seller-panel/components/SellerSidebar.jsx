"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GridSquareCircleIcon,
  MessageTextIcon,
  ToteBagIcon,
  SellerUserIcon,
  LocationPinLineIcon,
  BarcodeReadIcon,
  PlusSimpleIcon,
  TicketSimplePercentIcon,
  SellerLogoutIcon,
  CloseIcon,
  EditIcon,
} from "@/icons";
import { useSellerNavigation } from "../context/SellerNavigationContext";
import { MESSAGE_SECTIONS } from "../data/messageSections";
import useSellerProfileSection from "../hooks/useSellerProfileSection";

/**
 * Sidebar navigation items configuration matching Figma design
 */
const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "داشبورد",
    href: "/seller",
    icon: GridSquareCircleIcon,
    iconSize: 20,
  },
  {
    id: "messages",
    label: "پیام‌ها",
    href: "/seller/messages",
    icon: MessageTextIcon,
    iconSize: 24,
    badge: "۳",
  },
  {
    id: "orders",
    label: "سفارشات",
    href: "/seller/orders",
    icon: ToteBagIcon,
    iconSize: 24,
  },
  {
    id: "profile",
    label: "پروفایل فروشنده",
    href: "/seller/profile",
    icon: SellerUserIcon,
    iconSize: 20,
  },
  {
    id: "branches",
    label: "شعبه ها",
    href: "/seller/branches",
    icon: LocationPinLineIcon,
    iconSize: 24,
  },
  {
    id: "products",
    label: "محصولات من",
    href: "/seller/products",
    icon: BarcodeReadIcon,
    iconSize: 24,
  },
  {
    id: "add-product",
    label: "ثبت کالا",
    href: "/seller/products/new",
    icon: PlusSimpleIcon,
    iconSize: 24,
  },
  {
    id: "discounts",
    label: "تخفیف‌های فعال",
    href: "/seller/discounts",
    icon: TicketSimplePercentIcon,
    iconSize: 24,
  },
  {
    id: "logout",
    label: "خروج",
    href: "/seller/logout",
    icon: SellerLogoutIcon,
    iconSize: 24,
  },
];

const PROFILE_SECTIONS = [
  { id: "details", label: "مشخصات", href: "/seller/profile" },
  { id: "financial", label: "گزارش مالی", href: "/seller/profile#financial" },
  { id: "wallet", label: "کیف پول اعتباری", href: "/seller/profile#wallet" },
  { id: "sessions", label: "نشست های فعال", href: "/seller/profile#sessions" },
  { id: "settings", label: "تنظیمات", href: "/seller/profile#settings" },
];

function SellerSidebar() {
  const profileSection = useSellerProfileSection();
  const pathname = usePathname();
  const isMessageCenter = pathname?.startsWith("/seller/messages");
  const isSellerProfile = pathname?.startsWith("/seller/profile");
  const hasProfileNavigationStyle =
    isSellerProfile || pathname?.startsWith("/seller/branches");
  const messageCategory = pathname?.split("/")[3] || "experts";
  const { mobileSidebarOpen, closeMobileSidebar } = useSellerNavigation();

  const navigateProfileSection = (event, section) => {
    event.preventDefault();
    // Native hash navigation notifies the profile store and preserves browser history.
    window.location.hash = section === "details" ? "" : section;
  };

  return (
    <>
      {/* Mobile app bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-surface">
        <header className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border-subtle h-[76px]">
          {/* Right side in RTL: Slogan Logo */}
          <Link href="/seller" className="inline-block shrink-0">
            <Image
              src="/assets/images/logo/slogan-logo.svg"
              alt="تگ مال؛ با هم، برای همه"
              width={133}
              height={40}
              priority
            />
          </Link>

          {/* Left side in RTL: Messages button & Seller Avatar */}
          <div className="flex items-center gap-2">
            {/* Messages icon button with unread count badge "۳" */}
            <Link
              href="/seller/messages"
              className="relative w-11 h-11 rounded-xl flex items-center justify-center text-text-primary hover:bg-surface-subtle transition-colors"
              aria-label="پیام‌ها"
            >
              <MessageTextIcon size={24} className="text-[#4a4a68]" />
              <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full bg-error text-white text-[11px] font-medium flex items-center justify-center">
                ۳
              </span>
            </Link>

            {/* Seller Avatar */}
            <Link
              href="/seller/profile"
              className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-border-subtle inline-block"
              aria-label="پروفایل فروشنده"
            >
              <Image
                src="/assets/images/seller/avatar.png"
                alt="آرمان میمندی نژاد"
                fill
                sizes="44px"
                className="object-cover"
              />
            </Link>
          </div>
        </header>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-surface border-l border-border-subtle
          flex flex-col p-8 transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-10 lg:shrink-0 ${isSellerProfile ? "lg:h-[1032px] lg:min-h-0 lg:self-start" : "lg:min-h-screen"}
          ${isMessageCenter ? "font-extralight lg:h-dvh lg:min-h-0 lg:border-l-0 lg:ring-1 lg:ring-inset lg:ring-border-default" : ""}
          ${mobileSidebarOpen ? "translate-x-0 shadow-modal" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Drawer header on mobile / Top Logo on desktop */}
        <div className="h-10 flex items-center justify-between">
          <Link
            href="/seller"
            className="inline-block"
            onClick={closeMobileSidebar}
          >
            <Image
              src="/assets/images/logo/slogan-logo.svg"
              alt="تگ مال؛ با هم، برای همه"
              width={133}
              height={40}
              priority
            />
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-text-secondary hover:bg-surface-subtle transition-colors"
            aria-label="بستن منو"
          >
            <CloseIcon size={20} className="text-text-primary" />
          </button>
        </div>

        {/* User Profile Block */}
        <div
          className={`flex items-center gap-3 mt-10 ${isMessageCenter || hasProfileNavigationStyle ? "mb-10" : "mb-8"}`}
        >
          <div
            className={`relative w-12 h-12 overflow-hidden shrink-0 border border-border-subtle ${isMessageCenter || hasProfileNavigationStyle ? "rounded-md" : "rounded-full"}`}
          >
            <Image
              src="/assets/images/seller/avatar.png"
              alt="آرمان میمندی نژاد"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="truncate">
            <p
              className={`text-body text-text-primary truncate ${isMessageCenter ? "font-extralight" : hasProfileNavigationStyle ? "font-normal" : "font-semibold"}`}
            >
              آرمان میمندی نژاد
            </p>
          </div>
          {isMessageCenter && messageCategory !== "experts" && (
            <Link
              href="/seller/profile"
              aria-label="ویرایش پروفایل فروشنده"
              className="mr-auto shrink-0 text-text-primary"
            >
              <EditIcon size={24} />
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav
          className={`flex flex-col gap-2 flex-1 overflow-y-auto ${isMessageCenter ? "min-h-0" : ""}`}
        >
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/seller"
                ? pathname === "/seller"
                : pathname?.startsWith(item.href);

            const navigationItem = (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobileSidebar}
                onNavigate={
                  item.id === "profile" && isSellerProfile
                    ? (event) => navigateProfileSection(event, "details")
                    : undefined
                }
                className={`
                  relative h-[50px] px-4 rounded-md flex items-center justify-between transition-colors ${isMessageCenter ? "shrink-0" : ""}
                  ${
                    isActive
                      ? `bg-primary-50 text-primary ${isMessageCenter ? "font-extralight" : hasProfileNavigationStyle ? "font-normal" : "font-medium"}`
                      : "text-text-primary hover:bg-surface-subtle"
                  }
                `}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`
                      flex items-center justify-center
                      ${isActive ? "text-primary" : "text-text-secondary"}
                    `}
                  >
                    <Icon size={item.iconSize} />
                  </span>
                  <span
                    className={
                      isMessageCenter || hasProfileNavigationStyle
                        ? "text-body"
                        : "text-[15px]"
                    }
                  >
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`w-[18px] h-[18px] rounded-full bg-error text-white text-[11px] flex items-center justify-center font-medium ${isMessageCenter || hasProfileNavigationStyle ? "absolute right-2 top-1.5" : ""}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );

            if (item.id === "profile" && isSellerProfile) {
              return (
                <div key={item.id} className="shrink-0">
                  {navigationItem}
                  <nav
                    aria-label="بخش‌های پروفایل فروشنده"
                    className="relative mr-6 mt-2 flex h-[168px] flex-col pt-[3px] before:absolute before:right-0 before:top-0 before:h-[160px] before:w-[2px] before:bg-navigation-connector"
                  >
                    {PROFILE_SECTIONS.map((section) => (
                      <Link
                        key={section.id}
                        href={section.href}
                        onClick={closeMobileSidebar}
                        onNavigate={(event) =>
                          navigateProfileSection(event, section.id)
                        }
                        aria-current={
                          section.id === profileSection ? "page" : undefined
                        }
                        className={`relative flex h-[35px] shrink-0 items-center pr-[25px] text-small hover:text-primary focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary after:absolute after:right-0 after:top-0 after:h-[18px] after:w-[14px] after:rounded-br-lg after:border-b-2 after:border-r-2 after:border-navigation-connector ${section.id === profileSection ? "text-primary/80" : "text-text-secondary"}`}
                      >
                        {section.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              );
            }

            if (item.id !== "messages" || !isMessageCenter)
              return navigationItem;

            return (
              <div key={item.id} className="shrink-0">
                {navigationItem}
                <nav
                  aria-label="بخش‌های مرکز پیام‌ها"
                  className="mr-6 mt-2 flex h-[149px] flex-col pb-[7px] pt-[6px]"
                >
                  {MESSAGE_SECTIONS.map((section) => (
                    <Link
                      key={section.id}
                      href={section.href}
                      onClick={closeMobileSidebar}
                      aria-current={
                        messageCategory === section.id ? "page" : undefined
                      }
                      className={`relative flex h-[34px] items-center pr-6 text-small before:absolute before:right-0 before:top-0 before:h-[34px] before:w-3 before:rounded-br-lg before:border-b-2 before:border-r-2 before:border-text-secondary ${messageCategory === section.id ? "text-primary" : "text-text-secondary hover:text-primary"}`}
                    >
                      {section.label}
                    </Link>
                  ))}
                </nav>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default SellerSidebar;
