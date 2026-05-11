"use client";

import { useState } from "react";
import usePublicStore from "@/app/store/publicStore";
import { SupportIcon } from "@/icons";
import { cn } from "@/lib/client/utils";

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
      <p className="font-iransans text-gray-700 text-xs text-center pt-6 pb-2 px-3">
        کاربر محترم لطفا وضعیت موقعیت یابی و نمایش کالا ها را مشخص کنید.
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
            <button
              type="button"
              onClick={() => handleChange(opt.id, !checked)}
              className="w-full flex items-center justify-between gap-3 py-4 px-3 text-right text-xs text-gray-600"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex shrink-0 order-first items-center justify-center w-5 h-5 rounded border-2 bg-white transition-colors",
                    checked
                      ? "border-primary text-primary"
                      : "border-gray-400 text-transparent",
                  )}
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                    aria-hidden
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </span>
                <span className="flex-1 text-right">
                  {opt.label}{" "}
                  {opt.id === "visit" && (
                    <span className="font-bold text-gray-600">(1 کالا)</span>
                  )}
                </span>
              </div>
              {opt.id === "visit" && <SupportIcon size={20} />}
            </button>
            {index !== filterOptions.length - 1 && (
              <div className="w-full h-[2px] bg-gray-200 mr-10" />
            )}
          </div>
        );
      })}
    </div>
  );
}
