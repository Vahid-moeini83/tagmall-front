"use client";

import { Radio } from "@/components/ui/radio";

const sellerTypeOptions = [
  { id: "all", label: "همه فروشندگان" },
  { id: "special", label: "فروشندگان ویژه" },
  { id: "official", label: "فروشندگان رسمی" },
  { id: "local", label: "فروشندگان بومی" },
];

function SellerTypeFilterContent({ sellerType, onSellerTypeChange }) {
  return (
    <div className="flex flex-col">
      {sellerTypeOptions.map((option, index) => (
        <>
          <div key={option.id} className="py-3">
            <Radio
              checked={sellerType === option.id}
              onChange={() => onSellerTypeChange(option.id)}
              label={option.label}
            />
          </div>
          {sellerTypeOptions.length - 1 > index && (
            <div className="w-full h-[2px] mr-8 bg-gray-200" />
          )}
        </>
      ))}
    </div>
  );
}

export default SellerTypeFilterContent;
