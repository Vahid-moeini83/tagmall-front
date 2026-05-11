"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DownloadIcon,
  CopyIcon,
  HintIcon,
  FullScreenIcon,
  SmallScreenIcon,
  ExternalLinkIcon,
} from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { PartnershipHintDialog } from "@/components/ui/dialog";

export default function ProductPartnership({ cooperation }) {
  const [showLink, setShowLink] = useState(false);
  const [isHintBoxOpen, setIsHintBoxOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const affiliateLink = cooperation?.cooperation_link;
  const cooperationImage =
    cooperation?.image || "/assets/images/partnership-cover.png";

  // Parse HTML text if exists
  const cooperationTextHTML = cooperation?.text || "";

  return (
    <div className="bg-white lg:rounded-lg pb-30 lg:py-[50px] lg:px-[100px]">
      <Accordion type="single" collapsible defaultValue="partnership">
        <AccordionItem value="partnership">
          <AccordionTrigger className="hidden lg:flex text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline justify-between">
            مشارکت در فروش
          </AccordionTrigger>
          <AccordionContent className="lg:mt-4 px-[10px] lg:px-0">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Image Section */}
              <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
                <div className="relative w-full h-[350px] lg:h-[460px]">
                  <Image
                    src={cooperationImage}
                    fill
                    alt="Partnership"
                    className="object-contain"
                  />
                </div>
                <div className="lg:hidden flex items-center justify-end pl-2 mt-3">
                  <FullScreenIcon
                    size={20}
                    className="cursor-pointer ml-0.5"
                    onClick={() => setIsFullScreen(true)}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 flex flex-col">
                {/* Texts */}
                {cooperationTextHTML ? (
                  <div
                    className="hidden lg:block space-y-0 mb-6"
                    dangerouslySetInnerHTML={{ __html: cooperationTextHTML }}
                  />
                ) : (
                  <div className="hidden lg:block space-y-0 mb-6">
                    <div className="mb-2! lg:mb-3!">
                      <p className="text-gray-600 text-justify text-xs/6 lg:text-base/12">
                        با به اشتراک گذاری لینک فروش محصولات ، یک درصد از فروش
                        هر کالا را بهره مند شوید .
                      </p>
                    </div>

                    <div className="mb-2! lg:mb-3!">
                      <p className="text-gray-600 text-justify text-xs/6 lg:text-base/12">
                        لینک مشارکت در فروش هر کالا برای شما اختصاصی می باشد .
                      </p>
                    </div>

                    <div className="mb-2! lg:mb-3!">
                      <p className="text-gray-600 text-justify text-xs/6 lg:text-base/12 font-bold">
                        بررسی بازدهی لینک های به اشتراک گذاشته شده :
                      </p>
                      <p className="text-gray-600 text-justify text-xs/6 lg:text-base/12">
                        با بررسی بازدهی لینک های به اشتراک گذاشته شده ؛ عملکرد
                        بهتر و سود بیش ترکسب کنید .
                      </p>
                    </div>

                    <div className="mb-2! lg:mb-3!">
                      <p className="text-gray-600 text-justify text-xs/6 lg:text-base/12 font-bold">
                        محاسبه و پرداخت سود مشارکت در فروش :
                      </p>
                      <p className="text-gray-600 text-justify text-xs/6 lg:text-base/12">
                        با توجه به امکان مرجوع شدن کالا توسط خریدار سود مشارکت
                        در فروش پس ازپایان{" "}
                        <Link href="#" className="text-primary">
                          فرصت مرجوع شدن کالا
                        </Link>{" "}
                        به حساب شما واریز می شود .
                      </p>
                    </div>
                  </div>
                )}

                {/* Button or Link Box */}
                <div className="bg-gray-200 rounded-lg p-[10px]">
                  <div className="flex lg:hidden items-center justify-between">
                    <span className="text-primary font-bold">
                      مشارکت در فروش
                    </span>
                    <HintIcon
                      size={20}
                      onClick={() => setIsHintBoxOpen(true)}
                    />
                  </div>
                  <div className="block lg:hidden mt-5 space-y-2">
                    <div className="text-primary font-extralight">
                      <span className="font-bold">سود مشارکت در فروش </span>1
                      درصد به ازای فروش هر کالا
                    </div>
                  </div>
                  {!showLink ? (
                    <button
                      onClick={() => setShowLink(true)}
                      className="bg-white lg:bg-gray-200 h-10 rounded-lg text-primary w-full mt-5 lg:mt-0"
                    >
                      دریافت لینک مشارکت در فروش
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 mt-5 lg:mt-0">
                      {/* Link Box */}
                      <div className="bg-white flex-1 p-[10px] rounded-lg flex justify-end items-center lg:gap-6">
                        {/* Link */}
                        <span
                          dir="ltr"
                          className="text-gray-400 ml-6 lg:ml-0 line-clamp-1 max-w-[170px] lg:max-w-[unset] text-ellipsis"
                        >
                          {affiliateLink}
                        </span>
                        <div className="flex items-center">
                          {/* Copy Icon */}
                          <CopyIcon size={20} />
                          {/* Border */}
                          <div className="border-r-2 border-gray-200 h-6 mx-[14px]" />
                          {/* Download Icon */}
                          <DownloadIcon size={20} />
                        </div>
                      </div>
                      {/* External Link Icon */}
                      <ExternalLinkIcon size={20} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Hint box */}
      {isHintBoxOpen && (
        <PartnershipHintDialog
          open={isHintBoxOpen}
          setIsHintBoxOpen={setIsHintBoxOpen}
        />
      )}

      {/* Fullscreen Image Modal */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-200 bg-gray-200/20 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setIsFullScreen(false)}
        >
          <div className="absolute top-4 left-4">
            <SmallScreenIcon
              className="cursor-pointer text-gray-800"
              size={24}
              onClick={() => setIsFullScreen(false)}
            />
          </div>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={cooperationImage}
              fill
              alt="Partnership Fullscreen"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
