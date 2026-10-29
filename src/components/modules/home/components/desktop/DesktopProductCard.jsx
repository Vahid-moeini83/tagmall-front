"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BasketShoppingIcon,
  BoxIcon,
  InfoSquareIcon,
  ArrowsRepeatIcon,
} from "@/icons";
import { formatPrice } from "@/lib/client/utils";
import { cn } from "@/lib/client/utils";

export default function DesktopProductCard({
  product,
  mode = "special",
  onAddToCart,
}) {
  const isSpecial = mode === "special";
  const formattedPrice =
    product.formattedPrice ||
    (product.price ? formatPrice(product.price) : "۰");

  const productSlug = product.id?.split("-").pop() || product.id;

  return (
    <div
      className={cn(
        "w-60 shrink-0 bg-surface border border-border-default rounded-xl p-3 flex flex-col justify-between shadow-card hover:border-primary-300 transition-colors",
        isSpecial ? "h-77.75" : "h-85",
      )}
    >
      <Link href={`/products/${productSlug}`} className="block group">
        {/* Product Image Container */}
        <div className="w-full h-35.25 bg-surface-subtle rounded-2xl flex items-center justify-center p-3 overflow-hidden relative">
          <Image
            src={product.img || "/assets/images/fallback/no-photo.jpg"}
            alt={product.name || "محصول"}
            width={115}
            height={115}
            className="size-28.75 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Title (2 lines) */}
        <h4 className="mt-3 text-small text-text-primary line-clamp-2 h-11 text-right font-normal">
          {product.name}
        </h4>
      </Link>

      {isSpecial ? (
        <div className="space-y-3">
          {/* Stock Badges */}
          <div className="flex items-center justify-between text-label">
            <span className="text-error font-medium">
              {product.totalSales ? "فقط ۲ عدد باقیمانده" : "موجود"}
            </span>
            <span className="text-success font-medium">موجود</span>
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
              className="size-7.5 rounded-md bg-primary hover:bg-primary-600 transition-colors flex items-center justify-center text-surface cursor-pointer shrink-0"
            >
              <BasketShoppingIcon size={17} className="text-surface" />
            </button>

            {/* Price Info */}
            <div className="flex items-center gap-2">
              {product.discountPercent > 0 && (
                <span className="text-small text-text-disabled line-through">
                  {formatPrice(product.price * 1.2)}
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-small text-text-primary font-semibold">
                  {formattedPrice}
                </span>
                <span className="text-caption text-text-muted">تومان</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Divider */}
          <div className="border-b border-border-default my-1" />

          {/* Order Details (3 rows matching Figma exactly) */}
          <div className="flex items-center justify-between text-small h-5.5">
            <div className="flex items-center gap-1.5 text-text-muted">
              <BoxIcon size={18} className="text-text-muted" />
              <span>تعداد کالا</span>
            </div>
            <span className="text-text-primary font-medium">
              {product.quantity || 2} عدد
            </span>
          </div>

          <div className="flex items-center justify-between text-small h-5.5">
            <div className="flex items-center gap-1.5 text-text-muted">
              <InfoSquareIcon size={18} className="text-text-muted" />
              <span>وضعیت</span>
            </div>
            <span className="text-success font-medium">
              {product.orderHistory?.statusLabel || "آماده تحویل"}
            </span>
          </div>

          <div className="flex items-center justify-between text-small h-5.5">
            <div className="flex items-center gap-1.5 text-text-muted">
              <ArrowsRepeatIcon size={18} className="text-text-muted" />
              <span>آخرین بروزرسانی</span>
            </div>
            <span className="text-text-primary font-medium">۲ روز پیش</span>
          </div>
        </div>
      )}
    </div>
  );
}
