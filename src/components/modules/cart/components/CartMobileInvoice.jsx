"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";
import { formatPrice } from "@/lib/client/utils";

function CartMobileInvoice({ billSummary, className = "" }) {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const {
    orders = 0,
    shipping = 0,
    vat = 0,
    discount = 0,
    total = 0,
  } = billSummary || {};

  return (
    <div
      className={`bg-white rounded-xl p-[10px] ${isInvoiceOpen ? "border-2 border-gray-200" : ""} ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsInvoiceOpen((prev) => !prev)}
        className="relative flex w-full items-center justify-center cursor-pointer"
        aria-expanded={isInvoiceOpen}
        aria-label="صورت حساب"
      >
        {isInvoiceOpen ? (
          <ChevronUpIcon
            size={20}
            className="text-gray-800 shrink-0 absolute left-[10px]"
          />
        ) : (
          <ChevronDownIcon
            size={20}
            className="text-gray-800 shrink-0 absolute left-[10px]"
          />
        )}
        <span className="font-extralight text-gray-600">
          <span className="font-extrabold">صورت حساب:</span>{" "}
          {formatPrice(total)} تومان
        </span>
      </button>

      {isInvoiceOpen && (
        <div className="mt-6 space-y-6 text-gray-600 text-right">
          <p className="font-extralight text-sm">
            <span className="font-bold">سفارشات:</span> {formatPrice(orders)}{" "}
            تومان
          </p>
          <p className="font-extralight text-sm">
            <span className="font-bold">هزینه ارسال:</span>{" "}
            {formatPrice(shipping)} تومان
          </p>
          <p className="font-extralight text-sm">
            <span className="font-bold">مالیات بر ارزش افزوده:</span>{" "}
            {formatPrice(vat)} تومان
          </p>
          <p className="font-extralight text-sm text-success-medium">
            <span className="font-bold">تخفیف:</span> {formatPrice(discount)}{" "}
            تومان
          </p>
        </div>
      )}
    </div>
  );
}

export default CartMobileInvoice;
