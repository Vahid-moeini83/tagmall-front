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
    <div className="bg-surface rounded-2xl p-6 flex flex-col gap-4 border border-border-subtle shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-body font-bold text-text-primary">سفارشات اخیر</h2>
        <Link
          href="/seller/orders"
          className="flex items-center gap-1 text-caption text-text-muted hover:text-text-primary transition-colors"
        >
          <span>مشاهده همه سفارشات</span>
          <AngleLeftIcon size={16} />
        </Link>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="bg-surface-subtle rounded-xl h-[42px] px-6 grid grid-cols-6 items-center text-caption text-text-secondary font-normal">
            <span>شماره سفارش</span>
            <span>روش تحویل</span>
            <span>محصولات</span>
            <span>مبلغ کل</span>
            <span>تاریخ ثبت</span>
            <span className="text-center">وضعیت سفارش</span>
          </div>

          {/* Table Body with side line indicator */}
          <div className="relative mt-1">
            {/* Left vertical timeline line matching Figma */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary-50 rounded-full">
              <div className="h-[94px] w-full bg-primary-400 rounded-full" />
            </div>

            <div className="divide-y divide-border-subtle">
              {RECENT_ORDERS.map((order, idx) => (
                <div
                  key={`${order.id}-${idx}`}
                  className="h-[58px] px-6 grid grid-cols-6 items-center text-[13px] hover:bg-surface-subtle/50 transition-colors"
                >
                  {/* Order Number */}
                  <span className="font-medium text-text-primary">
                    {order.id}
                  </span>

                  {/* Delivery Method */}
                  <span className="text-text-secondary">
                    {order.deliveryMethod}
                  </span>

                  {/* Products Count */}
                  <span className="text-text-secondary">
                    {order.productsCount}
                  </span>

                  {/* Total Amount */}
                  <span className="font-medium text-text-primary">
                    {order.totalAmount}
                  </span>

                  {/* Registration Date */}
                  <span className="text-text-secondary">
                    {order.date}
                  </span>

                  {/* Order Status Badge */}
                  <div className="flex justify-center">
                    <span
                      className={`
                        h-[26px] px-3.5 rounded-lg flex items-center justify-center text-caption font-medium
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
  );
}

export default SellerRecentOrders;
