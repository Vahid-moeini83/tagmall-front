"use client";

import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/client/validations";
import { useState } from "react";
import { sendEmailOtp } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function ProfileEmailContent({ email, setReceivedOtp, setEmail, onNext }) {
  const [errors, setErrors] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const isDrawer = !useMediaQuery("(min-width: 1024px)");

  const isFormValid = email && isValidEmail(email);

  const handleSendOtp = async () => {
    if (!email) {
      setErrors({ ...errors, email: "ابتدا ایمیل خود را وارد نمایید" });
      return;
    }

    if (!isValidEmail(email)) {
      setErrors({ ...errors, email: "ایمیل معتبر نمی‌باشد" });
      return;
    }

    setIsLoading(true);
    const token = await getToken();
    const { sendEmailOtpRes, sendEmailOtpErr } = await sendEmailOtp(token, {
      email,
    });

    if (sendEmailOtpRes) {
      console.log(sendEmailOtpRes);
      setReceivedOtp(sendEmailOtpRes?.otp);
      const resendSeconds = sendEmailOtpRes?.resend_remaining_seconds || 120;
      toast.success("کد تایید به ایمیل شما ارسال شد");
      onNext(resendSeconds);
    } else {
      const errorMessage =
        sendEmailOtpErr?.response?.data?.message || "خطا در ارسال کد تایید";
      toast.error(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <div className="mt-3 lg:mt-0">
      {/* Input */}
      <Input
        label="افزودن پست الکترونیک به حساب کاربری:"
        id="profile_email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className={`text-center text-gray-600 bg-gray-200 ${errors.email ? "" : "border-0!"}`}
        error={errors.email}
        containerClassName="gap-3"
        placeholder="پست الکترونیک"
      />

      {/* Button */}
      <button
        onClick={handleSendOtp}
        disabled={!isFormValid || isLoading}
        className={
          isDrawer
            ? `w-full text-center border-2 rounded-full py-2 px-4 mt-1.5 mb-3 text-base ${
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

export default ProfileEmailContent;
