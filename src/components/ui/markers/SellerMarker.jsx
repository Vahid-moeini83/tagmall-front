import Image from "next/image";
import { cn } from "@/lib/client/utils";

function SellerMarker({ seller, isActive }) {
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
            "relative w-12 h-12 rounded-[14px] border-[3.5px] p-[3px] shadow-md overflow-hidden bg-white z-10 transition-colors duration-300 ease-out",
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
