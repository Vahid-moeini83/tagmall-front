"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  CommentsIcon,
  HeartIcon,
  StrokeArrowLeftIcon,
  UserIcon,
} from "@/icons";
import PartnershipPlatformSlider from "./PartnershipPlatformSlider";
import { cn, formatPartnershipRelativeTime } from "@/lib/client/utils";
import {
  mockPartnershipExperiences,
  PARTNERSHIP_CURRENT_USER_ID,
} from "@/lib/client/mockPartnershipExperiences";
import toast from "react-hot-toast";
import { CustomAccordion } from "@/components/ui/accordion";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

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
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformDrawerOpen, setPlatformDrawerOpen] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState([
    "بله",
    "روبیکا",
    "Telegram",
    "YouTube",
    "Instagram",
  ]);

  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const textareaRef = useRef(null);

  const platforms =
    socialPlatforms.length > 0
      ? socialPlatforms
      : [
          { name: "بله", url: "#" },
          { name: "روبیکا", url: "#" },
          { name: "Telegram", url: "#" },
          { name: "YouTube", url: "#" },
          { name: "Instagram", url: "#" },
        ];

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Sync textarea height with comment
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [draft]);

  const toggleAccordion = (id) => {
    setExpandedAccordions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

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

    if (!selectedPlatform) {
      toast.error("ابتدا بستر اشتراک گذاری را انتخاب کنید");
      return;
    }

    const newMessage = {
      id: Date.now(),
      userId: PARTNERSHIP_CURRENT_USER_ID,
      userName: "شما",
      text: trimmed,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      platform: selectedPlatform?.name || null,
    };

    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setSelectedPlatform(null);
    toast.success("تجربه شما ثبت شد");
  };

  const renderMessageBubble = (msg, index, arr) => {
    const isMine = msg.userId === PARTNERSHIP_CURRENT_USER_ID;
    const last = isLastOfGroup(arr, index);

    const bubbleClasses = cn(
      "font-iransans text-justify overflow-hidden rounded-xl text-xs lg:text-sm text-gray-800 w-fit",
      isMine
        ? last
          ? "border-2 border-primary rounded-br-none"
          : "border-2 border-primary"
        : last
          ? "border-2 border-gray-200 rounded-bl-none"
          : "border-2 border-gray-200",
    );

    return (
      <div key={msg.id}>
        <div
          className={cn(
            "flex flex-col w-full",
            isMine ? "items-start" : "items-end",
            isSameSenderAsPrev(arr, index) ? "mt-1" : "mt-6 lg:mt-4",
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
                <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center mb-5.5">
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
                <div className="flex flex-col gap-1 min-w-0">
                  <div className={bubbleClasses}>
                    <p className="font-iransans px-4 leading-10 text-justify wrap-break-word">
                      <span className="font-bold">{msg.userName}:</span>{" "}
                      {msg.text}
                    </p>
                  </div>
                  <span
                    className={`pt-1 text-gray-400 text-xs block text-center`}
                  >
                    {formatPartnershipRelativeTime(msg.createdAt)}
                  </span>
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-3 lg:pt-0 lg:px-[140px] flex flex-col h-full select-none overflow-hidden">
      {/* Header */}
      <div className="lg:fixed lg:top-0 lg:right-0 lg:left-0 lg:pt-10 lg:px-[140px] bg-white z-10">
        <div className="flex items-center justify-between pb-4 lg:pb-2">
          <h2 className="font-iransans font-semibold text-primary text-sm lg:text-lg leading-7 text-center lg:text-start flex-1 px-2 lg:px-0">
            تجربه کاربران از بسترهای اشتراک گذاری محتوا
          </h2>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="lg:pt-24 pb-78 lg:pb-56 overflow-y-auto scroll-hidden flex-1 lg:px-0"
      >
        <div className="flex flex-col">
          {platforms
            .filter((p) => messages.some((m) => m.platform === p.name))
            .map((platform, index, filtered) => {
              const platformMessages = messages.filter(
                (m) => m.platform === platform.name,
              );

              return (
                <div key={platform.name}>
                  <CustomAccordion
                    id={platform.name}
                    expandedItems={expandedAccordions}
                    onToggle={toggleAccordion}
                    customLabel={
                      <div className="w-full text-center">
                        <span className="text-gray-600 font-bold text-base">
                          {platform.name}
                        </span>
                      </div>
                    }
                    containerClassName={
                      index < filtered.length - 1
                        ? "border-b-4 border-gray-200"
                        : ""
                    }
                    triggerClassName="justify-center"
                    iconClassName="left-[25px]!"
                  >
                    <div className="pb-1 px-[10px]">
                      {platformMessages.map((msg, idx) =>
                        renderMessageBubble(msg, idx, platformMessages),
                      )}
                    </div>
                  </CustomAccordion>
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

              <div className="bg-gray-200 rounded-xl p-[5px] flex flex-col gap-2 w-full max-w-[540px]">
                {/* Top bar - clickable to open platform drawer */}
                <div
                  onClick={() => setPlatformDrawerOpen(true)}
                  className="flex items-center justify-center relative pt-2 pb-3"
                >
                  <button className="cursor-pointer">
                    <span className="text-gray-600">
                      {selectedPlatform
                        ? selectedPlatform.name
                        : "بستر اشتراک گذاری محتوا"}
                    </span>
                  </button>
                  <button className="absolute left-[10px] cursor-pointer">
                    <ChevronDownIcon size={20} className="rotate-90" />
                  </button>
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 px-1 bg-white rounded-xl">
                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={
                      selectedPlatform
                        ? `تجربه شما از ${selectedPlatform.name}`
                        : "تجربه شما از ..."
                    }
                    rows={1}
                    className="font-iransans placeholder:text-gray-400 placeholder:text-sm placeholder:text-center placeholder:pr-8 text-gray-600 min-h-12 py-3 px-2 flex-1 bg-transparent border-none outline-none resize-none overflow-hidden leading-6"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={draft.trim().length <= 0}
                      onClick={handleSubmitExperience}
                      className={`font-iransans text-sm transition-colors cursor-pointer ${
                        draft.trim().length > 0
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      ثبت
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform drawer */}
      <Drawer open={platformDrawerOpen} onOpenChange={setPlatformDrawerOpen}>
        <DrawerContent
          className="z-100! px-[10px]! pb-6!"
          overlayClassName="z-100 lg:hidden"
        >
          <h2 className="font-bold text-primary text-base text-center mt-3 mb-5">
            بستر اشتراک گذاری محتوا
          </h2>

          <div className="flex flex-col gap-[10px]">
            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => {
                  setSelectedPlatform(platform);
                  setPlatformDrawerOpen(false);
                }}
                className="flex items-center justify-center w-full py-2 rounded-full border-2 border-gray-200 cursor-pointer"
              >
                <span className="text-gray-600 font-bold text-sm">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
