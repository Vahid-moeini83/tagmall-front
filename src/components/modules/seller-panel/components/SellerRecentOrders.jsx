"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AngleLeftIcon } from "@/icons";

const RECENT_ORDERS = [
  {
    id: "DKC-۸۹۳۷۴۹۲",
    deliveryMethod: "ارسال توسط فروشنده",
    productsCount: "۲ محصول",
    totalAmount: "۱,۴۹۰,۰۰۰ تومان",
    date: "یک روز قبل",
    status: {
      label: "در انتظار تایید",
      bg: "bg-secondary-50",
      color: "text-secondary",
    },
  },
  {
    id: "DKC-۸۹۳۷۴۹۲",
    deliveryMethod: "مراجعه به فروشگاه",
    productsCount: "۴ محصول",
    totalAmount: "۱,۴۹۰,۰۰۰ تومان",
    date: "۲۴ دقیقه قبل",
    status: {
      label: "تایید شده",
      bg: "bg-success-light",
      color: "text-success",
    },
  },
  {
    id: "DKC-۸۹۳۷۴۹۲",
    deliveryMethod: "ارسال توسط فروشنده",
    productsCount: "۵ محصول",
    totalAmount: "۱,۴۹۰,۰۰۰ تومان",
    date: "۳۰ مرداد ۱۴۰۵",
    status: {
      label: "لغو شده",
      bg: "bg-error-light",
      color: "text-error",
    },
  },
  {
    id: "DKC-۸۹۳۷۴۹۲",
    deliveryMethod: "مراجعه به فروشگاه",
    productsCount: "۱۰ محصول",
    totalAmount: "۱,۴۹۰,۰۰۰ تومان",
    date: "۱۲ ساعت قبل",
    status: {
      label: "ارسال شده",
      bg: "bg-primary-50",
      color: "text-primary",
    },
  },
  {
    id: "DKC-۸۹۳۷۴۹۲",
    deliveryMethod: "ارسال توسط فروشنده",
    productsCount: "۶ محصول",
    totalAmount: "۱,۴۹۰,۰۰۰ تومان",
    date: "۳۰ مرداد ۱۴۰۵",
    status: {
      label: "تحویل داده شده",
      bg: "bg-info-light",
      color: "text-info",
    },
  },
  {
    id: "DKC-۸۹۳۷۴۹۲",
    deliveryMethod: "مراجعه به فروشگاه",
    productsCount: "۱۵ محصول",
    totalAmount: "۱,۴۹۰,۰۰۰ تومان",
    date: "۳۰ مرداد ۱۴۰۵",
    status: {
      label: "مرجوع شده",
      bg: "bg-warning-light",
      color: "text-warning",
    },
  },
  {
    id: "DKC-۸۹۳۷۴۹۳",
    deliveryMethod: "ارسال توسط فروشنده",
    productsCount: "۳ محصول",
    totalAmount: "۲,۱۴۰,۰۰۰ تومان",
    date: "۲۹ مرداد ۱۴۰۵",
    status: {
      label: "تحویل داده شده",
      bg: "bg-info-light",
      color: "text-info",
    },
  },
  {
    id: "DKC-۸۹۳۷۴۹۴",
    deliveryMethod: "مراجعه به فروشگاه",
    productsCount: "۱ محصول",
    totalAmount: "۹۴۰,۰۰۰ تومان",
    date: "۲۸ مرداد ۱۴۰۵",
    status: {
      label: "ارسال شده",
      bg: "bg-primary-50",
      color: "text-primary",
    },
  },
];

