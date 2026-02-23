"use client";

import { useState } from "react";
import { DialogWrapper } from "@/components/ui/dialog";
import PriceRangeFilterContent from "./PriceRangeFilterContent";

function PriceRangeDialog({ isOpen, onClose }) {
  const minPrice = 500;
  const maxPrice = 100000000;
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const handleConfirm = () => {
    console.log("Selected price range:", priceRange);
    onClose();
  };

  return (
    <DialogWrapper isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <PriceRangeFilterContent
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />

      <button
        onClick={handleConfirm}
        className="w-full py-3 bg-primary text-white rounded-lg transition-opacity hover:opacity-90 mt-4"
      >
        تایید
      </button>
    </DialogWrapper>
  );
}

export default PriceRangeDialog;
