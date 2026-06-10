"use client";

import { ReplyIcon, Trash2Icon } from "lucide-react";
import { HintIcon } from "@/icons";
import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";

export default function MessageContextMenu({
  isOpen,
  onReply,
  onDelete,
  onReport,
  onClose,
  position = "right", // "right" or "left"
  triggerRef, // ref to the element that triggered the menu
  isDeleting = false, // آیا در حال حذف است
  deleteLoadingComponent, // کامپوننت لودینگ برای حذف
}) {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isReady, setIsReady] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuHeight = 150; // تقریبی ارتفاع منو
      const menuWidth = 150;
      const isMobile = window.innerWidth < 1024;

      let top = triggerRect.bottom + (isMobile ? -20 : 5);
      let left =
        position === "right" ? triggerRect.right - menuWidth : triggerRect.left;

      // بررسی اینکه آیا منو از پایین صفحه خارج می‌شود
      if (top + menuHeight > window.innerHeight) {
        top = triggerRect.top - menuHeight - (isMobile ? -20 : 5);
      }

      // بررسی اینکه آیا منو از راست یا چپ صفحه خارج می‌شود
      if (left < 0) {
        left = 10;
      } else if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10;
      }

      setMenuPosition({ top, left });
      // کمی تاخیر برای اینکه موقعیت اول set شود، بعد انیمیشن شروع شود
      requestAnimationFrame(() => {
        setIsReady(true);
      });
    } else {
      setIsReady(false);
    }
  }, [isOpen, triggerRef, position]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        zIndex: 999,
      }}
      className={`bg-white text-gray-800 border-0 rounded-md ${position === "right" ? "rounded-tr-none" : "rounded-tl-none"} shadow-xl min-w-[150px] overflow-hidden p-1 transition-opacity duration-200 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
    >
      {onReply && (
        <div
          onClick={(e) => {
            console.log("Reply button clicked in menu");
            e.stopPropagation();
            onReply();
            onClose();
          }}
          className="relative text-center text-xs lg:text-base text-gray-700 px-2 py-3 lg:py-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-colors select-none"
        >
          <ReplyIcon size={20} className="absolute top-1/2 -translate-y-1/2" />
          <span className="mr-2">پاسخ</span>
        </div>
      )}

      {onDelete && (
        <div
          onClick={(e) => {
            if (isDeleting) return; // جلوگیری از کلیک در حین حذف
            e.stopPropagation();
            onDelete();
            // منو را بعد از حذف نمی‌بندیم، چون می‌خواهیم لودینگ را نشان دهیم
          }}
          className={`relative text-center text-xs lg:text-base text-error-medium px-2 py-3 lg:py-2 rounded-sm transition-colors select-none ${
            isDeleting
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:bg-error-light"
          }`}
        >
          <div className="absolute top-1/2 -translate-y-1/2">
            {isDeleting && deleteLoadingComponent ? (
              deleteLoadingComponent
            ) : (
              <Trash2Icon
                size={20}
                className="absolute top-1/2 -translate-y-1/2"
              />
            )}
          </div>
          <span className="mr-2">حذف</span>
        </div>
      )}

      {onReport && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onReport();
            onClose();
          }}
          className="relative text-center text-xs lg:text-base text-error-medium px-2 py-3 lg:py-2 cursor-pointer hover:bg-error-light rounded-sm transition-colors select-none"
        >
          <HintIcon size={20} className="absolute top-1/2 -translate-y-1/2" />
          <span className="mr-2">گزارش</span>
        </div>
      )}
    </div>
  );
}
