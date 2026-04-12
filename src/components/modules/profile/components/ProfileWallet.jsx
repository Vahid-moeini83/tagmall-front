"use client";

import DialogWrapper from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ProfileWalletContent } from "..";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

function ProfileWallet({ isOpen, setIsOpen }) {
  // Use media query to render conditionally
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return isDesktop ? (
    <DialogWrapper
      title={"افزایش موجودی"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ProfileWalletContent setIsOpen={setIsOpen} />
    </DialogWrapper>
  ) : (
    <Drawer open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DrawerContent
        className="z-100! px-[10px]"
        overlayClassName="z-100 lg:hidden"
      >
        <h2 className="text-xl font-bold mb-4">افزایش موجودی</h2>
        <ProfileWalletContent setIsOpen={setIsOpen} />
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileWallet;
