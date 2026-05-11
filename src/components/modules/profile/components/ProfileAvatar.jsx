"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import DialogWrapper from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ProfileAvatarContent, ProfileAvatarSourceContent } from "..";

function ProfileAvatar({
  isOpen,
  setIsOpen,
  isUpdating,
  user,
  onUpdateAvatar,
  onRemoveAvatar,
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Step: 1 = add/edit/delete | 2 = select source (mobile only)
  const [step, setStep] = useState(1);

  const close = () => {
    setStep(1);
    setIsOpen(false);
  };

  const renderContent = () => {
    if (step === 1) {
      return (
        <ProfileAvatarContent
          user={user}
          isUpdating={isUpdating}
          onAdd={() => {
            // در صورتی که تصویر ندارد
            if (isDesktop) {
              // انتخاب مستقیم فایل
              document.getElementById("desktop-avatar-file").click();
              return;
            }
            setStep(2);
          }}
          onChange={() => {
            if (isDesktop) {
              document.getElementById("desktop-avatar-file").click();
            } else {
              setStep(2);
            }
          }}
          onRemove={() => {
            onRemoveAvatar();
            close();
          }}
        />
      );
    }

    if (step === 2) {
      return (
        <ProfileAvatarSourceContent
          user={user}
          isUpdating={isUpdating}
          onBack={() => setStep(1)}
          onCamera={() => {
            document.getElementById("mobile-camera-file").click();
          }}
          onGallery={() => {
            document.getElementById("mobile-gallery-file").click();
          }}
          onRemove={() => {
            onRemoveAvatar();
            close();
          }}
        />
      );
    }
  };

  return (
    <>
      {/* Hidden input for desktop direct upload */}
      <input
        type="file"
        id="desktop-avatar-file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onUpdateAvatar(e);
          e.target.value = "";
        }}
      />

      {/* Hidden inputs for mobile */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        id="mobile-camera-file"
        className="hidden"
        onChange={(e) => {
          onUpdateAvatar(e);
          e.target.value = "";
        }}
      />

      <input
        type="file"
        accept="image/*"
        id="mobile-gallery-file"
        className="hidden"
        onChange={(e) => {
          onUpdateAvatar(e);
          e.target.value = "";
        }}
      />

      {isDesktop ? (
        <DialogWrapper isOpen={isOpen} onClose={close}>
          {renderContent()}
        </DialogWrapper>
      ) : (
        <Drawer open={isOpen} onOpenChange={close}>
          <DrawerContent
            className="z-100! px-[10px]"
            overlayClassName="z-100 lg:hidden"
          >
            {renderContent()}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default ProfileAvatar;
