"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon } from "@/icons";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = mockBrands.filter((brand) =>
    brand.name.includes(searchQuery),
  );

  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden">
      {/* Search Input */}
      <div className="relative px-2.5 py-3 border-b-2 border-white overflow-hidden">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="به برند خاصی علاقه دارید؟"
          className="w-full text-gray-600 text-center placeholder:text-gray-400 placeholder:font-iransans focus:outline-none"
        />
        <SearchIcon
          size={20}
          color="var(--color-gray-400)"
          className="absolute left-2.5 top-1/2 -translate-y-1/2"
        />
      </div>

      {/* Brand List */}
      {filteredBrands.map((brand, index) => (
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
          {index < filteredBrands.length - 1 && (
            <div className="w-full h-px border border-white mr-15" />
          )}
        </>
      ))}
    </div>
  );
}

export default BrandFilterContent;
