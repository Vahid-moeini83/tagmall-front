"use client";

import { Radio } from "@/components/ui/radio";

const sortOptions = [
  { id: "newest", label: "جدیدترین (حالت پیش فرض)" },
  { id: "mostViewed", label: "پربازدیدترین" },
  { id: "mostDiscounted", label: "بیشترین تخفیف" },
  { id: "cheapest", label: "ارزان ترین" },
  { id: "expensive", label: "گران ترین" },
];

function SortFilterContent({ sortBy, onSortChange }) {
  return (
    <div className="flex flex-col">
      {sortOptions.map((option, index) => (
        <>
          <div key={option.id} className="py-3">
            <Radio
              checked={sortBy === option.id}
              onChange={() => onSortChange(option.id)}
              label={option.label}
            />
          </div>
          {sortOptions.length - 1 > index && (
            <div className="w-full h-[2px] mr-8 bg-gray-200" />
          )}
        </>
      ))}
    </div>
  );
}

export default SortFilterContent;
