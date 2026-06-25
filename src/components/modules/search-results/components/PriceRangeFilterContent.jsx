"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/client/utils";
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
    <div className="bg-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-6">
        <Slider
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={onPriceChange}
        />
      </div>

      <div className="border-t border-white">
        <div className="w-full py-4 text-center text-gray-600">
          <span className="font-bold text-gray-700">از</span>{" "}
          {isEditingMin ? (
            <input
              autoFocus
              value={minInput}
              onChange={(e) =>
                setMinInput(e.target.value.replace(/[^0-9]/g, ""))
              }
              onBlur={validateAndSubmitMin}
              onKeyDown={(e) => e.key === "Enter" && validateAndSubmitMin()}
              className="bg-transparent text-center outline-none w-28 text-sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingMin(true)}
              className="cursor-pointer"
            >
              {formatPrice(priceRange[0])}
            </button>
          )}{" "}
          تومان
        </div>
      </div>

      <div className="border-t border-white">
        <div className="w-full py-4 text-center text-gray-600">
          <span className="font-bold text-gray-700">تا</span>{" "}
          {isEditingMax ? (
            <input
              autoFocus
              value={maxInput}
              onChange={(e) =>
                setMaxInput(e.target.value.replace(/[^0-9]/g, ""))
              }
              onBlur={validateAndSubmitMax}
              onKeyDown={(e) => e.key === "Enter" && validateAndSubmitMax()}
              className="bg-transparent text-center outline-none w-28 text-sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingMax(true)}
              className="cursor-pointer"
            >
              {formatPrice(priceRange[1])}
            </button>
          )}{" "}
          تومان
        </div>
      </div>
    </div>
  );
}

export default PriceRangeFilterContent;
