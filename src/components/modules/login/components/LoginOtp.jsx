"use client";
import React, { useState, useRef, useEffect } from "react";
import { HintIcon } from "@/icons";
import toast from "react-hot-toast";
import { formatPhoneNumber, formatTime } from "@/lib/client/utils";
import {
  checkAuthValidation,
  registerUser,
  sendOtp,
} from "@/lib/server/actions/auth";
import { useRouter } from "next/navigation";
import { saveTokenUser } from "@/lib/server/cookies";
import usePublicStore from "@/app/store/publicStore";

function LoginOtp({
  handleNextStep,
  handlePreviousStep,
  phoneNumber,
  setEnteredOtp,
  otpExpireTime,
  isNewUser,
}) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(otpExpireTime);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  const setUserInfo = usePublicStore((state) => state.setUserInfo);
  const setAccessToken = usePublicStore((state) => state.setAccessToken);

  const router = useRouter();

  const inputRef = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendActive(true);
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleResend = async () => {
    setIsResendActive(true);
    const { sendOtpRes, sendOtpErr } = await sendOtp({ mobile: phoneNumber });
    if (sendOtpRes) {
      console.log(sendOtpRes);
      setTimeLeft(sendOtpRes.data.expires_in_seconds);
      setError("");
    } else if (sendOtpErr) {
      console.log(sendOtpErr);
    }
    if (isResendActive) {
      toast.success("کد تایید مجدداً ارسال شد");
      setTimeLeft(10);
      setIsResendActive(false);
    }
  };

  // OTP enter
  const handleEnterOtp = (e) => {
    const value = e.target.value;
    if (error) setError("");

    if (/^\d*$/.test(value) && value.length <= 5) {
      setOtp(value);
    }
  };

  // Handle focus on fake box
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCheckOtp = async () => {
    setIsloading(true);
    setError("");

    const { checkRes, checkErr } = await checkAuthValidation({
      otp: otp,
      mobile: phoneNumber,
    });

    if (checkRes) {
      console.log(checkRes);
      if (checkRes.data.valid) {
        if (!isNewUser) {
          const payload = {
            mobile: phoneNumber,
            otp: otp,
          };
          const { registerRes, registerErr } = await registerUser(payload);
          if (registerRes) {
            console.log("LOGIN: ", registerRes);
            setAccessToken(registerRes?.data?.token);
            setUserInfo(registerRes?.data?.user);
            await saveTokenUser(
              registerRes?.data?.token,
              JSON.stringify(registerRes?.data?.user),
            );
            toast.success("ورود با موفقیت انجام شد");
            router.push("/");
          } else if (registerErr) {
            toast.error("مشکلی در ورود به سامانه پیش آمده است");
          }
        } else {
          setEnteredOtp(otp);
          handleNextStep();
        }
      } else {
        setError("کد تایید وارد شده صحیح نمی‌باشد.");
        setOtp("");
      }
    } else if (checkErr) {
      console.log("ERROR: ", checkErr);
      setError("خطایی در ارتباط با سرور رخ داده است.");
    }
    setIsloading(false);
  };

  // Confirm OTP
  useEffect(() => {
    if (otp.length === 5) {
      handleCheckOtp();
    }
  }, [otp]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">کد تایید</h1>
          <span className="text-gray-600 text-base">
            لطفا کد تایید ارسال شده را وارد نمایید.
          </span>
        </div>
        {/* Main content */}
        <div className="mt-10 flex-1">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="otp"
              className={`text-lg transition-colors ${error ? "text-error-medium" : ""}`}
            >
              کد تایید
            </label>

            {/* OTP input */}
            <div
              onClick={handleContainerClick}
              className={`relative w-full h-12 rounded-md border-2 flex items-center justify-center transition-colors hover:border-gray-400 focus-within:border-primary ${
                isLoading ? "opacity-40 cursor-not-allowed" : "cursor-text"
              } ${
                error
                  ? "border-error-medium hover:border-error-medium focus-within:border-error-medium"
                  : "border-gray-300"
              }`}
            >
              {/* Hidden input */}
              <input
                ref={inputRef}
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={otp}
                onChange={handleEnterOtp}
                maxLength={5}
                className="absolute opacity-0 w-full h-full cursor-text"
                autoComplete="one-time-code"
                autoFocus
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
              />
              {/* Numbers & lines */}
              <div dir="ltr" className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center w-8"
                  >
                    {/* Numbers */}
                    <span className="text-xl font-medium h-6">
                      {otp[index] ? otp[index] : ""}
                    </span>
                    {/* Active cursor */}
                    {isFocused && otp.length === index && (
                      <div
                        className={`absolute bottom-3.5 w-[2px] h-4 bg-gray-800 animate-bounce`}
                      />
                    )}
                    {/* lines */}
                    <div
                      className={`w-4 h-0.5 rounded-full transition-colors ${
                        otp[index]
                          ? error
                            ? "bg-error-medium"
                            : "bg-primary"
                          : error
                            ? "bg-error-medium"
                            : "bg-gray-300"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Error text */}
            {error && <p className="text-xs text-error-medium mt-1">{error}</p>}
          </div>

          <div className="flex items-center justify-between gap-2 mt-6">
            <span className="text-gray-800 " dir="ltr">
              {formatPhoneNumber(phoneNumber)}
            </span>
            <span
              onClick={handlePreviousStep}
              className="flex items-center gap-2 text-sm text-primary cursor-pointer"
            >
              <HintIcon size={16} className="text-primary" />
              ویرایش شماره موبایل
            </span>
          </div>
        </div>
      </div>
      {/* Resend code */}
      <button
        onClick={handleResend}
        disabled={!isResendActive}
        className={`w-full h-12 rounded-md transition-all duration-300 ${
          isResendActive
            ? "bg-primary text-white cursor-pointer hover:bg-opacity-90"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isResendActive ? (
          "ارسال مجدد کد تایید"
        ) : (
          <span dir="ltr">{formatTime(timeLeft)} تا ارسال مجدد کد</span>
        )}
      </button>
    </div>
  );
}

export default LoginOtp;
