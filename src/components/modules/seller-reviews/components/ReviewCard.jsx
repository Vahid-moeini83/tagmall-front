"use client";

import { useEffect, useRef, useState } from "react";
import { StarIcon } from "@/icons";
import MessageContextMenu from "@/components/ui/MessageContextMenu";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";

export default function ReviewCard({
  review,
  isUserReview,
  onDelete,
  onReport,
  isDeleting = false,
}) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState(null); // "review" | "reply"
  const [activeTriggerElement, setActiveTriggerElement] = useState(null);

  const reviewTriggerRef = useRef(null);
  const replyTriggerRef = useRef(null);
  const reviewMenuRef = useRef(null);
  const replyMenuRef = useRef(null);

  const borderColor = isUserReview ? "border-primary" : "border-gray-200";

  const handleCloseMenu = () => {
    setContextMenuOpen(false);
    setActiveTarget(null);
    setActiveTriggerElement(null);
  };

  const handleOpenMenu = (e, target) => {
    e.preventDefault();
    e.stopPropagation();

    if (contextMenuOpen && activeTarget === target) {
      handleCloseMenu();
      return;
    }

    const triggerEl =
      target === "reply" ? replyTriggerRef.current : reviewTriggerRef.current;

    setContextMenuOpen(true);
    setActiveTarget(target);
    setActiveTriggerElement(triggerEl);
  };

  // Close menu with outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!contextMenuOpen) return;

      const activeMenuEl =
        activeTarget === "reply" ? replyMenuRef.current : reviewMenuRef.current;

      if (activeMenuEl && !activeMenuEl.contains(e.target)) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenuOpen, activeTarget]);

  return (
    <>
      {/* Context menu overlay */}
      {contextMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-200/20 backdrop-blur-sm z-998"
          onClick={handleCloseMenu}
        />
      )}

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-4 items-start justify-between w-full">
          {/* Customer review - right side */}
          <div className="w-full flex justify-start">
            <div
              ref={reviewMenuRef}
              className={`relative flex flex-col gap-1 items-start ${
                contextMenuOpen && activeTarget === "review" ? "z-999" : ""
              }`}
            >
              <div
                className={`max-w-[380px] lg:max-w-[440px] flex flex-col gap-2 ${
                  contextMenuOpen && activeTarget === "review" ? "z-999" : ""
                }`}
              >
                {/* Trigger is only the bubble — same spacing as chat */}
                <div
                  ref={reviewTriggerRef}
                  className="relative cursor-context-menu"
                  onClick={(e) => handleOpenMenu(e, "review")}
                  onContextMenu={(e) => handleOpenMenu(e, "review")}
                >
                  <div
                    className={`flex flex-col gap-3 border-2 ${borderColor} rounded-t-xl rounded-bl-xl p-[10px] ${
                      contextMenuOpen ? "bg-white" : ""
                    }`}
                    data-bubble
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm lg:text-base text-gray-600">
                        {review.rating}
                        <span className="text-xs text-gray-600/50">/5</span>
                      </span>
                      <StarIcon className="w-[10px] h-[10px] text-yellow-600 mb-1" />
                    </div>

                    <p className="text-gray-600 font-iransans text-xs lg:text-sm leading-relaxed">
                      <span className="font-iransans font-semibold text-gray-800">
                        {review.userName} :
                      </span>{" "}
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                      <span className="font-iransans">
                        {review.productName}
                      </span>
                    </div>
                  </div>

                  {contextMenuOpen &&
                    activeTarget === "review" &&
                    activeTriggerElement && (
                      <MessageContextMenu
                        isOpen={true}
                        onDelete={
                          isUserReview ? () => onDelete?.(review.id) : undefined
                        }
                        onReport={
                          !isUserReview
                            ? () => {
                                onReport?.(review);
                                handleCloseMenu();
                              }
                            : undefined
                        }
                        onClose={handleCloseMenu}
                        position="right"
                        triggerRef={{ current: activeTriggerElement }}
                        isDeleting={isDeleting}
                        deleteLoadingComponent={
                          <SpinnerLoading
                            size={20}
                            className="border-error-medium"
                          />
                        }
                      />
                    )}
                </div>

                <div className="text-center text-gray-400 text-xs">
                  {review.timeAgo}
                </div>
              </div>
            </div>
          </div>

          {/* Seller reply - left side */}
          {review.sellerReply && (
            <div className="w-full flex justify-end">
              <div
                ref={replyMenuRef}
                className={`relative max-w-[380px] lg:max-w-[440px] ${
                  contextMenuOpen && activeTarget === "reply" ? "z-999" : ""
                }`}
              >
                <div
                  ref={replyTriggerRef}
                  className={`relative cursor-context-menu ${
                    contextMenuOpen && activeTarget === "reply" ? "z-999" : ""
                  }`}
                  onClick={(e) => handleOpenMenu(e, "reply")}
                  onContextMenu={(e) => handleOpenMenu(e, "reply")}
                >
                  <p
                    className={`text-gray-600 font-iransans text-xs lg:text-sm leading-relaxed border-2 border-gray-200 rounded-t-lg rounded-br-lg p-[10px] flex flex-col gap-3 ${
                      contextMenuOpen ? "bg-white" : ""
                    }`}
                    data-bubble
                  >
                    <span className="font-semibold font-iransans text-gray-800">
                      پاسخ فروشنده:
                    </span>{" "}
                    {review.sellerReply.comment}
                  </p>

                  {contextMenuOpen &&
                    activeTarget === "reply" &&
                    activeTriggerElement && (
                      <MessageContextMenu
                        isOpen={true}
                        onReport={() => {
                          onReport?.(review.sellerReply);
                          handleCloseMenu();
                        }}
                        onClose={handleCloseMenu}
                        position="left"
                        triggerRef={{ current: activeTriggerElement }}
                      />
                    )}
                </div>

                <div className="text-center text-gray-400 text-xs mt-2">
                  {review.sellerReply.timeAgo}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
