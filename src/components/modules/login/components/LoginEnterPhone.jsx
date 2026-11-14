"use client";

import { Input } from "@/components/ui/input";
import { HintIcon } from "@/icons";
import { isValidIranianMobile } from "@/lib/client/validations";
import { toEnglishNumber } from "@/lib/client/utils";
import { getAuthErrorMessage, getOtpExpirySeconds, parseAuthBoolean } from "@/lib/client/auth";
import { sendOtp } from "@/lib/server/actions/auth";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRef, useState } from "react";

function LoginEnterPhone({
  handleNextStep,
  phoneNumber,
  setPhoneNumber,
  setOtpExpireTime,
  setIsNewUser,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ phone: "" });
  const requestInFlight = useRef(false);

  const handleConfirm = async (event) => {
    event?.preventDefault();
    if (requestInFlight.current) return;

    const normalizedPhone = toEnglishNumber(String(phoneNumber ?? "")).replace(/[^0-9]/g, "");
    if (!normalizedPhone) {
      setErrors({ phone: "ابتدا شماره موبایل خود را وارد نمایید" });
      return;
    }

    if (!isValidIranianMobile(normalizedPhone)) {
      setErrors({ phone: "شماره موبایل معتبر نمی‌باشد" });
      return;
    }

    requestInFlight.current = true;
    setErrors({ phone: "" });
    setPhoneNumber(normalizedPhone);
    setIsLoading(true);
    try {
      const { sendOtpRes, sendOtpErr } = await sendOtp({ mobile: normalizedPhone });
      const responseData = sendOtpRes?.data;
      const isNewUser = parseAuthBoolean(responseData?.is_new_user);

      if (!responseData || isNewUser === null) {
        toast.error(getAuthErrorMessage(sendOtpErr, "پاسخ ارسال کد تأیید از سرور معتبر نیست."));
        return;
      }

      setIsNewUser(isNewUser);
      setOtpExpireTime(getOtpExpirySeconds(responseData.expires_in_seconds));
      handleNextStep();
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "ارسال کد تأیید انجام نشد."));
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col h-full justify-between mt-6 lg:mt-0" onSubmit={handleConfirm}>
      <div>
        {/* Slogan logo */}
        <div className="relative w-[150px] h-[50px] lg:w-[330px] lg:h-[100px] mx-auto flex items-center justify-center">
          <Image src="/assets/images/logo/slogan-logo.svg" fill alt="لوگوی شعار" loading="eager" />
        </div>
        {/* Title */}
        <div className="mt-9 lg:mt-12">
          <h1 className="font-bold text-primary text-base">ورود به حساب کاربری</h1>
        </div>
        {/* Main content */}
        <div className="mt-4">
          <Input
            placeholder="شماره تماس"
            id="phone"
            numeric
            maxLength={11}
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (errors.phone) setErrors({ phone: "" });
            }}
            disabled={isLoading}
            error={errors.phone}
            className={`text-center text-gray-600 bg-gray-200 ${errors.phone ? "" : "border-0!"}`}
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
        type="submit"
        disabled={!phoneNumber || isLoading}
        className={`mt-7 mb-2 w-full font-bold border-2 py-2 rounded-full ${
          !phoneNumber || isLoading
            ? "text-gray-400 border-gray-400 cursor-not-allowed"
            : "text-primary border-primary cursor-pointer"
        }`}
      >
        ارسال پیامکی کد تایید
      </button>
    </form>
  );
}

export default LoginEnterPhone;
