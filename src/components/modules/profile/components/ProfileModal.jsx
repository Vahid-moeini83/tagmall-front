"use client";

import { useState } from "react";
import { ProfileEditInfo, ProfileMainPanel, ProfileWallet } from "..";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import SellerReviewsContent from "../../seller-reviews/components/SellerReviewsContent";
import { StrokeArrowLeftIcon } from "@/icons";

export default function ProfileModal({
  isOpen,
  onClose,
  triggerElement,
  setIsProfileOpen,
}) {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleWalletAmountUpdate = (amount) => {
    setWalletAmount(amount);
  };

  if (!isOpen) return;

  // Display back arrow when editing profile, otherwise show avatar
  const displayElement = isEditingProfile ? (
    <div
      onClick={() => setIsEditingProfile(false)}
      className="cursor-pointer w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-md"
    >
      <StrokeArrowLeftIcon size={20} />
    </div>
  ) : (
    triggerElement
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm z-90"
        onClick={onClose}
      />
      {/* Trigger element (avatar or back arrow) - stays visible above backdrop */}
      {displayElement && (
        <div className="fixed z-100 bottom-[calc(12px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 lg:right-6 xl:right-8 lg:bottom-8 lg:left-auto lg:translate-x-0 pointer-events-auto">
          {displayElement}
        </div>
      )}
      {/* Modal */}
      <div className="fixed inset-0 lg:inset-auto lg:right-[calc(96px+24px)] xl:right-[calc(104px+24px)] lg:bottom-8 lg:max-w-[640px] lg:w-full z-100 bottom-[calc(72px+env(safe-area-inset-bottom))] lg:top-[16px]">
        <div className="bg-white lg:rounded-lg h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden">
          {/* --- Main profile --- */}
          {!isEditingProfile && (
            <ProfileMainPanel
              setIsWalletOpen={setIsWalletOpen}
              setIsEditingProfile={setIsEditingProfile}
              setIsProfileOpen={setIsProfileOpen}
              onWalletAmountUpdate={handleWalletAmountUpdate}
            />
          )}

          {/* Edit info */}
          {isEditingProfile &&
            (isDesktop ? (
              <ProfileEditInfo
                setIsEditingProfile={setIsEditingProfile}
                setIsProfileOpen={setIsProfileOpen}
              />
            ) : (
              <Drawer
                open={isEditingProfile}
                onOpenChange={() => setIsEditingProfile(false)}
              >
                <DrawerContent
                  className="z-100! h-[96%]!"
                  overlayClassName="z-100 lg:hidden"
                >
                  <ProfileEditInfo
                    setIsEditingProfile={setIsEditingProfile}
                    setIsProfileOpen={setIsProfileOpen}
                  />
                </DrawerContent>
              </Drawer>
            ))}
        </div>
      </div>
      {/* Wallet panel */}
      <ProfileWallet
        isOpen={isWalletOpen}
        setIsOpen={setIsWalletOpen}
        walletBalance={walletAmount}
      />
    </>
  );
}
