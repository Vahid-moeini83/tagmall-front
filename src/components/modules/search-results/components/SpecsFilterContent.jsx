"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";

const mockSpecs = [
  {
    id: 1,
    name: "ظرفیت",
    options: [
      { id: 11, name: "128 گیگابایت" },
      { id: 12, name: "256 گیگابایت" },
      { id: 13, name: "512 گیگابایت" },
    ],
  },
  {
    id: 2,
    name: "رنگ",
    options: [
      { id: 21, name: "مشکی" },
      { id: 22, name: "سفید" },
      { id: 23, name: "آبی" },
    ],
  },
  {
    id: 3,
    name: "حافظه رم",
    options: [
      { id: 31, name: "4 گیگابایت" },
      { id: 32, name: "6 گیگابایت" },
      { id: 33, name: "8 گیگابایت" },
    ],
  },
];

function SpecsFilterContent({ selectedSpecs, onSpecToggle }) {
  const [expandedSpecs, setExpandedSpecs] = useState([]);

  const toggleSpec = (specId) => {
    setExpandedSpecs((prev) =>
      prev.includes(specId)
        ? prev.filter((id) => id !== specId)
        : [...prev, specId],
    );
  };

  return (
    <div className="bg-gray-200 rounded-lg">
      {mockSpecs.map((spec) => {
        const selectedCount = spec.options.filter((option) =>
          selectedSpecs.includes(option.id),
        ).length;

        return (
          <div key={spec.id}>
            <button
              onClick={() => toggleSpec(spec.id)}
              className="w-full flex items-center justify-between pr-[10px] pl-3 py-4 font-bold text-gray-600"
            >
              <div className="flex items-center gap-2">
                <span>{spec.name}:</span>
                {selectedCount > 0 && (
                  <span className="text-sm font-normal">
                    {selectedCount} مورد
                  </span>
                )}
              </div>
              {expandedSpecs.includes(spec.id) ? (
                <ChevronUpIcon size={16} color="var(--color-gray-400)" />
              ) : (
                <ChevronDownIcon size={16} color="var(--color-gray-400)" />
              )}
            </button>

            {expandedSpecs.includes(spec.id) && (
              <>
                {spec.options.map((option) => (
                  <>
                    <div className="w-full h-px border border-white mr-15" />
                    <div
                      key={option.id}
                      className={`flex items-center justify-start gap-[20px] px-5 py-4`}
                    >
                      <Checkbox
                        checked={selectedSpecs.includes(option.id)}
                        onChange={() => onSpecToggle(option.id)}
                        hasBorder={false}
                      />
                      <span className="text-gray-600">{option.name}</span>
                    </div>
                  </>
                ))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SpecsFilterContent;
