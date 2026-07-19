"use client";

import Image from "next/image";
import { formatRelativeTime } from "@/lib/client/utils";

function getQuantitySuffix(item) {
  if (item.quantityLabel) {
    return item.quantityLabel.replace(/^تعداد\s*/, "");
  }

  if (item.quantity === 1) {
    return `یک ${item.product_name}`;
  }

  return `${item.quantity} عدد ${item.product_name}`;
}

function ReceiptProductList({ items = [] }) {
  return (
    <div className="flex flex-col gap-2 px-[10px] lg:px-[140px]">
      {items.map((item) => (
        <div
          key={item.id}
          className="w-full overflow-hidden rounded-lg border-2 border-gray-100 bg-white p-[5px]"
        >
          <div className="flex min-h-[88px] items-start gap-4">
            <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-lg">
              <Image
                src={item.image ?? "/assets/images/fallback/no-photo.jpg"}
                alt={item.product_name}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-3 text-right">
              <p className="line-clamp-1 text-xs text-gray-600">
                {item.product_name}
              </p>
              <p className="text-xs text-gray-600 font-extralight">
                <span className="font-bold">تعداد</span>{" "}
                {getQuantitySuffix(item)}
              </p>
              <p className="text-xs text-gray-600 font-extralight">
                <span className="font-bold">وضعیت</span> {item.status}{" "}
                <span className="text-gray-400">
                  (به روزرسانی{" "}
                  {formatRelativeTime(item.updated_at) || "۱ دقیقه پیش"})
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReceiptProductList;
