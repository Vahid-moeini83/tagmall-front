"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/client/utils";
import { CloseIcon, StrokeArrowLeftIcon } from "@/icons";

function Dialog(props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-gray-200/40 backdrop-blur-sm fixed inset-0 z-100",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  onBack,
  overlayClassName,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "outline-none focus:outline-none bg-white border border-gray-200 rounded-lg shadow-xl py-4 px-[10px] lg:px-[50px] lg:py-[50px] data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 duration-200 fixed top-1/2 left-1/2 z-200 w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[600px] -translate-x-1/2 -translate-y-1/2",
          className,
        )}
        {...props}
      >
        {children}

        {/* دکمه‌های بیرونی */}
        {onBack ? (
          <div className="absolute left-0 -top-14 bg-white w-[100px] h-[50px] rounded-lg border border-gray-200 flex items-center justify-between overflow-hidden">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-1/2 h-full flex items-center justify-center border-l-2 border-gray-200 outline-none focus:outline-none"
              aria-label="بازگشت"
            >
              <StrokeArrowLeftIcon size={20} />
              <span className="sr-only">بازگشت</span>
            </button>

            {/* Close Button */}
            <DialogPrimitive.Close data-slot="dialog-close" asChild>
              <button
                className="w-1/2 h-full flex items-center justify-center outline-none focus:outline-none"
                aria-label="بستن"
              >
                <CloseIcon size={20} />
                <span className="sr-only">بستن</span>
              </button>
            </DialogPrimitive.Close>
          </div>
        ) : (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <button
              className="absolute left-0 -top-14 bg-white w-[50px] h-[50px] rounded-lg border border-gray-200 flex items-center justify-center transition-colors cursor-pointer outline-none focus:outline-none"
              aria-label="بستن"
            >
              <CloseIcon size={20} />
              <span className="sr-only">بستن</span>
            </button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left pb-4",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            بستن
          </button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-bold leading-none tracking-tight text-center",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
