"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { HintIcon } from "@/icons";
import { formatSheba, toEnglishNumber } from "@/lib/client/utils";
import { getBankBySheba } from "@/lib/client/banks";
import { IranianBank } from "iranian-bank-logo-react";
import { isValidShebaNumber } from "@/lib/client/validations";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function ProfileBankAccountContent({ onSubmit }) {
  const [sheba, setSheba] = useState("");
  const [error, setError] = useState("");
  const [detectedBankName, setDetectedBankName] = useState("");
  const [detectedBankIcon, setDetectedBankIcon] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const isDrawer = !useMediaQuery("(min-width: 1024px)");

  const isFormValid = sheba.length === 24 && isValidShebaNumber(`IR${sheba}`);

  const handleShebaChange = (e) => {
    const value = e.target.value;
    // فقط اعداد را قبول کن
    const cleaned = toEnglishNumber(value).replace(/\D/g, "");

    if (cleaned.length <= 24) {
      setSheba(cleaned);
    }

    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!sheba.trim()) {
      setError("لطفا شماره شبا را وارد کنید");
      return;
    }

    if (sheba.length !== 24) {
      setError("شماره شبا باید 24 رقم باشد");
      return;
    }

    const fullSheba = `IR${sheba}`;
    if (!isValidShebaNumber(fullSheba)) {
      setError("شماره شبا نامعتبر است");
      return;
    }

    setIsLoading(true);
    await onSubmit({
      bankName: detectedBankName,
      sheba: fullSheba,
    });
    setIsLoading(false);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // تشخیص بانک از روی شماره شبا
  useEffect(() => {
    if (sheba.length >= 5) {
      const fullSheba = `IR${sheba}`;
      const bankInfo = getBankBySheba(fullSheba);

      if (bankInfo) {
        setDetectedBankName(bankInfo.name);
        setDetectedBankIcon(bankInfo.icon || "");
      } else {
        setDetectedBankName("");
        setDetectedBankIcon("");
      }
    } else {
      setDetectedBankName("");
      setDetectedBankIcon("");
    }
  }, [sheba]);

  // گروه‌بندی ارقام شبا: IR + 2 + 4 + 4 + 4 + 4 + 4 + 2
  const shebaGroups = [2, 4, 4, 4, 4, 4, 2];
  const totalLength = 24;

  return (
    <div className="mt-4 lg:mt-0">
      <div className="flex flex-col gap-3">
        <span
          className={`text-base ${error ? "text-error-medium" : "text-gray-800"}`}
        >
          شماره شبا:
        </span>

        <div className="relative">
          {/* Hidden input */}
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={sheba}
            onChange={handleShebaChange}
            maxLength={totalLength}
            disabled={isLoading}
            className="absolute opacity-0 w-full h-full"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Visual SHEBA display */}
          <div
            onClick={handleContainerClick}
            className={`relative w-full min-h-[50px] rounded-md border-2 flex items-center justify-center py-2 px-1 transition-colors cursor-text bg-gray-200
              ${
                error
                  ? "border-error-medium hover:border-error-medium"
                  : "border-transparent hover:border-gray-400 focus-within:border-primary"
              }`}
          >
            <div dir="ltr" className="flex items-center gap-1">
              {/* IR prefix */}
              <span className="text-sm font-medium text-gray-600 mt-2">IR</span>

              {/* SHEBA groups */}
              {shebaGroups.map((groupSize, groupIndex) => {
                // محاسبه شروع این گروه
                const startIndex = shebaGroups
                  .slice(0, groupIndex)
                  .reduce((sum, size) => sum + size, 0);

                return (
                  <div key={groupIndex} className="flex items-center">
                    {Array.from({ length: groupSize }).map((_, digitIndex) => {
                      const absoluteIndex = startIndex + digitIndex;
                      const active =
                        isFocused && sheba.length === absoluteIndex;

                      return (
                        <div
                          key={digitIndex}
                          className="flex flex-col items-center w-2.5 lg:w-3.5 relative"
                        >
                          {/* number */}
                          <span className="text-xs lg:text-sm font-medium h-4">
                            {sheba[absoluteIndex] || ""}
                          </span>

                          {/* Cursor */}
                          {active && (
                            <div className="absolute bottom-1 w-[1px] h-3 bg-gray-800 animate-bounce" />
                          )}

                          {/* Line */}
                          <div
                            className={`w-2.5 lg:w-3 h-0.5 rounded-full transition-colors ${
                              sheba[absoluteIndex]
                                ? error
                                  ? "bg-error-medium"
                                  : "bg-primary"
                                : error
                                  ? "bg-error-medium"
                                  : "bg-gray-400"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Bank icon */}
            {detectedBankIcon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <IranianBank name={detectedBankIcon} size={24} />
              </div>
            )}
          </div>

          {/* Error message */}
          {error && <p className="text-error-medium mt-2">{error}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 mr-4">
        <HintIcon size={20} />
        <p className="text-gray-600">شماره شبا باید به نام شما باشد</p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isLoading}
        className={
          isDrawer
            ? `w-full text-center border-2 rounded-full py-2 px-4 mt-4 mb-2 text-base ${
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
        افزودن حساب بانکی
      </button>
    </div>
  );
}

export default ProfileBankAccountContent;
