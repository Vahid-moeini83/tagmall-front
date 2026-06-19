import { Skeleton } from "..";
import { cn } from "@/lib/client/utils";

function VerticalSlideCardSkeleton({
  variant = "active",
  position = "bottom",
  className,
}) {
  const isActive = variant === "active";

  if (!isActive) {
    return (
      <div
        className={cn(
          "mx-auto w-[80%] overflow-hidden rounded-2xl bg-white origin-center",
          className,
        )}
      >
        {position === "top" ? (
          <div className="h-full flex flex-col justify-end px-[10px] pb-3">
            <Skeleton className="w-[80%] h-[2.5px] rounded-full mx-auto mb-2" />
            <Skeleton className="w-32 h-3 mx-auto" />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-[50px] pt-[32px] pb-4">
            <Skeleton className="w-[50px] h-[50px] rounded-lg shrink-0" />
            <Skeleton className="w-24 h-4" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl w-full flex flex-col overflow-hidden origin-center",
        className,
      )}
    >
      <div className="flex items-center justify-between px-[50px] pt-[32px] shrink-0">
        <div className="flex items-center gap-2">
          <Skeleton className="w-[50px] h-[50px] rounded-lg shrink-0" />
          <Skeleton className="w-28 h-4" />
        </div>
        <Skeleton className="w-20 h-5 shrink-0" />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between pr-[50px] pl-[64px] py-3 shrink-0">
          <div className="flex flex-col gap-1">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-16 h-3" />
          </div>
          <Skeleton className="w-20 h-5" />
        </div>

        <div className="flex flex-col items-center gap-3 px-[10px] pb-6">
          <Skeleton className="w-[200px] h-[200px] rounded-md shrink-0" />
          <Skeleton className="w-[80%] h-[2.5px] rounded-full" />
          <Skeleton className="w-40 h-4" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
    </div>
  );
}

function DesktopHomeSliderSkeleton() {
  return (
    <div className="flex flex-col h-full select-none">
      {/*
        Matches ProductsSlider vertical swiper:
        slidesPerView 1.16, spaceBetween 5, paddingY 8px
        peek ≈ 6.9% each, active slide ≈ 86.2%
      */}
      <div className="flex flex-col h-full w-full gap-[5px] pt-2 pb-2">
        <VerticalSlideCardSkeleton
          variant="peek"
          position="top"
          className="shrink-0 flex-[0_0_6.9%]"
        />

        <VerticalSlideCardSkeleton
          variant="active"
          className="min-h-0 flex-[1_1_86.2%]"
        />

        <VerticalSlideCardSkeleton
          variant="peek"
          position="bottom"
          className="shrink-0 flex-[0_0_6.9%]"
        />
      </div>
    </div>
  );
}

function MobileHomeSliderSkeleton() {
  return (
    <div className="flex flex-col gap-1 w-full min-h-[180px] select-none">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2 mr-1">
          <Skeleton className="w-10 h-10 rounded-md shrink-0" />
          <Skeleton className="w-28 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-14 h-3" />
          <Skeleton className="w-10 h-3" />
        </div>
      </div>

      <div className="bg-white rounded-md flex flex-col pt-[14px] pb-[10px] px-[10px] gap-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="flex flex-row gap-3">
          <Skeleton className="w-16 h-20 rounded-md shrink-0" />
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        <Skeleton className="w-6 h-2.5 rounded-full" />
        <Skeleton className="w-2.5 h-2.5 rounded-full" />
        <Skeleton className="w-2.5 h-2.5 rounded-full" />
      </div>
    </div>
  );
}

function HomeSliderSkeleton({ variant = "desktop" }) {
  if (variant === "mobile") {
    return <MobileHomeSliderSkeleton />;
  }

  return <DesktopHomeSliderSkeleton />;
}

export default HomeSliderSkeleton;
