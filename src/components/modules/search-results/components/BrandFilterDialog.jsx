"use client";

import { useState } from "react";
import { DialogWrapper } from "@/components/ui/dialog";
import BrandFilterContent from "./BrandFilterContent";

function BrandFilterDialog({ isOpen, onClose }) {
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleConfirm = () => {
    console.log("Selected brands:", selectedBrands);
    onClose();
  };

  return (
    <DialogWrapper isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">انتخاب برند</h3>

      <div className="mb-6">
        <BrandFilterContent
          selectedBrands={selectedBrands}
          onBrandToggle={handleBrandToggle}
        />
      </div>

      <button
        onClick={handleConfirm}
        className="w-full py-3 bg-primary text-white rounded-lg transition-opacity hover:opacity-90"
      >
        تایید
      </button>
    </DialogWrapper>
  );
}

export default BrandFilterDialog;
