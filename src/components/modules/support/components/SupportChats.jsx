"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { CloseIcon, SupportIcon } from "@/icons";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { SupportSingleChat } from "..";

function SupportChats({ isMobile = false }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deleteMode, setDeleteMode] = useState(false);
  const [pendingDeletes, setPendingDeletes] = useState([]);
  const [chatItems, setChatItems] = useState([
    {
      id: "s-0",
      name: "واحد پشتیبانی",
      msg: "سلام باشه ممنون از شما...",
      isSupport: true,
    },
    ...[1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
      id: `${i}`,
      name: `آرش ${i}`,
      msg: "سلام باشه ممنون از شما خیلی راضی هستم از کیفیت کار شما",
      isSupport: false,
    })),
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const [imagesSliderRef, imagesSlider] = useKeenSlider({
    vertical: isMobile ? false : true,
    loop: true,
    rtl: true,
    slides: {
      origin: "center",
      perView: isMobile ? 1 : 1.25,
      spacing: 24,
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  const handleBulletPointsClick = (index) => {
    setCurrentSlide(index);
    imagesSlider.current?.moveToIdx(index, true);
  };

  const handleDeleteButtonClick = () => {
    if (deleteMode) {
      handleConfirmDeletes();
    } else {
      setDeleteMode(true);
    }
  };

  const handleDeleteItem = (id) => {
    const deletedItem = chatItems.find((item) => item.id === id);

    setChatItems((prev) => prev.filter((item) => item.id !== id));

    setPendingDeletes((prev) => [...prev, deletedItem]);
  };

  const handleConfirmDeletes = () => {
    setPendingDeletes([]);
    setDeleteMode(false);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Accordion type="single" collapsible defaultValue="chats">
        <AccordionItem value="chats">
          <AccordionTrigger className="hidden lg:flex font-bold! font-iransans text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
            پیام ها
          </AccordionTrigger>

          <AccordionContent className="lg:mt-4 lg:h-[500px] pb-40 lg:pb-0 overflow-hidden">
            <div className="flex flex-col-reverse lg:flex-row gap-2 h-full">
              <div className="flex flex-1 flex-col h-full">
                <div className="flex flex-col gap-1 overflow-y-auto scroll-hidden flex-1 pr-1 mt-2">
                  {chatItems.length > 0 && chatItems[0]?.isSupport && (
                    <div className="flex items-start gap-[6px] lg:gap-3 pb-1 lg:pb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-[14px] border-2 border-gray-200">
                        <SupportIcon size={20} />
                      </div>

                      <div className="flex flex-col lg:gap-6">
                        <div
                          onClick={() => handleOpenChat()}
                          className="font-bold text-gray-600 text-xs lg:text-base"
                        >
                          واحد پشتیبانی
                        </div>

                        <div className="flex items-center gap-1">
                          <p className="font-iransans font-semibold text-gray-600 mb-0! max-w-[180px] line-clamp-1 text-xs lg:text-base">
                            {chatItems[0].msg}
                          </p>
                          <span className="font-bold text-gray-400 text-xs lg:text-base">
                            2 ساعت پیش دریافت شد
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {chatItems
                    .filter((i) => !i.isSupport)
                    .map((item) => (
                      <div key={item.id}>
                        <div className="w-full h-[2px] bg-gray-200 mr-12" />

                        <div className="relative flex items-start gap-[6px] lg:gap-3 pt-2 pb-1 lg:pb-3">
                          <Image
                            src="/assets/images/fallback/avatar.png"
                            width={40}
                            height={40}
                            alt="عکس پروفایل"
                            className="rounded-[14px] bg-gray-200"
                          />

                          <div className="flex flex-col lg:gap-6 lg:pt-2">
                            <div
                              onClick={() => handleOpenChat()}
                              className="font-bold text-gray-600 text-xs lg:text-base cursor-pointer"
                            >
                              {item.name}
                            </div>

                            <div className="flex items-center">
                              <p className="font-iransans font-semibold text-gray-600 mb-0! max-w-[180px] line-clamp-1 text-xs lg:text-base">
                                {item.msg}
                              </p>
                              <span className="font-bold text-gray-400 text-xs lg:text-base">
                                2 ساعت پیش دریافت شد
                              </span>
                            </div>
                          </div>

                          {/* Delete icon */}
                          {deleteMode && (
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="absolute left-[6px] top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                              <CloseIcon />
                            </button>
                          )}
                          {/* Notification */}
                          {!deleteMode && item.id % 3 === 0 && (
                            <div className="absolute left-[6px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-error-medium" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="hidden lg:flex sticky bottom-0 bg-white pt-4 pb-2 justify-center">
                  <button
                    className="text-primary cursor-pointer"
                    onClick={handleDeleteButtonClick}
                  >
                    {deleteMode ? "تایید" : "پاک کردن پیام ها"}
                  </button>
                </div>
              </div>

              <div className="relative flex-1 flex mt-2">
                <div className="keen-slider" ref={imagesSliderRef}>
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className={`relative keen-slider__slide h-[120px] ${
                        item !== currentSlide ? "w-[80%]! mx-auto" : "w-full!"
                      }`}
                    >
                      <Image
                        src="/assets/images/home/sampleMap.jpg"
                        fill
                        alt="تبلیغات"
                        className="rounded-lg"
                        objectFit="cover"
                      />
                    </div>
                  ))}
                </div>
                {/* Bullet navigation */}
                <div className="lg:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10 pointer-events-none">
                  {[0, 1, 2].map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleBulletPointsClick(idx)}
                      className={`h-3 rounded-full transition-all cursor-pointer pointer-events-auto ${
                        currentSlide === idx
                          ? "bg-primary w-5"
                          : "bg-gray-300 w-3 hover:bg-gray-400"
                      }`}
                      aria-label={`اسلاید ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:hidden fixed bottom-17 right-0 left-0 bg-white py-4 flex justify-center items-center">
              <button
                className="text-primary cursor-pointer"
                onClick={handleDeleteButtonClick}
              >
                {deleteMode ? "تایید" : "پاک کردن پیام ها"}
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {isDesktop ? (
        isOpen && (
          <div className="fixed inset-0 z-1000 bg-white h-screen">
            <SupportSingleChat isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        )
      ) : (
        <Drawer open={isOpen} onOpenChange={() => setIsOpen(false)}>
          <DrawerContent
            className="z-100! px-[10px] h-[92vh]!"
            overlayClassName="z-100 lg:hidden"
          >
            <SupportSingleChat isOpen={isOpen} setIsOpen={setIsOpen} />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default SupportChats;
