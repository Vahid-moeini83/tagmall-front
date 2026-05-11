"use client";

import { SearchInput, SearchBox } from "@/components/ui/search";
import usePublicStore from "@/app/store/publicStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { VerifyIcon, StarIcon, ArrowRightIcon } from "@/icons";
import ProductImageSlider from "../../product-single/components/ProductImageSlider";
import ReceiptStepOne from "./ReceiptStepOne";
import ReceiptStepTwo from "./ReceiptStepTwo";
import ReceiptStepThree from "./ReceiptStepThree";

function ReceiptDelivery() {
  const router = useRouter();
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);
  const [currentStep, setCurrentStep] = useState(1);

  // Mock data
  const sellerData = {
    sellerName: "دیجیتال استور بهار",
    sellerAvatar: "/assets/images/fallback/avatar.png",
    rating: 4.6,
    totalReviews: 128,
  };

  const orderData = {
    orderId: "1234567890",
    productName: "گوشی موبایل اپل آیفون 15 ظرفیت 256GB رنگ natural Titanium",
    quantity: 1,
    visitDate: "8 تا 10 مهر ماه 1403",
    status: "آماده تحویل ( خرید حضوری )",
    lastUpdate: "1 دقیقه پیش",
    itemsCount: 5,
  };

  const handleSearchInputClick = () => {
    setSearchBoxOpen(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ReceiptStepOne
            onNext={() => setCurrentStep(2)}
            sellerData={sellerData}
            orderData={orderData}
          />
        );
      case 2:
        return (
          <ReceiptStepTwo
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            orderData={orderData}
          />
        );
      case 3:
        return (
          <ReceiptStepThree
            onBack={() => setCurrentStep(2)}
            orderData={orderData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen flex-col">
        <div className="flex flex-col h-full py-[50px] px-[140px]">
          {/* Header section */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-primary text-base lg:text-xl">
              رسید تحویل کالا
            </h3>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              {/* Left Section - Image Slider */}
              <div className="lg:w-1/2">
                {/* Seller info */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start flex-col gap-1">
                    {/* Seller profile section */}
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          sellerData.sellerAvatar ||
                          "/assets/images/fallback/avatar.png"
                        }
                        width={48}
                        height={48}
                        alt="seller avatar"
                        className="bg-white rounded-lg"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-sm lg:text-base text-gray-600">
                          {sellerData.sellerName}
                        </span>
                        <VerifyIcon size={20} />
                      </div>
                    </div>

                    {/* Overall rating section */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <StarIcon size={10} className="text-yellow-600" />
                        <span className="text-sm lg:text-base">
                          {sellerData.rating}
                          <span className="text-xs text-gray-400">/5</span>
                        </span>
                      </div>
                      <span className="text-xs lg:text-sm text-gray-400">
                        آرا {sellerData.totalReviews}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 text-gray-600 text-xs lg:text-sm">
                    <span className="font-bold">شناسه سفارش</span>{" "}
                    {orderData.orderId}
                  </div>
                </div>

                {/* Image Slider */}
                <div className="-translate-y-20">
                  <ProductImageSlider />
                </div>
              </div>

              {/* Right Section - Steps */}
              <div className="lg:w-1/2 bg-gray-200 p-4 rounded-lg self-start">
                {renderStepContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen bg-white">
        {/* Content Area */}
        <div className="px-[10px] py-4 space-y-4">
          {/* Header section */}
          <h3 className="font-bold text-primary text-lg">رسید تحویل کالا</h3>

          {/* Main Content Box */}
          <div className="bg-gray-200 rounded-lg p-[10px]">
            {/* Seller info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start flex-col gap-1">
                {/* Seller profile section */}
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      sellerData.sellerAvatar ||
                      "/assets/images/fallback/avatar.png"
                    }
                    width={48}
                    height={48}
                    alt="seller avatar"
                    className="bg-white rounded-lg"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">
                      {sellerData.sellerName}
                    </span>
                    <VerifyIcon size={20} />
                  </div>
                </div>

                {/* Overall rating section */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <StarIcon size={10} className="text-yellow-600" />
                    <span className="text-sm">
                      {sellerData.rating}
                      <span className="text-xs text-gray-400">/5</span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    آرا {sellerData.totalReviews}
                  </span>
                </div>
              </div>
              <div className="pt-4 text-gray-600 text-xs font-extralight">
                <span className="font-bold">شناسه سفارش</span>{" "}
                {orderData.orderId}
              </div>
            </div>

            {/* Image Slider */}
            <div className="-translate-y-10">
              <ProductImageSlider hasUserImages={false} />
            </div>

            {/* Steps Section */}
            <div>{renderStepContent()}</div>
          </div>

          {/* Back button */}
          <div className="p-4 bg-gray-200 rounded-lg h-12 flex items-center justify-start gap-[10px]">
            <ArrowRightIcon />
            <p className="text-xs text-gray-600 font-extralight">
              <span className="font-bold">بازگشت</span> به لیست سبد خرید و فروش
            </p>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <SearchBox
        isOpen={searchBoxOpen}
        onClose={() => setSearchBoxOpen(false)}
      />
    </>
  );
}

export default ReceiptDelivery;
