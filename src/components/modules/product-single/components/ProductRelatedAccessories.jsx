import Image from "next/image";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";

export default function ProductRelatedAccessories() {
  const accessories = [
    "/assets/images/fallback/phone.png",
    "/assets/images/fallback/phone.png",
    "/assets/images/fallback/phone.png",
    "/assets/images/fallback/phone.png",
    "/assets/images/fallback/phone.png",
    "/assets/images/fallback/phone.png",
  ];

  return (
    <div className="bg-white rounded-lg py-[10px] px-[10px] lg:pt-[50px] lg:px-[100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-primary text-[16px] lg:text-[20px] font-semibold">
          لوازم جانبی و قطعات مرتبط
        </h2>

        {/* Desktop: Show All Link */}
        <Link href="#" className="hidden lg:block text-primary">
          نمایش همه
        </Link>
      </div>

      {/* Mobile: Link with chevron */}
      <button className="flex items-center justify-between w-full lg:hidden mb-4">
        <span className="text-primary text-[16px] font-semibold">
          لوازم جانبی و قطعات مرتبط
        </span>
        <ChevronLeftIcon size={20} color="currentColor" />
      </button>

      {/* Accessories Images - Desktop */}
      <div className="hidden lg:flex items-center gap-6 overflow-x-auto">
        {accessories.map((image, index) => (
          <div key={index} className="flex items-center gap-6 shrink-0 mb-12">
            <div className="relative w-[200px] h-[200px]">
              <Image
                src={image}
                fill
                alt={`Accessory ${index + 1}`}
                className="object-contain"
              />
            </div>
            {index < accessories.length - 1 && (
              <div className="w-[2px] h-[200px] bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
