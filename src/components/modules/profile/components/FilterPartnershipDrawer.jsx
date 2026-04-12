"use client";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";
import PartnershipFilterContent from "./PartnershipFilterContent.jsx";

function FilterPartnershipDrawer({
  isOpen,
  onClose,
  expandedFilter,
  onFilterToggle,
  selectedFilter,
  onFilterChange,
  hasFiltersChanged,
  onResetFilters,
  options,
}) {
  // لیست فیلترها برای موبایل (فقط یک مورد پیشنهادات)
  const mobileFilters = [{ id: "suggestions", label: "پیشنهادات" }];

  const getFilterValue = (filterId) => {
    if (filterId === "suggestions") {
      const option = options.find((o) => o.id === selectedFilter);
      return option ? option.label : "";
    }
    return "";
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent overlayClassName="lg:hidden">
        {/* Header */}
        <div className="relative bg-white px-[10px]">
          <p className="text-right text-base font-bold text-primary">
            مشارکت در فروش
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white px-[10px] pt-2">
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
                    <span className="text-sm text-gray-600">
                      {getFilterValue(filter.id)}
                    </span>
                  )}
                </div>
                {expandedFilter.includes(filter.id) ? (
                  <ChevronUpIcon
                    size={20}
                    color="var(--color-gray-800)"
                    className="absolute left-[14px]"
                  />
                ) : (
                  <ChevronDownIcon
                    size={20}
                    color="var(--color-gray-800)"
                    className="absolute left-[14px]"
                  />
                )}
              </button>

              {/* Filter Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFilter.includes(filter.id)
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {expandedFilter.includes(filter.id) && (
                  <div className="pb-3">
                    {filter.id === "suggestions" && (
                      <PartnershipFilterContent
                        selectedFilter={selectedFilter}
                        onFilterChange={onFilterChange}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="text-primary cursor-pointer pt-4 pb-4 bg-white">
          کالای خاصی در نظر دارید؟
        </button>
      </DrawerContent>
    </Drawer>
  );
}

export default FilterPartnershipDrawer;
