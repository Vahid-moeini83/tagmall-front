"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { HintIcon, StrokeArrowLeftIcon } from "@/icons";
import { formatPrice, toEnglishNumber } from "@/lib/client/utils";

function ProfileWalletAmountContent({
  type,
  walletBalance = 0,
  onBack,
  onNext,
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const numericAmount = Number(toEnglishNumber(amount).replace(/[٬,]/g, ""));
  const isFormValid =
    amount &&
    numericAmount >= 0 &&
    (type === "increase" || numericAmount <= walletBalance);

  const handleChange = (e) => {
    const rawValue = toEnglishNumber(e.target.value).replace(/[^0-9]/g, "");

    if (rawValue === "") {
      setAmount("");
    } else {
      setAmount(formatPrice(rawValue));
    }

    if (error) setError("");
  };

  const handleSubmit = () => {
    if (!amount) {
      setError("لطفا مبلغ مورد نظر را وارد نمایید");
      return;
    }

    if (type === "withdraw" && numericAmount > walletBalance) {
      setError("مبلغ درخواستی بیشتر از موجودی شما است");
      return;
    }

    if (numericAmount < 1000) {
      setError("حداقل مبلغ 1,000 تومان می‌باشد");
      return;
    }

    setIsLoading(true);
    onNext(numericAmount);
    setIsLoading(false);
  };

  return (
    <div className="mt-3 lg:mt-0">
      {/* Input with back button */}
      <div className="relative">
        <Input
          label={
            type === "withdraw"
              ? "درخواست وجه از کیف پول اعتباری:"
              : "افزایش اعتبار کیف پول اعتباری:"
          }
          type="text"
          value={amount}
          onChange={handleChange}
          disabled={isLoading}
          className={`h-[50px] text-center text-gray-600 bg-gray-200 ${error ? "" : "border-0!"}`}
          labelClassName={"mb-2"}
          placeholder={"مبلغ"}
          error={error}
        />
        {amount && (
          <span className="absolute left-4 top-13.5 lg:top-12 text-gray-600 pointer-events-none">
            تومان
          </span>
        )}
        <StrokeArrowLeftIcon
          size={20}
          className="absolute left-3 top-1 cursor-pointer lg:hidden"
          onClick={onBack}
        />
      </div>

      {/* Hint for withdraw */}
      {type === "withdraw" && (
        <div className="mt-[15px] mb-3.5 mr-4 flex items-center gap-5">
          <HintIcon size={20} />
          <span className="text-sm text-gray-600">
            موجودی شما {formatPrice(walletBalance)} تومان می‌باشد
          </span>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isLoading}
        className={`mb-4 mt-1.5 w-full text-base py-2 rounded-full border-2 ${
          !isFormValid || isLoading
            ? "text-gray-400 border-gray-400 cursor-not-allowed"
            : "text-primary border-primary cursor-pointer hover:opacity-80"
        } transition-opacity`}
      >
        {type === "increase" ? "افزایش اعتبار" : "درخواست وجه"}
      </button>
    </div>
  );
}

export default ProfileWalletAmountContent;
