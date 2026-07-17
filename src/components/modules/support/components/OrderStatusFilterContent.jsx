"use client";

import { Radio } from "@/components/ui/radio";

export const orderStatusOptions = [
  { id: "processing", label: "در حال پردازش" },
  { id: "ready_to_ship", label: "آماده ارسال" },
  { id: "ready_for_pickup", label: "آماده تحویل" },
  { id: "shipped", label: "ارسال شده" },
  { id: "delivered", label: "تحویل داده شده" },
  { id: "returned", label: "مرجوع شده" },
];

export const DEFAULT_ORDER_STATUS = "ready_for_pickup";

export function getOrderStatusLabel(statusId) {
  if (!statusId) return "";
  const option = orderStatusOptions.find((item) => item.id === statusId);
  return option?.label ?? "";
}

function OrderStatusFilterContent({ orderStatus, onChange }) {
  return (
    <div className="flex flex-col">
      {orderStatusOptions.map((option, index) => (
        <div key={option.id}>
          <div className="py-3 pr-[10px]">
            <Radio
              checked={orderStatus === option.id}
              onChange={() => onChange(option.id)}
              label={option.label}
            />
          </div>

          {orderStatusOptions.length - 1 > index && (
            <div className="h-px bg-gray-200 mr-8" />
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderStatusFilterContent;
