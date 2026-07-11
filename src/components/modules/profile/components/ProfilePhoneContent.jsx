"use client";

import { Input } from "@/components/ui/input";
import { HintIcon } from "@/icons";
import { isValidIranianMobile } from "@/lib/client/validations";
import { useState } from "react";
import { sendMobileOtp } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function ProfilePhoneContent({ phone, setReceivedOtp, setPhone, onNext }) {
  const [errors, setErrors] = useState({ phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const isDrawer = !useMediaQuery("(min-width: 1024px)");

  const isFormValid = phone && isValidIranianMobile(phone);

  const handleSendOtp = async () => {
    if (!phone) {
      setErrors({ ...errors, phone: "ابتدا شماره موبایل خود را وارد نمایید" });
      return;
    }

    if (!isValidIranianMobile(phone)) {
      setErrors({ ...errors, phone: "شماره موبایل معتبر نمی‌باشد" });
      return;
    }

    setIsLoading(true);
    const token = await getToken();
    const { sendMobileOtpRes, sendMobileOtpErr } = await sendMobileOtp(token, {
      mobile: phone,
    });

    if (sendMobileOtpRes) {
      console.log(sendMobileOtpRes);
      setReceivedOtp(sendMobileOtpRes?.data?.otp);
      const resendSeconds =
        sendMobileOtpRes.data?.resend_remaining_seconds || 120;
      toast.success("کد تایید به شماره موبایل شما ارسال شد");
      onNext(resendSeconds);
    } else {
      const errorMessage =
        sendMobileOtpErr?.response?.data?.message || "خطا در ارسال کد تایید";
      toast.error(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <div className="mt-4 lg:mt-0">
      {/* Input */}
      <Input
        label="افزودن شماره تماس به حساب کاربری:"
        type="number"
        id="profile_phone"
        value={phone}
        maxLength={11}
        onChange={(e) => setPhone(e.target.value)}
        disabled={isLoading}
        className={`text-center text-gray-600 bg-gray-200 ${errors.phone ? "" : "border-0!"}`}
        error={errors.phone}
      />

      {/* Hint */}
      <div className="mt-4 mr-4 flex items-center gap-2">
        <HintIcon size={20} />
        <span className="text-sm text-gray-600">
          شماره تماس باید به نام شما باشد
        </span>
      </div>

      {/* Button */}
      <button
        onClick={handleSendOtp}
        disabled={!isFormValid || isLoading}
        className={
          isDrawer
            ? `w-full text-center border-2 rounded-full py-2 px-4 mt-4 mb-2 text-base ${
                !isFormValid || isLoading
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-primary border-primary cursor-pointer"
              }`
            : `mt-6 w-full py-3 text-base ${
                !isFormValid || isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary cursor-pointer"
              }`
        }
      >
        ارسال کد تایید
      </button>
    </div>
  );
}

export default ProfilePhoneContent;
