"use client";

import { HintIcon } from "@/icons";
import { OtpInput } from "@/components/ui/otp";
import { formatTime } from "@/lib/client/utils";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function ProfileSessionsOtpContent({ phone, onBack, otpExpire, onVerify }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(otpExpire);
  const [isResendActive, setIsResendActive] = useState(false);
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

  useEffect(() => {
    if (otp.length === 5) onVerify({ phone, otp });
  }, [otp]);

  return (
    <div>
      {/* Otp Input */}
      <OtpInput
        value={otp}
        setValue={setOtp}
        onBack={!isDesktop && onBack}
        className="bg-gray-200! border-0!"
      />

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
        className={
          isDrawer
            ? `w-full text-center border-2 rounded-full py-2 px-4 mt-4 mb-2 text-base ${
                isResendActive
                  ? "text-primary border-primary cursor-pointer"
                  : "text-gray-400 border-gray-200 cursor-not-allowed"
              }`
            : `mt-6 pb-4 w-full cursor-pointer ${
                isResendActive
                  ? "text-primary"
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
