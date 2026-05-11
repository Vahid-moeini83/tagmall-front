"use client";

import { Input } from "@/components/ui/input";
import { HintIcon } from "@/icons";
import { isValidIranianMobile } from "@/lib/client/validations";
import { useState } from "react";
import { sendMobileOtp } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";

function ProfilePhoneContent({ phone, setReceivedOtp, setPhone, onNext }) {
  const [errors, setErrors] = useState({ phone: "" });
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="mt-2 lg:mt-0">
      {/* Input */}
      <Input
        label="شماره تماس:"
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
        className={`mt-6 w-full py-3 text-base ${
          !isFormValid || isLoading
            ? "text-gray-400 cursor-not-allowed"
            : "text-primary cursor-pointer"
        }`}
      >
        ارسال کد تایید
      </button>
    </div>
  );
}

export default ProfilePhoneContent;
