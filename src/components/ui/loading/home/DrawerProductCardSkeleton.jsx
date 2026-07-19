import { Skeleton } from "@/components/ui/loading";
import { StarIcon } from "@/icons";

export default function DrawerProductCardSkeleton() {
  return (
    <div className="rounded-lg shrink-0 w-full select-none">
      <div className="w-full flex items-center justify-between gap-2 pb-1.5 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <Skeleton className="w-[50px] h-[50px] rounded-lg shrink-0" />
          <div className="flex flex-col items-start gap-1">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-40 h-3" />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 text-gray-600">
          <span>(آرا 0)</span>
          <div className="flex items-center gap-1">
            <StarIcon className="w-[10px] h-[10px] text-yellow-500 mb-1" />
            <span className="text-gray-600">0/5</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg flex flex-col p-[5px] pt-[14px] gap-3">
        <div className="flex items-center justify-between px-[10px] gap-2 shrink-0">
          <span className="text-error-medium text-sm font-bold sm:pr-4">
            فروش ویژه
          </span>
          <span className="text-error-medium text-base font-bold tabular-nums">
            ۰۰:۰۰:۰۰
          </span>
        </div>
        <div className="flex flex-row gap-3">
          <Skeleton className="w-25 h-25 rounded-xl bg-gray-400 shrink-0" />
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <Skeleton className="w-20 h-5 bg-gray-400" />
            <Skeleton className="w-40 h-5 bg-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
