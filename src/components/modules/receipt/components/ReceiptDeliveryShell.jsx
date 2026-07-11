"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import usePublicStore from "@/app/store/publicStore";
import ReceiptDeliveryContent from "./ReceiptDeliveryContent";

function ReceiptDeliveryShell() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const receiptDrawerOpen = usePublicStore((s) => s.receiptDrawerOpen);
  const receiptData = usePublicStore((s) => s.receiptData);
  const closeReceiptDrawer = usePublicStore((s) => s.closeReceiptDrawer);

  const handleClose = () => {
    closeReceiptDrawer();
  };

  if (!receiptDrawerOpen) return null;

  if (isDesktop) {
    return (
      <div className="fixed inset-0 z-1000 h-screen bg-white">
        <ReceiptDeliveryContent
          receiptData={receiptData}
          onClose={handleClose}
        />
      </div>
    );
  }

  return (
    <Drawer
      open={receiptDrawerOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DrawerContent
        className="z-100! fixed! h-[96%]! px-0"
        overlayClassName="z-100 lg:hidden"
      >
        <ReceiptDeliveryContent
          receiptData={receiptData}
          onClose={handleClose}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default ReceiptDeliveryShell;
