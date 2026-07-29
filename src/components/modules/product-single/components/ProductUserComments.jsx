"use client";

import { useState, useEffect, useRef } from "react";
import { SupportIcon, HeartIcon, CloseSquareIcon } from "@/icons";
import { ScanLineIcon } from "lucide-react";
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
  updateComment,
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
  productName,
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
  const [reportMsgId, setReportMsgId] = useState(null);
  const [editMsgId, setEditMsgId] = useState(null);

  const setLoginOpen = usePublicStore((s) => s.setLoginOpen);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const hasOverflow = !isDesktop;

  const menuRef = useRef(null);
  const triggerRefs = useRef({});
  const inputRef = useRef(null);
  const activeReplyInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

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
    setEditMsgId(null);
    setReportMsgId(null);
    setNewComment("");
    handleReplyToMessage(messageId);
  };

  const handleEdit = (messageId) => {
    const { message } = findMessageAndBox(messageId);
    if (!message) return;

    handleCloseMenu();
    setEditMsgId(messageId);
    setActiveReplyId(null);
    setReportMsgId(null);
    setReplyInputs({});
    setNewComment(message.message || "");

    setTimeout(() => {
      const el = activeReplyInputRef.current;
      if (el) {
        el.focus();
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditMsgId(null);
    setNewComment("");
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
    handleCloseMenu();
    setReportMsgId(messageId);
    setActiveReplyId(null);
    setEditMsgId(null);
    setNewComment("");
  };

  // Report description only — not sent as a chat message (API later)
  const handleSubmitReport = () => {
    if (!newComment.trim() || !reportMsgId) return;

    // TODO: connect report API with reportMsgId + description
    toast.success("گزارش با موفقیت ثبت شد");
    setReportMsgId(null);
    setNewComment("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleSubmitComment = async (messageId = null) => {
    const isReply = messageId !== null && messageId !== undefined;
    const isEdit = Boolean(editMsgId) && !isReply;
    const text = isReply ? replyInputs[messageId]?.text : newComment;

    if (!text?.trim()) return;

    const token = await getToken();
    if (!token) {
      setLoginOpen(true);
      return;
    }

    setSubmitting(true);

    // Edit existing comment
    if (isEdit) {
      const { message: editMessage } = findMessageAndBox(editMsgId);
      if (!editMessage?.apiId) {
        setSubmitting(false);
        return;
      }

      const { updateCommentRes, updateCommentErr } = await updateComment(
        token,
        editMessage.apiId,
        { body: text },
      );

      if (updateCommentErr) {
        toast.error("خطا در ویرایش نظر");
        setSubmitting(false);
        return;
      }

      const updatedBody = updateCommentRes?.data?.body ?? text;

      setChatBoxes((prev) =>
        prev?.map((box) => ({
          ...box,
          messages: box?.messages?.map((msg) =>
            msg.id === editMsgId ? { ...msg, message: updatedBody } : msg,
          ),
        })),
      );

      handleCancelEdit();
      setSubmitting(false);
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

      if (!replyToMessage || !targetBox) {
        setSubmitting(false);
        return;
      }

      const firstCommentId = targetBox.messages[0].apiId;

      bodyData = {
        ...bodyData,
        first_comment_id: firstCommentId,
        reply_to_id: replyToMessage.apiId,
      };
    }

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
    setEditMsgId(null);
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
    setEditMsgId(null);
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
          <AccordionTrigger className="hidden lg:flex justify-between text-primary text-base lg:text-[20px] font-semibold hover:no-underline font-iransans">
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
                <h3 className="font-iransans text-base font-bold text-primary">
                  پرسش و پاسخ و دیدگاه کاربران
                </h3>
              </div>
              {/* Guide Box */}
              <div className="flex justify-end lg:justify-normal1 gap-[6px] shrink-0 mb-12">
                <div className="flex flex-col justify-between h-auto">
                  <div className="flex items-end gap-2 px-[10px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-end gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="border-2 border-gray-200 lg:border-primary/20 rounded-xl rounded-bl-none max-w-[175px]">
                            <div className="flex flex-col gap-[6px] py-[5px] px-[10px]">
                              <p className="font-iransans text-xs font-bold mb-1!">
                                راهنما:
                              </p>
                              <p className="font-iransans text-xs">
                                سوالات خود را در مورد محصول بپرسید
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 text-center">
                            1 مهر 1404
                          </p>
                        </div>
                        <div className="border-2 border-gray-200 rounded-lg p-[10px] shrink-0 mb-4">
                          <SupportIcon size={20} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment Input Box */}
                  {showCommentInput && !editMsgId ? (
                    isDesktop ? (
                      <div className="bg-white rounded-lg p-3">
                        <textarea
                          ref={inputRef}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={`دیدگاه شما در مورد ${productName || "محصول"}`}
                          className="w-full min-h-[80px] p-2 border-2 border-gray-200 rounded-lg resize-none outline-none focus:border-primary text-xs font-iransans placeholder:line-clamp-1"
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
                    isDesktop &&
                    !editMsgId && (
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
                    className="flex items-start gap-[6px] shrink-0 mb-4 lg:mb-12 w-full lg:w-[250px] border-b-5 border-gray-200 lg:border-white pb-4 lg:pb-0 lg:border-0"
                  >
                    <div
                      className={`flex flex-col gap-2 w-full lg:max-h-[208px] scroll-hidden lg:overflow-y-auto relative items-start px-[10px] lg:px-0`}
                    >
                      {allMessages?.map((msg) => {
                        const isUserMsg = msg.isUserMessage;
                        const bubbleClasses = [
                          "font-iransans text-justify overflow-hidden rounded-xl text-xs text-gray-800",
                          "w-fit cursor-context-menu",
                          isUserMsg
                            ? "border-2 border-primary rounded-br-none"
                            : "border-2 border-gray-200 rounded-bl-none",
                          contextMenuOpen && activeMessageId === msg.id
                            ? "bg-white"
                            : "",
                        ].join(" ");

                        return (
                          <div key={msg.id} className="w-full">
                            <div
                              className={`flex items-end w-full ${isUserMsg ? "justify-start" : "justify-end"} gap-2`}
                            >
                              {/* like — non-user side */}
                              {!isUserMsg && (
                                <div className="flex flex-col items-center gap-1 shrink-0 self-center">
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
                                    className={`text-xs ${likedMessages[msg.id] ? "text-error-medium" : "text-gray-400"}`}
                                  >
                                    {msg.likes}
                                  </span>
                                </div>
                              )}
                              {/* avatar + bubble + date */}
                              <div
                                className={`flex items-end gap-2 ${isUserMsg ? "flex-row" : "flex-row-reverse"}`}
                              >
                                <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center shrink-0 mb-4">
                                  <SupportIcon size={20} />
                                </div>
                                <div
                                  className={`flex flex-col gap-1 ${contextMenuOpen && activeMessageId === msg.id ? "relative z-1000" : ""}`}
                                >
                                  <div
                                    ref={(el) =>
                                      (triggerRefs.current[msg.id] = el)
                                    }
                                    className={`relative flex items-center gap-2 ${isUserMsg ? "flex-row" : "flex-row-reverse"} ${contextMenuOpen && activeMessageId === msg.id ? "z-999" : ""}`}
                                    onClick={(e) => handleOpenMenu(e, msg.id)}
                                    onContextMenu={(e) =>
                                      handleOpenMenu(e, msg.id)
                                    }
                                  >
                                    <div className={bubbleClasses}>
                                      {msg.replyTo &&
                                        msg.replyToText &&
                                        (() => {
                                          // پیدا کردن پیام reply شده برای تشخیص صاحبش
                                          const repliedMsg = (() => {
                                            for (const b of chatBoxes) {
                                              const found = b.messages.find(
                                                (m) => m.id === msg.replyTo,
                                              );
                                              if (found) return found;
                                            }
                                            return null;
                                          })();
                                          // اگه کاربر به پیام خودش ریپلای کرده → سمت راست، rounded-br-none
                                          // اگه به پیام دیگری ریپلای کرده → سمت چپ، rounded-bl-none
                                          const replyIsOwnMsg = Boolean(
                                            repliedMsg?.isUserMessage,
                                          );
                                          const replyBoxClass =
                                            isUserMsg && replyIsOwnMsg
                                              ? "rounded-br-none ml-auto"
                                              : "rounded-bl-none mr-auto";
                                          return (
                                            <div
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                scrollToReplyTarget(
                                                  msg.replyTo,
                                                );
                                              }}
                                              className={`border-2 border-gray-400 mt-1 mx-1.5 p-2 rounded-xl mb-1 max-w-[80%] cursor-pointer ${replyBoxClass}`}
                                            >
                                              <span className="text-xs text-gray-600 font-iransans line-clamp-1 overflow-hidden">
                                                {msg.replyToText}
                                              </span>
                                            </div>
                                          );
                                        })()}
                                      <div className="flex flex-col gap-[6px] py-[5px] px-[10px]">
                                        <p className="font-iransans text-xs font-bold mb-1!">
                                          {msg.user}:
                                        </p>
                                        <p className="font-iransans text-xs">
                                          {msg.message}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {/* date centered under bubble */}
                                  <p className="text-xs text-gray-400 text-center">
                                    {msg.date}
                                  </p>
                                  {contextMenuOpen &&
                                    activeMessageId === msg.id && (
                                      <MessageContextMenu
                                        isOpen={true}
                                        onReply={() => handleReply(msg.id)}
                                        onEdit={
                                          msg.isUserMessage
                                            ? () => handleEdit(msg.id)
                                            : undefined
                                        }
                                        onDelete={
                                          msg.isUserMessage
                                            ? () => handleDelete(msg.id)
                                            : undefined
                                        }
                                        onReport={
                                          msg.isUserMessage
                                            ? undefined
                                            : () => handleReport(msg.id)
                                        }
                                        onClose={handleCloseMenu}
                                        position={isUserMsg ? "right" : "left"}
                                        triggerRef={{
                                          current: activeTriggerElement,
                                        }}
                                        isDeleting={
                                          deletingMessageId === msg.id
                                        }
                                        deleteLoadingComponent={
                                          <SpinnerLoading
                                            size={20}
                                            className="border-error-medium"
                                          />
                                        }
                                      />
                                    )}
                                </div>
                              </div>
                              {/* like — user side */}
                              {isUserMsg && (
                                <div className="flex flex-col items-center gap-1 shrink-0 self-center">
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
                                    className={`text-xs ${likedMessages[msg.id] ? "text-error-medium" : "text-gray-400"}`}
                                  >
                                    {msg.likes}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Reply Input for this message - Desktop only */}
                            {isDesktop &&
                              replyInputs[msg.id]?.show &&
                              activeReplyId === msg.id && (
                                <div className="flex items-center justify-start gap-3 mt-2">
                                  <div className="flex flex-col gap-2 items-center w-full max-w-[175px]">
                                    <div className="w-full bg-white rounded-lg p-2 border-2 border-gray-200">
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          scrollToReplyTarget(msg.id);
                                        }}
                                        className={`border-2 border-gray-400 rounded-full p-[10px] max-w-[70%] cursor-pointer mb-2 ${
                                          isUserMsg
                                            ? "ml-auto rounded-br-none"
                                            : "mr-auto rounded-bl-none"
                                        }`}
                                      >
                                        <p className="font-iransans text-xs text-gray-600 line-clamp-1 overflow-hidden">
                                          {msg.message}
                                        </p>
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
                            {/* Edit Input for this message - Desktop only */}
                            {isDesktop && editMsgId === msg.id && (
                              <div className="flex items-center justify-start gap-3 mt-2">
                                <div className="flex flex-col gap-2 items-center w-full max-w-[175px]">
                                  <div className="w-full bg-white rounded-lg p-2 border-2 border-gray-200">
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        scrollToReplyTarget(msg.id);
                                      }}
                                      className={`border-2 border-gray-400 rounded-full p-[10px] max-w-[70%] cursor-pointer mb-2 ${
                                        msg.isUserMessage
                                          ? "ml-auto rounded-br-none"
                                          : "mr-auto rounded-bl-none"
                                      }`}
                                    >
                                      <p className="font-iransans text-xs text-gray-600 line-clamp-1 overflow-hidden">
                                        {msg.message}
                                      </p>
                                    </div>
                                    <textarea
                                      ref={activeReplyInputRef}
                                      value={newComment}
                                      onChange={(e) => {
                                        setNewComment(e.target.value);
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                      }}
                                      placeholder="ویرایش دیدگاه..."
                                      className="w-full min-h-[48px] text-xs font-iransans resize-none outline-none"
                                    />
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={handleCancelEdit}
                                        disabled={submitting}
                                        className="px-2 py-1 text-xs font-iransans text-gray-400 disabled:opacity-50"
                                      >
                                        انصراف
                                      </button>
                                      <button
                                        onClick={() => handleSubmitComment()}
                                        disabled={
                                          !newComment.trim() || submitting
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

            {/* Reply/Comment Input Box - Fixed at bottom for mobile only */}
            {!isDesktop && (
              <div className="fixed right-0 left-0 bottom-0 flex items-end px-[10px] pt-2 pb-6 bg-white z-30">
                <div className="flex flex-col gap-3 flex-1">
                  {/* reply header */}
                  {activeReplyId && !editMsgId && (
                    <div className="flex items-center justify-center relative">
                      <span className="font-iransans font-bold text-primary text-base line-clamp-1 px-10">
                        پاسخ به دیدگاه{" "}
                        {findMessageAndBox(activeReplyId).message?.user ||
                          "کاربر"}
                      </span>
                      <button
                        onClick={() => handleCancelReply(activeReplyId)}
                        className="absolute left-3"
                      >
                        <CloseSquareIcon size={20} />
                      </button>
                    </div>
                  )}
                  {/* edit header */}
                  {editMsgId && (
                    <div className="flex items-center justify-center relative">
                      <span className="font-iransans font-bold text-primary text-base">
                        ویرایش دیدگاه
                      </span>
                      <button
                        onClick={handleCancelEdit}
                        className="absolute left-3"
                      >
                        <CloseSquareIcon size={20} />
                      </button>
                    </div>
                  )}
                  {/* report header */}
                  {reportMsgId && (
                    <div className="flex items-center justify-center relative">
                      <span className="font-iransans font-bold text-error-medium text-base line-clamp-1 px-10">
                        گزارش دیدگاه{" "}
                        {findMessageAndBox(reportMsgId).message?.user ||
                          "کاربر"}
                      </span>
                      <button
                        onClick={() => setReportMsgId(null)}
                        className="absolute left-3"
                      >
                        <CloseSquareIcon size={20} />
                      </button>
                    </div>
                  )}

                  {/* input wrapper */}
                  <div
                    className={
                      activeReplyId || reportMsgId || editMsgId
                        ? "bg-gray-200 rounded-xl p-[5px] flex flex-col gap-2"
                        : ""
                    }
                  >
                    {/* reply / edit / report preview */}
                    {(activeReplyId || editMsgId || reportMsgId) &&
                      (() => {
                        const previewId =
                          editMsgId || activeReplyId || reportMsgId;
                        const { message: previewMsg } =
                          findMessageAndBox(previewId);
                        const isOwnPreview = Boolean(previewMsg?.isUserMessage);

                        return (
                          <div
                            onClick={() =>
                              activeReplyId
                                ? scrollToReplyTarget(activeReplyId)
                                : undefined
                            }
                            className={`border-2 border-gray-400 rounded-full p-[10px] max-w-[70%] ${
                              activeReplyId ? "cursor-pointer" : ""
                            } ${
                              isOwnPreview
                                ? "ml-auto rounded-br-none"
                                : "mr-auto rounded-bl-none"
                            }`}
                          >
                            <p className="font-iransans text-xs text-gray-600 line-clamp-1 overflow-hidden">
                              {previewMsg?.message || ""}
                            </p>
                          </div>
                        );
                      })()}

                    <div
                      className={`relative flex items-end rounded-xl overflow-hidden ${
                        activeReplyId || reportMsgId || editMsgId
                          ? "bg-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {!activeReplyId &&
                        !reportMsgId &&
                        !editMsgId &&
                        !newComment.trim() && (
                          <span className="pointer-events-none absolute inset-y-0 right-4 left-12 flex items-center text-gray-400 text-sm">
                            <span className="line-clamp-1 w-full text-center">
                              دیدگاه شما در مورد {productName || "محصول"}
                            </span>
                          </span>
                        )}
                      <textarea
                        ref={activeReplyId ? activeReplyInputRef : inputRef}
                        placeholder={
                          reportMsgId
                            ? "توضیحات ...."
                            : editMsgId
                              ? "ویرایش ...."
                              : activeReplyId
                                ? "پاسخ ...."
                                : ""
                        }
                        value={
                          activeReplyId
                            ? replyInputs[activeReplyId]?.text || ""
                            : newComment
                        }
                        rows={1}
                        onChange={(e) => {
                          if (activeReplyId) {
                            handleReplyTextChange(
                              activeReplyId,
                              e.target.value,
                            );
                          } else {
                            setNewComment(e.target.value);
                          }
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="font-iransans placeholder:text-gray-400 text-gray-600 min-h-12 py-3 pr-4 w-full outline-none bg-transparent resize-none overflow-hidden leading-6 text-right placeholder:text-center placeholder:pr-8 flex-1"
                      />
                      <div className="flex items-center justify-center w-12 min-h-12 shrink-0">
                        {!activeReplyId &&
                          !reportMsgId &&
                          !editMsgId &&
                          newComment.trim().length === 0 && (
                            <>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer pr-3"
                              >
                                <ScanLineIcon className="text-gray-800" />
                              </button>
                            </>
                          )}
                        {(activeReplyId ||
                          reportMsgId ||
                          editMsgId ||
                          newComment.trim().length > 0) && (
                          <button
                            disabled={
                              (activeReplyId
                                ? !replyInputs[activeReplyId]?.text?.trim()
                                : !newComment.trim()) || submitting
                            }
                            onClick={() => {
                              if (reportMsgId) {
                                handleSubmitReport();
                              } else if (activeReplyId) {
                                handleSubmitComment(activeReplyId);
                              } else {
                                handleSubmitComment();
                              }
                            }}
                            className={`font-iransans transition-colors ${
                              (
                                activeReplyId
                                  ? replyInputs[activeReplyId]?.text?.trim()
                                  : newComment.trim()
                              )
                                ? "text-primary cursor-pointer"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {submitting ? (
                              <SpinnerLoading
                                size={16}
                                className="border-primary"
                              />
                            ) : (
                              "ارسال"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
