"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function ReceiptStepOne({ onNext }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5 mr-4">
        <Checkbox
          checked={isConfirmed}
          onChange={setIsConfirmed}
          className="bg-gray-200! border-0!"
        />
        <label
          onClick={() => setIsConfirmed(!isConfirmed)}
          className="cursor-pointer text-base text-gray-600"
        >
          کالا با سفارش ثبت شده مطابقت دارد.
        </label>
      </div>

      <button
        type="button"
        disabled={!isConfirmed}
        onClick={onNext}
        className={`w-full rounded-full border-2 py-2.5 text-center text-base transition-colors ${
          isConfirmed
            ? "cursor-pointer border-primary text-primary"
            : "cursor-not-allowed border-gray-400 text-gray-400"
        }`}
      >
        دریافت پیامکی کد تحویل سفارش
      </button>
    </div>
  );
}
