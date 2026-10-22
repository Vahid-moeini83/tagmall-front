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
      bg: "bg-[#fef6ef]",
      color: "text-[#f58220]",
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
      bg: "bg-[#eeeff6]",
      color: "text-[#3d3183]",
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
      bg: "bg-[#fef3c7]",
      color: "text-[#f59e0b]",
    },
  },
];


function SellerRecentOrders() {
  return (
    <div className="bg-white rounded-[20px] p-6 flex flex-col gap-4 border border-gray-100/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#1a1a2e]">سفارشات اخیر</h2>
        <Link
          href="/seller/orders"
          className="flex items-center gap-1 text-[12px] text-[#7a7a96] hover:text-[#1a1a2e] transition-colors"
        >
          <span>مشاهده همه سفارشات</span>
          <AngleLeftIcon size={16} />
        </Link>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="bg-[#f9fafb] rounded-xl h-[42px] px-6 grid grid-cols-6 items-center text-[12px] text-[#4a4a68] font-normal">
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
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#eeeff6] rounded-full">
              <div className="h-[94px] w-full bg-[#6868b1] rounded-full" />
            </div>

            <div className="divide-y divide-[#f3f4f6]">
              {RECENT_ORDERS.map((order, idx) => (
                <div
                  key={`${order.id}-${idx}`}
                  className="h-[58px] px-6 grid grid-cols-6 items-center text-[13px] hover:bg-[#f9fafb]/50 transition-colors"
                >
                  {/* Order Number */}
                  <span className="font-medium text-[#1a1a2e]">
                    {order.id}
                  </span>

                  {/* Delivery Method */}
                  <span className="text-[#4a4a68]">
                    {order.deliveryMethod}
                  </span>

                  {/* Products Count */}
                  <span className="text-[#4a4a68]">
                    {order.productsCount}
                  </span>

                  {/* Total Amount */}
                  <span className="font-medium text-[#1a1a2e]">
                    {order.totalAmount}
                  </span>

                  {/* Registration Date */}
                  <span className="text-[#4a4a68]">
                    {order.date}
                  </span>

                  {/* Order Status Badge */}
                  <div className="flex justify-center">
                    <span
                      className={`
                        h-[26px] px-3.5 rounded-lg flex items-center justify-center text-[12px] font-medium
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
