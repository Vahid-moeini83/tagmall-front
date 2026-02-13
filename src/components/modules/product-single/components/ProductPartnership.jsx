"use client";

import { useState } from "react";
import Image from "next/image";
import { DownloadIcon, CopyIcon } from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function ProductPartnership() {
  const [showLink, setShowLink] = useState(false);

  const partnershipTexts = [
    "با به اشتراک گذاری لینک فروش محصولات ، یک  درصد  از  فروش   هر   کالا را بهره مند شوید .",
    "لینک مشارکت در فروش هر کالا برای شما اختصاصی می باشد .",
    "بررسی بازدهی لینک های به اشتراک گذاشته شده : با بررسی بازدهی لینک های به اشتراک گذاشته شده ؛ عملکرد بهتر و سود بیش ترکسب کنید .",
    "محاسبه و پرداخت سود مشارکت در فروش : با توجه به امکان مرجوع شدن کالا توسط خریدار سود مشارکت در فروش پس  ازپایان فرصت مرجوع شدن کالا به حساب شما واریز می شود .",
  ];

  const affiliateLink = "pinmall.com/pinmallaffliate/contract01";

  return (
    <div className="bg-white rounded-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
      <Accordion type="single" collapsible defaultValue="partnership">
        <AccordionItem value="partnership">
          <AccordionTrigger className="text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline justify-between">
            مشارکت در فروش
          </AccordionTrigger>
          <AccordionContent className="mt-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Right side - Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative w-full h-[300px] lg:h-[460px]">
                  <Image
                    src="/assets/images/fallback/phone.png"
                    fill
                    alt="Partnership"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Left side - Content */}
              <div className="w-full lg:w-1/2 flex flex-col">
                {/* Texts */}
                <div className="space-y-0 mb-6">
                  {partnershipTexts.map((text, index) => (
                    <p key={index} className="text-gray-600 text-base/12">
                      {text}
                    </p>
                  ))}
                </div>

                {/* Button or Link Box */}
                {!showLink ? (
                  <button
                    onClick={() => setShowLink(true)}
                    className="text-shade-100 text-lg"
                  >
                    دریافت لینک مشارکت در فروش
                  </button>
                ) : (
                  <div className="space-y-4">
                    {/* Link Box */}
                    <div className="bg-gray-200 p-4 rounded-lg flex justify-center items-center">
                      {/* Link */}
                      <span className="text-gray-400 ml-6">
                        {affiliateLink}
                      </span>
                      {/* Copy Icon */}
                      <CopyIcon size={20} color="black" />
                      {/* Border */}
                      <div className="border-r-2 border-white h-6 mx-[14px]" />
                      {/* Download Icon */}
                      <DownloadIcon size={20} color="black" />
                    </div>

                    {/* Share Button */}
                    <div className="text-center">
                      <button className="text-shade-100 text-lg cursor-pointer">
                        اشتراک گذاری
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
