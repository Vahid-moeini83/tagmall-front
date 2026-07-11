"use client";

import Image from "next/image";
import { VerifyIcon } from "@/icons";

function ReceiptSellerHeader({ seller, orderId }) {
  return (
    <div className="mb-4 flex shrink-0 items-center justify-between gap-3 px-[10px] lg:px-[140px]">
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={seller?.sellerAvatar || "/assets/images/fallback/avatar.png"}
            alt={seller?.sellerName || "فروشگاه"}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <span className="text-sm text-gray-600">{seller?.sellerName}</span>
        <VerifyIcon size={20} className="shrink-0" />
      </div>

      <p className="font-extralight shrink-0 text-gray-600">
        <span className="font-bold">شناسه سفارش</span> {orderId}
      </p>
    </div>
  );
}

export default ReceiptSellerHeader;
