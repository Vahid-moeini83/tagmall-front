"use client";

import { useState } from "react";
import { HintIcon } from "@/icons";
import ResponsiveModal from "@/components/ui/responsive-modal";

function ProfileWalletTypeContent({ onSelectType }) {
  const [isHintOpen, setIsHintOpen] = useState(false);

  return (
    <div className="mt-2 lg:mt-0">
      {/* Title with hint icon */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-800 text-lg font-bold">کیف پول اعتباری</span>
        <HintIcon
          size={20}
          className="ml-4 cursor-pointer"
          onClick={() => setIsHintOpen(true)}
        />
      </div>

      {/* Two options */}
      <div className="overflow-hidden">
        <button
          onClick={() => onSelectType("increase")}
          className="text-primary text-base py-4 text-center cursor-pointer w-full"
        >
          افزایش اعتبار
        </button>

        <div className="w-full h-[2px] bg-gray-200" />

        <button
          onClick={() => onSelectType("withdraw")}
          className="text-primary text-base py-4 text-center cursor-pointer w-full"
        >
          درخواست وجه
        </button>
      </div>

      {/* Hint Modal */}
      <ResponsiveModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        title="راهنما"
        isHintBox
        nested={true}
      >
        <p className="text-gray-600 text-base text-justify">
          این یک متن تستی برای راهنمای کیف پول اعتباری است. در اینجا می‌توانید
          توضیحات مربوط به نحوه استفاده از کیف پول، افزایش اعتبار و درخواست وجه
          را قرار دهید.
        </p>
      </ResponsiveModal>
    </div>
  );
}

export default ProfileWalletTypeContent;
