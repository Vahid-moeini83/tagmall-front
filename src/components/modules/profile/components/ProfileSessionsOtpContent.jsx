"use client";

import { HintIcon } from "@/icons";
import { OtpInput } from "@/components/ui/otp";
import { formatTime } from "@/lib/client/utils";
import { useEffect, useState, useCallback, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { sendMobileOtp } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";

function ProfileSessionsOtpContent({ phone, onBack, onVerify }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState("");
  const hasSentInitialOtp = useRef(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isDrawer = !isDesktop;

  const sendOtp = useCallback(async () => {
    if (!phone) return false;

    const token = await getToken();
    const { sendMobileOtpRes, sendMobileOtpErr } = await sendMobileOtp(token, {
      mobile: phone,
    });

    if (sendMobileOtpRes) {
      setReceivedOtp(sendMobileOtpRes?.data?.otp || "");
      const resendSeconds =
        sendMobileOtpRes.data?.resend_remaining_seconds || 120;
      setTimeLeft(resendSeconds);
      setIsResendActive(false);
      return true;
    }

    const errorMessage =
      sendMobileOtpErr?.response?.data?.message || "خطا در ارسال کد تایید";
    toast.error(errorMessage);
    return false;
  }, [phone]);

  // Send OTP once when OTP step opens — not when delete is clicked
  useEffect(() => {
    if (hasSentInitialOtp.current) return;
    hasSentInitialOtp.current = true;

    (async () => {
      const sent = await sendOtp();
      if (sent) {
        toast.success("کد تایید به شماره موبایل شما ارسال شد");
      }
    })();
  }, [sendOtp]);

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
      try {
        const success = await onVerify({ phone, otp: otpCode });
        if (!success) {
          setOtp("");
        }
      } finally {
        setIsVerifying(false);
      }
    },
    [phone, onVerify],
  );

  useEffect(() => {
    if (otp.length === 5) handleVerifyOtp(otp);
  }, [otp, handleVerifyOtp]);

  const handleResendOtp = async () => {
    const sent = await sendOtp();
    if (sent) {
      toast.success("کد تایید مجدداً ارسال شد");
    }
  };

  return (
    <div className="mt-3 lg:mt-0">
      {isDesktop && (
        <label className="text-base text-gray-600 font-bold mb-3 block">
          مدیریت نشست های فعال
        </label>
      )}

      <OtpInput
        value={otp}
        setValue={setOtp}
        label={!isDesktop ? "مدیریت نشست های فعال" : undefined}
        onBack={!isDesktop ? onBack : undefined}
        className="bg-gray-200! border-0!"
        containerClassName="gap-3"
        disabled={isVerifying}
      />

      {receivedOtp && (
        <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-center text-sm text-yellow-800">
            کد تایید (تست): <strong className="text-lg">{receivedOtp}</strong>
          </p>
        </div>
      )}

      <div className="mt-4 mr-4 flex items-center gap-5">
        <HintIcon size={20} className="shrink-0" />
        <p className="text-gray-600">
          کد تایید به شماره شما پیامک {isResendActive ? "می‌شود" : "شده است"}
        </p>
      </div>

      <button
        type="button"
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

export default ProfileSessionsOtpContent;
