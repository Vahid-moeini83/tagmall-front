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
import ResponsiveModal from "@/components/ui/responsive-modal";
import PopoverWithTrigger from "@/components/ui/popover/PopoverWithTrigger";

export default function ProductPartnership({ cooperation }) {
  const [showLink, setShowLink] = useState(false);
  const [isHintBoxOpen, setIsHintBoxOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isReturnGuideOpen, setIsReturnGuideOpen] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);

  const affiliateLink = cooperation?.cooperation_link;
  const cooperationImage =
    cooperation?.image || "/assets/images/fallback/no-photo.jpg";

  const socialPlatforms = [
    {
      name: "اینستاگرام",
      logo: "/assets/images/logo/instagram.svg",
      url: "#",
    },
    { name: "یوتیوب", logo: "/assets/images/logo/youtube.svg", url: "#" },
    { name: "بله", logo: "/assets/images/logo/bale.svg", url: "#" },
    { name: "تلگرام", logo: "/assets/images/logo/telegram.svg", url: "#" },
  ];

  const handleOpenReturnGuide = () => {
    setIsReturnGuideOpen(true);
  };

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
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <div className="relative w-full h-[350px] lg:h-[460px]">
                  <Image
                    src={cooperationImage}
                    fill
                    alt="Partnership"
                    className="object-contain rounded-lg"
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
                <div className="hidden lg:block space-y-0 mb-6">
                  <div className="mb-2! lg:mb-3!">
                    <p className="font-extralight text-gray-600 text-justify text-xs/6 lg:text-base/12">
                      با به اشتراک گذاری لینک فروش محصولات ، یک درصد از فروش هر
                      کالا را بهره مند شوید .
                    </p>
                  </div>

                  <div className="mb-2! lg:mb-3!">
                    <p className="font-extralight text-gray-600 text-justify text-xs/6 lg:text-base/12">
                      لینک مشارکت در فروش هر کالا برای شما اختصاصی می باشد .
                    </p>
                  </div>

                  <div className="mb-2! lg:mb-3!">
                    <p className="text-gray-600 text-justify text-xs/6 lg:text-base/12 font-bold">
                      بررسی بازدهی لینک های به اشتراک گذاشته شده :
                    </p>
                    <p className="font-extralight text-gray-600 text-justify text-xs/6 lg:text-base/12">
                      با بررسی بازدهی لینک های به اشتراک گذاشته شده ؛ عملکرد
                      بهتر و سود بیش ترکسب کنید .
                    </p>
                  </div>

                  <div className="mb-2! lg:mb-3!">
                    <p className="text-gray-600 text-justify text-xs/6 lg:text-base/12 font-bold">
                      محاسبه و پرداخت سود مشارکت در فروش :
                    </p>
                    <p className="font-extralight text-gray-600 text-justify text-xs/6 lg:text-base/12">
                      با توجه به امکان مرجوع شدن کالا توسط خریدار سود مشارکت در
                      فروش پس ازپایان{" "}
                      <span
                        onClick={handleOpenReturnGuide}
                        className="text-primary cursor-pointer"
                      >
                        فرصت مرجوع شدن کالا
                      </span>{" "}
                      به حساب شما واریز می شود .
                    </p>
                  </div>
                </div>

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
                  ) : true ? (
                    <div className="flex items-center gap-4 mt-5 lg:mt-0 relative">
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
                      <ExternalLinkIcon
                        size={20}
                        className="cursor-pointer"
                        onClick={() => setSharePopoverOpen(true)}
                      />
                    </div>
                  ) : (
                    <p className="bg-white lg:bg-gray-200 rounded-lg mt-5 lg:mt-0 py-[10px] lg:py-2 text-gray-600 text-center">
                      لینک مشارکت در فروش برای این محصول وجود ندارد
                    </p>
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
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Return Guide Modal */}
      <ResponsiveModal
        isOpen={isReturnGuideOpen}
        onClose={() => setIsReturnGuideOpen(false)}
        title="مرجوع شدن کالا"
        isHintBox={true}
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-justify text-sm lg:text-base leading-7">
            برای مرجوع کردن کالا، لطفاً به بخش سفارشات خود مراجعه کرده و گزینه
            &ldquo;درخواست مرجوعی&rdquo; را انتخاب نمایید. کالا باید در شرایط
            اولیه و با بسته‌بندی کامل باشد.
          </p>
        </div>
      </ResponsiveModal>

      {/* Share Popover */}
      <PopoverWithTrigger
        isOpen={sharePopoverOpen}
        onClose={() => setSharePopoverOpen(false)}
        trigger={
          <div className="flex items-center gap-4">
            {/* Empty space to match the link box width */}
            <div className="flex-1"></div>
            {/* External Link Icon in its original position */}
            <button
              type="button"
              className="flex items-center justify-center shrink-0 text-primary focus:outline-none touch-none pointer-events-auto"
              onClick={() => setSharePopoverOpen(false)}
            >
              <ExternalLinkIcon className="text-primary" size={20} />
            </button>
          </div>
        }
        triggerPosition="bottom-[calc(100px+env(safe-area-inset-bottom))] left-[20px]"
        popoverClassName="bottom-[calc(132px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[608px] bg-white rounded-lg shadow-lg lg:hidden animate-slide-up-simple"
      >
        <span
          onClick={() => setSharePopoverOpen(false)}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-1 block bg-gray-300 rounded-full cursor-pointer"
        ></span>
        <div className="pr-[5px] py-[5px] pt-6">
          <h3 className="text-center text-primary font-bold text-base mb-3 px-[5px]">
            بستر اشتراک گذاری محتوا
          </h3>
          <div>
            {socialPlatforms.map((platform, index) => (
              <div key={index}>
                <Link
                  href={platform.url}
                  onClick={() => setSharePopoverOpen(false)}
                  className="flex items-center gap-2 hover:bg-gray-50 transition-colors h-[64px]"
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={platform.logo}
                      width={40}
                      height={40}
                      alt={platform.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-gray-600">{platform.name}</span>
                </Link>
                {index < socialPlatforms.length - 1 && (
                  <div className="border-t-2 border-gray-200 mr-[5px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </PopoverWithTrigger>
    </div>
  );
}
