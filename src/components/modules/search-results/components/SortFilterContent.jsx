"use client";

import { Radio } from "@/components/ui/radio";

const sortOptions = [
  { id: "newest", label: "جدیدترین" },
  { id: "mostViewed", label: "پربازدیدترین" },
  { id: "cheapest", label: "ارزان ترین" },
  { id: "expensive", label: "گران ترین" },
];

function SortFilterContent({ sortBy, onSortChange }) {
  return (
    <div className="flex flex-col">
      {sortOptions.map((option, index) => (
        <div
          key={option.id}
          className={`py-3 ${index < sortOptions.length - 1 ? "border-b-2 border-gray-200" : ""}`}
        >
          <Radio
            checked={sortBy === option.id}
            onChange={() => onSortChange(option.id)}
            label={option.label}
          />
        </div>
      ))}
    </div>
  );
}

export default SortFilterContent;
