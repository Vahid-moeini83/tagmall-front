import { Skeleton } from "..";

function OrderItemsSkeleton({ isMobile = false }) {
  return (
    <div className="space-y-4 lg:space-y-10 select-none">
      {[1, 2].map((item, index) => (
        <div
          key={item}
          className={`pb-1 lg:pb-8 lg:mx-4 xl:mx-8 ${index < 1 ? "lg:border-b-2 lg:border-gray-100" : ""}`}
        >
          {isMobile ? (
            // Mobile Layout
            <div className="flex flex-col gap-1">
              {/* Seller and Timer */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2 mr-1">
                  <Skeleton className="w-10 h-10 rounded-md" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-5 h-5 rounded-full" />
                  </div>
                </div>
                <Skeleton className="w-24 h-3" />
              </div>

              {/* Product Details Box */}
              <div className="flex gap-3">
                <Skeleton className="w-25 h-25 rounded-lg shrink-0" />
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-5 h-5 ml-4 shrink-0" />
                  </div>
                  <Skeleton className="w-24 h-3" />
                  <Skeleton className="w-40 h-3" />
                </div>
              </div>
            </div>
          ) : (
            // Desktop Layout
            <div className="grid grid-cols-2">
              <div className="flex justify-center items-center">
                <Skeleton className="w-50 h-50 rounded-lg" />
              </div>
              <div className="flex flex-col items-start justify-start gap-8 pl-8">
                {/* Seller Info */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-5 h-5 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-64 h-5" />
                    <Skeleton className="w-5 h-5" />
                  </div>
                  <Skeleton className="w-32 h-4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-48 h-4" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Success Message */}
      {!isMobile && <Skeleton className="w-96 h-6 mx-auto mt-8" />}
    </div>
  );
}

export default OrderItemsSkeleton;
