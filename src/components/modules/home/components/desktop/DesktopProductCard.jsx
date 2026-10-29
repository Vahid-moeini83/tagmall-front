"use client";

import Image from "next/image";
import Link from "next/link";
import { BasketShoppingIcon } from "@/icons";
import { formatPrice } from "@/lib/client/utils";

export default function DesktopProductCard({ product, mode = "special", onAddToCart }) {
  const isSpecial = mode === "special";
  const formattedPrice =
    product.formattedPrice ||
    (product.price ? formatPrice(product.price) : "۰");

  const productSlug = product.id?.split("-").pop() || product.id;

  return (
    <div className="w-60 shrink-0 bg-surface border border-border-default rounded-xl p-3 flex flex-col justify-between shadow-card hover:border-primary-300 transition-colors">
      <Link
        href={`/products/${productSlug}`}
        className="block group"
      >
        {/* Product Image Container */}
        <div className="w-full h-36 bg-surface-subtle rounded-xl flex items-center justify-center p-3 overflow-hidden relative">
          <Image
            src={product.img || "/assets/images/fallback/no-photo.jpg"}
            alt={product.name || "محصول"}
            width={120}
            height={120}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Title */}
        <h4 className="mt-3 text-small text-text-primary line-clamp-2 h-11 text-right font-normal">
          {product.name}
        </h4>
      </Link>

      {isSpecial ? (
        <div className="space-y-3">
          {/* Stock Badges */}
          <div className="flex items-center justify-between text-label">
            <span className="text-error font-semibold">
              {product.totalSales ? `فقط ۲ عدد باقیمانده` : "موجود"}
            </span>
            <span className="text-success font-semibold">موجود</span>
          </div>

          {/* Divider */}
          <div className="border-b border-border-subtle" />

          {/* Price & Cart Action */}
          <div className="flex items-center justify-between">
            {/* Cart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart?.(product);
              }}
              aria-label="افزودن به سبد خرید"
              className="size-7.5 rounded-md bg-primary hover:bg-primary-600 transition-colors flex items-center justify-center text-surface cursor-pointer"
            >
              <BasketShoppingIcon size={17} className="text-surface" />
            </button>

            {/* Price */}
            <div className="flex items-center gap-2">
              {product.discountPercent > 0 && (
                <span className="text-small text-text-disabled line-through">
                  {formatPrice(product.price * 1.2)}
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-small text-text-secondary font-semibold">
                  {formattedPrice}
                </span>
                <span className="text-caption text-text-muted">تومان</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-label">
          {/* Dashed divider */}
          <div className="border-b border-dashed border-primary-200 my-1" />

          {/* Order Details */}
          <div className="flex items-center justify-between text-text-primary">
            <span>{product.quantity || 1} عدد</span>
            <span className="text-text-muted">تعداد کالا</span>
          </div>
          <div className="flex items-center justify-between text-text-primary">
            <span className="text-success font-medium">آماده تحویل</span>
            <span className="text-text-muted">وضعیت</span>
          </div>
          <div className="flex items-center justify-between text-text-primary">
            <span>۲ روز پیش</span>
            <span className="text-text-muted">آخرین بروزرسانی</span>
          </div>
        </div>
      )}
    </div>
  );
}
