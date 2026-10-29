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
];

function SellerRecentOrders() {
  return (
    <section className="flex flex-col gap-4 lg:gap-0 lg:bg-surface lg:rounded-xl lg:p-6 lg:border lg:border-border-subtle lg:shadow-card">
      {/* Header: Matches both Figma mobile (44:39482) and desktop */}
      <div className="flex items-center justify-between">
        <h2 className="text-body sm:text-h5 font-bold text-text-primary">سفارشات اخیر</h2>
        <Link
          href="/seller/orders"
          className="flex items-center gap-1 text-[12px] sm:text-caption text-primary hover:text-primary-600 transition-colors font-normal"
        >
          <span>مشاهده همه سفارشات</span>
          <AngleLeftIcon size={16} />
        </Link>
      </div>

      {/* Mobile Card List (Figma Node: 44:39487) */}
      <div className="flex flex-col gap-3 lg:hidden">
        {RECENT_ORDERS.map((order, idx) => (
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
          <div className="min-w-[900px]">
            {/* Table Header */}
            <div className="bg-surface-subtle rounded-lg h-[42px] px-6 grid grid-cols-6 items-center text-caption text-text-secondary font-normal">
              <span>شماره سفارش</span>
              <span>روش تحویل</span>
              <span>محصولات</span>
              <span>مبلغ کل</span>
              <span>تاریخ ثبت</span>
              <span className="text-center">وضعیت سفارش</span>
            </div>

            {/* Table Body with side line indicator */}
            <div className="relative mt-6">
              {/* Left vertical timeline line matching Figma */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary-50 rounded-full">
                <div className="h-[94px] w-full bg-primary-400 rounded-full" />
              </div>

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
    </section>
  );
}

export default SellerRecentOrders;
