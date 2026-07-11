"use client";

import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";
import OrderStatusFilterContent, {
  getOrderStatusLabel,
} from "./OrderStatusFilterContent";
import OrderDateRangeFilterContent from "./OrderDateRangeFilterContent";

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
  onFromDateChange,
  toDate,
  onToDateChange,
  hasFiltersChanged,
  onResetFilters,
}) {
  const getFilterValue = (filterId) => {
    if (filterId === "order-status") {
      return getOrderStatusLabel(orderStatus);
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
        <div className="px-[10px] pt-4">
          <h3 className="pb-2 text-center text-base font-bold text-primary">
            پیگیری سفارشات
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-[10px]">
          {mobileFilters.map((filter, index) => (
            <div
              key={filter.id}
              className={
                mobileFilters.length - 1 === index ? "" : "border-b border-gray-200"
              }
            >
              <button
                type="button"
                onClick={() => onFilterToggle(filter.id)}
                className="relative flex w-full items-center justify-between py-4"
              >
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-600">{filter.label}</span>
                  {filter.id === "order-status" && getFilterValue(filter.id) && (
                    <>
                      <span className="text-gray-600">:</span>
                      <span className="text-sm font-normal text-gray-600">
                        {getFilterValue(filter.id)}
                      </span>
                    </>
                  )}
                </div>

                {expandedFilter.includes(filter.id) ? (
                  <ChevronUpIcon size={20} className="absolute left-[14px]" />
                ) : (
                  <ChevronDownIcon size={20} className="absolute left-[14px]" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFilter.includes(filter.id)
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {expandedFilter.includes(filter.id) && (
                  <div className="pb-3">
                    {filter.id === "order-status" && (
                      <OrderStatusFilterContent
                        orderStatus={orderStatus}
                        onChange={onStatusChange}
                      />
                    )}

                    {filter.id === "date-range" && (
                      <OrderDateRangeFilterContent
                        fromDate={fromDate}
                        onFromDateChange={onFromDateChange}
                        toDate={toDate}
                        onToDateChange={onToDateChange}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
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
