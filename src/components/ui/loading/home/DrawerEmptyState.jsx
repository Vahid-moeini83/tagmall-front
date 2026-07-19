import { LocationIcon } from "@/icons";
import { cn } from "@/lib/client/utils";

export default function DrawerEmptyState({ isListMode = false }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center select-none w-full",
        isListMode ? "py-8 px-2" : "py-2 px-1",
      )}
    >
      <div className="bg-white rounded-lg flex flex-col items-center gap-2 w-full p-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <LocationIcon size={22} />
        </div>
        <p className="font-bold text-gray-700 text-sm">
          فروشگاهی در این ناحیه یافت نشد
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          نقشه را جابه‌جا کنید تا فروشگاه‌های اطراف را ببینید
        </p>
      </div>
    </div>
  );
}
