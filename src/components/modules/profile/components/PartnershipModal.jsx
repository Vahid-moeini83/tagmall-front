"use client";

import Image from "next/image";
import { ArrowRightIcon, HintIcon } from "@/icons";
import { useState } from "react";

export default function PartnershipModal({ isOpen, onClose, products }) {
  const [selectedFilter, setSelectedFilter] = useState("most-viewed");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex flex-col justify-between h-full py-12 px-16">
        {/* Header section */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-semibold text-primary text-[20px]">
            مشارکت در فروش
          </h3>
          <HintIcon size={20} className="text-gray-600 cursor-pointer" />
        </div>

        {/* Filter section */}
        <div className="flex items-center gap-5 mb-8">
          <span className="font-semibold text-gray-600">پیشنهادات:</span>
          <div className="flex items-center gap-4 border-l border-gray-300 pl-[10px]">
            <button
              onClick={() => setSelectedFilter("most-viewed")}
              className={`transition-colors ${
                selectedFilter === "most-viewed"
                  ? "text-primary"
                  : "text-gray-600"
              }`}
            >
              پر بازدیدترین
            </button>
            <button
              onClick={() => setSelectedFilter("best-selling")}
              className={`transition-colors ${
                selectedFilter === "best-selling"
                  ? "text-primary"
                  : "text-gray-600"
              }`}
            >
              پر فروش ترین
            </button>
          </div>
          <span className="text-shade-100">کالای خاصی در نظر دارید؟</span>
        </div>

        {/* Products list */}
        <div className="space-y-8 overflow-y-auto flex-1">
          {products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-2 border-b border-gray-100 pb-8 lg:mx-4 xl:mx-8"
            >
              <div className="flex justify-center items-center">
                <div className="relative w-40 xl:w-50 h-40 xl:h-50 rounded-lg overflow-hidden">
                  <Image
                    src={product.img || "/assets/images/fallback/phone.png"}
                    fill
                    alt={product.name}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start justify-center gap-4 pl-8">
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600">
                  سود مشارکت در فروش یک درصد به ازای فروش هر کالا
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer section */}
        <div className="grid grid-cols-[0.1fr_1.8fr_0.1fr] mt-6 pt-4 items-center">
          <ArrowRightIcon
            className="text-gray-600 cursor-pointer w-5 h-5"
            onClick={onClose}
          />
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-600 text-center">
              با مشارکت در فروش ، ما قدرت خرید شما را بیش تر می کنیم .
            </span>
            <button className="text-primary hover:opacity-80 transition-opacity">
              لینک های دریافت شده
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
