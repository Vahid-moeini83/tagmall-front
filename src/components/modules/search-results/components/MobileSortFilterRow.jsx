import { ArrowUpDownIcon } from "@/icons";

function MobileSortFilterRow({ sortLabel, onClick, className = "" }) {
  return (
    <div dir="rtl" className={`w-full flex justify-start ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="text-xs flex items-center gap-3 mb-5 pr-4 cursor-pointer"
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
