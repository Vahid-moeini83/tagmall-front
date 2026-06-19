"use client";

import { NoteIcon, StarIcon, VerifyIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

function ProductCardMobile({
  product,
  variant = "product",
  onSellerClick,
  onSellerMouseDown,
  onSellerMouseUp,
  onSellerMouseLeave,
  isListMode = false,
  setIsReviewsModalOpen,
}) {
  const isOrder = variant === "order";
  const statusLabel = isOrder
    ? (product.orderHistory?.statusLabel ?? "آماده تحویل")
    : null;

  // Drag handling برای جلوگیری از باز شدن لینک هنگام drag
  // از pointerDown/Move روی wrapper بیرونی استفاده می‌کنیم تا
  // حتی وقتی Keen Slider رویدادها رو intercept می‌کنه هم کار کنه
  const dragStartPos = useRef(null);
  const isDragging = useRef(false);

  const handlePointerDown = (e) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  const handlePointerMove = (e) => {
    if (dragStartPos.current) {
      const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
      const deltaY = Math.abs(e.clientY - dragStartPos.current.y);
      if (deltaX > 5 || deltaY > 5) {
        isDragging.current = true;
      }
    }
  };

  const handleClick = (e) => {
    if (isDragging.current) {
      e.preventDefault();
      isDragging.current = false;
    }
    dragStartPos.current = null;
  };

  return (
    <>
      <div
        className="rounded-lg shrink-0 w-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <div className="w-full text-start flex items-center justify-between gap-2 pb-1.5 px-1 rounded-lg hover:opacity-80 focus:outline-none">
          <div
            onClick={() => onSellerClick?.(product)}
            className={`flex items-center gap-2 min-w-0 ${isListMode ? "cursor-pointer" : ""}`}
          >
            <div className="w-10 h-10 relative shrink-0 rounded-md overflow-hidden bg-white">
              <Image
                src={
                  product.seller.profileImage ||
                  "/assets/images/fallback/no-photo.jpg"
                }
                fill
                alt={product.seller.storeName || product.seller.name}
                className="object-cover"
              />
            </div>
            <span
              role="button"
              tabIndex={0}
              className="font-medium text-gray-700 truncate text-sm cursor-pointer select-none"
              onMouseDown={() => onSellerMouseDown?.(product)}
              onMouseUp={onSellerMouseUp}
              onMouseLeave={onSellerMouseLeave}
              onTouchStart={() => onSellerMouseDown?.(product)}
              onTouchEnd={onSellerMouseUp}
              onTouchCancel={onSellerMouseUp}
            >
              {product.seller.storeName || product.seller.name}
            </span>
            <VerifyIcon
              size={20}
              uniqueId={`store-${product.storeId}`}
              className="shrink-0"
            />
          </div>
          <div
            onClick={() => setIsReviewsModalOpen(true)}
            className="flex items-center gap-1 shrink-0 text-gray-600"
          >
            <span>(آرا {product.seller.totalReviews || 1000})</span>
            <div className="flex items-center gap-1">
              <StarIcon className="w-[10px] h-[10px] text-yellow-500 mb-1" />
              <span className="text-gray-600">
                {product.seller.rating || 0}/۵
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/products/2"
          onClick={handleClick}
          className="mt-2 bg-white rounded-md flex flex-col pt-[14px] pb-[10px] px-[10px] overflow-hidden gap-3"
        >
          <div className="flex items-center justify-between gap-2 min-h-5 shrink-0">
            {isOrder ? (
              <>
                <span className="text-primary text-xs sm:text-sm font-bold sm:pr-4">
                  سفارشات(خرید حضوری)
                </span>
                <span className="text-gray-600 text-xs sm:text-sm">
                  بروزرسانی اطلاعات (1 دقیقه پیش)
                </span>
              </>
            ) : product.isSpecialSale ? (
              <>
                <span className="text-error-medium text-sm font-bold sm:pr-4">
                  فروش ویژه
                </span>
                <span className="text-error-medium text-sm font-bold tabular-nums">
                  ۰۰:۰۰:۰۰
                </span>
              </>
            ) : (
              <>
                <span
                  className="invisible text-sm font-bold sm:pr-4"
                  aria-hidden
                >
                  فروش ویژه
                </span>
                <span
                  className="invisible text-sm font-bold tabular-nums"
                  aria-hidden
                >
                  ۰۰:۰۰:۰۰
                </span>
              </>
            )}
          </div>
          <div className="flex flex-row gap-3">
            <div className="relative w-16 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100">
              <Image
                src={product.img || "/assets/images/fallback/no-photo.jpg"}
                fill
                alt={product.name}
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 text-start min-w-0">
              <div className="flex justify-between">
                <p className="font-bold text-gray-800 text-sm line-clamp-2">
                  {product.name}
                </p>
                {isOrder ? (
                  <NoteIcon size={20} className="cursor-pointer" />
                ) : null}
              </div>
              <div className="flex flex-col gap-0.5">
                {isOrder ? (
                  <span className="font-semibold text-gray-800">
                    {statusLabel}
                  </span>
                ) : (
                  <>
                    {product.finalPrice > 0 ? (
                      <>
                        <span className="font-bold text-gray-800">
                          قیمت{" "}
                          {product.formattedPrice ||
                            Number(product.finalPrice).toLocaleString(
                              "fa-IR",
                            )}{" "}
                          تومان
                        </span>
                        {product.discountPercent > 0 && (
                          <span className="text-gray-500 line-through text-xs">
                            {Number(product.price).toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="font-bold text-gray-800">
                        قیمت نامشخص
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default ProductCardMobile;
