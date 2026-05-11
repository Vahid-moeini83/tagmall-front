import { Skeleton } from "..";

function MobilesSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-3 lg:mt-0 select-none">
      {/* Mobile items - با باکس خاکستری مثل CustomOptions */}
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        {[1, 2].map((i, index) => (
          <div key={i}>
            <div className="flex items-center gap-3 px-4 py-4">
              <Skeleton className="w-5 h-5 rounded-full shrink-0" />
              <Skeleton className="flex-1 h-5" />
            </div>
            {index < 1 && <div className="w-full h-[2px] bg-white" />}
          </div>
        ))}
      </div>

      {/* Bottom button */}
      <Skeleton className="w-full h-6 rounded" />
    </div>
  );
}

export default MobilesSkeleton;
