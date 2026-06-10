import { Skeleton } from "..";

function OrderSummarySkeleton({ isMobile = false }) {
  return (
    <div className="space-y-6 select-none">
      {/* Receiver Header */}
      <Skeleton className="w-32 h-6" />

      {/* Receiver Information */}
      <div className="space-y-6 lg:border-b-2 lg:border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-40 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-5" />
          <Skeleton className="w-32 h-5" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-full h-12" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-36 h-5" />
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-6 lg:space-y-4">
        <Skeleton className="w-28 h-6" />
        <div className="space-y-6 lg:space-y-4">
          {/* Bank Gateway */}
          <div className="flex items-start gap-3">
            <Skeleton className="w-5 h-5 rounded-full shrink-0 mt-1" />
            <Skeleton className="w-48 h-5" />
          </div>

          {/* Line */}
          <div className="hidden lg:block w-full h-[2px] bg-gray-200 mr-8" />

          {/* Wallet */}
          <div className="flex items-start gap-3">
            <Skeleton className="w-5 h-5 rounded-full shrink-0 mt-1" />
            <Skeleton className="w-64 h-5" />
          </div>
        </div>
      </div>

      {/* Final Payment Button */}
      <div
        className={`${isMobile ? "fixed right-0 left-0 bottom-26" : ""} lg:static text-center lg:mt-[114px]`}
      >
        <Skeleton className="w-80 h-6 mx-auto" />
      </div>
    </div>
  );
}

export default OrderSummarySkeleton;