function SellerRecentOrders() {
  const ordersScrollRef = useRef(null);
  const dragStartRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const syncScroll = () => {
    const element = ordersScrollRef.current;
    if (!element) return;
    const available = element.scrollHeight - element.clientHeight;
    setScrollProgress(available > 0 ? element.scrollTop / available : 0);
  };

  const startRailDrag = (event) => {
    const element = ordersScrollRef.current;
    if (!element) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { y: event.clientY, scrollTop: element.scrollTop };
  };

  const moveRailDrag = (event) => {
    const element = ordersScrollRef.current;
    if (!element || !dragStartRef.current) return;
    const scrollRange = element.scrollHeight - element.clientHeight;
    element.scrollTop = dragStartRef.current.scrollTop +
      ((event.clientY - dragStartRef.current.y) / (428 - 94)) * scrollRange;
  };

  return (
    <section className="flex flex-col gap-4 lg:gap-0 lg:bg-surface lg:rounded-xl lg:p-6 lg:border lg:border-border-subtle lg:shadow-card">
      {/* Header: Matches both Figma mobile (44:39482) and desktop */}
      <div className="flex items-center justify-between">
        <h2 className="text-body sm:text-h5 font-bold text-text-primary">سفارشات اخیر</h2>
        <Link
          href="/seller/orders"
          className="flex items-center gap-1 text-[12px] sm:text-caption text-text-muted hover:text-text-secondary transition-colors font-normal"
        >
          <span>مشاهده همه سفارشات</span>
          <AngleLeftIcon size={16} />
        </Link>
      </div>

      {/* Mobile Card List (Figma Node: 44:39487) */}
      <div className="flex flex-col gap-3 lg:hidden">
        {RECENT_ORDERS.slice(0, 6).map((order, idx) => (
          <div
            key={`mobile-${order.id}-${idx}`}
            className="bg-surface rounded-lg p-3.5 border border-border-subtle flex flex-col gap-2.5 shadow-card"
          >
            {/* Row 1: Order ID & Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-text-primary">{order.id}</span>
              <span
                className={`h-[26px] w-[100px] rounded-md flex items-center justify-center text-[12px] font-medium ${order.status.bg} ${order.status.color}`}
              >
                {order.status.label}
              </span>
            </div>

            {/* Row 2: Date & Product Count */}
            <div className="flex items-center justify-between text-[12px] text-text-secondary">
              <span>{order.date}</span>
              <span>{order.productsCount}</span>
            </div>

            {/* Row 3: Delivery Method */}
            <div className="text-[12px] text-text-secondary text-right">
              <span>{order.deliveryMethod}</span>
            </div>

            {/* Row 4: Divider */}
            <div className="border-t border-border-subtle" />

            {/* Row 5: Total Amount */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-secondary">مبلغ کل</span>
              <span className="text-[14px] font-semibold text-text-primary">
                {order.totalAmount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Responsive Table (Figma Node: 44:39024) */}
      <div className="hidden lg:block mt-6">
        <div className="overflow-x-auto">
          <div className="min-w-[840px]">
            {/* Table Header */}
            <div className="bg-surface-subtle rounded-lg h-[42px] px-6 grid grid-cols-6 items-center text-caption text-text-secondary font-normal">
              <span>شماره سفارش</span>
              <span>روش تحویل</span>
              <span>محصولات</span>
              <span>مبلغ کل</span>
              <span>تاریخ ثبت</span>
              <span className="text-center">وضعیت سفارش</span>
            </div>

            <div className="relative mt-6 pl-4">
              <div
                role="scrollbar"
                aria-controls="seller-recent-orders-list"
                aria-label="پیمایش سفارش‌های اخیر"
                aria-orientation="vertical"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(scrollProgress * 100)}
                tabIndex={0}
                onPointerDown={startRailDrag}
                onPointerMove={moveRailDrag}
                onPointerUp={() => { dragStartRef.current = null; }}
                onPointerCancel={() => { dragStartRef.current = null; }}
                onKeyDown={(event) => {
                  const element = ordersScrollRef.current;
                  if (!element) return;
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    element.scrollTop += event.key === "ArrowDown" ? 58 : -58;
                  }
                }}
                className="absolute left-0 top-0 h-[428px] w-3 cursor-grab touch-none"
              >
                <span className="absolute left-0 top-0 h-full w-[2px] bg-primary-50" />
                <span
                  className="absolute left-0 w-[2px] h-[94px] bg-primary-400"
                  style={{ top: `${scrollProgress * (428 - 94)}px` }}
                />
              </div>
              <div id="seller-recent-orders-list" ref={ordersScrollRef} onScroll={syncScroll} className="seller-recent-orders-scroll h-[428px] overflow-y-auto" tabIndex={0} aria-label="سفارش‌های اخیر، قابل پیمایش">
              <div className="flex flex-col gap-4">
                {RECENT_ORDERS.map((order, idx) => (
                  <div
                    key={`desktop-${order.id}-${idx}`}
                    className="h-[58px] px-6 grid grid-cols-6 items-center text-[13px] hover:bg-surface-subtle/50 transition-colors"
                  >
                    {/* Order Number */}
                    <span className="font-medium text-text-primary">{order.id}</span>

                    {/* Delivery Method */}
                    <span className="text-text-secondary">{order.deliveryMethod}</span>

                    {/* Products Count */}
                    <span className="text-text-secondary">{order.productsCount}</span>

                    {/* Total Amount */}
                    <span className="font-medium text-text-primary">{order.totalAmount}</span>

                    {/* Registration Date */}
                    <span className="text-text-secondary">{order.date}</span>

                    {/* Order Status Badge */}
                    <div className="flex justify-center">
                      <span
                        className={`
                          h-[26px] w-[100px] rounded-md flex items-center justify-center text-caption font-medium
                          ${order.status.bg} ${order.status.color}
                        `}
                      >
                        {order.status.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SellerRecentOrders;
