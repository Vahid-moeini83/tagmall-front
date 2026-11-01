import Image from "next/image";
import { cn } from "@/lib/client/utils";
import { StrokeLocationIcon } from "@/icons";

function SellerMarker({ seller, isActive, variant = "default" }) {
  if (variant === "desktop") {
    const storeName = seller.storeName || seller.name || "فروشگاه";

    if (isActive) {
      return (
        <div className="flex flex-col items-center justify-center cursor-pointer select-none">
          <div className="relative flex flex-col items-center">
            {/* Store Avatar Pin */}
            <div className="relative size-13 rounded-circle border-[2.5px] border-primary bg-surface shadow-card overflow-hidden flex items-center justify-center">
              <Image
                src={seller.profileImage || "/assets/images/fallback/no-photo.jpg"}
                alt={storeName}
                width={52}
                height={52}
                className="w-full h-full object-cover rounded-circle"
              />
            </div>
            {/* Triangle pointer */}
            <div className="w-0 h-0 border-x-6 border-x-transparent border-t-8 border-t-primary -mt-0.5" />
          </div>
          {/* Active Store Name Popup */}
          <div className="mt-2 bg-primary text-surface px-3 py-1.5 rounded-md shadow-card whitespace-nowrap">
            <span className="text-small font-bold">{storeName}</span>
          </div>
        </div>
      );
    }

    // Inactive Desktop Store Pin
    return (
      <div className="flex flex-col items-center justify-center cursor-pointer select-none opacity-90 hover:opacity-100 transition-opacity">
        <div className="text-text-primary">
          <StrokeLocationIcon size={24} />
        </div>
        <div className="mt-1 bg-primary text-surface px-2 py-1 rounded-md shadow-card whitespace-nowrap">
          <span className="text-caption font-medium">{storeName}</span>
        </div>
      </div>
    );
  }

  // Default (Mobile) Behavior - Frozen and Unchanged
  const borderColor = isActive
    ? "border-primary"
    : seller.hasReadyDelivery
      ? "border-green-600"
      : "border-orange-600";

  const tailColor = isActive
    ? "bg-primary"
    : seller.hasReadyDelivery
      ? "bg-green-500"
      : "bg-orange-600";

  if (seller.hasSpecialSale) {
    return (
      <div className="flex flex-col-reverse items-center justify-end cursor-pointer">
        <div
          className={cn(
            "w-1 h-2.5 -mt-1 z-0 transition-colors duration-300 ease-out",
            tailColor,
          )}
        />
        <div
          className={cn(
            "relative w-12 h-12 rounded-lg border-[3.5px] p-[3px] shadow-md overflow-hidden bg-white z-10 transition-colors duration-300 ease-out",
            borderColor,
          )}
        >
          <Image
            src={seller.profileImage}
            alt={seller.name}
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-2 h-2 rounded-full bg-primary shadow-sm transition-all duration-300 ease-out",
        isActive ? "border border-white p-0.5" : "",
      )}
    />
  );
}

export default SellerMarker;
