"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import DialogWrapper from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ProfileBankAccountContent } from "..";

function ProfileBankAccount({ isOpen, setIsOpen, onSubmit }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const close = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      close();
    }
  };

  return isDesktop ? (
    <DialogWrapper isOpen={isOpen} onClose={close}>
      <ProfileBankAccountContent onSubmit={handleSubmit} />
    </DialogWrapper>
  ) : (
    <Drawer open={isOpen} onOpenChange={close}>
      <DrawerContent className="z-100! px-[10px]" overlayClassName="z-100">
        <ProfileBankAccountContent onSubmit={handleSubmit} />
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileBankAccount;
