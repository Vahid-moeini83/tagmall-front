"use client";

import { Input } from "@/components/ui/input";
import { ArrowRightIcon, HintIcon } from "@/icons";
import { isValidIranianMobile } from "@/lib/client/validations";
import { sendOtp } from "@/lib/server/actions/auth";
import { useState } from "react";

function LoginEnterPhone({
  handleNextStep,
  phoneNumber,
  setPhoneNumber,
  setOtpExpireTime,
  setIsNewUser,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ phone: "" });

  const handleConfirm = async () => {
    if (!phoneNumber) {
      setErrors({ ...errors, phone: "ابتدا شماره موبایل خود را وارد نمایید" });
      return;
    }

    if (!isValidIranianMobile(phoneNumber)) {
      setErrors({ ...errors, phone: "شماره موبایل معتبر نمی‌باشد" });
      return;
    }

    setErrors({ ...errors, phone: "" });
    setIsLoading(true);
    const { sendOtpRes, sendOtpErr } = await sendOtp({ mobile: phoneNumber });
    if (sendOtpRes) {
      console.log(sendOtpRes);
      setIsNewUser(sendOtpRes.data.is_new_user);
      setOtpExpireTime(sendOtpRes.data.expires_in_seconds);
      handleNextStep();
    } else if (sendOtpErr) {
      console.log(sendOtpErr);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">ورود یا ثبت‌نام</h1>
          <span className="text-gray-600 text-base">
            لطفا شماره موبایل خود را وارد نمایید.
          </span>
        </div>
        {/* Main content */}
        <div className="mt-10">
          <Input
            label={"شماره موبایل"}
            id="phone"
            numeric
            maxLength={11}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
            error={errors.phone}
          />
          <div className="flex items-center gap-2 mt-4">
            <HintIcon size={16} className="text-gray-600" />
            <span className="font-bold text-sm text-gray-600">
              شماره موبایل باید به نام شما باشد.
            </span>
          </div>
        </div>
      </div>
      {/* Submit button */}
      <button
        onClick={handleConfirm}
        className="mt-10 bg-primary text-white rounded-md w-full h-12 flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:gap-3 cursor-pointer"
      >
        تایید و ادامه
        <ArrowRightIcon size={20} className="rotate-180" />
      </button>
    </div>
  );
}

export default LoginEnterPhone;
