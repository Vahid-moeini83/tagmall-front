"use client";

import { SupportIcon, StrokeArrowLeftIcon } from "@/icons";

function ReceiptDeliveryHeader({ onSupport, onClose }) {
  return (
    <div className="shrink-0 bg-white px-[12px] pb-4 pt-3 lg:px-[140px] lg:pt-10">
      <div className="relative flex items-center justify-center">
        <h3 className="text-base font-bold text-primary lg:text-xl">
          رسید تحویل سفارش
        </h3>

        <button
          type="button"
          onClick={onSupport}
          className="absolute left-0 -top-2 flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-lg border-2 border-primary"
          aria-label="ارتباط با پشتیبانی"
        >
          <SupportIcon size={20} className="text-primary" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-0 hidden cursor-pointer lg:inline-flex"
          aria-label="بستن رسید تحویل"
        >
          <StrokeArrowLeftIcon size={20} className="rotate-180 text-gray-700" />
        </button>
      </div>
    </div>
  );
}

export default ReceiptDeliveryHeader;
