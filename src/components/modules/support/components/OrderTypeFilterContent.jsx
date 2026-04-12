"use client";

import { Radio } from "@/components/ui/radio";

const orderTypeOptions = [
  { id: "in-person", label: "خرید حضوری" },
  { id: "online", label: "خرید آنلاین" },
];

function OrderTypeFilterContent({ orderType, onChange }) {
  return (
    <div className="flex flex-col pr-[10px]">
      {orderTypeOptions.map((option, index) => (
        <>
          <div key={option.id} className="py-3">
            <Radio
              checked={orderType === option.id}
              onChange={() => onChange(option.id)}
              label={option.label}
            />
          </div>

          {orderTypeOptions.length - 1 > index && (
            <div className="w-full h-[2px] mr-8 bg-gray-200" />
          )}
        </>
      ))}
    </div>
  );
}

export default OrderTypeFilterContent;
