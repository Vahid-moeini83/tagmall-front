"use client";

import { OtpInput } from "@/components/ui/otp";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HintIcon } from "@/icons";
import { formatTime } from "@/lib/client/utils";
import { useEffect, useState, useCallback } from "react";
import { verifyEmailOtp, sendEmailOtp } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";

function ProfileEmailOtpContent({
  email,
  receivedOtp,
  onBack,
  otpExpire,
  onVerify,
  onClose,
}) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(otpExpire);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isDrawer = !isDesktop;

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendActive(true);
      return;
    }
    const id = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const handleVerifyOtp = useCallback(
    async (otpCode) => {
      setIsVerifying(true);
      const token = await getToken();
      const { verifyEmailOtpRes, verifyEmailOtpErr } = await verifyEmailOtp(
        token,
        {
          email,
          otp: otpCode,
        },
      );

      if (verifyEmailOtpRes) {
        toast.success("ایمیل با موفقیت تایید شد");
        onVerify({ email, otp: otpCode });
        onClose();
      } else {
        const errorMessage = verifyEmailOtpErr?.response?.data?.message || "";
        toast.error(errorMessage);
        setOtp("");
      }

      setIsVerifying(false);
    },
    [email, onVerify, onClose],
  );

  useEffect(() => {
    if (otp.length === 5) handleVerifyOtp(otp);
  }, [otp, handleVerifyOtp]);

  const handleResendOtp = async () => {
    const token = await getToken();
    const { sendEmailOtpRes, sendEmailOtpErr } = await sendEmailOtp(token, {
      email,
    });

    if (sendEmailOtpRes) {
      const resendSeconds =
        sendEmailOtpRes.data?.resend_remaining_seconds || 120;
      setTimeLeft(resendSeconds);
      setIsResendActive(false);
      toast.success("کد تایید مجدداً ارسال شد");
    } else {
      const errorMessage =
        sendEmailOtpErr?.response?.data?.message ||
        "خطا در ارسال مجدد کد تایید";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mt-3 lg:mt-0">
      {/* Label (desktop only) */}
      {isDesktop && (
        <label className="text-base text-gray-600 font-bold mb-3 block">
          افزودن ایمیل به حساب کاربری:
        </label>
      )}

      {/* Otp Input */}
      <OtpInput
        value={otp}
        setValue={setOtp}
        label={!isDesktop ? "افزودن ایمیل به حساب کاربری:" : undefined}
        onBack={!isDesktop ? onBack : undefined}
        className="bg-gray-200! border-0!"
        containerClassName="gap-3"
        disabled={isVerifying}
      />

      {/* Hint */}
      <div className="mt-4 mr-4 flex items-start gap-5">
        <HintIcon size={20} className="shrink-0" />
        <p className="text-gray-600">
          کد تایید به {email} ارسال {isResendActive ? "می‌شود" : "شده است"} (
          {receivedOtp})
        </p>
      </div>

      {/* Resend Button */}
      <button
        disabled={!isResendActive}
        onClick={handleResendOtp}
        className={
          isDrawer
            ? `w-full text-center border-2 rounded-full py-2 px-4 mt-5 mb-3 text-base ${
                isResendActive
                  ? "text-primary border-primary cursor-pointer"
                  : "text-gray-400 border-gray-200 cursor-not-allowed"
              }`
            : `mt-6 w-full py-3 text-base ${
                isResendActive
                  ? "text-primary cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`
        }
      >
        {isResendActive ? (
          "ارسال مجدد کد تایید"
        ) : (
          <>
            ارسال مجدد کد تایید تا{" "}
            <span className="text-error-medium">{formatTime(timeLeft)}</span>{" "}
            دیگر
          </>
        )}
      </button>
    </div>
  );
}

export default ProfileEmailOtpContent;
