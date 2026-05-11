import { Skeleton } from "..";

function SessionsSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-3 lg:mt-0 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-5 h-5 rounded-full ml-4" />
      </div>

      {/* Session items - با باکس خاکستری مثل CustomOptions */}
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        {[1, 2, 3].map((i, index) => (
          <div key={i}>
            <div className="flex items-center gap-3 px-4 py-4">
              <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
              <Skeleton className="flex-1 h-5" />
            </div>
            {index < 2 && <div className="w-full h-[2px] bg-white" />}
          </div>
        ))}
      </div>

      {/* Select all checkbox */}
      <div className="flex items-center pr-4 gap-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="w-48 h-4" />
      </div>

      {/* Delete button */}
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
}

export default SessionsSkeleton;
