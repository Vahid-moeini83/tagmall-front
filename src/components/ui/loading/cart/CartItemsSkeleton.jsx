import { Skeleton } from "..";
import { UserIcon, HintIcon, PlusIcon, MinusIcon } from "@/icons";

function CartItemMobileSkeleton() {
  return (
    <div className="space-y-3 select-none">
      {/* Seller row */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
          <UserIcon size={20} />
        </div>
        <Skeleton className="h-3 w-[42%] rounded-full" />
      </div>

      {/* Product card row */}
      <div className="bg-gray-200 rounded-full px-3 py-3 flex items-center gap-3">
        <Skeleton className="w-12 h-12 shrink-0 rounded-lg bg-gray-400" />
        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          <Skeleton className="h-3 w-full rounded-full bg-gray-400" />
          <Skeleton className="h-3 w-[58%] rounded-full bg-gray-400" />
        </div>
        <div className="flex items-center gap-1 shrink-0" dir="ltr">
          <PlusIcon size={20} className="text-primary" />
          <span className="text-gray-400 font-extralight text-sm w-4 text-center">
            1
          </span>
          <MinusIcon size={20} className="text-gray-800" />
        </div>
      </div>

      {/* Delivery info row */}
      <div className="flex items-center gap-3">
        <HintIcon size={20} className="mr-4" />
        <Skeleton className="h-3 w-[60%] rounded-full" />
      </div>
    </div>
  );
}

function CartItemsSkeleton({ isMobile = false, count = 2 }) {
  if (!isMobile) {
    return (
      <div className="space-y-10 select-none">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`pb-8 ${index < count - 1 ? "border-b-2 border-gray-100" : ""}`}
          >
            <div className="grid grid-cols-2">
              <div className="flex justify-center items-center">
                <Skeleton className="w-50 h-50 rounded-lg" />
              </div>
              <div className="flex flex-col items-start justify-start gap-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="w-5 h-5 rounded-full" />
                  </div>
                </div>
                <div className="pr-14 w-full space-y-4">
                  <Skeleton className="h-5 w-3/4 bg-gray-400" />
                  <Skeleton className="h-5 w-80 bg-gray-400" />
                </div>
                <div className="flex items-center justify-end w-full pr-3.5">
                  <div className="flex items-center px-3 py-2 gap-2 border-2 border-gray-200 rounded-md">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-8 h-5" />
                    <Skeleton className="w-5 h-5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, index) => (
        <CartItemMobileSkeleton key={index} />
      ))}
    </div>
  );
}

export default CartItemsSkeleton;
