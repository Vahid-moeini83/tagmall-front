"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { CloseSquareIcon, SupportIcon, UserIcon } from "@/icons";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSearchParams } from "next/navigation";
import { formatRelativeTime } from "@/lib/client/utils";
import { deleteConversations } from "@/lib/server/actions/support";
import {
  buildSupportConversation,
  pushConversationHistory,
} from "../utils/conversation";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";
import usePublicStore from "@/app/store/publicStore";

function formatChatItems(conversationsData) {
  return conversationsData.map((conv) => {
    const otherUser = conv.other_user;

    return {
      id: conv.id,
      name:
        conv.department === 2 ? "واحد پشتیبانی" : otherUser?.name || "کاربر",
      msg: conv.latest_message?.body
        ? conv.latest_message?.body
        : conv.latest_message?.attachments.length > 0
          ? "تصویر"
          : "بدون پیام",
      isSupport: conv.department === 2,
      department: conv.department,
      department_text: conv.department_text,
      status: conv.status,
      unread_count: conv.unread_count,
      last_message_at: conv.last_message_at,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      other_user: otherUser,
      latest_message: conv.latest_message,
      read_status: conv.read_status,
      read_status_text: conv.read_status_text,
    };
  });
}

function SupportChats({ conversations, isMobile = false }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get("conversationId");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [deleteMode, setDeleteMode] = useState(false);
  const [pendingDeletes, setPendingDeletes] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [chatItems, setChatItems] = useState([]);

  const openConversation = usePublicStore((s) => s.openConversation);

  useEffect(() => {
    if (conversations?.data) {
      setChatItems(formatChatItems(conversations.data));
    }
  }, [conversations]);

  const restoreChatItems = () => {
    if (conversations?.data) {
      setChatItems(formatChatItems(conversations.data));
    }
  };

  useEffect(() => {
    if (!conversationIdFromUrl) return;

    const parsedId = Number.parseInt(conversationIdFromUrl, 10);
    const conversation = chatItems.find((chat) => chat.id === parsedId);

    if (conversation) {
      openConversation(conversation);
      return;
    }

    openConversation(buildSupportConversation(parsedId));
  }, [conversationIdFromUrl, chatItems, openConversation]);

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
    setDeleteMode(true);
    setPendingDeletes([]);
  };

  const handleCancelDeletes = () => {
    restoreChatItems();
    setPendingDeletes([]);
    setDeleteMode(false);
  };

  const handleMarkForDeletion = (e, id) => {
    e.stopPropagation();

    setPendingDeletes((prev) => [...prev, id]);

    // Delete temporaray
    setChatItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmDeletes = async () => {
    if (pendingDeletes.length === 0) {
      setDeleteMode(false);
      return;
    }

    setIsDeleting(true);
    const token = await getToken();
    const payload = {
      ids: pendingDeletes,
    };
    const { deleteConversationsErr } = await deleteConversations(
      token,
      payload,
    );

    if (deleteConversationsErr) {
      toast.error("خطا در حذف گفت‌و‌گوها");
      setIsDeleting(false);
      return;
    }

    setPendingDeletes([]);
    setDeleteMode(false);
    setIsDeleting(false);
  };

  const handleOpenChat = (conversation) => {
    openConversation(conversation);
    pushConversationHistory(conversation.id);
  };

  const supportChat = chatItems.find((chat) => chat.isSupport);
  const otherChats = chatItems.filter((chat) => !chat.isSupport);

  console.log(chatItems);

  const isConfirmDeleteEnabled = pendingDeletes.length > 0;

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
                {chatItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="font-iransans text-gray-400 text-sm lg:text-base mt-6 lg:mt-0">
                      هنوز گفت و گویی وجود ندارد
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1 overflow-y-auto scroll-hidden flex-1 pr-1 mt-2">
                      {supportChat && (
                        <div
                          onClick={() => handleOpenChat(supportChat)}
                          className="flex items-start gap-[6px] lg:gap-3 lg:pb-3 cursor-pointer"
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded-[14px] border-2 border-gray-200">
                            <SupportIcon size={20} />
                          </div>

                          <div className="flex flex-col gap-1 lg:gap-6">
                            <div className="font-bold! text-gray-600 text-xs lg:text-base lg:pt-2">
                              {supportChat.name}
                            </div>

                            <div className="flex items-center gap-1">
                              <p className="font-iransans text-gray-600 mb-0! max-w-[132px] lg:max-w-[200px] line-clamp-1 text-xs lg:text-base">
                                {supportChat.msg}
                              </p>
                              {supportChat?.read_status > 0 && (
                                <p className="text-gray-400 text-xs lg:text-base pt-1">
                                  {supportChat?.read_status_text}
                                </p>
                              )}
                            </div>
                          </div>

                          {supportChat.unread_count > 0 && (
                            <div className="mr-auto ml-4 bg-error-medium rounded-full w-2 h-2 my-auto"></div>
                          )}
                        </div>
                      )}

                      {otherChats.map((item) => (
                        <div key={item.id}>
                          <div
                            className="border-t-2 border-gray-200 mr-11"
                            aria-hidden
                          />
                          <div
                            onClick={() => handleOpenChat(item)}
                            className="relative flex items-start gap-[6px] lg:gap-3 pt-1 lg:pt-3 pb-1 lg:pb-3 cursor-pointer"
                          >
                            {item.other_user?.avatar ? (
                              <Image
                                src={item.other_user?.avatar}
                                width={40}
                                height={40}
                                alt="عکس پروفایل"
                                className="rounded-[14px] bg-gray-200 object-cover w-10 h-10"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-[14px] flex items-center justify-center bg-gray-200">
                                <UserIcon size={20} className="text-gray-600" />
                              </div>
                            )}

                            <div className="flex flex-col gap-[4px] lg:gap-6 lg:pt-2 flex-1">
                              <div className="font-bold! text-gray-600 text-xs lg:text-base">
                                {item.name}
                              </div>

                              <div className="flex items-center gap-1">
                                <p className="font-iransans text-gray-600 mb-0! max-w-[132px] lg:max-w-[200px] line-clamp-1 text-xs lg:text-base">
                                  {item.msg}
                                </p>
                                {item?.read_status > 0 && (
                                  <p className="text-gray-400 text-xs lg:text-base pt-2">
                                    {item?.read_status_text}
                                  </p>
                                )}
                              </div>
                            </div>

                            {supportChat?.unread_count > 0 && (
                              <div className="mr-auto ml-4 bg-error-medium rounded-full w-2 h-2 my-auto"></div>
                            )}

                            {deleteMode && (
                              <div className="absolute left-[6px] top-1/2 -translate-y-1/2 pt-2">
                                <button
                                  onClick={(e) =>
                                    handleMarkForDeletion(e, item.id)
                                  }
                                  className="cursor-pointer"
                                >
                                  <CloseSquareIcon size={20} />
                                </button>
                              </div>
                            )}

                            {/* Unread sign */}
                            {!deleteMode && item.unread_count > 0 && (
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-error-medium" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="hidden lg:flex sticky bottom-0 bg-white pt-4 pb-2 px-2">
                      {deleteMode ? (
                        <div className="flex w-full gap-2">
                          <button
                            type="button"
                            disabled={isDeleting || !isConfirmDeleteEnabled}
                            className={`flex-1 cursor-pointer border-2 py-2 rounded-full flex items-center justify-center disabled:cursor-not-allowed ${
                              isConfirmDeleteEnabled
                                ? "text-primary border-primary disabled:opacity-70"
                                : "text-gray-400 border-gray-400"
                            }`}
                            onClick={handleConfirmDeletes}
                          >
                            {isDeleting ? (
                              <SpinnerLoading
                                size={20}
                                className="border-primary"
                              />
                            ) : (
                              "تایید"
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting}
                            className="flex-1 text-error-medium cursor-pointer py-2 rounded-full disabled:opacity-70"
                            onClick={handleCancelDeletes}
                          >
                            انصراف
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-primary cursor-pointer"
                          onClick={handleDeleteButtonClick}
                        >
                          پاک کردن پیام ها
                        </button>
                      )}
                    </div>
                  </>
                )}
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

            {chatItems.length > 0 && (
              <div className="lg:hidden fixed bottom-17 right-0 left-0 bg-white py-4 px-[10px]">
                {deleteMode ? (
                  <div className="flex w-full gap-2">
                    <button
                      type="button"
                      disabled={isDeleting || !isConfirmDeleteEnabled}
                      className={`flex-1 cursor-pointer border-2 py-2 rounded-full flex items-center justify-center disabled:cursor-not-allowed ${
                        isConfirmDeleteEnabled
                          ? "text-primary border-primary disabled:opacity-70"
                          : "text-gray-400 border-gray-400"
                      }`}
                      onClick={handleConfirmDeletes}
                    >
                      {isDeleting ? (
                        <SpinnerLoading size={20} className="border-primary" />
                      ) : (
                        "تایید"
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      className="flex-1 text-error-medium cursor-pointer py-2 rounded-full disabled:opacity-70"
                      onClick={handleCancelDeletes}
                    >
                      انصراف
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full text-primary cursor-pointer border-2 border-primary py-2 rounded-full"
                    onClick={handleDeleteButtonClick}
                  >
                    پاک کردن پیام ها
                  </button>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default SupportChats;
