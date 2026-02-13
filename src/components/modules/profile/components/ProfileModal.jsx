"use client";

import {
  PlusIcon,
  PanelIcon,
  ExternalLinkIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
} from "@/icons";
import Image from "next/image";
import { useState } from "react";
import PartnershipModal from "./PartnershipModal";

export default function ProfileModal({
  isOpen,
  onClose,
  triggerElement,
  onPartnershipOpen,
}) {
  if (!isOpen) return null;

  // Format number with Persian thousand separators
  const formatBalance = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm z-90"
        onClick={onClose}
      />

      {/* Trigger element (avatar) - stays visible above backdrop */}
      {triggerElement && (
        <div className="fixed z-100 bottom-[calc(12px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 lg:right-6 xl:right-10 lg:bottom-8 lg:left-auto lg:translate-x-0 pointer-events-none">
          {triggerElement}
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 lg:inset-auto lg:right-[calc(96px+24px)] xl:right-[calc(104px+24px)] lg:bottom-8 lg:max-w-[500px] lg:w-full z-100 bottom-[calc(72px+env(safe-area-inset-bottom))] lg:top-auto">
        <div className="bg-white border border-gray-200 rounded-lg h-full overflow-y-auto overflow-x-hidden px-[10px] py-6 lg:p-[50px]">
          {/* Wallet section */}
          <div className="relative w-full h-[100px] lg:w-full lg:max-w-[400px] lg:h-[200px] lg:mx-auto mb-6 lg:mb-8">
            <Image
              src="/assets/images/wallet-bg.svg"
              fill
              alt="wallet background"
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 lg:gap-[28px]">
              <span className="text-sm lg:text-base font-semibold text-white">
                کیف پول اعتباری
              </span>
              <span className="text-sm lg:text-base text-white">
                موجودی{" "}
                <span className="font-semibold">{formatBalance(1000000)}</span>{" "}
                تومان
              </span>
            </div>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity cursor-pointer">
              <PlusIcon size={24} className="text-white" />
            </button>
          </div>

          {/* Seller panel section */}
          <div className="border-t-2 border-gray-200 py-3">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <PanelIcon size={24} className="text-gray-800" />
                <span className="text-gray-600">پنل فروشندگان</span>
              </div>
              <button className="hover:opacity-80 transition-opacity">
                <ArrowRightIcon size={20} className="-rotate-45" />
              </button>
            </div>
            <p className="text-xs lg:text-sm text-gray-600 leading-[24px]">
              با ثبت محصولات و بهره مند از خدمات ما ، بازدید و فروش بیش تر و
              تجربه بی نظیری برای مشتریان خود فراهم کنید .
            </p>
          </div>

          {/* Partnership section */}
          <div className="border-t-2 border-gray-200 py-3">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <ExternalLinkIcon size={24} className="text-gray-800" />
                <span
                  className="text-gray-600 cursor-pointer"
                  onClick={onPartnershipOpen}
                >
                  مشارکت در فروش
                </span>
              </div>
              <button
                className="hover:opacity-80 transition-opacity"
                onClick={onPartnershipOpen}
              >
                <ChevronLeftIcon size={20} />
              </button>
            </div>
            <p className="text-xs lg:text-sm text-gray-600 leading-[24px]">
              با به اشتراک گذاری لینک فروش محصولات ، به ازای فروش هر کالا از
              مزایای فروش کالا بهره مند شوید .
            </p>
          </div>

          {/* Edit profile button */}
          <div className="mt-6 text-center">
            <button className="text-primary hover:opacity-80 transition-opacity cursor-pointer">
              ویرایش مشخصات
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
