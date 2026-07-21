"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  CloseSquareIcon,
  MoreSquareIcon,
  StrokeArrowLeftIcon,
  SupportIcon,
  UserIcon,
} from "@/icons";
import { ScanLineIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import MessageContextMenu from "@/components/ui/MessageContextMenu";
import {
  getConversationMessages,
  getPresetMessages,
  sendMessage,
  deleteMessage,
} from "@/lib/server/actions/support";
import usePublicStore from "@/app/store/publicStore";
import { getToken, getUser } from "@/lib/server/cookies";
import toast from "react-hot-toast";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import { ChatSkeleton } from "@/components/ui/loading";

function SupportSingleChat({ setIsOpen, conversation }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showRecommended, setShowRecommended] = useState(true);
  const [recommendedMessages, setRecommendedMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [visibleDate, setVisibleDate] = useState("");
  const [showSticky, setShowSticky] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [activeTriggerElement, setActiveTriggerElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [isReported, setIsReported] = useState(false);
  const [editMsg, setEditMsg] = useState(null); // پیامی که در حال ویرایش است
  const [reportMsg, setReportMsg] = useState(null); // پیامی که گزارش داده می‌شه

  const otherUserDisplayName = conversation?.isSupport
    ? "واحد پشتیبانی"
    : `${conversation?.other_user?.name} ${conversation?.other_user?.family}`;

  const stickyTimeoutRef = useRef(null);
  const lastMessageRef = useRef(null);
  const messageRefs = useRef({});
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const triggerRefs = useRef({});
  const textareaRef = useRef(null);
  const imageLongPressTimerRef = useRef(null);
  const imageLongPressTriggeredRef = useRef(false);

  const IMAGE_LONG_PRESS_MS = 500;

  const fetchMessages = async () => {
    const token = await getToken();
    if (!token || !conversation?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { messagesRes, messagesErr } = await getConversationMessages(
      token,
      conversation?.id,
    );

    if (messagesRes) {
      const formattedMessages = messagesRes.data.map((msg) => {
        const sender = msg.is_mine ? "user" : "support";
        const hasAttachment = msg.attachments && msg.attachments.length > 0;
        const type = hasAttachment ? "image" : "text";
        const imageUrl = hasAttachment ? msg.attachments[0] : null;

        let replyToData = null;
        if (msg.reply_to) {
          replyToData = {
            id: msg.reply_to.id,
            text: msg.reply_to.body || "پیام",
          };
        }

        return {
          id: msg.id,
          sender: sender,
          text: msg.body || (hasAttachment ? "فایل پیوست شده" : ""),
          date: new Date(msg.created_at),
          type: type,
          image: imageUrl,
          replyTo: replyToData,
          is_read: msg.is_read,
          read_at: msg.read_at,
          attachments: msg.attachments,
        };
      });

      setMessages(formattedMessages);
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (messagesErr) {
      toast.error("خطا در دریافت پیام های گفت‌و‌گو");
    }

    setLoading(false);
  };

  const fetchPresetMessages = async () => {
    const token = await getToken();
    const cookieUser = await getUser();

    if (!token || !cookieUser) return;

    const otherUserId = conversation?.other_user?.id;
    const { presetMessagesRes, presetMessagesErr } = await getPresetMessages(
      token,
      otherUserId,
    );

    if (presetMessagesRes) {
      // Transform API data to component format - استفاده از فیلد question
      const formattedMessages = presetMessagesRes.data.map((msg, index) => ({
        id: msg.id || index + 1,
        question: msg.question || "",
        answer: msg.answer || "",
        sort_order: msg.sort_order || index,
      }));

      // مرتب‌سازی بر اساس sort_order
      const sortedMessages = formattedMessages.sort(
        (a, b) => a.sort_order - b.sort_order,
      );
      setRecommendedMessages(sortedMessages);
    } else if (presetMessagesErr) {
      // Keep default messages if API fails
      setRecommendedMessages([]);
    }
  };

  const handleRecommendedMessageClick = async (recommendedItem) => {
    await handleSendMessage(recommendedItem.question);

    // Show the answer
    setTimeout(async () => {
      const token = await getToken();
      if (!token) {
        toast.error("لطفاً وارد حساب کاربری خود شوید");
        return;
      }

      const formData = new FormData();
      formData.append("body", recommendedItem.answer);

      const { sendMessageRes, sendMessageErr } = await sendMessage(
        token,
        conversation?.id,
        formData,
      );

      if (sendMessageErr) {
        toast.error("خطا در ارسال پاسخ");
        return;
      }

      const newSupportMsg = {
        id: sendMessageRes.data?.id || Date.now(),
        sender: "support",
        text: recommendedItem.answer,
        date: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, newSupportMsg]);
      setShowRecommended(false);
    }, 1000);
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const token = await getToken();
    if (!token) {
      toast.error("لطفاً وارد حساب کاربری خود شوید");
      return;
    }

    const formData = new FormData();
    formData.append("body", messageText);

    if (replyTo) {
      formData.append("reply_to_id", replyTo.id);
    }

    const { sendMessageRes, sendMessageErr } = await sendMessage(
      token,
      conversation?.id,
      formData,
    );

    if (sendMessageErr) {
      toast.error("خطا در ارسال پیام");
      return;
    }

    const newMsg = {
      id: sendMessageRes.data?.id || messages.length + 1,
      sender: "user",
      text: messageText,
      date: new Date(),
      type: "text",
      ...(replyTo && { replyTo: { id: replyTo.id, text: replyTo.text } }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
    setReplyTo(null);
    setShowRecommended(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = await getToken();
    if (!token) {
      toast.error("لطفاً وارد حساب کاربری خود شوید");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از 10 مگابایت باشد");
      e.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "video/mp4",
      "audio/mp3",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("فرمت فایل مجاز نیست");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("attachments[]", file);

    if (message.trim()) {
      formData.append("body", message);
    }

    if (replyTo) {
      formData.append("reply_to_id", replyTo.id);
    }

    const { sendMessageRes, sendMessageErr } = await sendMessage(
      token,
      conversation?.id,
      formData,
    );

    if (sendMessageErr) {
      toast.error("خطا در ارسال فایل");
      e.target.value = "";
      return;
    }

    const newMsg = {
      id: sendMessageRes.data?.id || messages.length + 1,
      sender: "user",
      text: message.trim() || "فایل ارسال شد",
      date: new Date(),
      type: "image",
      image:
        sendMessageRes.data?.attachments?.[0]?.url || URL.createObjectURL(file),
      ...(replyTo && { replyTo: { id: replyTo.id, text: replyTo.text } }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
    setReplyTo(null);
    setShowRecommended(false);
    e.target.value = "";
  };

  const isLastOfGroup = (messages, index) => {
    const current = messages[index];
    const next = messages[index + 1];
    if (!next || next.sender !== current.sender) return true;
    // اگه تاریخ پیام بعدی فرق داشت، این پیام آخر گروهه
    if (formatDateLabel(current.date) !== formatDateLabel(next.date))
      return true;
    return false;
  };

  const isSameSenderAsPrev = (messages, index) => {
    if (index === 0) return false;
    const current = messages[index];
    const prev = messages[index - 1];
    if (current.sender !== prev.sender) return false;
    // اگه تاریخ با پیام قبلی فرق داشت، گروه جدیده
    if (formatDateLabel(current.date) !== formatDateLabel(prev.date))
      return false;
    return true;
  };

  const scrollToMessage = (id) => {
    const element = messageRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const formatDateLabel = (dateString) => {
    const today = new Date();
    const messageDate = new Date(dateString);

    const diffTime =
      today.setHours(0, 0, 0, 0) - new Date(messageDate).setHours(0, 0, 0, 0);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "امروز";
    if (diffDays === 1) return "دیروز";

    return messageDate.toLocaleDateString("fa-IR", {
      day: "numeric",
      month: "long",
    });
  };

  const handleOpenMenu = (e, msg) => {
    e.preventDefault();
    e.stopPropagation();

    if (contextMenuOpen && activeMessageId === msg.id) {
      handleCloseMenu();
      return;
    }

    setContextMenuOpen(true);
    setActiveMessageId(msg.id);
    setActiveTriggerElement(triggerRefs.current[msg.id]);
  };

  const openImageContextMenu = (msg) => {
    if (contextMenuOpen && activeMessageId === msg.id) {
      handleCloseMenu();
      return;
    }

    setContextMenuOpen(true);
    setActiveMessageId(msg.id);
    setActiveTriggerElement(triggerRefs.current[msg.id]);
  };

  const clearImageLongPress = () => {
    if (imageLongPressTimerRef.current) {
      clearTimeout(imageLongPressTimerRef.current);
      imageLongPressTimerRef.current = null;
    }
  };

  const startImageLongPress = (msg) => {
    if (msg.type !== "image") return;

    imageLongPressTriggeredRef.current = false;
    clearImageLongPress();
    imageLongPressTimerRef.current = setTimeout(() => {
      imageLongPressTriggeredRef.current = true;
      openImageContextMenu(msg);
    }, IMAGE_LONG_PRESS_MS);
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleCloseMenu = () => {
    setContextMenuOpen(false);
    setActiveMessageId(null);
    setActiveTriggerElement(null);
  };

  const handleDeleteMessage = async (messageId) => {
    const token = await getToken();
    if (!token) {
      toast.error("لطفاً وارد حساب کاربری خود شوید");
      handleCloseMenu();
      return;
    }

    setDeletingMessageId(messageId);

    const { deleteMessageErr } = await deleteMessage(token, messageId);

    if (deleteMessageErr) {
      toast.error("خطا در حذف پیام");
      setDeletingMessageId(null);
      handleCloseMenu();
      return;
    }

    setMessages((prev) => prev.filter((msg) => msg.id != messageId));
    setDeletingMessageId(null);
    handleCloseMenu();
  };

  // Report description only — not sent as a chat message (API later)
  const handleSubmitReport = async () => {
    if (!message.trim() || !reportMsg) return;

    // TODO: connect report API with reportMsg.id + description
    toast.success("گزارش با موفقیت ثبت شد");
    setReportMsg(null);
    setMessage("");
    setIsReported(true);
    resetTextareaHeight();
  };

  const handleComposerSubmit = () => {
    if (message.trim().length === 0) return;

    if (reportMsg) {
      handleSubmitReport();
      return;
    }

    handleSendMessage(message);
    resetTextareaHeight();
  };

  const lastUserMessageId = messages
    .filter((m) => m.sender === "user")
    .at(-1)?.id;

  // Fetch preset messages
  useEffect(() => {
    fetchPresetMessages();
  }, []);

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, [conversation?.id]);

  // Close menu with outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        contextMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenuOpen]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync textarea height when editMsg changes (pre-filled text)
  useEffect(() => {
    if (editMsg && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [editMsg]);

  // For date scroll & auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const container = chatContainerRef.current;
      if (!container) return;

      // پیدا کردن تاریخ‌های یونیک
      const uniqueDates = [];
      const seenDates = new Set();

      messages.forEach((msg) => {
        const dateLabel = formatDateLabel(msg.date);
        if (!seenDates.has(dateLabel)) {
          seenDates.add(dateLabel);
          uniqueDates.push({ date: dateLabel, id: msg.id });
        }
      });

      // پیدا کردن آخرین تاریخی که از بالای viewport رد شده
      let currentVisibleDate = null;
      let hasPassedAnyDate = false;

      for (let i = 0; i < uniqueDates.length; i++) {
        const msgElement = messageRefs.current[uniqueDates[i].id];
        if (msgElement) {
          const rect = msgElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const threshold = window.innerWidth >= 1024 ? 152 : 52;

          // اگر پیام از بالای container رد شده باشه
          if (rect.top <= containerRect.top + threshold) {
            currentVisibleDate = uniqueDates[i].date;
            hasPassedAnyDate = true;
          } else {
            break;
          }
        }
      }

      // اگر از هیچ تاریخی رد نشده، sticky رو مخفی کن
      if (!hasPassedAnyDate) {
        setShowSticky(false);
        return;
      }

      setShowSticky(true);
      setVisibleDate(currentVisibleDate);

      if (stickyTimeoutRef.current) {
        clearTimeout(stickyTimeoutRef.current);
      }

      stickyTimeoutRef.current = setTimeout(() => {
        setShowSticky(false);
      }, 1000);
    };

    const container = chatContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      container?.removeEventListener("scroll", handleScroll);
      if (stickyTimeoutRef.current) clearTimeout(stickyTimeoutRef.current);
    };
  }, [messages]);

  return (
    <div className="pt-2 lg:pt-0 lg:px-[140px] flex flex-col h-full select-none overflow-hidden">
      {/* Context menu overlay */}
      {contextMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-200/20 backdrop-blur-sm z-998"
          onClick={handleCloseMenu}
        />
      )}

      {previewImage && (
        <div
          className="fixed inset-0 bg-gray-200/20 backdrop-blur-sm z-9999 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative w-[90%] h-[50%] rounded-lg overflow-hidden">
            <Image
              src={previewImage}
              alt="پیش نمایش"
              fill
              className="shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="lg:fixed lg:top-0 lg:right-0 lg:left-0 lg:pt-10 lg:px-[140px] bg-white z-10">
        <div className="flex items-center justify-center lg:justify-between py-1 lg:pb-2">
          <div className="flex items-center gap-1">
            <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[14px] border-2 border-gray-200">
              <SupportIcon size={20} />
            </div>
            <span className="hidden lg:inline font-iransans font-semibold! text-primary text-lg">
              {conversation?.isSupport
                ? "واحد پشتیبانی"
                : `${conversation?.other_user?.name} ${conversation?.other_user?.family}`}
            </span>
            <span className="inline lg:hidden font-iransans font-bold mx-auto text-primary text-lg">
              {conversation?.isSupport
                ? "واحد پشتیبانی"
                : `${conversation?.other_user?.name} ${conversation?.other_user?.family}`}
            </span>
          </div>
        </div>
      </div>

      {/* Chat content */}
      <div
        ref={chatContainerRef}
        className="lg:pt-24 pb-78 lg:pb-56 overflow-y-auto scroll-hidden flex-1"
      >
        {loading ? (
          <ChatSkeleton />
        ) : (
          <>
            <div className="sticky top-1 z-20 h-0 overflow-visible">
              <div
                className={`flex justify-center pointer-events-none transition-opacity duration-500 ${
                  showSticky ? "opacity-100" : "opacity-0"
                }`}
              >
                {visibleDate && (
                  <div className="bg-white/80 backdrop-blur-sm shadow-sm border text-gray-600 text-xs px-4 py-1 rounded-full">
                    {visibleDate}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col pt-3">
              <div className="flex w-full justify-end">
                <div className="flex items-end gap-2 max-w-[80%] lg:max-w-[40%] flex-row-reverse">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                      <SupportIcon size={20} />
                    </div>
                  </div>
                  <div className="font-iransans text-justify whitespace-break-spaces px-4 py-2 rounded-lg text-xs lg:text-sm leading-8 w-full wrap-break-word text-gray-800 border-2 border-gray-200 rounded-bl-none">
                    سلام با افتخار به شما خوش آمد میگوییم. در سامانه پشتیبانی،
                    تمرکز ما ایجاد تجربه ای بی نظیر برای شماست؛ شما میتوانید از
                    این قسمت با ما در تعامل باشید و سوالات خود را مطرح کنید و
                    اطلاعات بیشتری در رابطه با محصولات و خدمات مختلف بدست آورید.
                  </div>
                </div>
              </div>
              {messages.map((msg, index) => {
                const currentDateLabel = formatDateLabel(msg.date);
                const prevDateLabel =
                  index > 0 ? formatDateLabel(messages[index - 1].date) : null;

                const showDateSeparator = currentDateLabel !== prevDateLabel;
                const last = isLastOfGroup(messages, index);

                const bubbleClasses = `
    font-iransans text-justify overflow-hidden rounded-xl text-xs lg:text-sm text-gray-800 
    w-fit cursor-context-menu
    ${
      msg.sender === "user"
        ? last
          ? "border-2 border-primary rounded-br-none"
          : "border-2 border-primary"
        : last
          ? "border-2 border-gray-200 rounded-bl-none"
          : "border-2 border-gray-200"
    } ${contextMenuOpen ? "bg-white" : ""}
  `;

                return (
                  <div key={msg.id}>
                    {showDateSeparator && (
                      <div className="flex justify-center my-6">
                        <div className="bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full">
                          {currentDateLabel}
                        </div>
                      </div>
                    )}
                    <div
                      data-id={msg.id}
                      ref={(el) => (messageRefs.current[msg.id] = el)}
                      className={`flex flex-col w-full ${
                        msg.sender === "user" ? "items-start" : "items-end"
                      } ${isSameSenderAsPrev(messages, index) ? "mt-1" : "mt-6 lg:mt-4"}`}
                    >
                      <div
                        className={`${msg.sender === "user" ? "flex-row" : "flex-row-reverse"} flex gap-2 max-w-[80%] lg:max-w-[40%] ${!last ? (msg.sender === "user" ? "mr-[50px]" : "ml-[50px]") : ""}`}
                      >
                        {last && (
                          <div
                            className={`flex items-end ${msg.id === lastUserMessageId ? "pb-[18px]" : ""} ${contextMenuOpen && activeMessageId === msg.id ? "relative z-999" : ""}`}
                          >
                            <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                              {msg.sender === "support" ? (
                                <SupportIcon size={20} />
                              ) : (
                                <UserIcon size={20} />
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-1">
                          <div
                            ref={(el) => (triggerRefs.current[msg.id] = el)}
                            className={`relative flex items-center gap-2 ${msg.sender === "user" ? "flex-row" : "flex-row-reverse"} ${contextMenuOpen && activeMessageId === msg.id ? "z-999" : ""}`}
                            onClick={(e) => {
                              if (msg.type === "image") return;
                              handleOpenMenu(e, msg);
                            }}
                            onContextMenu={(e) => handleOpenMenu(e, msg)}
                            onTouchStart={() => startImageLongPress(msg)}
                            onTouchEnd={clearImageLongPress}
                            onTouchMove={clearImageLongPress}
                            onTouchCancel={clearImageLongPress}
                            onMouseDown={(e) => {
                              if (msg.type === "image" && e.button === 0) {
                                startImageLongPress(msg);
                              }
                            }}
                            onMouseUp={clearImageLongPress}
                            onMouseLeave={clearImageLongPress}
                          >
                            <div className={bubbleClasses} data-bubble>
                              {msg.replyTo &&
                                (() => {
                                  const repliedMsg = messages.find(
                                    (m) => m.id === msg.replyTo.id,
                                  );
                                  const repliedIsUser =
                                    repliedMsg?.sender === "user";
                                  const alignClass = repliedIsUser
                                    ? "ml-auto"
                                    : "mr-auto";
                                  const roundedClass = repliedIsUser
                                    ? "rounded-br-none"
                                    : "rounded-bl-none";
                                  return (
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        scrollToMessage(msg.replyTo.id);
                                      }}
                                      className={`border-2 border-gray-400 mt-1 mx-1.5 p-2 rounded-xl ${roundedClass} ${alignClass} max-w-[80%] cursor-pointer`}
                                    >
                                      <p className="font-iransans text-xs text-gray-600 line-clamp-1 overflow-hidden">
                                        {msg.replyTo.text}
                                      </p>
                                    </div>
                                  );
                                })()}
                              {msg.type === "image" ? (
                                <Image
                                  src={msg?.image}
                                  alt="عکس"
                                  width={120}
                                  height={64}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (imageLongPressTriggeredRef.current) {
                                      imageLongPressTriggeredRef.current = false;
                                      return;
                                    }
                                    setPreviewImage(msg.image);
                                  }}
                                  // priority
                                  loading="lazy"
                                  className={`object-cover rounded-md select-none ${last ? (msg.sender === "user" ? "rounded-br-none" : "rounded-bl-none") : ""}`}
                                  draggable={false}
                                />
                              ) : (
                                <p className="font-iransans px-4 leading-10 text-justify wrap-break-word">
                                  {msg.text}
                                </p>
                              )}
                            </div>
                            <span className="font-iransans text-gray-400 text-sm">
                              {msg.date.toLocaleTimeString("fa-IR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>

                            {/* Custom Context Menu */}
                            {contextMenuOpen &&
                              activeMessageId === msg.id &&
                              activeTriggerElement && (
                                <MessageContextMenu
                                  isOpen={true}
                                  onReply={() => {
                                    setReplyTo(msg);
                                    setEditMsg(null);
                                    setReportMsg(null);
                                    setMessage("");
                                    resetTextareaHeight();
                                    handleCloseMenu();
                                  }}
                                  onDelete={
                                    msg.sender === "user"
                                      ? () => handleDeleteMessage(msg.id)
                                      : undefined
                                  }
                                  onEdit={
                                    msg.sender === "user" &&
                                    msg.type !== "image"
                                      ? () => {
                                          setEditMsg(msg);
                                          setReplyTo(null);
                                          setReportMsg(null);
                                          setMessage(msg.text);
                                          handleCloseMenu();
                                        }
                                      : undefined
                                  }
                                  onReport={
                                    msg.sender !== "user"
                                      ? () => {
                                          setReportMsg(msg);
                                          setReplyTo(null);
                                          setEditMsg(null);
                                          setMessage("");
                                          resetTextareaHeight();
                                          handleCloseMenu();
                                        }
                                      : undefined
                                  }
                                  onClose={handleCloseMenu}
                                  position={
                                    msg.sender === "user" ? "right" : "left"
                                  }
                                  triggerRef={{ current: activeTriggerElement }}
                                  isDeleting={deletingMessageId === msg.id}
                                  deleteLoadingComponent={
                                    <SpinnerLoading
                                      size={20}
                                      className="border-error-medium"
                                    />
                                  }
                                />
                              )}
                          </div>

                          {msg.id === lastUserMessageId && (
                            <div className="w-full flex flex-col gap-1">
                              <p className="text-gray-400 text-xs lg:text-sm">
                                1 ساعت پیش خوانده شد
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div ref={lastMessageRef} />
          </>
        )}
      </div>

      {/* Chat box */}
      <div className="fixed right-0 left-0 bottom-0 flex items-end gap-4 lg:items-center lg:justify-center px-[10px] lg:px-[140px] pt-2 lg:pt-4 pb-6 lg:pb-12 bg-white">
        <div className="flex items-end gap-1 flex-1">
          <div className="flex flex-col gap-3 flex-1">
            {/* پیام‌های آماده — فقط حالت نرمال */}
            {!editMsg &&
              !reportMsg &&
              !replyTo &&
              !isReported &&
              showRecommended && (
                <div className="space-y-2">
                  {recommendedMessages.map((item) => (
                    <p
                      key={item.id}
                      onClick={() => handleRecommendedMessageClick(item)}
                      className="font-iransans text-gray-600 text-center cursor-pointer text-sm lg:text-sm rounded-full p-2 w-full border-2 border-gray-200"
                    >
                      {item.question}
                    </p>
                  ))}
                </div>
              )}

            <div className="flex items-center justify-center gap-4 lg:gap-1">
              <StrokeArrowLeftIcon
                size={20}
                onClick={() => setIsOpen(false)}
                className="hidden lg:inline absolute bottom-16 right-16 rotate-180 cursor-pointer"
              />

              <div
                className={`relative w-full max-w-[540px] ${contextMenuOpen ? "z-999" : ""}`}
              >
                {isReported ? (
                  <div className="flex items-center justify-center py-3 lg:py-4">
                    <p className="font-iransans font-bold text-error-medium text-sm lg:text-base text-center">
                      گفت و گو با واحد پشتیبانی گزارش و مسدود شده است
                    </p>
                  </div>
                ) : (
                  <>
                    {/* باکس ویرایش پیام */}
                    {editMsg && (
                      <div className="flex items-center justify-center relative mb-3">
                        <span className="font-iransans font-bold text-primary text-base">
                          ویرایش پیام
                        </span>
                        <button
                          onClick={() => {
                            setEditMsg(null);
                            setMessage("");
                            resetTextareaHeight();
                          }}
                          className="absolute left-3"
                        >
                          <CloseSquareIcon size={22} />
                        </button>
                      </div>
                    )}

                    {/* باکس گزارش پیام */}
                    {reportMsg && (
                      <div className="flex items-center justify-center relative mb-3">
                        <span className="font-iransans font-bold text-error-medium text-base">
                          گزارش گفت و گو با {otherUserDisplayName}
                        </span>
                        <button
                          onClick={() => {
                            setReportMsg(null);
                            setMessage("");
                            resetTextareaHeight();
                          }}
                          className="absolute left-3"
                        >
                          <CloseSquareIcon size={20} />
                        </button>
                      </div>
                    )}

                    {/* باکس پاسخ */}
                    {replyTo && !editMsg && !reportMsg && (
                      <div className="flex items-center justify-center relative mb-3">
                        <span className="font-iransans font-bold text-primary text-base">
                          پاسخ به {otherUserDisplayName}
                        </span>
                        <button
                          onClick={() => setReplyTo(null)}
                          className="absolute left-3"
                        >
                          <CloseSquareIcon size={20} />
                        </button>
                      </div>
                    )}

                    {/* باکس مشترک (پیام + اینپوت) در حالت ویرایش/گزارش/پاسخ، یا فقط اینپوت در حالت عادی */}
                    {(() => {
                      const activeMsg = editMsg || reportMsg || replyTo;
                      const isReply = replyTo && !editMsg && !reportMsg;

                      return (
                        <div
                          className={
                            activeMsg
                              ? "bg-gray-200 rounded-xl p-[5px] flex flex-col gap-2"
                              : ""
                          }
                        >
                          {activeMsg && (
                            <div
                              onClick={
                                isReply
                                  ? () => scrollToMessage(replyTo.id)
                                  : undefined
                              }
                              className={`border-2 border-gray-400 rounded-full p-[10px] max-w-[70%] ${
                                isReply ? "cursor-pointer" : ""
                              } ${
                                activeMsg.sender === "user"
                                  ? "ml-auto rounded-br-none"
                                  : "mr-auto rounded-bl-none"
                              }`}
                            >
                              <p className="font-iransans text-xs text-gray-600 line-clamp-1 overflow-hidden">
                                {activeMsg.text}
                              </p>
                            </div>
                          )}

                          {/* input */}
                          <div
                            className={`flex items-end rounded-xl overflow-hidden ${
                              activeMsg ? "bg-white" : "bg-gray-200"
                            }`}
                          >
                            <textarea
                              ref={textareaRef}
                              placeholder={
                                reportMsg
                                  ? "توضیحات ...."
                                  : editMsg
                                    ? "ویرایش ...."
                                    : replyTo
                                      ? "پاسخ ...."
                                      : "پیام ...."
                              }
                              value={message}
                              rows={1}
                              onChange={(e) => {
                                setMessage(e.target.value);
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleComposerSubmit();
                                }
                              }}
                              className="font-iransans placeholder:text-gray-400 text-gray-600 min-h-12 py-3 pr-4 w-full outline-none select-all bg-transparent resize-none overflow-hidden leading-6 text-right placeholder:text-center placeholder:pr-8 flex-1"
                            />
                            <div className="flex items-center justify-center w-12 min-h-12 shrink-0">
                              {message.length === 0 &&
                                !editMsg &&
                                !reportMsg && (
                                  <>
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      accept="image/*"
                                      capture="environment"
                                      onChange={handleFileSelect}
                                      className="hidden"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        fileInputRef.current?.click()
                                      }
                                      className="cursor-pointer pr-3"
                                    >
                                      <ScanLineIcon className="text-gray-800" />
                                    </button>
                                  </>
                                )}
                              {(message.trim().length > 0 ||
                                editMsg ||
                                reportMsg) && (
                                <button
                                  type="button"
                                  disabled={message.trim().length === 0}
                                  onClick={handleComposerSubmit}
                                  className={`font-iransans transition-colors  ${
                                    message.trim().length > 0
                                      ? "text-primary cursor-pointer"
                                      : "text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  ارسال
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
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
