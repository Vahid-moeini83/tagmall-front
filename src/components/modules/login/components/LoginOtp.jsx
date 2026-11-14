"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HintIcon, StrokeArrowLeftIcon } from "@/icons";
import toast from "react-hot-toast";
import { formatTime } from "@/lib/client/utils";
import {
  getAuthErrorMessage,
  getOtpExpirySeconds,
  parseAuthBoolean,
  persistAuthSession,
} from "@/lib/client/auth";
import { checkAuthValidation, registerUser, sendOtp } from "@/lib/server/actions/auth";
import usePublicStore from "@/app/store/publicStore";
import { OtpInput } from "@/components/ui/otp";
import Image from "next/image";

function LoginOtp({
  handleNextStep,
  handlePreviousStep,
  phoneNumber,
  setEnteredOtp,
  otpExpireTime,
  isNewUser,
  onSuccess,
}) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => getOtpExpirySeconds(otpExpireTime));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const isResendActive = timeLeft === 0;
  const verificationInFlight = useRef(false);
  const resendInFlight = useRef(false);
  const lastSubmittedOtp = useRef("");

  const setUserInfo = usePublicStore((state) => state.setUserInfo);
  const setAccessToken = usePublicStore((state) => state.setAccessToken);
  const setLoginOpen = usePublicStore((state) => state.setLoginOpen);

  useEffect(() => {
    if (timeLeft <= 0) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [timeLeft]);

  const handleResend = async () => {
    if (!isResendActive || resendInFlight.current || isLoading) return;
    resendInFlight.current = true;

    try {
      const { sendOtpRes, sendOtpErr } = await sendOtp({ mobile: phoneNumber });
      const responseData = sendOtpRes?.data;
      if (!responseData) {
        toast.error(getAuthErrorMessage(sendOtpErr, "ارسال مجدد کد انجام نشد."));
        return;
      }

      const duration = getOtpExpirySeconds(responseData.expires_in_seconds);
      setOtp("");
      setError("");
      setTimeLeft(duration);
      toast.success("کد تایید مجدداً ارسال شد");
    } catch (requestError) {
      toast.error(getAuthErrorMessage(requestError, "ارسال مجدد کد انجام نشد."));
    } finally {
      resendInFlight.current = false;
    }
  };

  const handleCheckOtp = useCallback(async () => {
    if (verificationInFlight.current || otp.length !== 5) return;
    verificationInFlight.current = true;
    setIsLoading(true);
    setError("");

    try {
      const { checkRes, checkErr } = await checkAuthValidation({ otp, mobile: phoneNumber });
      const valid = parseAuthBoolean(checkRes?.data?.valid);

      if (!checkRes?.data || valid === null) {
        setError(getAuthErrorMessage(checkErr, "بررسی کد تأیید انجام نشد."));
        setOtp("");
        return;
      }

      if (!valid) {
        setError("کد تایید وارد شده صحیح نمی‌باشد.");
        setOtp("");
        return;
      }

      if (isNewUser) {
        setEnteredOtp(otp);
        handleNextStep();
        return;
      }

      const { registerRes, registerErr } = await registerUser({ mobile: phoneNumber, otp });
      if (!registerRes?.data) {
        toast.error(getAuthErrorMessage(registerErr, "ورود به سامانه انجام نشد."));
        setOtp("");
        return;
      }

      await persistAuthSession({
        authData: registerRes.data,
        setAccessToken,
        setUserInfo,
      });
      toast.success("ورود با موفقیت انجام شد");
      onSuccess?.();
      setLoginOpen(false);
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError, "ورود به سامانه انجام نشد."));
      setOtp("");
    } finally {
      verificationInFlight.current = false;
      setIsLoading(false);
    }
  }, [
    handleNextStep,
    isNewUser,
    onSuccess,
    otp,
    phoneNumber,
    setAccessToken,
    setEnteredOtp,
    setLoginOpen,
    setUserInfo,
  ]);

  useEffect(() => {
    if (otp.length < 5) {
      lastSubmittedOtp.current = "";
      return;
    }

    if (lastSubmittedOtp.current !== otp) {
      lastSubmittedOtp.current = otp;
      handleCheckOtp();
    }
  }, [handleCheckOtp, otp]);

  return (
    <div className="h-full flex flex-col justify-between mt-6 lg:mt-0">
      <div>
        {/* Slogan logo */}
        <div className="relative w-[150px] h-[50px] lg:w-[330px] lg:h-[100px] mx-auto flex items-center justify-center">
          <Image src="/assets/images/logo/slogan-logo.svg" fill alt="لوگوی شعار" />
        </div>
        {/* Title */}
        <div className="flex items-center justify-between mt-9 lg:mt-12">
          <h1 className="font-bold text-primary text-base">ورود به حساب کاربری</h1>
          <StrokeArrowLeftIcon
            size={20}
            onClick={() => {
              if (!isLoading) handlePreviousStep();
            }}
            className="lg:hidden"
          />
        </div>
        {/* Main content */}
        <div className="mt-4">
          <OtpInput value={otp} setValue={setOtp} error={error} disabled={isLoading} />

          <div className="flex items-center gap-5 mt-4 mr-4">
            <HintIcon size={20} />
            <p className="text-gray-600">
              کد تایید به شماره شما پیامک {isResendActive ? "می‌شود" : "شده است"}
            </p>
          </div>
        </div>
      </div>
      {/* Resend code */}
      <button
        type="button"
        onClick={handleResend}
        disabled={!isResendActive || isLoading}
        className={`w-full mt-6 mb-2 rounded-full border-2 py-2 transition-all duration-300 font-bold ${
          isResendActive
            ? "text-primary border-primary cursor-pointer"
            : "text-gray-400 border-gray-400 cursor-not-allowed"
        }`}
      >
        {isResendActive ? (
          "ارسال مجدد کد تایید"
        ) : (
          <span dir="ltr">
            ارسال مجدد کد تایید تا <span className="text-error-medium">{formatTime(timeLeft)}</span>{" "}
            دیگر
          </span>
        )}
      </button>
    </div>
  );
}

export default LoginOtp;
