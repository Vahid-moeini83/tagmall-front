"use client";

import { useState } from "react";
import { ProfileEditInfo, ProfileMainPanel, ProfileWallet } from "..";

export default function ProfileModal({ isOpen, onClose, triggerElement }) {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (!isOpen) return;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm z-90"
        onClick={onClose}
      />
      {/* Trigger element (avatar) - stays visible above backdrop */}
      {triggerElement && (
        <div className="fixed z-100 bottom-[calc(12px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 lg:right-6 xl:right-8 lg:bottom-8 lg:left-auto lg:translate-x-0 pointer-events-none">
          {triggerElement}
        </div>
      )}
      {/* Modal */}
      <div className="fixed inset-0 lg:inset-auto lg:right-[calc(96px+24px)] xl:right-[calc(104px+24px)] lg:bottom-8 lg:max-w-[500px] lg:w-full z-100 bottom-[calc(72px+env(safe-area-inset-bottom))] lg:top-[16px]">
        <div className="bg-white lg:rounded-lg h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden">
          {/* --- Main profile --- */}
          {!isEditingProfile && (
            <ProfileMainPanel
              setIsWalletOpen={setIsWalletOpen}
              setIsEditingProfile={setIsEditingProfile}
            />
          )}

          {/* Edit info */}
          {isEditingProfile && (
            <ProfileEditInfo setIsEditingProfile={setIsEditingProfile} />
          )}
        </div>
      </div>
      {/* Wallet panel */}
      {isWalletOpen && (
        <ProfileWallet isOpen={isWalletOpen} setIsOpen={setIsWalletOpen} />
      )}
    </>
  );
}
