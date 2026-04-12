"use client";

import { Radio } from "@/components/ui/radio";

const statusOptions = [
  { id: "sending", label: "در حال ارسال" },
  { id: "delivered", label: "تحویل شده" },
];

function OrderStatusFilterContent({ orderStatus, onChange }) {
  return (
    <div className="flex flex-col pr-[10px]">
      {statusOptions.map((option, index) => (
        <>
          <div key={option.id} className="py-3">
            <Radio
              checked={orderStatus === option.id}
              onChange={() => onChange(option.id)}
              label={option.label}
            />
          </div>

          {statusOptions.length - 1 > index && (
            <div className="w-full h-[2px] mr-8 bg-gray-200" />
          )}
        </>
      ))}
    </div>
  );
}

export default OrderStatusFilterContent;
