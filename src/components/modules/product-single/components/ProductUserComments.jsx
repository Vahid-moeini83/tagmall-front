"use client";

import { useState, useEffect, useRef } from "react";
import { SupportIcon, HeartIcon, CloseSquareIcon } from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MessageContextMenu from "@/components/ui/MessageContextMenu";
import {
  createComment,
  deleteComment,
  toggleCommentLike,
} from "@/lib/server/actions/product";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import usePublicStore from "@/app/store/publicStore";

// Helper function to get user display name based on type (outside component to avoid useMemo dependency)
function getUserDisplayName(user) {
  if (!user) return "کاربر";

  const { type, type_str, name, family } = user;

  if (type === 1) {
    return `${name} ${family || ""}`.trim();
  } else if (type === 2) {
    return type_str || "مدیر";
  } else if (type === 3) {
    const fullName = `${name} ${family || ""}`.trim();
    return `${type_str || "فروشنده"} ${fullName}`.trim();
  }

  return `${name} ${family || ""}`.trim();
}

export default function ProductUserComments({
  productId,
  initialComments,
  commentsError,
}) {
  // Transform API data to chatBoxes format - must be before useState
  const getTransformedData = () => {
    if (commentsError || !initialComments || !initialComments.data) {
      return { boxes: [], liked: {} };
    }

    const transformedBoxes = initialComments.data.map((comment) => {
      const messages = [
        {
          id: `${comment?.id}`,
          apiId: comment?.id,
          user: getUserDisplayName(comment?.user),
          message: comment.body,
          date: new Date(comment?.created_at).toLocaleDateString("fa-IR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          likes: comment?.likes_count,
          isUserMessage: comment?.is_mine,
          isLiked: comment?.is_liked,
        },
      ];

      if (comment?.replies && comment?.replies?.length > 0) {
        comment.replies.forEach((reply) => {
          messages.push({
            id: `${reply.id}`,
            apiId: reply.id,
            user: getUserDisplayName(reply.user),
            message: reply.body,
            date: new Date(reply.created_at).toLocaleDateString("fa-IR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            likes: reply?.likes_count,
            isUserMessage: reply.is_mine,
            isLiked: reply?.is_liked,
            replyTo: reply?.reply_to ? `${reply.reply_to.id}` : null,
            replyToText: reply?.reply_to ? reply.reply_to.body : null,
          });
        });
      }

      return {
        id: comment.id,
        type: "qa",
        messages: messages,
      };
    });

    const initialLiked = {};
    transformedBoxes.forEach((box) => {
      box.messages.forEach((msg) => {
        if (msg.isLiked) {
          initialLiked[msg.id] = true;
        }
      });
    });

    return { boxes: transformedBoxes, liked: initialLiked };
  };

  const initialData = getTransformedData();

  const [chatBoxes, setChatBoxes] = useState(initialData.boxes);
  const [likedMessages, setLikedMessages] = useState(initialData.liked);
  const [isOpen, setIsOpen] = useState(true);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [activeTriggerElement, setActiveTriggerElement] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);

  const setLoginOpen = usePublicStore((s) => s.setLoginOpen);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const hasOverflow = !isDesktop;

  const menuRef = useRef(null);
  const triggerRefs = useRef({});
  const inputRef = useRef(null);
  const activeReplyInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Helper: Find message and its box by message ID
  const findMessageAndBox = (messageId) => {
    for (const box of chatBoxes) {
      const message = box.messages.find((msg) => msg.id === messageId);
      if (message) {
        return { message, box };
      }
    }
    return { message: null, box: null };
  };

  const toggleLike = async (id, apiId) => {
    const token = await getToken();
    if (!token) {
      setLoginOpen(true);
      return;
    }

    // Optimistic update
    const wasLiked = likedMessages[id];
    setLikedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    // Update likes count optimistically
    setChatBoxes((prev) =>
      prev?.map((box) => ({
        ...box,
        messages: box?.messages?.map((msg) =>
          msg.id === id
            ? { ...msg, likes: wasLiked ? msg.likes - 1 : msg.likes + 1 }
            : msg,
        ),
      })),
    );

    const { likeRes, likeErr } = await toggleCommentLike(token, apiId);

    if (likeErr) {
      // Revert on error
      setLikedMessages((prev) => ({
        ...prev,
        [id]: wasLiked,
      }));
      setChatBoxes((prev) =>
        prev?.map((box) => ({
          ...box,
          messages: box?.messages?.map((msg) =>
            msg.id === id
              ? { ...msg, likes: wasLiked ? msg.likes + 1 : msg.likes - 1 }
              : msg,
          ),
        })),
      );
      toast.error("خطا در ثبت لایک");
    } else if (likeRes) {
      // Update with actual count from server
      setChatBoxes((prev) =>
        prev?.map((box) => ({
          ...box,
          messages: box?.messages?.map((msg) =>
            msg.id === id ? { ...msg, likes: likeRes?.likes_count } : msg,
          ),
        })),
      );
    }
  };

  const handleOpenMenu = (e, messageId) => {
    // Open with a simple click
    if (e.type === "click") {
      e.preventDefault();
      e.stopPropagation();
    } else if (e.type === "contextmenu") {
      e.preventDefault();
      e.stopPropagation();
    }

    if (contextMenuOpen && activeMessageId === messageId) {
      handleCloseMenu();
      return;
    }

    setContextMenuOpen(true);
    setActiveMessageId(messageId);
    setActiveTriggerElement(triggerRefs.current[messageId]);
  };

  const handleCloseMenu = () => {
    setContextMenuOpen(false);
    setActiveMessageId(null);
    setActiveTriggerElement(null);
  };

  const handleReply = (messageId) => {
    handleCloseMenu();
    handleReplyToMessage(messageId);
  };

  const handleDelete = async (messageId) => {
    const { message } = findMessageAndBox(messageId);
    if (!message || !message.apiId) return;

    const token = await getToken();
    if (!token) {
      setLoginOpen(true);
      handleCloseMenu();
      return;
    }

    setDeletingMessageId(messageId);

    const { deleteCommentErr } = await deleteComment(token, message.apiId);

    if (deleteCommentErr) {
      toast.error("خطا در حذف نظر");
      setDeletingMessageId(null);
      handleCloseMenu();
      return;
    }

    // Remove from UI
    setChatBoxes((prev) => {
      return prev
        ?.map((box) => {
          const filteredMessages = box.messages.filter(
            (msg) => msg.id !== messageId,
          );
          // If no messages left, remove the box
          if (filteredMessages?.length === 0) return null;
          return { ...box, messages: filteredMessages };
        })
        .filter(Boolean);
    });

    setDeletingMessageId(null);
    handleCloseMenu();
  };

  const handleReport = (messageId) => {
    // اینجا می‌توانید منطق گزارش را پیاده‌سازی کنید
  };

  const handleSubmitComment = async (messageId = null) => {
    console.log("Msg ID: ", messageId);
    const isReply = messageId !== null && messageId !== undefined;

    console.log("Is reply: ", isReply);
    const text = isReply ? replyInputs[messageId]?.text : newComment;

    if (!text?.trim()) return;

    const token = await getToken();
    console.log(token);
    if (!token) {
      setLoginOpen(true);
      return;
    }

    let bodyData = {
      type: "product",
      id: productId,
      body: text,
    };

    if (isReply) {
      const { message: replyToMessage, box: targetBox } =
        findMessageAndBox(messageId);

      if (!replyToMessage || !targetBox) return;

      const firstCommentId = targetBox.messages[0].apiId;

      bodyData = {
        ...bodyData,
        first_comment_id: firstCommentId,
        reply_to_id: replyToMessage.apiId,
      };
    }

    setSubmitting(true);

    const { createCommentRes, createCommentErr } = await createComment(
      token,
      bodyData,
    );

    if (createCommentErr) {
      toast.error(isReply ? "خطا در ثبت پاسخ" : "خطا در ثبت نظر");
      setSubmitting(false);
      return;
    }

    // Add the new comment/reply to UI immediately
    if (createCommentRes?.data) {
      const newMessageData = {
        id: `${createCommentRes.data.id}`,
        apiId: createCommentRes.data.id,
        user: getUserDisplayName(createCommentRes.data.user),
        message: createCommentRes.data.body,
        date: new Date(createCommentRes.data.created_at).toLocaleDateString(
          "fa-IR",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        ),
        likes: createCommentRes.data.likes_count,
        isUserMessage: createCommentRes.data.is_mine,
        isLiked: createCommentRes.data.is_liked,
      };

      if (isReply) {
        // Add reply to existing box
        const { box: targetBox } = findMessageAndBox(messageId);
        if (targetBox) {
          // Add replyTo information if exists
          if (createCommentRes.data.reply_to) {
            newMessageData.replyTo = `${createCommentRes.data.reply_to.id}`;
            newMessageData.replyToText = createCommentRes.data.reply_to.body;
          }

          setChatBoxes((prev) =>
            prev.map((box) =>
              box.id === targetBox.id
                ? { ...box, messages: [...box.messages, newMessageData] }
                : box,
            ),
          );
        }
      } else {
        // Add new comment box
        const newBox = {
          id: createCommentRes.data.id,
          type: "qa",
          messages: [newMessageData],
        };

        setChatBoxes((prev) => [...prev, newBox]);

        // Scroll to bottom on mobile after adding new comment
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    }

    if (isReply) {
      setReplyInputs((prev) => ({
        ...prev,
        [messageId]: { show: false, text: "" },
      }));
      setActiveReplyId(null);
    } else {
      setNewComment("");
      setShowCommentInput(false);
    }

    setSubmitting(false);
  };

  const handleOpenCommentInput = () => {
    setShowCommentInput(true);
    // Focus on input after it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleReplyToMessage = (messageId) => {
    setReplyInputs((prev) => ({
      ...prev,
      [messageId]: { show: true, text: prev[messageId]?.text || "" },
    }));
    setActiveReplyId(messageId);
    setTimeout(() => {
      activeReplyInputRef.current?.focus();
      // On desktop, scroll to the reply input element
      if (isDesktop && activeReplyInputRef.current) {
        activeReplyInputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  };

  const handleCancelComment = () => {
    setShowCommentInput(false);
    setNewComment("");
  };

  const handleCancelReply = (messageId) => {
    setReplyInputs((prev) => ({
      ...prev,
      [messageId]: { show: false, text: "" },
    }));
    setActiveReplyId(null);
  };

  const handleReplyTextChange = (messageId, text) => {
    setReplyInputs((prev) => ({
      ...prev,
      [messageId]: { ...prev[messageId], text },
    }));
  };

  const scrollToReplyTarget = (messageId) => {
    const element = triggerRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToBottom = () => {
    if (!isDesktop && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

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

  // Show error toast if there's an error
  useEffect(() => {
    if (commentsError) {
      toast.error("خطا در دریافت نظرات");
    }
  }, [commentsError]);

  const orderedChatBoxes = isDesktop ? [...chatBoxes].reverse() : chatBoxes;

  return (
    <div
      className={`lg:bg-white lg:rounded-b-lg lg:py-[10px] lg:px-[100px] ${
        isOpen ? "lg:pt-[50px]" : "lg:py-[50px]"
      } ${!isDesktop ? "bg-white" : ""}`}
    >
      {/* Context menu overlay */}
      {contextMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-200/20 backdrop-blur-sm z-40"
          onClick={handleCloseMenu}
        />
      )}

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
          <AccordionContent className="mt-4 flex flex-col h-screen lg:h-auto relative">
            <div
              ref={messagesContainerRef}
              className={`flex flex-col lg:flex-row gap-[6px] pb-36 lg:pb-0 ${
                hasOverflow ? "overflow-y-auto" : ""
              }  lg:overflow-x-auto`}
            >
              <div className="lg:hidden flex items-center justify-center mb-2">
                <h3 className="font-iransans font-bold text-primary">
                  پرسش و پاسخ و دیدگاه کاربران
                </h3>
              </div>
              {/* Guide Box */}
              <div className="flex gap-[6px] shrink-0 mb-12">
                <div className="flex flex-col justify-between h-auto ">
                  <div className="flex items-end gap-2 px-[10px]">
                    <div className="border-2 border-gray-200 lg:border-primary/20 rounded-t-lg rounded-br-lg px-2 py-[2px] max-w-[175px]">
                      <p className="text-xs font-iransans">
                        <span className="font-bold">راهنما:</span> سوالات خود را
                        در مورد محصول بپرسید
                      </p>
                      <p className="text-xs text-center text-gray-400 mt-2">
                        1 مهر 1404
                      </p>
                    </div>
                    <div className="border-2 border-gray-200 lg:border-gray-200 rounded-lg p-[10px]">
                      <SupportIcon size={20} />
                    </div>
                  </div>

                  {/* Comment Input Box */}
                  {showCommentInput ? (
                    isDesktop ? (
                      <div className="bg-white rounded-lg p-3">
                        <textarea
                          ref={inputRef}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="نظر یا پرسش خود را بنویسید..."
                          className="w-full min-h-[80px] p-2 border-2 border-gray-200 rounded-lg resize-none outline-none focus:border-primary text-xs font-iransans"
                        />
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <button
                            onClick={handleCancelComment}
                            disabled={submitting}
                            className="px-4 py-2 text-xs font-iransans text-gray-400 disabled:opacity-50"
                          >
                            انصراف
                          </button>
                          <button
                            onClick={() => handleSubmitComment()}
                            disabled={!newComment.trim() || submitting}
                            className="px-4 py-2 text-xs font-iransans text-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {submitting ? (
                              <>
                                <SpinnerLoading
                                  size={16}
                                  className="border-primary"
                                />
                                در حال ارسال...
                              </>
                            ) : (
                              "ارسال"
                            )}
                          </button>
                        </div>
                      </div>
                    ) : null
                  ) : (
                    isDesktop && (
                      <button
                        onClick={handleOpenCommentInput}
                        className="font-iransans rounded-lg py-4 bg-white text-primary text-center"
                      >
                        ثبت دیدگاه یا پرسش
                      </button>
                    )
                  )}
                </div>
                <div className="hidden lg:block w-[2px] h-[200px] bg-gray-200" />
              </div>

              {/* Chat Boxes */}
              {orderedChatBoxes?.map((box, boxIndex) => {
                const isUserBox = box.type === "user";
                const allMessages = box.messages;

                return (
                  <div
                    key={box.id}
                    className="flex items-start gap-[6px] shrink-0 mb-4 lg:mb-12 w-full lg:w-auto border-b-2 border-gray-200 lg:border-white pb-4 lg:pb-0 lg:border-0"
                  >
                    <div
                      className={`flex flex-col gap-2 w-full lg:w-auto lg:max-h-[208px] scroll-hidden lg:overflow-y-auto relative items-start px-[10px] lg:px-0`}
                    >
                      {allMessages?.map((msg) => {
                        const isUserMsg = msg.isUserMessage;

                        return (
                          <div key={msg.id} className="w-full">
                            {/* Message */}
                            <div
                              className={`flex items-center w-full ${
                                isUserMsg ? "justify-start" : "justify-end"
                              } ${
                                isUserBox
                                  ? "gap-3 lg:gap-[50px]"
                                  : "gap-6 lg:gap-4"
                              }`}
                            >
                              {!isUserMsg && (
                                <div className="flex flex-col items-center gap-1">
                                  <button
                                    onClick={() =>
                                      toggleLike(msg.id, msg.apiId)
                                    }
                                  >
                                    <HeartIcon
                                      size={20}
                                      filled={likedMessages[msg.id]}
                                      color="var(--gray-color-400)"
                                    />
                                  </button>
                                  <span
                                    className={`text-xs ${
                                      likedMessages[msg.id]
                                        ? "text-error-medium"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {msg.likes}
                                  </span>
                                </div>
                              )}

                              <div
                                className={`flex flex-col gap-[5px] ${
                                  contextMenuOpen && activeMessageId === msg.id
                                    ? "relative z-1000"
                                    : ""
                                }`}
                              >
                                <div
                                  ref={(el) =>
                                    (triggerRefs.current[msg.id] = el)
                                  }
                                  className={`relative border-2 ${
                                    isUserMsg
                                      ? "border-gray-400 bg-gray-200"
                                      : isUserMsg
                                        ? "border-gray-400 lg:border-gray-200"
                                        : "border-gray-300"
                                  } ${
                                    !isUserMsg
                                      ? "rounded-t-lg rounded-br-lg"
                                      : "rounded-t-lg rounded-bl-lg"
                                  } px-2 py-[2px] ${isUserBox ? "max-w-[175px]" : "max-w-[240px] lg:max-w-[175px]"} cursor-context-menu`}
                                  onClick={(e) => handleOpenMenu(e, msg.id)}
                                  onContextMenu={(e) =>
                                    handleOpenMenu(e, msg.id)
                                  }
                                >
                                  {msg.replyTo && msg.replyToText && (
                                    <div
                                      className={`border-r-2 border-gray-600 py-1 px-2 mb-2 rounded-md ${isUserMsg ? "bg-white" : "bg-gray-100"}`}
                                    >
                                      <span className="text-xs text-gray-600 font-iransans line-clamp-1">
                                        {msg.replyToText}
                                      </span>
                                    </div>
                                  )}
                                  <p className="text-xs font-iransans">
                                    <span className="font-bold">
                                      {msg.user}:
                                    </span>{" "}
                                    {msg.message}
                                  </p>
                                  <p className="text-xs text-center text-gray-400 mt-2">
                                    {msg.date}
                                  </p>
                                </div>

                                {/* Context Menu for this message */}
                                {contextMenuOpen &&
                                  activeMessageId === msg.id && (
                                    <MessageContextMenu
                                      isOpen={true}
                                      onReply={() => handleReply(msg.id)}
                                      onDelete={
                                        msg.isUserMessage
                                          ? () => handleDelete(msg.id)
                                          : undefined
                                      }
                                      onReport={() => handleReport(msg.id)}
                                      onClose={handleCloseMenu}
                                      position={isUserMsg ? "right" : "left"}
                                      triggerRef={{
                                        current: activeTriggerElement,
                                      }}
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

                              {isUserMsg && (
                                <div className="flex flex-col items-center gap-1">
                                  <button
                                    onClick={() =>
                                      toggleLike(msg.id, msg.apiId)
                                    }
                                  >
                                    <HeartIcon
                                      size={20}
                                      filled={likedMessages[msg.id]}
                                      color="var(--gray-color-400)"
                                    />
                                  </button>
                                  <span
                                    className={`text-xs ${
                                      likedMessages[msg.id]
                                        ? "text-error-medium"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {msg.likes}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Reply Input for this message - Desktop only, inside scrollable container */}
                            {isDesktop &&
                              replyInputs[msg.id]?.show &&
                              activeReplyId === msg.id && (
                                <div className="flex items-center justify-start gap-3 lg:gap-[50px] mt-2">
                                  <div className="flex flex-col gap-2 items-center w-full max-w-[175px]">
                                    <div className="w-full bg-white rounded-lg p-2 border-2 border-gray-200">
                                      <div className="bg-gray-100 border-r-4 border-gray-600 py-1 px-2 rounded-md mb-2">
                                        <span className="font-iransans text-gray-600 text-xs line-clamp-1">
                                          {msg.message}
                                        </span>
                                      </div>
                                      <textarea
                                        ref={activeReplyInputRef}
                                        value={replyInputs[msg.id]?.text || ""}
                                        onChange={(e) =>
                                          handleReplyTextChange(
                                            msg.id,
                                            e.target.value,
                                          )
                                        }
                                        placeholder="پاسخ خود را بنویسید..."
                                        className="w-full min-h-[48px] text-xs font-iransans resize-none outline-none"
                                      />
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() =>
                                            handleCancelReply(msg.id)
                                          }
                                          disabled={submitting}
                                          className="px-2 py-1 text-xs font-iransans text-gray-400 disabled:opacity-50"
                                        >
                                          انصراف
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleSubmitComment(msg.id)
                                          }
                                          disabled={
                                            !replyInputs[
                                              msg.id
                                            ]?.text?.trim() || submitting
                                          }
                                          className="px-2 py-1 text-xs font-iransans text-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                          {submitting ? (
                                            <>
                                              <SpinnerLoading
                                                size={12}
                                                className="border-primary"
                                              />
                                              ارسال...
                                            </>
                                          ) : (
                                            "ارسال"
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                    {boxIndex < chatBoxes?.length - 1 && (
                      <div className="hidden lg:block w-[2px] h-[200px] bg-gray-200" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box - Fixed at bottom for mobile only */}
            {!isDesktop && (
              <div className="fixed bottom-4 right-[10px] left-[10px] z-30">
                <div className="relative rounded-t-md rounded-bl-md bg-gray-200 overflow-hidden">
                  {activeReplyId && (
                    <div
                      onClick={() => scrollToReplyTarget(activeReplyId)}
                      className="bg-white border-r-4 border-gray-600 py-2.5 pl-1 pr-2 rounded-md mx-2 mt-1 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-iransans text-gray-600 text-xs max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                        {(() => {
                          const { message } = findMessageAndBox(activeReplyId);
                          return message?.message || "";
                        })()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelReply(activeReplyId);
                        }}
                      >
                        <CloseSquareIcon size={20} />
                      </button>
                    </div>
                  )}
                  <input
                    ref={activeReplyId ? activeReplyInputRef : inputRef}
                    type="text"
                    placeholder={
                      activeReplyId ? "پاسخ ..." : "دیدگاه خود را ثبت کنید ..."
                    }
                    value={
                      activeReplyId
                        ? replyInputs[activeReplyId]?.text || ""
                        : newComment
                    }
                    onChange={(e) =>
                      activeReplyId
                        ? handleReplyTextChange(activeReplyId, e.target.value)
                        : setNewComment(e.target.value)
                    }
                    className="font-iransans placeholder:text-gray-400 text-gray-600 h-14 pr-2 pl-14 w-full outline-none bg-gray-200"
                  />
                  {activeReplyId ? (
                    replyInputs[activeReplyId]?.text?.trim()?.length > 0 ? (
                      <button
                        onClick={() => handleSubmitComment(activeReplyId)}
                        disabled={submitting}
                        className="absolute left-2 bottom-4 font-iransans text-primary cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {submitting ? (
                          <>
                            <SpinnerLoading
                              size={16}
                              className="border-primary"
                            />
                            ارسال...
                          </>
                        ) : (
                          "ارسال"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCancelReply(activeReplyId)}
                        disabled={submitting}
                        className="absolute left-2 bottom-4 font-iransans text-gray-400 cursor-pointer disabled:opacity-50"
                      >
                        انصراف
                      </button>
                    )
                  ) : (
                    newComment.trim()?.length > 0 && (
                      <button
                        onClick={() => handleSubmitComment()}
                        disabled={submitting}
                        className="absolute left-2 bottom-1/2 translate-y-1/2 font-iransans text-primary cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {submitting ? (
                          <>
                            <SpinnerLoading
                              size={16}
                              className="border-primary"
                            />
                            ارسال...
                          </>
                        ) : (
                          "ارسال"
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
