"use client";

import { StarIcon, VerifyIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";

function ProductCardMobile({
  product,
  variant = "product",
  onSellerClick,
  onSellerMouseDown,
  onSellerMouseUp,
  onSellerMouseLeave,
}) {
  const isOrder = variant === "order";
  const statusLabel = isOrder
    ? (product.orderHistory?.statusLabel ?? "آماده تحویل")
    : null;

  return (
    <div className="rounded-lg shrink-0">
      <div className="w-full text-start flex items-center justify-between gap-2 py-1.5 px-1 rounded-lg hover:opacity-80 focus:outline-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 relative shrink-0 rounded-lg overflow-hidden bg-white">
            <Image
              src={
                product.seller.profileImage ||
                "/assets/images/fallback/avatar.png"
              }
              fill
              alt={product.seller.name}
              className="object-cover"
            />
          </div>
          <span
            role="button"
            tabIndex={0}
            className="font-medium text-gray-700 truncate text-sm cursor-pointer select-none"
            onClick={() => onSellerClick?.(product)}
            onMouseDown={() => onSellerMouseDown?.(product)}
            onMouseUp={onSellerMouseUp}
            onMouseLeave={onSellerMouseLeave}
            onTouchStart={() => onSellerMouseDown?.(product)}
            onTouchEnd={onSellerMouseUp}
            onTouchCancel={onSellerMouseUp}
          >
            {product.seller.name}
          </span>
          <VerifyIcon
            size={20}
            uniqueId={product.seller.id}
            className="shrink-0"
          />
        </div>
        <div className="flex items-center gap-1 shrink-0 text-gray-600">
          <span>(آرا 1000)</span>
          <div className="flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-yellow-500 mb-1" />
            <span className="text-gray-600">{product.seller.rating}/۵</span>
          </div>
        </div>
      </div>
      <Link
        href="#"
        className="mt-2 bg-white rounded-lg flex flex-col pt-[14px] pb-[10px] px-[10px] overflow-hidden gap-2"
      >
        {isOrder ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-primary text-xs sm:text-sm font-bold sm:pr-4">
              سفارشات(خرید حضوری)
            </span>
            <span className="text-gray-600 text-xs sm:text-sm">
              بروزرسانی اطلاعات (1 دقیقه پیش)
            </span>
          </div>
        ) : (
          product.isSpecialSale && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-error-medium text-xs sm:text-sm font-bold sm:pr-4">
                فروش ویژه
              </span>
              <span className="text-error-medium text-xs sm:text-sm font-bold tabular-nums">
                ۰۰:۰۰:۰۰
              </span>
            </div>
          )
        )}
        <div className="flex flex-row gap-3">
          <div className="relative w-16 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={product.img || "/assets/images/fallback/phone.png"}
              fill
              alt={product.name}
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 text-start min-w-0">
            <p className="font-bold text-gray-800 text-sm line-clamp-2">
              {product.name}
            </p>
            <div className="flex flex-col gap-0.5">
              {isOrder ? (
                <span className="font-semibold text-gray-800">
                  {statusLabel}
                </span>
              ) : (
                <>
                  <span className="font-bold text-gray-800">
                    قیمت {Number(product.finalPrice).toLocaleString("fa-IR")}{" "}
                    تومان
                  </span>
                  {product.discountPercent > 0 && (
                    <span className="text-gray-500 line-through text-xs">
                      {Number(product.price).toLocaleString("fa-IR")} تومان
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCardMobile;
