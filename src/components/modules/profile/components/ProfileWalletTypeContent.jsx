"use client";

import { useState } from "react";
import { HintIcon } from "@/icons";
import ResponsiveModal from "@/components/ui/responsive-modal";

function ProfileWalletTypeContent({ onSelectType }) {
  const [isHintOpen, setIsHintOpen] = useState(false);

  return (
    <div className="mt-4 lg:mt-0">
      {/* Title with hint icon */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-primary text-lg font-bold">کیف پول اعتباری</span>
        <HintIcon
          size={20}
          className="ml-4 cursor-pointer"
          onClick={() => setIsHintOpen(true)}
        />
      </div>

      {/* Two options */}
      <div className="overflow-hidden space-y-[10px]">
        <button
          onClick={() => onSelectType("increase")}
          className="text-gray-600 border-2 border-gray-200 rounded-full px-4 py-2.5 text-base text-center cursor-pointer w-full"
        >
          افزایش اعتبار
        </button>

        <button
          onClick={() => onSelectType("withdraw")}
          className="text-gray-600 border-2 border-gray-200 rounded-full px-4 py-2.5 text-base text-center cursor-pointer w-full"
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
