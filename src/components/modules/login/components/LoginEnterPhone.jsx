"use client";

import { Input } from "@/components/ui/input";
import { HintIcon } from "@/icons";
import { isValidIranianMobile } from "@/lib/client/validations";
import { sendOtp } from "@/lib/server/actions/auth";
import Image from "next/image";
import { useState } from "react";

function LoginEnterPhone({
  handleNextStep,
  phoneNumber,
  setPhoneNumber,
  setOtpExpireTime,
  setIsNewUser,
  setReceivedOtp,
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
      setReceivedOtp(sendOtpRes.data.otp);
      setIsNewUser(sendOtpRes.data.is_new_user);
      setOtpExpireTime(sendOtpRes.data.expires_in_seconds);
      handleNextStep();
    } else if (sendOtpErr) {
      console.log(sendOtpErr);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full justify-between mt-6 lg:mt-0">
      <div>
        {/* Slogan logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/assets/images/logo/slogan-logo.svg"
            width={160}
            height={50}
            alt="لوگوی شعار"
          />
        </div>
        {/* Title */}
        <div className="mt-9">
          <h1 className="font-bold text-primary text-lg">
            ورود به حساب کاربری
          </h1>
        </div>
        {/* Main content */}
        <div className="mt-7">
          <Input
            label={"شماره تماس:"}
            id="phone"
            numeric
            maxLength={11}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
            error={errors.phone}
            className={`text-center text-gray-600 bg-gray-200 ${
              errors.phone ? "" : "border-0!"
            }`}
          />
          <div className="flex items-center gap-2 mt-4 mr-4">
            <HintIcon size={20} />
            <span className="font-bold text-sm text-gray-600">
              کد تایید به شماره تماس شما ارسال می‌شود
            </span>
          </div>
        </div>
      </div>
      {/* Submit button */}
      <button
        onClick={handleConfirm}
        disabled={!phoneNumber || isLoading}
        className={`mt-7 mb-4 w-full font-bold ${
          !phoneNumber || isLoading
            ? "text-gray-400 cursor-not-allowed"
            : "text-primary cursor-pointer"
        }`}
      >
        ارسال کد تایید
      </button>
    </div>
  );
}

export default LoginEnterPhone;
