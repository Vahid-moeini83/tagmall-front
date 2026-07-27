"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReceiptDeliveryHeader from "./ReceiptDeliveryHeader";
import ReceiptSellerHeader from "./ReceiptSellerHeader";
import ReceiptProductList from "./ReceiptProductList";
import ReceiptStepOne from "./ReceiptStepOne";
import ReceiptStepTwo from "./ReceiptStepTwo";
import ReceiptStepThree from "./ReceiptStepThree";
import { defaultReceiptData } from "@/lib/client/receiptData";

function ReceiptDeliveryContent({ receiptData, onClose }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const orderData = receiptData ?? defaultReceiptData;

  useEffect(() => {
    setCurrentStep(1);
  }, [receiptData?.orderId]);

  const handleSupport = () => {
    router.push("/support?tab=chats");
  };

  const renderStepFooter = () => {
    switch (currentStep) {
      case 1:
        return <ReceiptStepOne onNext={() => setCurrentStep(2)} />;
      case 2:
        return <ReceiptStepTwo />;
      case 3:
        return <ReceiptStepThree />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden select-none">
      <ReceiptDeliveryHeader onSupport={handleSupport} onClose={onClose} />

      <ReceiptSellerHeader
        seller={orderData.seller}
        orderId={orderData.orderId}
      />

      <div className="min-h-0 flex-1 overflow-y-auto scroll-hidden pb-4">
        <ReceiptProductList items={orderData.items} />
      </div>

      <div className="bg-white px-[10px] pb-3 pt-4 lg:px-[140px] lg:pb-12">
        {renderStepFooter()}
      </div>
    </div>
  );
}

export default ReceiptDeliveryContent;
