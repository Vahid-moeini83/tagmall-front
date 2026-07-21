"use client";

import { useState } from "react";
import { CustomAccordion } from "@/components/ui/accordion";
import { HintIcon } from "@/icons";

function CartReceiverStepMobile({ receiverInfo, onConfirm, onEdit }) {
  const [expandedMobileSections, setExpandedMobileSections] = useState([
    "receiver",
    "contact",
    "address",
  ]);

  const toggleMobileAccordion = (id) => {
    setExpandedMobileSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="pb-36">
      <div className="space-y-3">
        {/* Border full-bleed; content keeps side padding */}
        <div className="border-b-4 border-gray-200">
          <div className="px-[10px] pb-2">
            <CustomAccordion
              id="receiver"
              expandedItems={expandedMobileSections}
              onToggle={toggleMobileAccordion}
              customLabel={
                <span className="font-bold text-gray-600">تحویل گیرنده:</span>
              }
              triggerClassName="py-2"
              iconClassName="left-5!"
            >
              <div className="bg-gray-100 rounded-2xl py-3 text-center text-gray-600">
                {receiverInfo.fullName}
              </div>
            </CustomAccordion>
          </div>
        </div>

        <div className="border-b-4 border-gray-200">
          <div className="px-[10px] pb-2">
            <CustomAccordion
              id="contact"
              expandedItems={expandedMobileSections}
              onToggle={toggleMobileAccordion}
              customLabel={
                <span className="font-bold text-gray-600">راه ارتباطی:</span>
              }
              triggerClassName="py-2"
              iconClassName="left-5!"
            >
              <div className="bg-gray-200 rounded-2xl py-3 text-center text-gray-600">
                {receiverInfo.phone}
              </div>
            </CustomAccordion>
          </div>
        </div>

        <div className="px-[10px]">
          <CustomAccordion
            id="address"
            expandedItems={expandedMobileSections}
            onToggle={toggleMobileAccordion}
            customLabel={<span className="font-bold text-gray-600">آدرس:</span>}
            triggerClassName="py-2"
            iconClassName="left-5!"
          >
            <div className="bg-gray-200 rounded-2xl p-[10px] text-gray-600 leading-8 text-center">
              <p>
                {receiverInfo.province && `${receiverInfo.province}، `}
                {receiverInfo.city && `${receiverInfo.city}، `}
                {receiverInfo.address}
              </p>
            </div>
          </CustomAccordion>
        </div>
      </div>

      <div className="mt-4 px-[10px] flex items-center gap-5 text-gray-600">
        <HintIcon size={22} className="text-gray-800 shrink-0" />
        <p>سفارشاتی که توسط فروشنده ارسال می شود.</p>
      </div>

      <div className="fixed right-0 left-0 bottom-18 z-40 bg-white px-[10px] py-4 space-y-3">
        <div className="flex items-center justify-center gap-0.5">
          <button
            type="button"
            onClick={onConfirm}
            className="w-1/2 border-2 border-primary text-primary rounded-full py-2 font-bold cursor-pointer"
          >
            تایید
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="w-1/2 text-primary font-bold cursor-pointer"
          >
            ویرایش
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartReceiverStepMobile;
