"use client";

import { ReplyIcon, Trash2Icon } from "lucide-react";
import { HintIcon } from "@/icons";
import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";

export default function MessageContextMenu({
  isOpen,
  onReply,
  onDelete,
  onEdit,
  onReport,
  onClose,
  position = "right",
  triggerRef,
  isDeleting = false,
  deleteLoadingComponent,
}) {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isReady, setIsReady] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setIsReady(false);
      return;
    }

    // رندر منو بدون visibility تا بتونیم سایز واقعیش رو بگیریم
    requestAnimationFrame(() => {
      if (!triggerRef?.current || !menuRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuWidth = menuRef.current.offsetWidth;
      const menuHeight = menuRef.current.offsetHeight;
      const isMobile = window.innerWidth < 1024;

      let top = triggerRect.bottom + (isMobile ? -23 : 5);
      let left =
        position === "right" ? triggerRect.right - menuWidth : triggerRect.left;

      // بررسی خروج از پایین صفحه
      if (top + menuHeight > window.innerHeight) {
        top = triggerRect.top - menuHeight - (isMobile ? -20 : 5);
      }

      // بررسی خروج از راست یا چپ صفحه
      if (left < 0) {
        left = 10;
      } else if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10;
      }

      setMenuPosition({ top, left });
      setIsReady(true);
    });
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
        visibility: isReady ? "visible" : "hidden",
      }}
      className="bg-white border-0 rounded-lg shadow-xl min-w-[100px] overflow-hidden transition-opacity duration-200 opacity-100"
    >
      {onReply && (
        <div
          onClick={(e) => {
            console.log("Reply button clicked in menu");
            e.stopPropagation();
            onReply();
            onClose();
          }}
          className="font-iransans relative text-center text-sm lg:text-base text-primary px-2 py-3 lg:py-2 cursor-pointer hover:bg-gray-100 transition-colors select-none border-b-2 border-gray-200"
        >
          پاسخ
        </div>
      )}

      {onEdit && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
            onClose();
          }}
          className="font-iransans relative text-center text-sm lg:text-base text-primary px-2 py-3 lg:py-2 cursor-pointer hover:bg-gray-100 transition-colors select-none border-b-2 border-gray-200"
        >
          ویرایش
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
          className={`relative flex items-center justify-center text-sm lg:text-base text-error-medium px-2 py-3 lg:py-2 transition-colors select-none border-b-2 border-gray-200 ${
            isDeleting
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:bg-error-light"
          }`}
        >
          {isDeleting && deleteLoadingComponent ? (
            deleteLoadingComponent
          ) : (
            <span className="font-iransans">حذف</span>
          )}
        </div>
      )}

      {onReport && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onReport();
            onClose();
          }}
          className="font-iransans relative text-center text-sm lg:text-base text-error-medium px-2 py-3 lg:py-2 cursor-pointer hover:bg-error-light transition-colors select-none"
        >
          گزارش
        </div>
      )}
    </div>
  );
}
