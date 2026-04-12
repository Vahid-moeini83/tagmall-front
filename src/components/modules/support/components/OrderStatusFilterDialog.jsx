"use client";

import { useState, useEffect } from "react";
import { DialogWrapper } from "@/components/ui/dialog";
import OrderStatusFilterContent from "./OrderStatusFilterContent";

function OrderStatusFilterDialog({
  isOpen,
  onClose,
  selectedStatus,
  onConfirm,
}) {
  const [localStatus, setLocalStatus] = useState(selectedStatus);

  useEffect(() => {
    setLocalStatus(selectedStatus);
  }, [selectedStatus]);

  const handleConfirm = () => {
    onConfirm(localStatus);
    onClose();
  };

  return (
    <DialogWrapper isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">وضعیت سفارش</h3>

      <div className="mb-6">
        <OrderStatusFilterContent
          orderStatus={localStatus}
          onChange={setLocalStatus}
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

export default OrderStatusFilterDialog;
