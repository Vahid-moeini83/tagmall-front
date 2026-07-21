"use client";

import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";
import OrderStatusFilterContent, {
  getOrderStatusLabel,
} from "./OrderStatusFilterContent";
import DateRangeFilterContent, {
  formatDateRangeLabel,
} from "@/components/ui/date-range";

const mobileFilters = [
  { id: "order-status", label: "وضعیت سفارشات" },
  { id: "date-range", label: "بازه زمانی" },
];

function FilterOrdersDrawer({
  isOpen,
  onClose,
  expandedFilter,
  onFilterToggle,
  orderStatus,
  onStatusChange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  hasFiltersChanged,
  onResetFilters,
}) {
  const getFilterValue = (filterId) => {
    if (filterId === "order-status") {
      return getOrderStatusLabel(orderStatus);
    }

    if (filterId === "date-range") {
      return formatDateRangeLabel(fromDate, toDate);
    }

    return "";
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent overlayClassName="lg:hidden">
        <div className="px-[10px] pt-3">
          <h3 className="pb-2 text-center text-base font-bold text-primary">
            پیگیری سفارشات
          </h3>
        </div>

        <div className="flex-1 px-[10px]">
          {mobileFilters.map((filter, index) => {
            const filterValue = getFilterValue(filter.id);

            return (
              <div
                key={filter.id}
                className={
                  mobileFilters.length - 1 === index
                    ? ""
                    : "border-b border-gray-200"
                }
              >
                <button
                  type="button"
                  onClick={() => onFilterToggle(filter.id)}
                  className="relative flex w-full items-center justify-between py-4"
                >
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-600">
                      {filter.label}
                      {filterValue ? ":" : ""}
                    </span>
                    {filterValue && (
                      <span className="text-sm text-gray-600 font-extralight">
                        {filterValue}
                      </span>
                    )}
                  </div>

                  {expandedFilter.includes(filter.id) ? (
                    <ChevronUpIcon size={20} className="absolute left-[19px]" />
                  ) : (
                    <ChevronDownIcon size={20} className="absolute left-[19px]" />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ${
                    expandedFilter.includes(filter.id)
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {expandedFilter.includes(filter.id) && (
                    <div>
                      {filter.id === "order-status" && (
                        <OrderStatusFilterContent
                          orderStatus={orderStatus}
                          onChange={onStatusChange}
                        />
                      )}

                      {filter.id === "date-range" && (
                        <DateRangeFilterContent
                          fromDate={fromDate}
                          setFromDate={setFromDate}
                          toDate={toDate}
                          setToDate={setToDate}
                          showLabel={false}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DrawerFooter className="bg-white px-[10px] pt-4 pb-18">
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!hasFiltersChanged()}
            className={`w-full rounded-full border-2 py-2 text-center transition-colors ${
              hasFiltersChanged()
                ? "border-primary text-primary"
                : "border-gray-400 text-gray-400"
            }`}
          >
            حالت پیش فرض
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default FilterOrdersDrawer;
