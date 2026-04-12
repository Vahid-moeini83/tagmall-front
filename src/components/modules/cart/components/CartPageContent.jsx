"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/search";
import MainNavigation from "@/components/layout/navigation-menu/MainNavigation";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";
import OrderItems from "./OrderItems";

function CartPageContent() {
  const [isOrderItemsOpen, setIsOrderItemsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex lg:hidden h-screen bg-white flex-col">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-[10px] pt-5 pb-4">
          {/* Steps */}
          <div className="flex items-center justify-center mb-5">
            <div
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
          <div className="flex items-center gap-[25px] pr-5">
            <div className="w-[50px] h-[50px] bg-gray-400 rounded-lg shrink-0" />
            <div className="flex-1">
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                showSearchIcon={false}
                readOnly
                bgColor="bg-white"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative rounded-lg overflow-y-auto flex-1 min-h-0">
            {/* Main Navigation */}
            <div className="fixed right-[65px] bottom-[55px]">
              <MainNavigation isHomePage={false} />
            </div>

            {/* Content */}
            <div className="space-y-1.5 bg-gray-200">
              {/* First White Box - Cart Items */}
              <div className="bg-white rounded-t-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                <CartItems isMobile={false} />
              </div>

              {/* Second White Box - Order Summary */}
              <div className="bg-white rounded-b-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                <OrderSummary
                  isOrderItemsOpen={isOrderItemsOpen}
                  setIsOrderItemsOpen={setIsOrderItemsOpen}
                  isMobile={false}
                />
              </div>

              {/* Third White Box - Order Items (Conditional) */}
              {isOrderItemsOpen && (
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
