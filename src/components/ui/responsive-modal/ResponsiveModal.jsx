"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import DialogWrapper from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

function ResponsiveModal({
  isOpen,
  onClose,
  children,
  title,
  isHintBox = false,
  nested = false,
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <DialogWrapper
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        className={nested ? "z-300!" : undefined}
        overlayClassName={nested ? "z-250!" : undefined}
      >
        {children}
      </DialogWrapper>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        className={`z-100! px-[10px] ${isHintBox ? "h-[96%]!" : ""}`}
        overlayClassName="z-100"
        isHintBox={true}
      >
        <div className={`${isHintBox ? "pt-2" : ""}`}>
          {title && (
            <h2 className="font-bold text-primary text-base lg:text-lg mt-1 mb-4">
              {title}
            </h2>
          )}
          {children}
        </div>
        {isHintBox && (
          <button
            onClick={onClose}
            className="text-primary text-base text-center mx-auto py-3"
          >
            متوجه شدم
          </button>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default ResponsiveModal;
