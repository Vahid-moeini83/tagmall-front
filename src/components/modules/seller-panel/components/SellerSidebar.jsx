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
} from "@/icons";
import { useSellerNavigation } from "../context/SellerNavigationContext";


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


function SellerSidebar() {
  const pathname = usePathname();
  const { mobileSidebarOpen, closeMobileSidebar } = useSellerNavigation();

  return (
    <>
      {/* Mobile top app bar matching Figma PWA (44:39308) */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-border-subtle sticky top-0 z-30 h-[76px]">
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
          lg:static lg:translate-x-0 lg:z-10 lg:shrink-0 lg:min-h-screen
          ${mobileSidebarOpen ? "translate-x-0 shadow-modal" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Drawer header on mobile / Top Logo on desktop */}
        <div className="h-10 flex items-center justify-between">
          <Link href="/seller" className="inline-block" onClick={closeMobileSidebar}>
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
        <div className="flex items-center gap-3 mt-10 mb-8">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border-subtle">
            <Image
              src="/assets/images/seller/avatar.png"
              alt="آرمان میمندی نژاد"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="truncate">
            <p className="text-body font-semibold text-text-primary truncate">
              آرمان میمندی نژاد
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/seller"
                ? pathname === "/seller"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`
                  h-[50px] px-4 rounded-md flex items-center justify-between transition-colors
                  ${
                    isActive
                      ? "bg-primary-50 text-primary font-medium"
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
                  <span className="text-[15px]">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="w-[18px] h-[18px] rounded-full bg-error text-white text-[11px] flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default SellerSidebar;
