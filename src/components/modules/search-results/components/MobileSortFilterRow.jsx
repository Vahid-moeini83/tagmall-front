import { ArrowUpDownIcon } from "@/icons";

function MobileSortFilterRow({ sortLabel, onClick, className = "" }) {
  return (
    <div dir="rtl" className={`w-full flex justify-start ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="text-xs flex items-center gap-2 mt-6 mb-8 pr-2 cursor-pointer"
      >
        <ArrowUpDownIcon size={20} />
        <span className="text-gray-600 text-sm font-extralight">
          <span className="font-bold">اولویت نمایش</span>: {sortLabel}
        </span>
      </button>
    </div>
  );
}

export default MobileSortFilterRow;
