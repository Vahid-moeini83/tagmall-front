"use client";

import { useState } from "react";
import { SupportIcon, HeartIcon } from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function ProductUserComments() {
  const [likedMessages, setLikedMessages] = useState({});
  const [isOpen, setIsOpen] = useState(true);

  const toggleLike = (id) => {
    setLikedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const qaBoxes = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    question: {
      user: "کاربر",
      message: "آیا این محصول گارانتی دارد؟",
      date: "1 مهر 1404",
      likes: 10,
    },
    answer: {
      user: "فروشنده",
      message: "بله، این محصول دارای گارانتی 18 ماهه می‌باشد.",
      date: "2 مهر 1404",
      likes: 5,
    },
  }));

  return (
    <div
      className={`lg:bg-white lg:rounded-lg py-[10px] lg:px-[100px] ${
        isOpen ? "lg:pt-[50px]" : "lg:py-[50px]"
      }`}
    >
      <Accordion
        type="single"
        collapsible
        defaultValue="comments"
        onValueChange={(value) => setIsOpen(value === "comments")}
      >
        <AccordionItem value="comments">
          <AccordionTrigger className="hidden lg:flex justify-between text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline font-iransans">
            پرسش و پاسخ و دیدگاه کاربران
          </AccordionTrigger>
          <AccordionContent className="mt-4">
            <div className="flex flex-col lg:flex-row items-center gap-[6px] lg:overflow-x-auto pb-26 lg:pb-0">
              {/* Guide Box */}
              <div className="flex gap-[6px] shrink-0 mb-12">
                <div className="flex flex-col justify-between h-auto">
                  <div className="flex items-end gap-2">
                    <div className="border-2 border-white lg:border-primary/20 rounded-t-lg rounded-br-lg px-2 py-[2px] max-w-[175px]">
                      <p className="text-xs font-iransans">
                        <span className="font-bold">راهنما:</span> سوالات خود را
                        در مورد محصول بپرسید
                      </p>
                      <p className="text-xs text-center text-gray-400 mt-2">
                        1 مهر 1404
                      </p>
                    </div>
                    <div className="border-2 border-white lg:border-gray-200 rounded-lg p-[10px]">
                      <SupportIcon size={20} className="text-primary" />
                    </div>
                  </div>
                  <button className="font-iransans fixed lg:static bottom-21 right-[10px] left-[10px] rounded-lg py-4 bg-white text-primary text-center">
                    ثبت دیدگاه یا پرسش
                  </button>
                </div>
                <div className="hidden lg:block w-[2px] h-[200px] bg-gray-200" />
              </div>

              {/* Q&A Boxes */}
              {qaBoxes.map((box, index) => (
                <div
                  key={box.id}
                  className="flex items-center gap-[6px] shrink-0 mb-4 lg:mb-12 w-full lg:w-auto border-b-2 border-white pb-4 lg:pb-0 lg:border-0"
                >
                  <div className="flex flex-col gap-2 w-full lg:w-auto">
                    {/* Question Section (message box on left, heart on right) */}
                    <div className="flex items-center justify-end lg:justify-normal gap-3 lg:gap-[50px]">
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => toggleLike(`q-${box.id}`)}>
                          <HeartIcon
                            size={20}
                            color={
                              likedMessages[`q-${box.id}`]
                                ? "var(--error-color-medium)"
                                : "var(--gray-color-400)"
                            }
                          />
                        </button>
                        <span
                          className={`text-xs ${
                            likedMessages[`q-${box.id}`]
                              ? "text-error-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {box.question.likes}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="border-2 border-gray-400 lg:border-gray-200 rounded-t-lg rounded-br-lg px-2 py-[2px] max-w-[175px]">
                          <p className="text-xs font-iransans">
                            <span className="font-bold">
                              {box.question.user}:
                            </span>{" "}
                            {box.question.message}
                          </p>
                          <p className="text-xs text-center text-gray-400 mt-2">
                            {box.question.date}
                          </p>
                        </div>
                        <button className="font-iransans text-xs text-primary text-center">
                          پاسخ
                        </button>
                      </div>
                    </div>

                    {/* Answer Section (heart on left, message box on right) */}
                    <div className="flex items-center justify-start lg:justify-normal gap-3 lg:gap-[50px]">
                      <div className="flex flex-col gap-2 items-center">
                        <div className="border-2 border-gray-300 rounded-t-lg rounded-bl-lg px-2 py-[2px] max-w-[175px]">
                          <p className="text-xs font-iransans">
                            <span className="font-bold">
                              {box.answer.user}:
                            </span>{" "}
                            {box.answer.message}
                          </p>
                          <p className="text-xs text-center text-gray-400 mt-2">
                            {box.answer.date}
                          </p>
                        </div>
                        <button className="text-xs text-primary font-iransans">
                          پاسخ
                        </button>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => toggleLike(`a-${box.id}`)}>
                          <HeartIcon
                            size={20}
                            color={
                              likedMessages[`a-${box.id}`]
                                ? "var(--error-color-medium)"
                                : "var(--gray-color-400)"
                            }
                          />
                        </button>
                        <span className="text-xs text-gray-400">
                          {box.answer.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < qaBoxes.length - 1 && (
                    <div className="w-[2px] h-[200px] bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
