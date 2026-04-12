"use client";

import { DialogWrapper } from "@/components/ui/dialog";
import SpecsFilterContent from "./SpecsFilterContent";

function SpecsFilterDialog({ isOpen, onClose, selectedSpecs, onSpecToggle }) {
  const handleConfirm = () => {
    console.log("Selected specs:", selectedSpecs);
    onClose();
  };

  return (
    <DialogWrapper isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <SpecsFilterContent
        selectedSpecs={selectedSpecs}
        onSpecToggle={onSpecToggle}
      />

      <button
        onClick={handleConfirm}
        className="w-full h-12 bg-primary text-white rounded-md transition-opacity hover:opacity-90 mt-4"
      >
        تایید
      </button>
    </DialogWrapper>
  );
}

export default SpecsFilterDialog;
