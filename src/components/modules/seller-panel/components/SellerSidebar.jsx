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
  MenuBarsIcon,
  CloseIcon,
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
      <div className="lg:hidden flex items-center justify-between p-4 bg-surface border-b border-border-subtle sticky top-0 z-30">
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
          className="p-2 rounded-lg bg-surface-subtle text-text-secondary hover:bg-surface-muted transition-colors flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <CloseIcon size={20} className="text-text-primary" />
          ) : (
            <MenuBarsIcon size={24} className="text-text-primary" />
          )}
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
          fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-surface border-l border-border-subtle
          flex flex-col p-8 transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-10 lg:shrink-0 lg:min-h-screen
          ${mobileOpen ? "translate-x-0 shadow-modal" : "translate-x-full lg:translate-x-0"}
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
                onClick={() => setMobileOpen(false)}
                className={`
                  h-[50px] px-4 rounded-xl flex items-center justify-between transition-colors
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
