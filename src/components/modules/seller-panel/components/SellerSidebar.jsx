"use client";

import { useState } from "react";
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
} from "@/icons";


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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <Link href="/seller" className="inline-block">
          <Image
            src="/assets/images/logo/slogan-logo.svg"
            alt="تگ مال"
            width={120}
            height={36}
            priority
          />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-white border-l border-gray-100
          flex flex-col p-8 transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-10 lg:shrink-0 lg:min-h-screen
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Logo */}
        <div className="h-10 flex items-center">
          <Link href="/seller" className="inline-block">
            <Image
              src="/assets/images/logo/slogan-logo.svg"
              alt="تگ مال؛ با هم، برای همه"
              width={133}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* User Profile Block */}
        <div className="flex items-center gap-3 mt-10 mb-8">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
            <Image
              src="/assets/images/seller/avatar.png"
              alt="آرمان میمندی نژاد"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="truncate">
            <p className="text-[16px] font-semibold text-[#1a1a2e] truncate">
              آرمان میمندی نژاد
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
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
                onClick={() => setMobileOpen(false)}
                className={`
                  h-[50px] px-4 rounded-xl flex items-center justify-between transition-colors
                  ${
                    isActive
                      ? "bg-[#eeeff6] text-[#3d3183] font-medium"
                      : "text-[#1a1a2e] hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`
                      flex items-center justify-center
                      ${isActive ? "text-[#3d3183]" : "text-[#4a4a68]"}
                    `}
                  >
                    <Icon size={item.iconSize} />
                  </span>
                  <span className="text-[15px]">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="w-[18px] h-[18px] rounded-full bg-[#ef4444] text-white text-[11px] flex items-center justify-center font-medium">
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
