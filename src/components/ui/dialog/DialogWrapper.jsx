"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog";

function DialogWrapper({
  title,
  isOpen,
  onClose,
  children,
  showCloseButton = true,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={showCloseButton}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className={title ? "mt-6" : ""}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWrapper;
