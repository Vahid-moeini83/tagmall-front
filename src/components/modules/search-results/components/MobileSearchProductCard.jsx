import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/client/utils";

function MobileSearchProductCard({ product, className = "" }) {
  const {
    id,
    name,
    img,
    minPrice,
    maxPrice,
    oldMinPrice,
    oldMaxPrice,
    isSpecialSale,
    saleTimer = "۰۰ : ۰۰ : ۰۰",
  } = product;

  return (
    <Link href={`/products/${id}`} className="block">
      <div
        className={`bg-white rounded-lg border-2 border-gray-100 p-[5px] w-full overflow-hidden ${className}`}
      >
        <div className="flex items-start gap-4 min-h-[88px]">
          <div className="relative w-[100px] h-[100px] shrink-0 rounded-lg overflow-hidden">
            <Image
              src={img || "/assets/images/fallback/no-photo.jpg"}
              fill
              alt={name}
              className="object-contain"
            />
          </div>

          <div className="flex-1 min-w-0 text-right space-y-2">
            {isSpecialSale ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-error-medium text-xs font-bold">
                  فروش ویژه
                </span>
                <span className="text-error-medium text-xs font-bold">
                  {saleTimer}
                </span>
              </div>
            ) : null}

            <p className="text-sm text-gray-600 line-clamp-1">{name}</p>

            <p className="text-xs text-gray-600">
              <span className="font-bold">محدوده قیمت</span>{" "}
              {formatPrice(minPrice)} تا {formatPrice(maxPrice)} تومان
            </p>

            {oldMinPrice && oldMaxPrice ? (
              <p className="text-xs text-gray-400 line-through mr-19">
                {formatPrice(oldMinPrice)} تا {formatPrice(oldMaxPrice)} تومان
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MobileSearchProductCard;
