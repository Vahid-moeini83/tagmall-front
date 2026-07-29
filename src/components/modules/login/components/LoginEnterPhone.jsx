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
        <div className="relative w-[150px] h-[50px] lg:w-[330px] lg:h-[100px] mx-auto flex items-center justify-center">
          <Image
            src="/assets/images/logo/slogan-logo.svg"
            fill
            alt="لوگوی شعار"
          />
        </div>
        {/* Title */}
        <div className="mt-9 lg:mt-12">
          <h1 className="font-bold text-primary text-base">
            ورود به حساب کاربری
          </h1>
        </div>
        {/* Main content */}
        <div className="mt-4">
          <Input
            placeholder="شماره تماس"
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
          <div className="flex items-center gap-5 mt-4 mr-4">
            <HintIcon size={20} />
            <span className="font-bold text-sm text-gray-600">
              کد تایید به شماره تماس شما پیامک می‌شود
            </span>
          </div>
        </div>
      </div>
      {/* Submit button */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!phoneNumber || isLoading}
        className={`mt-7 mb-2 w-full font-bold border-2 py-2 rounded-full ${
          !phoneNumber || isLoading
            ? "text-gray-400 border-gray-400 cursor-not-allowed"
            : "text-primary border-primary cursor-pointer"
        }`}
      >
        ارسال پیامکی کد تایید
      </button>
    </div>
  );
}

export default LoginEnterPhone;
