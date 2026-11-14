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
      mobileWidth: "w-[87px]",
      desktopWidth: "lg:w-[95px]",
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
      mobileWidth: "w-[67px]",
      desktopWidth: "lg:w-[100px]",
      bg: "bg-[#108981]/10",
      color: "text-[#108981]",
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
      mobileWidth: "w-[60px]",
      desktopWidth: "lg:w-[100px]",
      bg: "bg-[#fee2e2]",
      color: "text-[#ef4444]",
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
      mobileWidth: "w-[72px]",
      desktopWidth: "lg:w-[100px]",
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
      mobileWidth: "w-[102px]",
      desktopWidth: "lg:w-[100px]",
      bg: "bg-[#dbeafe]",
      color: "text-[#3b82f6]",
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
      mobileWidth: "w-[75px]",
      desktopWidth: "lg:w-[100px]",
      bg: "bg-[#fef3c7]",
      color: "text-[#f59e0b]",
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
    <section className="flex flex-col gap-3 lg:gap-0 lg:bg-surface lg:rounded-xl lg:p-6">
      {/* Header: Matches both Figma mobile (44:39482) and desktop */}
      <div className="flex h-11 items-center justify-between lg:h-[25px]">
        <h2 className="text-[18px] leading-[26px] [font-weight:450] text-text-primary lg:text-[16px] lg:leading-[25px] lg:[font-weight:600]">سفارشات اخیر</h2>
        <Link
          href="/seller/orders"
          className="flex h-11 items-center gap-1 text-[12px] leading-[18px] [font-weight:325] text-primary transition-colors hover:text-text-secondary"
        >
          <span>مشاهده همه سفارشات</span>
          <AngleLeftIcon size={14} strokeWidth={0} />
        </Link>
      </div>

      {/* Mobile Card List (Figma Node: 44:39487) */}
      <div className="flex flex-col gap-3 lg:hidden">
        {RECENT_ORDERS.slice(0, 6).map((order, idx) => (
          <div
            key={`mobile-${order.id}-${idx}`}
            className="bg-surface h-[157px] rounded-lg border border-[#eeeff6] p-[13px] flex flex-col gap-2.5"
          >
            {/* Row 1: Order ID & Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-[22px] [font-weight:325] text-text-primary">{order.id}</span>
              <span
                className={`h-[26px] ${order.status.mobileWidth} sm:w-[100px] ${order.status.desktopWidth} shrink-0 whitespace-nowrap rounded-md px-2 py-1 sm:px-3 flex items-center justify-center text-[12px] leading-[18px] [font-weight:325] ${order.status.bg} ${order.status.color}`}
              >
                {order.status.label}
              </span>
            </div>

            {/* Row 2: Date & Product Count */}
            <div className="flex h-[18px] items-center justify-between text-[12px] leading-[18px] [font-weight:325]">
              <span className="text-text-muted">{order.date}</span>
              <span className="text-text-secondary">{order.productsCount}</span>
            </div>

            {/* Row 3: Delivery Method */}
            <div className="text-[14px] leading-[22px] [font-weight:325] text-text-secondary text-right">
              <span>{order.deliveryMethod}</span>
            </div>

            {/* Row 4: Divider */}
            <div className="border-t border-border-subtle" />

            {/* Row 5: Total Amount */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] leading-[18px] [font-weight:325] text-text-muted">مبلغ کل</span>
              <span className="text-[14px] leading-[22px] [font-weight:325] text-text-primary">
                {order.totalAmount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Responsive Table (Figma Node: 44:39024) */}
      <div className="hidden lg:block mt-6">
        <div className="overflow-x-auto">
          <div className="min-w-[1012px]">
            {/* Table Header */}
            <div className="relative h-[42px] min-w-[1012px] rounded-lg bg-surface-subtle text-caption leading-[18px] [font-weight:325] text-text-secondary">
              <span className="absolute left-[821.333px] top-3 h-[18px] w-[166.667px] text-right">شماره سفارش</span>
              <span className="absolute left-[677px] top-3 h-[18px] w-[166.667px] text-center">روش تحویل</span>
              <span className="absolute left-[553px] top-3 h-[18px] w-[49px] text-center">محصولات</span>
              <span className="absolute left-[390px] top-3 h-[18px] w-[41px] text-center">مبلغ کل</span>
              <span className="absolute left-[183px] top-3 h-[18px] w-[149px] text-center">تاریخ ثبت</span>
              <span className="absolute left-6 top-3 h-[18px] w-[100px] text-center">وضعیت سفارش</span>
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
                    className="relative flex h-[58px] w-full items-center justify-between px-6 text-[14px] leading-[22px] [font-weight:325] transition-colors hover:bg-surface-subtle/50"
                    dir="rtl"
                  >
                    {/* Order Number */}
                    <span className="w-[89px] shrink-0 whitespace-nowrap text-right text-text-primary">{order.id}</span>

                    {/* Delivery Method */}
                    <span className="w-[130px] shrink-0 whitespace-nowrap text-center text-text-secondary">{order.deliveryMethod}</span>

                    {/* Products Count */}
                    <span className="w-[80px] shrink-0 whitespace-nowrap text-center text-text-secondary">{order.productsCount}</span>

                    {/* Total Amount */}
                    <span className="w-[95px] shrink-0 whitespace-nowrap text-center text-text-primary">{order.totalAmount}</span>

                    {/* Registration Date */}
                    <span className="w-[90px] shrink-0 whitespace-nowrap text-center text-text-secondary">{order.date}</span>

                    {/* Order Status Badge */}
                    <div className="flex w-[100px] shrink-0 justify-start" dir="ltr">
                      <span
                        className={`
                          h-[26px] ${order.status.desktopWidth || "lg:w-[100px]"} rounded-md flex items-center justify-center text-caption [font-weight:325]
                          ${order.status.bg} ${order.status.color}
                        `}
                      >
                        {order.status.label}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#f3f4f6]"
                    />
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
