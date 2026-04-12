"use client";

import {
  MoreSquareIcon,
  StrokeArrowLeftIcon,
  SupportIcon,
  UserIcon,
} from "@/icons";
import { useEffect, useRef, useState } from "react";

const recommendedMessages = [
  {
    id: 1,
    messgae: "زمان تحویل سفارش من حدودا چه قدر است؟",
  },
  {
    id: 2,
    messgae: "چگونه میتوانم سفارشی را بازگردانده یا مرجوع کنم؟",
  },
  {
    id: 3,
    messgae: "شرایط بازگردانی یا مرجوع کردن سفارش چگونه است؟",
  },
];

function SupportSingleChat({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "سلام، یه سوال در مورد پیگیری سفارش داشتم.",
      sender: "user",
      date: "۱ مهر ۱۴۰۴",
      time: "۱۳:۴۵",
    },
    {
      id: 2,
      text: "بفرمایید، کد سفارش رو لطفاً ارسال کنید تا براتون چک کنم.",
      sender: "support",
      date: "۱ مهر ۱۴۰۴",
      time: "۱۳:۴۶",
    },
  ]);
  const [message, setMessage] = useState("");

  const lastMessageRef = useRef(null);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      date: "۱ مهر ۱۴۰۴",
      time: new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="lg:px-[140px] flex flex-col h-screen">
      {/* Header */}
      <div className="lg:fixed lg:top-0 lg:right-0 lg:left-0 lg:pt-10 lg:px-[140px] bg-white z-10">
        <div className="flex items-center justify-between border-b-2 border-gray-200 lg:border-0 pb-4 lg:pb-2">
          <div className="flex items-center gap-1">
            <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[14px] border-2 border-gray-200">
              <SupportIcon size={20} />
            </div>
            <span className="hidden lg:inline font-iransans font-semibold! text-primary text-lg">
              واحد پشتیبانی
            </span>
            <span className="inline lg:hidden font-iransans font-semibold! text-primary text-lg">
              ارسال پیام به واحد پشتیبانی
            </span>
          </div>
          <span className="hidden lg:block">icon</span>
          <MoreSquareIcon className="block ml-2 lg:hidden" size={20} />
        </div>
      </div>

      {/* Chat content */}
      <div className="pt-4 lg:pt-24 pb-70 lg:pb-56 overflow-y-auto scroll-hidden">
        <div className="flex flex-col gap-6 lg:gap-4">
          <div className="flex w-full justify-end">
            <div className="flex items-end gap-2 max-w-[80%] lg:max-w-[40%] flex-row-reverse">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <SupportIcon size={20} />
                </div>
              </div>
              <div className="font-iransans px-4 py-2 rounded-lg text-xs lg:text-sm leading-10 w-full wrap-break-word text-gray-800 border-2 border-gray-200 rounded-bl-none">
                سلام با افتخار به شما خوش آمد میگویم. در سامانه پشتیبانی، تمرکز
                ما ایجاد تجربه ای بی نظیر برای شماست؛ شما میتوانید از این قسمت
                با ما در تعامل باشید و سوالات خود را مطرح کنید و اطلاعات بیشتری
                در رابطه با محصولات و خدمات مختلف بدست آورید.
              </div>
            </div>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 w-full ${
                msg.sender === "user" ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] lg:max-w-[40%] ${
                  msg.sender === "user" ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Profile or Icon */}
                <div className="flex items-end">
                  <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                    {msg.sender === "support" ? (
                      <SupportIcon size={20} />
                    ) : (
                      <UserIcon size={20} />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {/* Text */}
                  <div
                    className={`font-iransans px-4 rounded-lg text-xs lg:text-sm text-gray-800 leading-10 w-full wrap-break-word ${
                      msg.sender === "user"
                        ? "border-2 border-gray-400 rounded-br-none"
                        : "border-2 border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* Date and Time */}
                  <div className={`w-full flex flex-col gap-1 text-center`}>
                    <span className="font-iransans text-gray-400 text-sm">
                      {msg.date}
                    </span>
                    <span className="hidden lg:inline font-iransans text-gray-400 text-sm">
                      {msg.time}
                    </span>
                  </div>
                </div>
                <div className="flex lg:hidden items-center">
                  <span className="font-iransans text-gray-400 text-sm">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={lastMessageRef} />
      </div>

      {/* Chat box */}
      <div className="fixed right-0 left-0 bottom-0 flex items-end gap-4 lg:items-center lg:justify-center px-[10px] lg:px-[140px] pt-2 lg:pt-4 pb-6 lg:pb-12 bg-white">
        <div className="flex items-end gap-1 flex-1">
          <div className="flex flex-col gap-3 flex-1">
            <div className="space-y-5">
              {recommendedMessages.map((item) => (
                <p
                  key={item.id}
                  onClick={() => handleSendMessage(item.messgae)}
                  className="font-iransans font-semibold text-primary text-center cursor-pointer text-xs lg:text-sm"
                >
                  {item.messgae}
                </p>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 lg:gap-1">
              <StrokeArrowLeftIcon
                size={24}
                onClick={() => setIsOpen(false)}
                className="hidden lg:inline absolute bottom-16 right-16 rotate-180 cursor-pointer"
              />

              <div className="relative rounded-t-md rounded-bl-md overflow-hidden w-full max-w-[540px]">
                <input
                  type="text"
                  placeholder="پیام ..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendMessage(message)
                  }
                  className="font-iransans placeholder:text-gray-400 text-gray-600 bg-gray-200 h-14 lg:h-12 pr-2 pl-14 w-full outline-none"
                />
                {message.trim().length > 0 && (
                  <button
                    onClick={() => handleSendMessage(message)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 font-iransans text-primary cursor-pointer"
                  >
                    ارسال
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportSingleChat;
