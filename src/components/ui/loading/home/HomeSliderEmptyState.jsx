import { LocationIcon } from "@/icons";
import { cn } from "@/lib/client/utils";

function HomeSliderEmptyState({ variant = "desktop" }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center select-none",
        variant === "desktop" ? "h-full min-h-[50vh] px-6 py-10" : "py-6 px-4",
      )}
    >
      <div
        className={cn(
          "bg-white rounded-2xl flex flex-col items-center gap-3 shadow-sm",
          variant === "desktop" ? "w-full max-w-md p-10" : "w-full p-6",
        )}
      >
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <LocationIcon size={28} />
        </div>
        <p className="font-bold text-gray-700 text-base">
          فروشگاهی در این ناحیه یافت نشد
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          نقشه را جابه‌جا کنید تا فروشگاه‌های اطراف را ببینید
        </p>
      </div>
    </div>
  );
}

export default HomeSliderEmptyState;
