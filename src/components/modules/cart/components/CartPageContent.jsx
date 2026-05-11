"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/search";
import MainNavigation from "@/components/layout/navigation-menu/MainNavigation";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";
import OrderItems from "./OrderItems";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function CartPageContent() {
  const [isOrderItemsOpen, setIsOrderItemsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleOrderSubmit = () => {
    setIsOrderSubmitted(true);
  };

  const handlePayment = () => {
    setIsPaid(true);
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex lg:hidden h-screen bg-white flex-col">
        {/* Main Content */}
        <div className="px-[10px] pt-20 pb-40">
          {/* Steps */}
          <div className="fixed top-0 right-0 left-0 bg-white py-5 flex items-center justify-center z-50">
            <div
              onClick={handlePreviousStep}
              className={`rounded-md w-25 h-10 flex items-center justify-center bg-gray-200 ${currentStep === 1 ? "text-primary" : currentStep > 1 ? "text-gray-600" : "text-gray-400"}`}
            >
              سبد خرید
            </div>
            <div className="w-7 h-[3px] bg-gray-200" />
            <div
              className={`rounded-md w-25 h-10 flex items-center justify-center bg-gray-200 ${currentStep === 2 ? "text-primary" : currentStep > 2 ? "text-gray-600" : "text-gray-400"}`}
            >
              صورت حساب
            </div>
            <div className="w-7 h-[3px] bg-gray-200" />
            <div
              className={`rounded-md w-25 h-10 flex items-center justify-center bg-gray-200  ${currentStep === 3 ? "text-primary" : "text-gray-400"}`}
            >
              تحویل سفارش
            </div>
          </div>

          {/* Content based on step */}
          {currentStep === 1 && (
            <CartItems handleNextStep={handleNextStep} isMobile={true} />
          )}

          {currentStep === 2 && (
            <OrderSummary
              isOrderItemsOpen={isOrderItemsOpen}
              setIsOrderItemsOpen={setIsOrderItemsOpen}
              handleNextStep={handleNextStep}
              isMobile={true}
            />
          )}

          {currentStep === 3 && <OrderItems isMobile={true} />}
        </div>

        {/* Main Navigation */}
        <MainNavigation isHomePage={false} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          {/* Top Section - Search Input */}
          <div className="flex items-center gap-[25px] pr-6">
            <Image
              src="/assets/images/logo/small-logo.svg"
              width={40}
              height={40}
              alt="لوگو"
              className="z-70"
            />
            <div className="flex-1">
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                readOnly
                hasLogo={!isDesktop}
                bgColor="bg-white"
                className="max-w-[642px]"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative rounded-lg overflow-y-auto flex-1 min-h-0">
            {/* Main Navigation */}
            <div className="fixed right-[65px] bottom-[55px]">
              <MainNavigation hasSearchBox isHomePage={false} />
            </div>

            {/* Content */}
            <div className="space-y-1.5 bg-gray-200">
              {/* Show Cart and Order Summary only if not paid */}
              {!isPaid && (
                <>
                  {/* First White Box - Cart Items */}
                  <div className="bg-white rounded-t-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                    <CartItems
                      handleNextStep={handleOrderSubmit}
                      isMobile={false}
                    />
                  </div>

                  {/* Second White Box - Order Summary */}
                  <div className="bg-white rounded-b-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                    <OrderSummary
                      isOrderItemsOpen={isOrderItemsOpen}
                      setIsOrderItemsOpen={setIsOrderItemsOpen}
                      handleNextStep={handlePayment}
                      isMobile={false}
                      isOrderSubmitted={isOrderSubmitted}
                    />
                  </div>
                </>
              )}

              {/* Show Order Items only after payment */}
              {isPaid && (
                <div className="bg-white rounded-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                  <OrderItems isMobile={false} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPageContent;
