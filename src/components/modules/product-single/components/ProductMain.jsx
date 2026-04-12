"use client";

import { useState } from "react";
import Image from "next/image";
import {
  VerifyIcon,
  StarIcon,
  NoteIcon,
  PlusIcon,
  MinusIcon,
  ChevronLeftIcon,
} from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import ProductImageSlider from "./ProductImageSlider";
import { Radio } from "@/components/ui/radio";

export default function ProductMain() {
  const [selectedColor, setSelectedColor] = useState("gray");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [quantity, setQuantity] = useState(1);

  // Mock data
  const sellerData = {
    sellerName: "دیجیتال استور بهار",
    sellerAvatar: "/assets/images/fallback/avatar.png",
    rating: 4.6,
    totalReviews: 128,
  };

  const productData = {
    name: "سامسونگ مدل Galaxy S23 Ultra",
    colors: [
      {
        id: "gray",
        name: "خاکستری",
        colorCode: "#848484",
        price: 55000000,
        image: "/assets/images/fallback/phone.png",
      },
      {
        id: "black",
        name: "مشکی",
        colorCode: "#000000",
        price: 55000000,
        image: "/assets/images/fallback/phone.png",
      },
    ],
  };

  const deliveryMethods = {
    delivery: "ارسال توسط فروشنده",
    pickup: "مراجعه به فروشگاه",
  };

  const selectedColorData = productData.colors.find(
    (c) => c.id === selectedColor,
  );

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-gray-200 lg:bg-white lg:rounded-lg pb-82 lg:pb-0 lg:py-[50px] lg:px-[100px]">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Seller details and Images Section */}
        <div className="lg:w-1/2 border-b-2 border-white lg:border-0 pt-2 lg:pt-0 pb-6 lg:pb-0">
          {/* Seller profile and rating */}
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-col gap-1 lg:mb-6">
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
            <button className="block lg:hidden pt-4 text-primary">
              10 فروشنده دیگر
            </button>
          </div>

          {/* Product Image Slider */}
          <div className="lg:-translate-y-20">
            <ProductImageSlider />
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2 space-y-4">
          <div className="fixed right-[10px] left-[10px] bottom-17 rounded-lg bg-white lg:bg-none lg:static z-10">
            <div className="px-[10px] pt-4">
              {/* Special Sale & Timer */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-error-medium font-bold lg:text-[20px]">
                  فروش ویژه
                </span>
                <span className="text-error-medium font-bold lg:text-[20px]">
                  02:45:30
                </span>
              </div>

              {/* Product Name & Price */}
              <div className="flex flex-col gap-4 pb-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-gray-600 text-xs lg:text-base line-clamp-1">
                    <span className="font-bold">گوشی موبایل </span>
                    {productData.name}
                  </h1>
                  <PlusIcon size={24} className="text-primary lg:hidden" />
                </div>
                <p className="text-gray-600 text-xs lg:text-lg">
                  <span className="font-bold">قیمت </span>
                  {selectedColorData?.price.toLocaleString("fa-IR")} تومان
                </p>
                <p className="text-gray-400 line-through pr-8 lg:pr-12 text-xs lg:text-lg">
                  {(65500000).toLocaleString("fa-IR")} تومان
                </p>
                <p className="text-gray-600 text-xs lg:hidden">
                  <span className="font-bold">روش‌های تحویل کالا </span>
                  مراجعه به فروشگاه (اراک) ، ارسال توسط فروشنده
                </p>
              </div>
            </div>
            <div className="lg:hidden w-full h-[3px] bg-gray-200" />
            <button className="flex items-center justify-between w-full lg:hidden px-[10px] py-4">
              <span className="text-gray-600 font-bold">
                لوازم جانبی و قطعات مرتبط
              </span>
              <ChevronLeftIcon size={20} color="currentColor" />
            </button>
          </div>

          {/* Color Accordion */}
          <div className="border-b-2 border-white lg:border-0 pb-2 lg:pb-0">
            <Accordion type="single" collapsible defaultValue="color">
              <AccordionItem value="color">
                <AccordionTrigger className="text-gray-600 pl-[11px] justify-between hover:no-underline cursor-pointer">
                  <div>
                    <span className="font-bold text-gray-600 text-lg lg:text-base">
                      رنگ
                    </span>{" "}
                    <span className="hidden lg:inline">
                      {selectedColorData?.name}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mt-4">
                  <div className="lg:space-y-4">
                    {productData.colors.map((color, index) => (
                      <div key={color.id}>
                        <button
                          onClick={() => setSelectedColor(color.id)}
                          className={`w-full flex items-center lg:items-start justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                            selectedColor === color.id
                              ? "bg-gray-300 lg:bg-gray-200"
                              : ""
                          }`}
                        >
                          {/* Right side: Image and text */}
                          <div className="flex items-center lg:items-start gap-3">
                            <Image
                              src={color.image}
                              width={24}
                              height={36}
                              alt={color.name}
                              className="object-contain"
                            />
                            <div className="flex flex-col gap-3 lg:gap-[24px] items-start">
                              <span className="text-gray-600 text-xs lg:text-base">
                                <span className="font-bold">رنگ</span>{" "}
                                {color.name}
                              </span>
                              <span className="text-gray-600 text-xs lg:text-base">
                                <span className="font-bold">قیمت از</span>{" "}
                                {color.price.toLocaleString("fa-IR")} تومان
                              </span>
                            </div>
                          </div>

                          {/* Left side: Color circle */}
                          <div
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: color.colorCode }}
                          />
                        </button>
                        {index < productData.colors.length - 1 && (
                          <div className="border-t-2 border-gray-200 mr-14 hidden lg:block" />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Delivery Method Accordion */}
          <div className="border-b-2 border-white lg:border-0 pb-3 lg:pb-0 lg:border-t-2 lg:border-gray-200 lg:pt-4">
            <Accordion type="single" collapsible defaultValue="delivery">
              <AccordionItem value="delivery">
                <AccordionTrigger className="text-gray-600 pl-[11px] justify-between hover:no-underline">
                  <div>
                    <span className="font-bold text-gray-600 text-lg lg:text-base">
                      روش تحویل سفارش
                    </span>{" "}
                    <span className="hidden lg:inline">
                      {deliveryMethods[deliveryMethod]}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mt-4">
                  <div className="space-y-4">
                    {/* Delivery by seller */}
                    <div className="px-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Radio
                          name="delivery"
                          value="delivery"
                          checked={deliveryMethod === "delivery"}
                          onChange={() => setDeliveryMethod("delivery")}
                          className="mt-1"
                        />
                        <div className="flex flex-col gap-[20px]">
                          <span className="text-gray-600 font-bold text-xs lg:text-base">
                            ارسال توسط فروشنده (هزینه ارسال 30000 تومان)
                          </span>
                          <span className="text-gray-600 text-xs lg:text-sm">
                            فروشنده متعهد شده است سفارش را تا 2 روز کاری ارسال
                            کند .
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Line */}
                    <div className="border-t-2 border-white lg:border-gray-200 mr-9 lg:mr-8" />

                    {/* In-person pickup */}
                    <div className="px-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Radio
                          name="delivery"
                          value="pickup"
                          checked={deliveryMethod === "pickup"}
                          onChange={() => setDeliveryMethod("pickup")}
                          className="mt-1"
                        />
                        <div className="flex flex-col gap-[20px]">
                          <span className="text-gray-600 text-xs lg:text-base">
                            مراجعه به فروشگاه (اراک)
                          </span>
                          <span className="text-gray-600 text-xs lg:text-sm">
                            کاربر محترم پس از پایان فرآیند پرداخت سفارش موقعیت
                            فروشگاه به شما جهت تحویل سفارش نمایش داده می شود .
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Quantity Selector */}
          <div className="lg:border-t-2 lg:border-gray-200 lg:pt-4 flex items-center justify-between">
            <span className="text-gray-600 font-bold text-lg lg:text-base">
              تعداد سفارش
            </span>
            <div className="flex items-center gap-1 border-2 border-white rounded-lg px-3 py-2.5 lg:border-0 lg:p-0 lg:pl-3">
              <MinusIcon
                size={24}
                onClick={() => handleQuantityChange("decrease")}
                className={`${quantity <= 1 ? "text-gray-400" : "text-gray-800"}`}
              />
              <span className="text-gray-600 min-w-[30px] text-center select-none">
                {quantity}
              </span>
              <PlusIcon
                size={24}
                onClick={() => handleQuantityChange("increase")}
                className="text-primary"
              />
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-white lg:bg-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <NoteIcon size={20} color="currentColor" />
              <span className="text-gray-600 font-bold text-lg lg:text-base">
                یادداشت
              </span>
            </div>
          </div>

          {/* Order button */}
          <div className="hidden lg:block text-center">
            <button className="text-primary text-[20px] cursor-pointer hover:text-primary transition-colors">
              ثبت سفارش
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
