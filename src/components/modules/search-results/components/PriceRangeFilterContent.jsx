"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";

function PriceRangeFilterContent({
  priceRange,
  onPriceChange,
  minPrice,
  maxPrice,
}) {
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);

  const [minInput, setMinInput] = useState(priceRange[0].toString());
  const [maxInput, setMaxInput] = useState(priceRange[1].toString());

  // وقتی اسلایدر تغییر کرد، فقط اگر در حال ادیت نیست sync کن
  useEffect(() => {
    if (!isEditingMin) setMinInput(priceRange[0].toString());
    if (!isEditingMax) setMaxInput(priceRange[1].toString());
  }, [priceRange, isEditingMin, isEditingMax]);

  const validateAndSubmitMin = () => {
    const numeric = Number(minInput.replace(/[^0-9]/g, ""));

    if (isNaN(numeric)) {
      setMinInput(priceRange[0].toString());
      setIsEditingMin(false);
      return;
    }

    if (numeric < minPrice) {
      toast.error("مقدار کمتر از حداقل قیمت است");
      return;
    }

    if (numeric > priceRange[1]) {
      toast.error("مقدار نباید بیشتر از مقدار حداکثر باشد");
      return;
    }

    onPriceChange([numeric, priceRange[1]]);
    setIsEditingMin(false);
  };

  const validateAndSubmitMax = () => {
    const numeric = Number(maxInput.replace(/[^0-9]/g, ""));

    if (isNaN(numeric)) {
      setMaxInput(priceRange[1].toString());
      setIsEditingMax(false);
      return;
    }

    if (numeric > maxPrice) {
      toast.error("مقدار بیشتر از حداکثر قیمت است");
      return;
    }

    if (numeric < priceRange[0]) {
      toast.error("مقدار نباید کمتر از مقدار حداقل باشد");
      return;
    }

    onPriceChange([priceRange[0], numeric]);
    setIsEditingMax(false);
  };

  return (
    <div className="relative pt-4 pr-10 lg:pr-0">
      {/* Labels */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-600">گران ترین</span>
        <span className="text-xs text-gray-600">ارزان ترین</span>
      </div>

      {/* Slider */}
      <div className="px-6">
        <Slider
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={onPriceChange}
        />
      </div>

      {/* Editable Values */}
      <div className="flex flex-col gap-4 items-start mt-6">
        {/* MIN */}
        <span className="text-gray-600">
          <span className="text-gray-700 font-bold">از</span>{" "}
          {isEditingMin ? (
            <input
              autoFocus
              value={minInput} // ❗ بدون format هنگام تایپ
              onChange={(e) =>
                setMinInput(e.target.value.replace(/[^0-9]/g, ""))
              }
              onBlur={validateAndSubmitMin}
              onKeyDown={(e) => e.key === "Enter" && validateAndSubmitMin()}
              className="border rounded px-2 py-1 w-28 text-sm"
            />
          ) : (
            <button type="button" onClick={() => setIsEditingMin(true)}>
              {formatPrice(priceRange[0])}
            </button>
          )}{" "}
          تومان
        </span>

        {/* MAX */}
        <span className="text-gray-600">
          <span className="text-gray-700 font-bold">تا</span>{" "}
          {isEditingMax ? (
            <input
              autoFocus
              value={maxInput} // ❗ بدون format هنگام تایپ
              onChange={(e) =>
                setMaxInput(e.target.value.replace(/[^0-9]/g, ""))
              }
              onBlur={validateAndSubmitMax}
              onKeyDown={(e) => e.key === "Enter" && validateAndSubmitMax()}
              className="border rounded px-2 py-1 w-28 text-sm"
            />
          ) : (
            <button type="button" onClick={() => setIsEditingMax(true)}>
              {formatPrice(priceRange[1])}
            </button>
          )}{" "}
          تومان
        </span>
      </div>
    </div>
  );
}

export default PriceRangeFilterContent;
