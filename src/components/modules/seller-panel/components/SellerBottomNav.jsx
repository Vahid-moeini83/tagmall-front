"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GridSquareCircleIcon,
  ToteBagIcon,
  BarcodeReadIcon,
  MessageTextIcon,
  MenuBarsIcon,
} from "@/icons";
import { useSellerNavigation } from "../context/SellerNavigationContext";

/**
 * Mobile Bottom Navigation destinations matching Figma PWA design
 */
const BOTTOM_NAV_ITEMS = [
  {
    id: "dashboard",
    label: "داشبورد",
    href: "/seller",
    icon: GridSquareCircleIcon,
  },
  {
    id: "orders",
    label: "سفارشات",
    href: "/seller/orders",
    icon: ToteBagIcon,
  },
  {
    id: "products",
    label: "محصولات من",
    href: "/seller/products",
    icon: BarcodeReadIcon,
  },
  {
    id: "messages",
    label: "پیام‌ها",
    href: "/seller/messages",
    icon: MessageTextIcon,
    badge: "۳",
  },
];

function SellerBottomNav() {
  const pathname = usePathname();
  const { toggleMobileSidebar, mobileSidebarOpen } = useSellerNavigation();

  return (
    <nav
      aria-label="ناوبری اصلی ثابت"
      className="fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border-subtle lg:hidden flex flex-col justify-end pt-1 pb-1"
    >
      <div className="flex items-center justify-around h-[53px] px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/seller"
              ? pathname === "/seller"
              : item.id === "products"
                ? pathname?.startsWith(item.href) && !pathname?.startsWith("/seller/products/new")
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors select-none ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <div
                className={`relative w-12 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? "bg-primary-50 text-primary" : "text-text-muted"
                }`}
              >
                <Icon size={20} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center pointer-events-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] leading-tight ${
                  isActive
                    ? "font-semibold text-primary"
                    : "font-normal text-text-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 5th item: "بیشتر" toggles the drawer */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors select-none ${
            mobileSidebarOpen
              ? "text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
          aria-label="نمایش منوی کامل"
        >
          <div
            className={`w-12 h-7 rounded-lg flex items-center justify-center transition-colors ${
              mobileSidebarOpen
                ? "bg-primary-50 text-primary"
                : "text-text-muted"
            }`}
          >
            <MenuBarsIcon size={20} />
          </div>
          <span
            className={`text-[11px] leading-tight ${
              mobileSidebarOpen
                ? "font-semibold text-primary"
                : "font-normal text-text-muted"
            }`}
          >
            بیشتر
          </span>
        </button>
      </div>
    </nav>
  );
}

export default SellerBottomNav;
