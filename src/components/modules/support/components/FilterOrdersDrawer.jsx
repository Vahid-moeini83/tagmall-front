"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";
import { OrderStatusFilterContent, OrderTypeFilterContent } from "..";

function FilterOrdersDrawer({
  isOpen,
  onClose,
  expandedFilter,
  onFilterToggle,
  orderType,
  onOrderTypeChange,
  orderStatus,
  onStatusChange,
}) {
  const mobileFilters = [
    { id: "order-type", label: "نوع سفارش" },
    { id: "order-status", label: "وضعیت سفارش" },
  ];

  const getFilterValue = (filterId) => {
    if (filterId === "order-type") {
      if (orderType === "in-person") return "خرید حضوری";
      if (orderType === "online") return "خرید آنلاین";
    }

    if (filterId === "order-status") {
      const statusMap = {
        sending: "در حال ارسال",
        delivered: "تحویل شده",
      };

      return statusMap[orderStatus] || "";
    }

    return "";
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent overlayClassName="lg:hidden">
        {/* Header */}
        <div className="px-[10px] pt-2">
          <h3 className="text-primary text-base font-bold pb-2 cursor-pointer">
            پیگیری سفارشات
          </h3>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto px-[10px]">
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
                className="relative flex items-center justify-between w-full py-4"
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
                    {filter.id === "order-type" && (
                      <OrderTypeFilterContent
                        orderType={orderType}
                        onChange={onOrderTypeChange}
                      />
                    )}

                    {filter.id === "order-status" && (
                      <OrderStatusFilterContent
                        orderStatus={orderStatus}
                        onChange={onStatusChange}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <button className="font-bold text-primary cursor-pointer pt-4 pb-18 bg-white">
          جست و جوی سفارش
        </button>
      </DrawerContent>
    </Drawer>
  );
}

export default FilterOrdersDrawer;
