"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { HintIcon } from "@/icons";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function ProfileBankAccountContent({ activeAddressAuth, onSubmit }) {
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isDrawer = !useMediaQuery("(min-width: 1024px)");

  const isFormValid =
    address.trim() && postalCode.trim() && postalCode.length === 10;

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit({ address, postalCode });
    setIsLoading(false);
  };

  return (
    <div className="mt-4 lg:mt-0">
      <div className="flex flex-col gap-3">
        <span className="text-gray-800 text-base">
          افزودن آدرس به حساب کاربری:
        </span>
        <div className="rounded-lg bg-gray-200 overflow-hidden">
          <textarea
            placeholder="آدرس"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
            rows={3}
            className="w-full outline-none py-9 px-[10px] text-center h-[100px] border-b-2 border-white placeholder:text-gray-400 resize-none overflow-y-auto scroll-hidden"
          ></textarea>
          <Input
            placeholder="کد پستی"
            numeric={true}
            value={postalCode}
            maxLength={10}
            onChange={(e) => setPostalCode(e.target.value)}
            disabled={isLoading}
            className="text-center border-0! h-[50px] placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Hint text */}
      {activeAddressAuth && (
        <div className="flex items-center gap-2 text-gray-600 mt-4 mr-4">
          <HintIcon size={20} />
          احراز کد پستی توسط اداره پست انجام می‌شود
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isLoading}
        className={
          isDrawer
            ? `w-full text-center border-2 rounded-full py-2 px-4 mt-2 mb-2 text-base ${
                !isFormValid || isLoading
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-primary border-primary cursor-pointer"
              }`
            : `w-full mt-7 pb-4 text-base ${
                !isFormValid || isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary cursor-pointer"
              }`
        }
      >
        {activeAddressAuth ? "احراز کد پستی" : "افزودن موقعیت"}
      </button>
    </div>
  );
}

export default ProfileBankAccountContent;
