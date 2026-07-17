"use client";

import { NoteIcon, ReceiptIcon, StarIcon, VerifyIcon } from "@/icons";
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
            <div className="w-[50px] h-[50px] relative shrink-0 rounded-md overflow-hidden bg-white">
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
          className="bg-white rounded-lg flex flex-col p-[5px] pt-3 overflow-hidden gap-3"
        >
          {(isOrder || product.isSpecialSale) && (
            <div className="flex items-center justify-between px-[10px] gap-2 min-h-5 shrink-0">
              {isOrder ? (
                <>
                  <span className="text-primary text-sm font-bold sm:pr-4">
                    سفارشات(خرید حضوری)
                  </span>
                  <ReceiptIcon size={20} />
                </>
              ) : (
                <>
                  <span className="text-error-medium text-sm font-bold sm:pr-4">
                    فروش ویژه
                  </span>
                  <span className="text-error-medium text-base font-bold tabular-nums">
                    ۰۰:۰۰:۰۰
                  </span>
                </>
              )}
            </div>
          )}
          <div className="flex flex-row gap-3">
            <div className="relative w-25 h-25 shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.img || "/assets/images/fallback/no-photo.jpg"}
                fill
                alt={product.name}
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3 text-start min-w-0">
              <div className="flex justify-between">
                <p className="font-bold text-gray-600 text-sm line-clamp-1">
                  {product.name}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                {isOrder ? (
                  <p className="font-bold text-sm text-gray-600">
                    وضعیت <span className="font-extralight">{statusLabel}</span>
                  </p>
                ) : (
                  <>
                    {product.finalPrice > 0 ? (
                      <>
                        <span className="font-bold text-gray-600">
                          قیمت{" "}
                          <span className="font-extralight">
                            {product.formattedPrice ||
                              Number(product.finalPrice).toLocaleString(
                                "fa-IR",
                              )}{" "}
                            تومان
                          </span>
                        </span>
                        {product.discountPercent > 0 && (
                          <span className="text-gray-400 line-through text-xs">
                            {Number(product.price).toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="font-bold text-gray-600">
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
