"use client";

import { useState } from "react";
import usePublicStore from "@/app/store/publicStore";
import { SupportIcon } from "@/icons";
import Checkbox from "@/components/ui/checkbox/Checkbox";

const FILTER_OPTIONS = [
  { id: "special", label: "فروش ویژه" },
  { id: "visit", label: "سفارشات آماده تحویل" },
];

export default function HomeFilterContent() {
  const homeFilterSpecial = usePublicStore((s) => s.homeFilterSpecial);
  const homeFilterVisit = usePublicStore((s) => s.homeFilterVisit);
  const setHomeFilterSpecial = usePublicStore((s) => s.setHomeFilterSpecial);
  const setHomeFilterVisit = usePublicStore((s) => s.setHomeFilterVisit);
  const showSearchResultBox = usePublicStore((s) => s.showSearchResultBox);
  const searchResultData = usePublicStore((s) => s.searchResultData);

  const [locationFilterEnabled, setLocationFilterEnabled] = useState(true);

  const handleChange = (id, checked) => {
    if (id === "special") setHomeFilterSpecial(checked);
    else if (id === "visit") setHomeFilterVisit(checked);
    else if (id === "location") setLocationFilterEnabled(checked);
  };

  const filterOptions =
    showSearchResultBox && searchResultData
      ? [
          {
            id: "location",
            label: `موقعیت یابی گروه کالایی ${searchResultData}`,
          },
          ...FILTER_OPTIONS,
        ]
      : FILTER_OPTIONS;

  return (
    <div className="overflow-hidden">
      <p className="font-bold text-primary text-center pt-6 pb-2">
        وضعیت نمایش محتوا
      </p>
      {filterOptions.map((opt, index) => {
        const checked =
          opt.id === "special"
            ? homeFilterSpecial
            : opt.id === "visit"
              ? homeFilterVisit
              : locationFilterEnabled;
        return (
          <div key={opt.id}>
            <div className="w-full flex items-center justify-between gap-3 p-4 text-right text-xs text-gray-600">
              <Checkbox
                checked={checked}
                onChange={(val) => handleChange(opt.id, val)}
                className={"bg-gray-200! border-0!"}
                label={
                  <span className="font-extralight flex-1 text-right text-base text-gray-600">
                    {opt.label}{" "}
                    {opt.id === "visit" && (
                      <span className="font-bold text-gray-600">(1 کالا)</span>
                    )}
                  </span>
                }
              />
              {opt.id === "visit" && (
                <SupportIcon size={20} className={"text-primary"} />
              )}
            </div>
            {index !== filterOptions.length - 1 && (
              <div className="w-full h-[2px] bg-gray-200 mr-10" />
            )}
          </div>
        );
      })}
    </div>
  );
}
