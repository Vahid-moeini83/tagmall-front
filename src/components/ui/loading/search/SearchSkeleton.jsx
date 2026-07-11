import { Skeleton } from "..";

function SearchSkeleton() {
  return (
    <div className="flex flex-col items-start gap-6">
      {[1, 2, 3, 4, 5, 6, 7].map((item) => (
        <div key={item} className="flex flex-col items-start gap-1">
          <Skeleton className="w-20 h-2.5 bg-gray-200" />
          <Skeleton className="w-40 h-2.5 bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default SearchSkeleton;
