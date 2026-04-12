"use client";

import { useState } from "react";
import { DialogWrapper } from "@/components/ui/dialog";
import SellerTypeFilterContent from "./SellerTypeFilterContent";

function SellerTypeDialog({ isOpen, onClose }) {
  const [sellerType, setSellerType] = useState("all");

  const handleConfirm = () => {
    console.log("Selected seller type:", sellerType);
    onClose();
  };

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      title={"نوع فروشنده"}
      className="overflow-hidden"
    >
      <SellerTypeFilterContent
        sellerType={sellerType}
        onSellerTypeChange={setSellerType}
      />

      <button
        onClick={handleConfirm}
        className="w-full h-12 bg-primary text-white rounded-lg transition-opacity hover:opacity-90 mt-4"
      >
        تایید
      </button>
    </DialogWrapper>
  );
}

export default SellerTypeDialog;
