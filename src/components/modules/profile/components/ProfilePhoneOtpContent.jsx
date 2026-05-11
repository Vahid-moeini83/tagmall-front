"use client";

import { HintIcon } from "@/icons";
import { OtpInput } from "@/components/ui/otp";
import { formatTime } from "@/lib/client/utils";
import { useEffect, useState, useCallback } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { verifyMobileOtp, sendMobileOtp } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";

function ProfilePhoneOtpContent({
  phone,
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
      const { verifyMobileOtpRes, verifyMobileOtpErr } = await verifyMobileOtp(
        token,
        {
          mobile: phone,
          otp: otpCode,
        },
      );

      if (verifyMobileOtpRes) {
        toast.success("شماره موبایل با موفقیت تایید شد");
        onVerify({ phone, otp: otpCode });
        onClose();
      } else {
        const errorMessage = verifyMobileOtpErr?.response?.data?.message || "";
        toast.error(errorMessage);
        setOtp("");
      }

      setIsVerifying(false);
    },
    [phone, onVerify, onClose],
  );

  useEffect(() => {
    if (otp.length === 5) handleVerifyOtp(otp);
  }, [otp, handleVerifyOtp]);

  const handleResendOtp = async () => {
    const token = await getToken();
    const { sendMobileOtpRes, sendMobileOtpErr } = await sendMobileOtp(token, {
      mobile: phone,
    });

    if (sendMobileOtpRes) {
      const resendSeconds =
        sendMobileOtpRes.data?.resend_remaining_seconds || 120;
      setTimeLeft(resendSeconds);
      setIsResendActive(false);
      toast.success("کد تایید مجدداً ارسال شد");
    } else {
      const errorMessage =
        sendMobileOtpErr?.response?.data?.message ||
        "خطا در ارسال مجدد کد تایید";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mt-2 lg:mt-0">
      {/* Otp Input */}
      <OtpInput
        value={otp}
        setValue={setOtp}
        onBack={!isDesktop && onBack}
        className="bg-gray-200! border-0!"
        disabled={isVerifying}
      />

      {/* Received OTP Display (for testing) */}
      {receivedOtp && (
        <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-center text-sm text-yellow-800">
            کد تایید (تست): <strong className="text-lg">{receivedOtp}</strong>
          </p>
        </div>
      )}

      {/* Hint */}
      <div className="mt-4 flex items-center gap-2 mr-4">
        <HintIcon size={20} />
        <p className="text-gray-600">
          کد تایید به {phone} ارسال {isResendActive ? "می‌شود" : "شده است"}
        </p>
      </div>

      {/* Resend Button */}
      <button
        disabled={!isResendActive}
        onClick={handleResendOtp}
        className={`mt-6 pb-4 w-full cursor-pointer ${
          isResendActive ? "text-primary" : "text-gray-400 cursor-not-allowed"
        }`}
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

export default ProfilePhoneOtpContent;
