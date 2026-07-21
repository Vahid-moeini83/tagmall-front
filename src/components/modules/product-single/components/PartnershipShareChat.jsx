"use client";

import { useEffect, useRef, useState } from "react";
import { HeartIcon, StrokeArrowLeftIcon, UserIcon } from "@/icons";
import PartnershipPlatformSlider from "./PartnershipPlatformSlider";
import { cn } from "@/lib/client/utils";
import {
  mockPartnershipExperiences,
  PARTNERSHIP_CURRENT_USER_ID,
} from "@/lib/client/mockPartnershipExperiences";
import toast from "react-hot-toast";

function formatDateLabel(dateInput) {
  const today = new Date();
  const messageDate = new Date(dateInput);

  const diffTime =
    today.setHours(0, 0, 0, 0) - new Date(messageDate).setHours(0, 0, 0, 0);
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return "امروز";
  if (diffDays === 1) return "دیروز";

  return messageDate.toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
  });
}

function formatMessageTime(dateInput) {
  return new Date(dateInput).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isLastOfGroup(messages, index) {
  const current = messages[index];
  const next = messages[index + 1];
  return !next || next.userId !== current.userId;
}

function isSameSenderAsPrev(messages, index) {
  if (index === 0) return false;
  return messages[index].userId === messages[index - 1].userId;
}

export default function PartnershipShareChat({
  setIsOpen,
  isContributor = false,
  affiliateLink,
  socialPlatforms = [],
}) {
  const [messages, setMessages] = useState(mockPartnershipExperiences);
  const [likedMessages, setLikedMessages] = useState(() =>
    Object.fromEntries(
      mockPartnershipExperiences.map((item) => [item.id, item.isLiked]),
    ),
  );
  const [draft, setDraft] = useState("");

  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleLike = (messageId) => {
    const wasLiked = likedMessages[messageId];

    setLikedMessages((prev) => ({
      ...prev,
      [messageId]: !wasLiked,
    }));

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, likes: wasLiked ? msg.likes - 1 : msg.likes + 1 }
          : msg,
      ),
    );
  };

  const handleSubmitExperience = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const newMessage = {
      id: Date.now(),
      userId: PARTNERSHIP_CURRENT_USER_ID,
      userName: "شما",
      text: trimmed,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
    toast.success("تجربه شما ثبت شد");
  };

  return (
    <div className="pt-2 lg:pt-0 px-[5px] lg:px-[140px] flex flex-col h-full select-none overflow-hidden">
      {/* Header */}
      <div className="lg:fixed lg:top-0 lg:right-0 lg:left-0 lg:pt-10 lg:px-[140px] bg-white z-10">
        <div className="flex items-center justify-between lg:pb-2">
          <h2 className="font-iransans font-semibold text-primary text-sm lg:text-lg leading-7 text-center lg:text-start flex-1 px-2 lg:px-0">
            تجربه کاربران از بسترهای به اشتراک گذاری محتوا
          </h2>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="lg:pt-24 pb-78 lg:pb-56 overflow-y-auto scroll-hidden flex-1 lg:px-0"
      >
        <div className="flex flex-col">
          {messages.map((msg, index) => {
            const isMine = msg.userId === PARTNERSHIP_CURRENT_USER_ID;
            const currentDateLabel = formatDateLabel(msg.createdAt);
            const prevDateLabel =
              index > 0
                ? formatDateLabel(messages[index - 1].createdAt)
                : null;
            const showDateSeparator = currentDateLabel !== prevDateLabel;
            const last = isLastOfGroup(messages, index);

            const bubbleClasses = cn(
              "font-iransans text-justify overflow-hidden rounded-lg text-xs lg:text-sm text-gray-800 w-fit",
              isMine
                ? last
                  ? "border-2 border-gray-400 rounded-br-none"
                  : "border-2 border-gray-400"
                : last
                  ? "border-2 border-gray-200 rounded-bl-none"
                  : "border-2 border-gray-200",
            );

            return (
              <div key={msg.id}>
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <div className="bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full">
                      {currentDateLabel}
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "flex flex-col w-full",
                    isMine ? "items-start" : "items-end",
                    isSameSenderAsPrev(messages, index)
                      ? "mt-1"
                      : "mt-6 lg:mt-4",
                  )}
                >
                  <div
                    className={cn(
                      "flex gap-[5px] max-w-[80%] lg:max-w-[40%]",
                      isMine ? "flex-row" : "flex-row-reverse",
                      !last ? (isMine ? "mr-[50px]" : "ml-[50px]") : "",
                    )}
                  >
                    {last && (
                      <div className="flex items-end">
                        <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center mb-4">
                          <UserIcon size={20} />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1 min-w-0">
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          !isMine && "flex-row-reverse",
                        )}
                      >
                        <div className={bubbleClasses}>
                          <p className="font-iransans px-4 leading-10 text-justify wrap-break-word">
                            <span className="font-bold">{msg.userName}:</span>{" "}
                            {msg.text}
                          </p>
                        </div>

                        {!isMine && (
                          <div className="flex flex-col items-center justify-center gap-1 shrink-0 self-center">
                            <button
                              type="button"
                              onClick={() => toggleLike(msg.id)}
                              aria-label="لایک"
                              className="cursor-pointer"
                            >
                              <HeartIcon
                                size={20}
                                filled={likedMessages[msg.id]}
                                color="var(--gray-color-400)"
                              />
                            </button>
                            <span
                              className={cn(
                                "text-xs leading-none",
                                likedMessages[msg.id]
                                  ? "text-error-medium"
                                  : "text-gray-400",
                              )}
                            >
                              {msg.likes}
                            </span>
                          </div>
                        )}
                      </div>

                      <span className="font-iransans text-gray-400 text-xs text-center">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={lastMessageRef} />
      </div>

      {/* Footer */}
      <div
        className="fixed right-0 left-0 bottom-0 flex items-end gap-4 lg:items-center lg:justify-center px-[10px] lg:px-[140px] pt-2 lg:pt-4 pb-6 lg:pb-12 bg-white"
        data-vaul-no-drag
      >
        <div className="flex items-end gap-1 flex-1 w-full">
          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="relative flex items-center justify-center gap-4 lg:gap-1 w-full">
              <StrokeArrowLeftIcon
                size={20}
                onClick={() => setIsOpen(false)}
                className="hidden lg:inline absolute bottom-16 right-16 rotate-180 cursor-pointer"
              />

              {isContributor ? (
                <div className="relative rounded-t-md rounded-bl-md bg-gray-200 overflow-hidden w-full max-w-[540px]">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmitExperience();
                      }
                    }}
                    placeholder="تجربه خود را بنویسید ..."
                    className="font-iransans placeholder:text-gray-400 text-gray-600 h-14 lg:h-12 pr-3 pl-16 w-full outline-none bg-transparent"
                  />
                  {draft.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={handleSubmitExperience}
                      className="absolute left-3 top-1/2 -translate-y-1/2 font-iransans text-primary cursor-pointer"
                    >
                      ثبت
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-none lg:max-w-[540px] -mx-[10px] lg:mx-0">
                  <PartnershipPlatformSlider
                    platforms={socialPlatforms}
                    affiliateLink={affiliateLink}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
