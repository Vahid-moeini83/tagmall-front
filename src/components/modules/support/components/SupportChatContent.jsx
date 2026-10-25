"use client";

import {
  MoreSquareIcon,
  CheckCircleIcon,
  GalleryIcon,
  CloseIcon,
  StrokeArrowLeftIcon,
  SupportIcon,
  UserIcon,
} from "@/icons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

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

function SupportChatContent({ variant = "default", contact, onBack }) {
  const router = useRouter();

  // Sample messages
  const [messages, setMessages] = useState(
    variant === "seller"
      ? [
          {
            id: 1,
            text: "زمان تحویل سفارش من حدوداً چه‌قدر است؟",
            sender: "user",
            date: "۱ فروردین ۱۴۰۵",
            time: "۱۲:۰۴",
            isRead: true,
          },
        ]
      : [
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
        ],
  );

  const [message, setMessage] = useState("");
  const lastMessageRef = useRef(null);
  const fileInputRef = useRef(null);
  const attachmentUrlsRef = useRef([]);
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");

  const handleGoBack = () => {
    router.back();
  };

  const handleSendMessage = (message) => {
    if (!message.trim() && !attachment) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      date: "۱ مهر ۱۴۰۴",
      time: new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ...(attachment ? { attachment } : {}),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setAttachment(null);
  };

  useEffect(() => {
    if (variant === "seller" && messages.length === 1) return;
    lastMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: variant === "seller" ? "nearest" : "start",
    });
  }, [messages, variant]);

  useEffect(
    () => () => {
      attachmentUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setAttachmentError("یک تصویر با حجم کمتر از ۱۰ مگابایت انتخاب کنید.");
      return;
    }
    const url = URL.createObjectURL(file);
    attachmentUrlsRef.current.push(url);
    setAttachment({ url, name: file.name });
    setAttachmentError("");
  };

  // The seller variant shares the composer state without changing the public chat.
  if (variant === "seller") {
    const isSupport = !contact || contact.isSupport;
    return (
      <section
        dir="rtl"
        aria-label="گفتگوی انتخاب‌شده"
        className="flex h-full min-w-0 flex-1 flex-col gap-3 bg-surface-soft bg-pattern-diagonal-fine font-extralight text-text-secondary"
      >
        <header className="flex h-[88px] shrink-0 items-center gap-2 bg-surface px-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="بازگشت به فهرست پیام‌ها"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-primary lg:hidden"
            >
              <StrokeArrowLeftIcon size={20} className="rotate-180" />
            </button>
          )}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src={
                isSupport
                  ? "/assets/images/logo/small-logo.svg"
                  : contact.image || "/assets/images/seller/avatar.png"
              }
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h1 className="truncate text-body text-primary">
              {contact?.name || "واحد پشتیبانی"}
            </h1>
            <p className="text-small text-text-secondary">
              معمولاً کمتر از ۱۰ دقیقه پاسخ می‌دهد
            </p>
          </div>
        </header>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-8 lg:px-12"
          aria-label="پیام‌های گفتگو"
          role="log"
          aria-live="polite"
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <span className="w-[129px] rounded-pill bg-border-default px-3 py-1 text-center text-body">
                ۱ فروردین ۱۴۰۵
              </span>
            </div>
            <div dir="ltr" className="flex items-start gap-3">
              <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-surface">
                <Image
                  src="/assets/images/logo/small-logo.svg"
                  alt="واحد پشتیبانی"
                  width={22}
                  height={22}
                />
              </div>
              <div className="flex min-w-0 flex-1 items-end gap-2">
                <p
                  dir="rtl"
                  className="max-w-[430px] rounded-xl rounded-bl-sm bg-surface p-4 text-right text-body ring-1 ring-inset ring-border-default lg:w-[430px]"
                >
                  سلام، با افتخار به شما خوش آمد می‌گوییم. در سامانه
                  <br className="hidden lg:block" /> پشتیبانی، تمرکز ما ایجاد
                  تجربه‌ای روشن و سریع برای
                  <br className="hidden lg:block" /> شماست. سوالات خود را
                  همین‌جا مطرح کنید.
                </p>
                <time dir="rtl" className="shrink-0 text-body text-text-muted">
                  ۱۲:۰۰
                </time>
              </div>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <Image
                  src="/assets/images/seller/avatar.png"
                  alt="آرمان میمندی نژاد"
                  width={40}
                  height={40}
                  className="mt-[5px] h-10 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-col items-start gap-2">
                  <div className="flex max-w-full items-end gap-3">
                    <div
                      className={`min-w-0 max-w-[430px] rounded-xl rounded-br-sm bg-primary px-4 py-3 text-body text-white ${msg.id === 1 ? "lg:w-[324px]" : ""}`}
                    >
                      {msg.attachment && (
                        <Image
                          src={msg.attachment.url}
                          alt={msg.attachment.name}
                          width={280}
                          height={180}
                          unoptimized
                          className="mb-2 max-h-52 w-full rounded-md object-contain"
                        />
                      )}
                      {msg.text && <p className="wrap-anywhere">{msg.text}</p>}
                    </div>
                    <time className="shrink-0 text-body text-text-muted">
                      {msg.time}
                    </time>
                  </div>
                  <div className="flex h-5 items-center gap-2 text-caption text-text-muted">
                    {msg.isRead ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="relative block h-5 w-5"
                        >
                          <CheckCircleIcon
                            size={32}
                            className="absolute -left-2 -top-1.5 [&>path:first-child]:hidden"
                          />
                          <CheckCircleIcon
                            size={32}
                            className="absolute -left-1 -top-1.5 [&>path:first-child]:hidden"
                          />
                        </span>
                        <span>خوانده شده</span>
                        <span className="text-text-disabled">۱ دقیقه پیش</span>
                      </>
                    ) : (
                      <span>ارسال شد</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={lastMessageRef} />
          </div>
        </div>

        <footer className="relative flex shrink-0 flex-col gap-2 pb-6 pr-4 lg:pr-6">
          <div className="flex h-[42px] items-center gap-2 overflow-x-auto">
            {["شرایط مرجوعی", "پیگیری وضعیت سفارش"].map((text, index) => (
              <button
                key={text}
                type="button"
                onClick={() => handleSendMessage(text)}
                className={`h-[42px] shrink-0 rounded-pill border border-border-default bg-surface px-3 py-2 text-body transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary ${index === 0 ? "w-[122px]" : "w-[186px]"}`}
              >
                {text}
              </button>
            ))}
          </div>
          {(attachment || attachmentError) && (
            <div className="absolute bottom-full right-6 mb-2 flex max-w-full items-center gap-2 rounded-md bg-surface p-2 text-small shadow-card">
              {attachment && (
                <>
                  <Image
                    src={attachment.url}
                    alt="پیش‌نمایش پیوست"
                    width={44}
                    height={44}
                    unoptimized
                    className="h-11 w-11 rounded-md object-cover"
                  />
                  <span className="max-w-40 truncate">{attachment.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    aria-label="حذف پیوست"
                  >
                    <CloseIcon size={18} />
                  </button>
                </>
              )}
              {attachmentError && (
                <p role="alert" className="text-error">
                  {attachmentError}
                </p>
              )}
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage(message);
            }}
            className="flex h-[60px] items-center gap-3 rounded-xl bg-surface px-3 ring-1 ring-inset ring-border-default focus-within:ring-primary"
          >
            <Input
              variant="plain"
              aria-label="متن پیام"
              placeholder="پیام خود را بنویسید..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              containerClassName="min-w-0 flex-1"
              className="border-0 bg-transparent px-0 text-body text-text-primary placeholder:text-text-disabled"
              autoComplete="off"
            />
            {(message.trim() || attachment) && (
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-small text-white"
              >
                ارسال
              </button>
            )}
            <button
              type="button"
              aria-label="پیوست تصویر"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-subtle hover:bg-surface-muted"
            >
              <GalleryIcon size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAttachment}
              className="hidden"
              aria-label="انتخاب تصویر پیوست"
            />
          </form>
        </footer>
      </section>
    );
  }

  return (
    <div className="px-[10px] lg:px-[140px]">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 pt-4 lg:pt-10 px-[10px] lg:px-[140px] bg-white z-10">
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
      <div className="pt-20 lg:pt-24 pb-54 lg:pb-56 overflow-y-auto">
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
                className={`flex gap-2 max-w-[80%] lg:max-w-[40%] ${
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
                <div className="flex items-center">
                  <span className="inline lg:hidden font-iransans text-gray-400 text-sm">
                    {msg.time}
                  </span>
                </div>
              </div>

              {/* Date and Time */}
              <div
                className={`w-full flex flex-col gap-1 max-w-[80%] lg:max-w-[40%] ${msg.sender === "user" ? "text-right pr-13" : "text-left pl-13"}`}
              >
                <span className="font-iransans text-gray-400 text-sm">
                  {msg.date}
                </span>
                <span className="hidden lg:inline font-iransans text-gray-400 text-sm">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div ref={lastMessageRef} />
      </div>

      {/* Chat box */}
      <div className="fixed right-0 left-0 bottom-0 flex items-end gap-4 lg:items-center lg:justify-center px-[10px] lg:px-[140px] pt-4 pb-6 lg:pb-12 bg-white">
        <div className="flex items-end gap-1 flex-1">
          <div className="flex flex-col gap-3 flex-1">
            <div className="space-y-5">
              {recommendedMessages.map((item) => (
                <p
                  key={item.id}
                  onClick={() => handleSendMessage(item.messgae)}
                  className="font-iransans font-semibold text-primary text-center cursor-pointer text-sm"
                >
                  {item.messgae}
                </p>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 lg:gap-1">
              <StrokeArrowLeftIcon
                size={20}
                onClick={handleGoBack}
                className="lg:absolute lg:bottom-16 lg:right-16 rotate-180 cursor-pointer"
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

export default SupportChatContent;
