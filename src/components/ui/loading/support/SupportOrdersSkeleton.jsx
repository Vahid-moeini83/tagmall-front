import { Skeleton } from "..";
import { ChevronDownIcon, ReceiptIcon, SupportIcon, UserIcon } from "@/icons";

function SupportOrderCardSkeleton() {
  return (
    <div className="w-full border-b-4 border-gray-200">
      <div className="px-[10px] pb-[10px] space-y-2 select-none">
        {/* Header: seller + receipt (mirrors SupportOrderCard) */}
        <div className="flex items-center justify-between mb-[5px] px-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-gray-200 flex items-center justify-center">
              <UserIcon size={20} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-2.5 w-20 rounded-full" />
              <Skeleton className="h-2.5 w-40 rounded-full" />
            </div>
          </div>

          <ReceiptIcon size={20} className="shrink-0 ml-[10px] text-gray-800" />
        </div>

        {/* Main content block */}
        <Skeleton className="w-full h-[110px] rounded-2xl" />
      </div>
    </div>
  );
}

function SupportOrdersSkeleton({ isMobile = true, count = 2 }) {
  if (!isMobile) {
    return (
      <div className="space-y-10 mt-10 select-none">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="grid grid-cols-2 pb-8 mx-4 xl:mx-8 border-b-2 border-gray-100 last:border-b-0"
          >
            <div className="flex justify-center items-center">
              <Skeleton className="w-50 h-50 rounded-lg" />
            </div>
            <div className="flex flex-col items-start justify-start gap-8 pl-8">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="w-5 h-5" />
              </div>
              <div className="w-full space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="select-none">
      <div className="mb-[10px] mt-4 flex w-full items-center justify-between px-[10px]">
        <span className="font-bold text-primary">سفارشات</span>
        <ChevronDownIcon size={20} className={"rotate-90 ml-4"} />
      </div>

      <div className="space-y-[5px]">
        {Array.from({ length: count }).map((_, index) => (
          <SupportOrderCardSkeleton key={index} />
        ))}
      </div>

      <div className="lg:hidden fixed bottom-17 right-0 left-0 bg-white py-4 px-[10px] flex justify-center items-center z-10">
        <div className="font-iransans font-semibold text-primary border-2 border-primary py-2 rounded-full w-full flex items-center justify-center gap-2">
          <SupportIcon size={20} />
          ارتباط با واحد پشتیبانی
        </div>
      </div>
    </div>
  );
}

export default SupportOrdersSkeleton;
