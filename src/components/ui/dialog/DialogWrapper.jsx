"use client";

import { cn } from "@/lib/client/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function DialogWrapper({
  title,
  isOpen,
  onClose,
  hideInMobile = false,
  children,
  showCloseButton = true,
  className,
  titleClassName,
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (hideInMobile && !isDesktop) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(className, `${hideInMobile ? "hidden lg:block" : ""}`)}
      >
        {title && (
          <DialogHeader>
            <DialogTitle className="text-primary">{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className={`text-sm lg:text-base ${title ? "mt-2 lg:mt-4" : ""}`}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWrapper;
