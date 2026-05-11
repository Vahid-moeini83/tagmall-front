"use client";

import { useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

export default function ReceiptStepOne({ onNext, sellerData, orderData }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="space-y-2">
      {/* Three info texts */}
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
          <span className="font-bold">وضعیت سفارش</span> {orderData.status}{" "}
          <span className="text-gray-400">
            به روز رسانی {orderData.lastUpdate}
          </span>
        </p>
      </div>

      {/* Dashed separator with semi-circles */}
      <div className="relative my-4">
        <div className="border-t-6 border-dotted border-white" />
        <div className="absolute -right-5 lg:-right-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-l-full" />
        <div className="absolute -left-5 lg:-left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-r-full" />
      </div>

      {/* Instructions text */}
      <p className="text-gray-600 text-xs lg:text-sm leading-8 text-justify">
        کاربر محترم لطفا با توجه به وضعیت فعالیت فروشگاه و بازه زمانی که مشخص
        کردید به فروشگاه مراجعه و با اعلام کد تحویل سفارش به فروشنده سفارش را
        تحویل بگیرید ؛ همچنین جهت پیگیری سفارش می توانید با واحد پشتیبانی ارتباط
        برقرار کنید .
      </p>

      {/* Checkbox */}
      <div className="flex items-center gap-2 pt-2">
        <Checkbox checked={isConfirmed} onChange={setIsConfirmed} />
        <label
          onClick={() => setIsConfirmed(!isConfirmed)}
          className="text-gray-600 text-xs lg:text-sm cursor-pointer"
        >
          <span className="font-bold">کالا با سفارش ثبت شده</span> مطابقت دارد.{" "}
          <span className="text-gray-400">
            (سفارش {orderData.itemsCount} کالا بدون مرجوعی)
          </span>
        </label>
      </div>

      {/* Submit button */}
      <button
        disabled={!isConfirmed}
        onClick={onNext}
        className={`w-full text-base font-bold my-4 ${
          isConfirmed
            ? "text-primary cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        دریافت کد تحویل سفارش
      </button>
    </div>
  );
}
