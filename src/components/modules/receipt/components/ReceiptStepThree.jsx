"use client";

export default function ReceiptStepThree({ onBack, orderData }) {
  return (
    <div className="space-y-3">
      {/* Three info texts with updated status */}
      <div className="space-y-4">
        <p className="text-gray-600 text-xs lg:text-base">
          <span className="font-bold">تعداد</span> {orderData.quantity}{" "}
          {orderData.productName}
        </p>
        <p className="text-gray-600 text-xs lg:text-base">
          <span className="font-bold">بازه زمانی مراجعه به فروشگاه</span>{" "}
          {orderData.visitDate}
        </p>
        <p className="text-gray-600 text-xs lg:text-base">
          <span className="font-bold">وضعیت سفارش</span> (تحویل داده شده){" "}
          <span className="text-gray-400">
            به روز رسانی {orderData.lastUpdate}
          </span>
        </p>
      </div>

      {/* Support button */}
      <button className="my-4 text-primary text-sm lg:text-base w-full cursor-pointer hover:opacity-80 transition-opacity">
        ارتباط با واحد پشتیبانی
      </button>
    </div>
  );
}
