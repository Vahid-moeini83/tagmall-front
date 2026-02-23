"use client";

import { useState } from "react";
import Image from "next/image";
import { VerifyIcon, StarIcon, NoteIcon, PlusIcon, MinusIcon } from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import ProductImageSlider from "./ProductImageSlider";

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
    name: "گوشی موبایل سامسونگ مدل Galaxy S23 Ultra",
    colors: [
      {
        id: "gray",
        name: "خاکستری",
        colorCode: "#CBCBCB",
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
    <div className="bg-gray-200 py-[10px] lg:bg-white lg:rounded-lg lg:py-[50px] lg:px-[100px]">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Right Section */}
        <div className="lg:w-1/2">
          {/* Seller profile and rating */}
          <div className="flex items-center justify-between lg:items-start lg:flex-col gap-1 mb-6">
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

          {/* Product Image Slider */}
          <div className="lg:-translate-y-20">
            <ProductImageSlider />
          </div>
        </div>

        {/* Left Section */}
        <div className="lg:w-1/2 space-y-4">
          {/* Special Sale & Timer */}
          <div className="flex items-center justify-between">
            <span className="text-error-medium font-bold text-[20px]">
              فروش ویژه
            </span>
            <span className="text-error-medium font-bold text-[20px]">
              02:45:30
            </span>
          </div>

          {/* Product Name & Price */}
          <div className="flex flex-col gap-4 pb-4">
            <h1 className="text-gray-600">{productData.name}</h1>
            <p className="text-gray-600 text-lg">
              {selectedColorData?.price.toLocaleString("fa-IR")} تومان
            </p>
          </div>

          {/* Color Accordion */}
          <div>
            <Accordion type="single" collapsible defaultValue="color">
              <AccordionItem value="color">
                <AccordionTrigger className="text-gray-600 justify-between hover:no-underline cursor-pointer">
                  <div>
                    <span className="font-bold">رنگ</span>{" "}
                    {selectedColorData?.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mt-4">
                  <div className="space-y-4">
                    {productData.colors.map((color, index) => (
                      <div key={color.id}>
                        <button
                          onClick={() => setSelectedColor(color.id)}
                          className={`w-full flex items-start justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                            selectedColor === color.id ? "bg-gray-200" : ""
                          }`}
                        >
                          {/* Right side: Image and text */}
                          <div className="flex items-start gap-3">
                            <Image
                              src={color.image}
                              width={36}
                              height={36}
                              alt={color.name}
                              className="object-contain"
                            />
                            <div className="flex flex-col gap-[24px] items-start">
                              <span className="text-gray-600">
                                <span className="font-bold">رنگ</span>{" "}
                                {color.name}
                              </span>
                              <span className="text-gray-600">
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
                          <div className="border-t-2 border-gray-200 mr-14" />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Delivery Method Accordion */}
          <div className="border-t-2 border-gray-200 pt-4">
            <Accordion type="single" collapsible defaultValue="delivery">
              <AccordionItem value="delivery">
                <AccordionTrigger className="text-gray-600 justify-between hover:no-underline">
                  <div>
                    <span className="font-bold">روش تحویل سفارش</span>{" "}
                    {deliveryMethods[deliveryMethod]}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mt-4">
                  <div className="space-y-4">
                    {/* Delivery by seller */}
                    <div className="px-1">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          value="delivery"
                          checked={deliveryMethod === "delivery"}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="mt-1 accent-primary"
                        />
                        <div className="flex flex-col gap-[20px]">
                          <span className="text-gray-600">
                            ارسال توسط فروشنده (هزینه ارسال 30000 تومان)
                          </span>
                          <span className="text-gray-600 text-sm">
                            فروشنده متعهد شده است سفارش را تا 2 روز کاری ارسال
                            کند .
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Line */}
                    <div className="border-t-2 border-gray-200 mr-8" />

                    {/* In-person pickup */}
                    <div className="px-1">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          value="pickup"
                          checked={deliveryMethod === "pickup"}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="mt-1 accent-primary"
                        />
                        <div className="flex flex-col gap-[20px]">
                          <span className="text-gray-600">
                            مراجعه به فروشگاه (اراک)
                          </span>
                          <span className="text-gray-600 text-sm">
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
          <div className="border-t-2 border-gray-200 pt-4 flex items-center justify-between">
            <span className="text-gray-600">تعداد سفارش</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                disabled={quantity <= 1}
              >
                <MinusIcon size={24} />
              </button>
              <span className="text-gray-600 min-w-[30px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange("increase")}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <PlusIcon size={24} />
              </button>
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <NoteIcon size={20} color="currentColor" />
              <span className="text-gray-600">یادداشت</span>
            </div>
          </div>

          {/* Order button */}
          <div className="text-center">
            <button className="text-primary text-[20px] cursor-pointer hover:text-primary transition-colors">
              ثبت سفارش
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
