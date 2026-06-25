import Image from "next/image";
import { formatPrice } from "@/lib/client/utils";
import MobileSearchProductCard from "./MobileSearchProductCard";

function ProductListItem({ product, isDesktop = false }) {
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 not-last:border-b-2 border-gray-100 pb-8">
        <div className="flex justify-center items-center">
          <div className="relative w-40 xl:w-50 h-40 xl:h-50 rounded-lg overflow-hidden">
            <Image
              src={product.img || "/assets/images/fallback/phone.png"}
              fill
              alt={product.name}
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-8">
          <div className="flex items-center justify-between w-full">
            <span className="text-error-medium text-xl">فروش ویژه</span>
            <span className="text-error-medium text-xl">00:00:00</span>
          </div>
          <div>
            <p className="font-bold text-gray-600 line-clamp-1 mb-4">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mb-2 text-gray-600">
              <span className="font-bold">محدوده قیمت</span>
              <span>
                {formatPrice(product.minPrice)} تا{" "}
                {formatPrice(product.maxPrice)} تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <MobileSearchProductCard product={product} />;
}

export default ProductListItem;
