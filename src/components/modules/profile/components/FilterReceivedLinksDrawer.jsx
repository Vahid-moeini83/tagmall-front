"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { AvailableProductsIcon, ChevronDownIcon, ChevronUpIcon } from "@/icons";
import ReceivedLinksFilterContent from "./ReceivedLinksFilterContent";
import DateRangeFilterContent from "./DateRangeFilterContent";
import { formatPersianDate } from "@/lib/client/utils";

function FilterReceivedLinksDrawer({
  isOpen,
  onClose,
  expandedFilter,
  onFilterToggle,
  selectedFilter,
  onFilterChange,
  options,
  showAvailable,
  setShowAvailable,
}) {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const mobileFilters = [
    { id: "sort", label: "ترتیب نمایش" },
    { id: "dateRange", label: "بازه زمانی" },
  ];

  const getFilterValue = (filterId) => {
    if (filterId === "sort") {
      const option = options.find((o) => o.id === selectedFilter);
      return option ? option.label : "";
    }
    if (filterId === "dateRange") {
      if (fromDate && toDate) {
        // تبدیل به فرمت استاندارد با اعداد انگلیسی
        const fromFormatted = formatPersianDate(
          fromDate.format("YYYY/MM/DD", false),
        );
        const toFormatted = formatPersianDate(
          toDate.format("YYYY/MM/DD", false),
        );
        return `از ${fromFormatted} تا ${toFormatted}`;
      }
      return "";
    }
    return "";
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent overlayClassName="lg:hidden z-100!" className="z-100!">
        {/* Header */}
        <div className="relative flex items-center justify-center lg:justify-start bg-white rounded-t-2xl px-[10px] pt-4 pb-2">
          <p className="text-center text-base font-bold text-primary">
            لینک های دریافت شده
          </p>
          <AvailableProductsIcon
            onClick={() => setShowAvailable(!showAvailable)}
            active={showAvailable}
            size={20}
            className="absolute left-[25px] cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 bg-white px-[10px] ">
          {mobileFilters.map((filter, index) => (
            <div
              key={filter.id}
              className={`${
                mobileFilters.length - 1 === index
                  ? ""
                  : "border-b-2 border-gray-200"
              }`}
            >
              <button
                onClick={() => onFilterToggle(filter.id)}
                className={`relative flex items-center justify-between w-full py-4`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-bold">
                    {filter.label}:
                  </span>
                  {getFilterValue(filter.id) && (
                    <span className="text-sm text-gray-600 font-extralight">
                      {getFilterValue(filter.id)}
                    </span>
                  )}
                </div>
                {expandedFilter.includes(filter.id) ? (
                  <ChevronUpIcon
                    size={20}
                    color="var(--color-gray-800)"
                    className="absolute left-[19px]"
                  />
                ) : (
                  <ChevronDownIcon
                    size={20}
                    color="var(--color-gray-800)"
                    className="absolute left-[19px]"
                  />
                )}
              </button>

              {/* Filter Content */}
              <div
                className={`transition-all duration-300 ${
                  expandedFilter.includes(filter.id)
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {expandedFilter.includes(filter.id) && (
                  <div>
                    {filter.id === "sort" && (
                      <ReceivedLinksFilterContent
                        selectedFilter={selectedFilter}
                        onFilterChange={onFilterChange}
                      />
                    )}
                    {filter.id === "dateRange" && (
                      <DateRangeFilterContent
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="text-primary border-2 border-primary rounded-full px-4 py-2 lg:border-0 lg:px-0 lg:py-0 mx-[10px] cursor-pointer bg-white">
          کالای خاصی در نظر دارید؟
        </button>
      </DrawerContent>
    </Drawer>
  );
}

export default FilterReceivedLinksDrawer;
