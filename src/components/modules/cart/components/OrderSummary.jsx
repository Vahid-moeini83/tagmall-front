"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Radio } from "@/components/ui/radio";
import { formatPrice } from "@/lib/client/utils";

function OrderSummary({
  isOrderItemsOpen,
  setIsOrderItemsOpen,
  handleNextStep,
  isMobile = false,
}) {
  const [paymentMethod, setPaymentMethod] = useState("gateway");

  const receiverInfo = {
    fullName: "وحید معینی",
    phone: "09151234567",
    address: "استان تهران - خیابان افسریه - افسریه 44",
    postalCode: "1234567890",
  };

  const walletBalance = 5000000;
  const totalAmount = 2000000;
  const isWalletSufficient = walletBalance >= totalAmount;

  return (
    <Accordion
      type="single"
      collapsible={isMobile ? false : true}
      defaultValue="order-summary"
    >
      <AccordionItem value="order-summary">
        {!isMobile && (
          <AccordionTrigger className="font-bold text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
            صورت حساب
          </AccordionTrigger>
        )}
        <AccordionContent className="lg:mt-4">
          <div className="space-y-6">
            {/* Receiver and Orders Header */}
            <div className="flex items-center justify-between">
              <span className="font-bold lg:text-xl text-primary lg:text-gray-600">
                تحویل گیرنده
              </span>
              <span
                className="text-primary lg:text-xl cursor-pointer"
                onClick={() => setIsOrderItemsOpen(!isOrderItemsOpen)}
              >
                سفارشات
              </span>
            </div>

            {/* Receiver Information */}
            <div className="space-y-6 lg:border-b-2 lg:border-gray-200 pb-4">
              <div className="text-gray-600">
                <span className="font-bold">نام و نام خانوادگی:</span>{" "}
                {receiverInfo.fullName}
              </div>
              <div className="text-gray-600">
                <span className="font-bold">شماره تماس:</span>{" "}
                {receiverInfo.phone}
              </div>
              <div className="text-gray-600">
                <span className="font-bold">آدرس:</span> {receiverInfo.address}
              </div>
              <div className="text-gray-600">
                <span className="font-bold">کدپستی:</span>{" "}
                {receiverInfo.postalCode}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6 lg:space-y-4">
              <h3 className="lg:text-xl font-bold text-primary lg:text-gray-600 pr-2 lg:pr-0">
                روش پرداخت
              </h3>
              <div className="space-y-6 lg:space-y-4">
                {/* Bank Gateway */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <Radio
                    name="payment"
                    value="gateway"
                    checked={paymentMethod === "gateway"}
                    onChange={() => setPaymentMethod("gateway")}
                    className="mt-1"
                  />
                  <span className="text-gray-600">پرداخت از درگاه بانکی</span>
                </label>

                {/* Line */}
                <div className="hidden lg:block w-full h-[2px] bg-gray-200 mr-8" />

                {/* Wallet */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <Radio
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                    className="mt-1"
                    disabled={!isWalletSufficient}
                  />
                  <span
                    className={
                      isWalletSufficient ? "text-gray-600" : "text-gray-400"
                    }
                  >
                    پرداخت از کیف پول اعتباری (موجودی{" "}
                    {formatPrice(walletBalance)} تومان)
                  </span>
                </label>
              </div>
            </div>

            {/* Final Payment Info */}
            <div className="fixed right-0 left-0 bottom-26 lg:static text-center lg:mt-[114px]">
              <button
                onClick={handleNextStep}
                className="text-primary cursor-pointer lg:text-xl"
              >
                {paymentMethod === "gateway"
                  ? "پرداخت از درگاه بانکی"
                  : "پرداخت از کیف پول اعتباری"}{" "}
                (مبلغ {formatPrice(totalAmount)} تومان)
              </button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default OrderSummary;
