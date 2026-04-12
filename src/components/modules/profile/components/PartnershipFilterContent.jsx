"use client";
import { Radio } from "@/components/ui/radio";

const partnershipOptions = [
  { id: "most-viewed", label: "پربازدیدترین" },
  { id: "best-selling", label: "پرفروش ترین" },
];

function PartnershipFilterContent({ selectedFilter, onFilterChange }) {
  return (
    <div className="flex flex-col pr-[10px]">
      {partnershipOptions.map((option, index) => (
        <>
          <div key={option.id} className="py-3">
            <Radio
              checked={selectedFilter === option.id}
              onChange={() => onFilterChange(option.id)}
              label={option.label}
            />
          </div>
          {partnershipOptions.length - 1 > index && (
            <div className="w-full h-[2px] mr-8 bg-gray-200" />
          )}
        </>
      ))}
    </div>
  );
}
export default PartnershipFilterContent;
