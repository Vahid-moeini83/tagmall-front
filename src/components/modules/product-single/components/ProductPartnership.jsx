"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import PartnershipShareChat from "./PartnershipShareChat";
import {
  CommentsIcon,
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
import Link from "next/link";

export default function ProductPartnership({ cooperation, productName = "" }) {
  const [showLink, setShowLink] = useState(false);
  const [isHintBoxOpen, setIsHintBoxOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isReturnGuideOpen, setIsReturnGuideOpen] = useState(false);
  const [shareChatOpen, setShareChatOpen] = useState(false);
  // drawer پلتفرم‌های اشتراک‌گذاری — فقط موبایل
  const [sharePlatformsOpen, setSharePlatformsOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isContributor = cooperation?.is_contributor === true;

  const affiliateLink = cooperation?.cooperation_link;
  const cooperationImage =
    cooperation?.image || "/assets/images/fallback/no-photo.jpg";

  const socialPlatforms = [
    { name: "YouTube", url: "#" },
    {
      name: "Instagram",
      url: "#",
    },
    { name: "Telegram", url: "#" },
    { name: "روبیکا", url: "#" },
    { name: "بله", url: "#" },
  ];

  const handleOpenReturnGuide = () => {
    setIsReturnGuideOpen(true);
  };

  const handleDownloadImage = useCallback(async () => {
    try {
      const response = await fetch(cooperationImage);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const extension =
        cooperationImage.split(".").pop()?.split("?")[0] || "jpg";
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `partnership-content.${extension}`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error("خطا در دانلود تصویر");
    }
  }, [cooperationImage]);

  return (
    <div className="bg-white lg:rounded-lg pb-26 lg:py-[50px] lg:px-[100px]">
      <Accordion type="single" collapsible defaultValue="partnership">
        <AccordionItem value="partnership">
          <AccordionTrigger className="hidden lg:flex text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline justify-between">
            مشارکت در فروش
          </AccordionTrigger>
          <AccordionContent className="lg:mt-4 px-[10px] lg:px-0">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Image Section */}
              <div className="w-full lg:w-1/2 mt-[50px] lg:mt-0">
                <div className="relative rounded-lg overflow-hidden w-full h-[350px] lg:h-[460px]">
                  <Image
                    src={cooperationImage}
                    fill
                    alt="Partnership"
                    className="object-cover"
                  />
                </div>
                <div className="lg:hidden flex items-center justify-end pl-2 mt-[50px]">
                  <FullScreenIcon
                    size={20}
                    className="cursor-pointer ml-1.5"
                    onClick={() => setIsFullScreen(true)}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 flex flex-col">
                {/* Texts */}
                <div className="hidden lg:block space-y-0 mb-6">
                  <div className="mb-2! lg:mb-3!">
                    <p className="font-iransans font-extralight text-gray-600 text-justify text-xs/6 lg:text-base/12">
                      با به اشتراک گذاری لینک فروش محصولات ، یک درصد از فروش هر
                      کالا را بهره مند شوید .
                    </p>
                  </div>

                  <div className="mb-2! lg:mb-3!">
                    <p className="font-iransans font-extralight text-gray-600 text-justify text-xs/6 lg:text-base/12">
                      لینک مشارکت در فروش هر کالا برای شما اختصاصی می باشد .
                    </p>
                  </div>

                  <div className="mb-2! lg:mb-3!">
                    <p className="font-iransans text-gray-600 text-justify text-xs/6 lg:text-base/12 font-bold">
                      بررسی بازدهی لینک های به اشتراک گذاشته شده :
                    </p>
                    <p className="font-iransans font-extralight text-gray-600 text-justify text-xs/6 lg:text-base/12">
                      با بررسی بازدهی لینک های به اشتراک گذاشته شده ؛ عملکرد
                      بهتر و سود بیش ترکسب کنید .
                    </p>
                  </div>

                  <div className="mb-2! lg:mb-3!">
                    <p className="font-iransans text-gray-600 text-justify text-xs/6 lg:text-base/12 font-bold">
                      محاسبه و پرداخت سود مشارکت در فروش :
                    </p>
                    <p className="font-iransans font-extralight text-gray-600 text-justify text-xs/6 lg:text-base/12">
                      با توجه به امکان مرجوع شدن کالا توسط خریدار سود مشارکت در
                      فروش پس ازپایان{" "}
                      <span
                        onClick={handleOpenReturnGuide}
                        className="text-primary cursor-pointer font-iransans"
                      >
                        فرصت مرجوع شدن کالا
                      </span>{" "}
                      به حساب شما واریز می شود .
                    </p>
                  </div>
                </div>

                {/* Button or Link Box */}
                <div className="bg-gray-200 rounded-lg px-[10px] pt-[15px] pb-[5px] lg:p-[5px]">
                  <div className="flex lg:hidden items-center justify-between px-[5px]">
                    <span className="text-primary text-base font-bold">
                      مشارکت در فروش
                    </span>
                    <HintIcon
                      size={20}
                      onClick={() => setIsHintBoxOpen(true)}
                    />
                  </div>
                  <div className="block lg:hidden mt-6 space-y-2">
                    <div className="text-gray-600 font-extralight mr-2">
                      <span className="font-bold">سود مشارکت در فروش </span>1
                      درصد به ازای فروش هر کالا
                    </div>
                  </div>
                  {!showLink ? (
                    <button
                      onClick={() => setShowLink(true)}
                      className="bg-white lg:bg-gray-200 h-10 rounded-lg text-primary w-full mt-4 lg:mt-0"
                    >
                      دریافت لینک مشارکت در فروش
                    </button>
                  ) : true ? (
                    <div className="flex lg:flex-col items-center gap-3 mt-5 lg:mt-0 relative">
                      {/* Link Box */}
                      <div className="w-full bg-white lg:bg-transparent flex-1 p-[10px] lg:pb-0 rounded-lg flex justify-end items-center lg:gap-6">
                        {/* Link */}
                        <span
                          dir="ltr"
                          className="w-full text-center text-gray-500 ml-6 lg:ml-0 pt-1 lg:pr-20 line-clamp-1 max-w-[170px] lg:max-w-[unset] text-ellipsis"
                        >
                          {affiliateLink ||
                            "https://tagmall.ir/products/id/sharelink?user"}
                        </span>
                        <div className="flex items-center">
                          {/* Copy Icon */}
                          <CopyIcon size={20} />
                          {/* Border */}
                          <div className="border-r-2 border-gray-200 lg:border-white h-6 mx-[14px]" />
                          {/* Download Icon */}
                          <button
                            type="button"
                            onClick={handleDownloadImage}
                            className="cursor-pointer"
                            aria-label="دانلود تصویر"
                          >
                            <DownloadIcon size={20} />
                          </button>
                        </div>
                      </div>
                      {/* Share Icon */}
                      <button
                        type="button"
                        className="lg:hidden flex items-center justify-center shrink-0 bg-white rounded-lg w-10 h-10 cursor-pointer -ml-1"
                        onClick={() =>
                          isDesktop
                            ? setShareChatOpen(true)
                            : setSharePlatformsOpen(true)
                        }
                        aria-label="اشتراک گذاری"
                      >
                        <ExternalLinkIcon size={20} />
                      </button>
                      {/* Desktop share button */}
                      <button className="w-full hidden lg:flex justify-center items-center gap-4 py-2 rounded-xl bg-white text-lg text-primary">
                        <ExternalLinkIcon size={20} />
                        اشتراک گذاری
                      </button>
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

      {/* Fullscreen Image - drawer on mobile, overlay on desktop */}
      {isDesktop ? (
        isFullScreen && (
          <div className="fixed inset-0 z-200 bg-gray-200 backdrop-blur-sm flex flex-col">
            {productName && (
              <h2 className="font-extralight text-center text-primary text-base mt-4 mb-4 px-[10px] shrink-0">
                {productName}
              </h2>
            )}

            <div className="flex-1 px-[10px] mt-[80px]">
              <div className="relative rounded-lg overflow-hidden w-full h-full">
                <Image
                  src={cooperationImage}
                  fill
                  alt="Partnership Fullscreen"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 items-end px-[10px] pb-7 mt-12">
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="cursor-pointer ml-[15px]"
                aria-label="بستن تمام صفحه"
              >
                <SmallScreenIcon size={24} />
              </button>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="w-full rounded-full bg-white text-primary border-2 border-primary py-2 flex items-center justify-center gap-5"
              >
                <DownloadIcon size={20} />
                دریافت محتوا
              </button>
            </div>
          </div>
        )
      ) : (
        <Drawer open={isFullScreen} onOpenChange={setIsFullScreen}>
          <DrawerContent
            className="z-100! h-[96%]! overflow-hidden flex flex-col bg-gray-200"
            overlayClassName="z-100 lg:hidden"
          >
            {productName && (
              <h2 className="font-extralight text-center text-primary text-base mt-4 mb-4 px-[10px] shrink-0">
                {productName}
              </h2>
            )}

            <div className="flex-1 min-h-0 px-[10px] mt-8">
              <div className="relative rounded-lg overflow-hidden w-full h-full">
                <Image
                  src={cooperationImage}
                  fill
                  alt="Partnership Fullscreen"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 items-end px-[10px] pb-7 mt-8 shrink-0">
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="cursor-pointer ml-[15px]"
                aria-label="بستن تمام صفحه"
              >
                <SmallScreenIcon size={24} />
              </button>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="w-full rounded-full bg-white text-primary border-2 border-primary py-2 flex items-center justify-center gap-5"
              >
                <DownloadIcon size={20} />
                دریافت محتوا
              </button>
            </div>
          </DrawerContent>
        </Drawer>
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

      {isDesktop ? (
        shareChatOpen && (
          <div className="fixed inset-0 z-1000 bg-white h-screen">
            <PartnershipShareChat
              setIsOpen={setShareChatOpen}
              isContributor={isContributor}
              affiliateLink={affiliateLink}
              socialPlatforms={socialPlatforms}
            />
          </div>
        )
      ) : (
        <Drawer open={shareChatOpen} onOpenChange={setShareChatOpen}>
          <DrawerContent
            className="z-100! h-[96%]!"
            overlayClassName="z-100 lg:hidden"
          >
            <PartnershipShareChat
              setIsOpen={setShareChatOpen}
              isContributor={isContributor}
              affiliateLink={affiliateLink}
              socialPlatforms={socialPlatforms}
            />
          </DrawerContent>
        </Drawer>
      )}

      {/* Drawer پلتفرم‌های اشتراک‌گذاری — فقط موبایل */}
      <Drawer open={sharePlatformsOpen} onOpenChange={setSharePlatformsOpen}>
        <DrawerContent
          className="z-100! px-[10px] h-[96%]! flex flex-col"
          overlayClassName="z-100 lg:hidden"
        >
          {/* عنوان */}
          <h2 className=" font-bold text-primary text-base text-center mt-3 mb-5 shrink-0">
            بسترهای پیشنهادی اشتراک گذاری محتوا
          </h2>

          {/* لیست پلتفرم‌ها */}
          <div className="flex-1 overflow-y-auto scroll-hidden">
            <div className="flex flex-col" style={{ gap: "10px" }}>
              {socialPlatforms.map((platform) => (
                <Link
                  key={platform.name}
                  href={"#"}
                  className="flex items-center justify-center gap-3 w-full py-2 rounded-full border-2 border-gray-200"
                >
                  <span className="text-gray-600 font-bold text-sm">
                    {platform.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* دکمه تجربه کاربران — چسبیده به پایین با فاصله 12px */}
          <div className="shrink-0 pb-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShareChatOpen(true);
              }}
              className="flex items-center justify-center gap-3 w-full py-2 border-2 border-primary rounded-full text-primary font-bold"
            >
              <CommentsIcon size={20} />
              تجربه کاربران
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
