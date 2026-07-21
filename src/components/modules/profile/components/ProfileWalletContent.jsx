"use client";

import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import { HintIcon } from "@/icons";
import { formatPrice, toEnglishNumber } from "@/lib/client/utils";
import { chargeWalletAmount } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import { useState } from "react";
import toast from "react-hot-toast";

function ProfileWalletContent({ setIsOpen }) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const numericAmount = Number(toEnglishNumber(amount).replace(/[٬,]/g, ""));

  const handleSuggestedAmount = (value) => {
    setAmount(formatPrice(value));
  };

  const handleChange = (e) => {
    const rawValue = toEnglishNumber(e.target.value).replace(/[^0-9]/g, "");

    if (rawValue === "") {
      setAmount("");
    } else {
      setAmount(formatPrice(rawValue));
    }
  };

  const handleChargeWallet = async () => {
    setIsSubmitted(true);

    if (!amount) {
      toast.error("لطفا مبلغ مورد نظر را وارد نمایید");
      return;
    }

    if (numericAmount < 1000) return;

    const payload = {
      amount: numericAmount,
    };

    const token = await getToken();

    setIsLoading(true);
    const { chargeWalletRes, chargeWalletErr } = await chargeWalletAmount(
      token,
      payload,
    );
    if (chargeWalletRes) {
      console.log(chargeWalletRes);
      setAmount("");
      window.open(
        chargeWalletRes?.data?.payment_url,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (chargeWalletErr) {
      toast.error("خطا در شارژ کیف پول");
    }
    setIsLoading(false);
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-14">
        <p className="text-gray-600 text-base">
          لطفا مبلغ مورد نظر برای افزایش موجودی را وارد نمایید.
        </p>
        <div className="space-y-4">
          {/* Amount input */}
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleChange}
              className="outline-none border-2 border-gray-400 h-12 rounded-md px-2 w-full text-center"
              dir="ltr"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
              تومان
            </span>
          </div>
          {/* Default buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSuggestedAmount(500000)}
              className="px-2.5 flex-1 h-10 border border-gray-400 cursor-pointer rounded-sm hover:bg-gray-50 transition-colors text-sm"
            >
              {formatPrice(500000)} تومان
            </button>
            <button
              onClick={() => handleSuggestedAmount(1000000)}
              className="px-2.5 h-10 flex-1 border border-gray-400 cursor-pointer rounded-sm hover:bg-gray-50 transition-colors text-sm"
            >
              {formatPrice(1000000)} تومان
            </button>
            <button
              onClick={() => handleSuggestedAmount(2000000)}
              className="px-2.5 h-10 flex-1 border border-gray-400 cursor-pointer rounded-sm hover:bg-gray-50 transition-colors text-sm"
            >
              {formatPrice(2000000)} تومان
            </button>
          </div>
          {/* Hint text */}
          <div
            className={`${isSubmitted && numericAmount < 1000 ? "text-error-medium" : "text-gray-600"} flex items-center gap-1`}
          >
            <HintIcon
              size={16}
              className={`${isSubmitted && numericAmount < 1000 ? "text-error-medium" : "text-gray-600"}`}
            />
            حداقل مبلغ شارژ {formatPrice(1000)} تومان می‌باشد
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-[10px] mt-14">
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-md h-12 flex-1 flex items-center justify-center border-2 border-primary text-primary text-base cursor-pointer transition-all"
        >
          انصراف
        </button>
        <button
          onClick={handleChargeWallet}
          className="rounded-md h-12 flex-1 flex items-center justify-center bg-primary text-white text-base cursor-pointer transition-all"
        >
          {isLoading ? <SpinnerLoading /> : " پرداخت"}
        </button>
      </div>
    </div>
  );
}
export default ProfileWalletContent;
