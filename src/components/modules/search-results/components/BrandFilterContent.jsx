"use client";

import { Checkbox } from "@/components/ui/checkbox";

const mockBrands = [
  { id: 1, name: "سامسونگ" },
  { id: 2, name: "اپل" },
  { id: 3, name: "شیائومی" },
  { id: 4, name: "هوآوی" },
  { id: 5, name: "نوکیا" },
  { id: 6, name: "ال جی" },
  { id: 7, name: "سونی" },
  { id: 8, name: "موتورولا" },
];

function BrandFilterContent({ selectedBrands, onBrandToggle }) {
  return (
    <div className="bg-gray-200 rounded-lg">
      {mockBrands.map((brand, index) => (
        <>
          <div
            key={brand.id}
            className={`flex items-center justify-start gap-[20px] px-5 py-4`}
          >
            <Checkbox
              checked={selectedBrands.includes(brand.id)}
              onChange={() => onBrandToggle(brand.id)}
              hasBorder={false}
            />
            <span className="text-gray-600">{brand.name}</span>
          </div>
          {index < mockBrands.length - 1 && (
            <div className="w-full h-px border border-white mr-15" />
          )}
        </>
      ))}
    </div>
  );
}

export default BrandFilterContent;
