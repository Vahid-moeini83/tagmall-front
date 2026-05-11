"use client";
import React, { useState, useEffect } from "react";
import { EditIcon, HintIcon, StrokeArrowLeftIcon } from "@/icons";
import toast from "react-hot-toast";
import { formatPhoneNumber, formatTime } from "@/lib/client/utils";
import {
  checkAuthValidation,
  registerUser,
  sendOtp,
} from "@/lib/server/actions/auth";
import { useRouter } from "next/navigation";
import usePublicStore from "@/app/store/publicStore";
import { saveToken, saveUser } from "@/lib/server/cookies";
import { OtpInput } from "@/components/ui/otp";
import Image from "next/image";

function LoginOtp({
  handleNextStep,
  handlePreviousStep,
  phoneNumber,
  setEnteredOtp,
  otpExpireTime,
  isNewUser,
  receivedOtp,
  onSuccess,
}) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(otpExpireTime);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  const setUserInfo = usePublicStore((state) => state.setUserInfo);
  const setAccessToken = usePublicStore((state) => state.setAccessToken);
  const setLoginOpen = usePublicStore((state) => state.setLoginOpen);

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
            await saveToken(registerRes?.data?.token);
            await saveUser(JSON.stringify(registerRes?.data?.user));
            toast.success("ورود با موفقیت انجام شد");
            if (onSuccess) onSuccess();
            setLoginOpen(false);
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
    <div className="h-full flex flex-col justify-between mt-6 lg:mt-0">
      <div>
        {/* Slogan logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/assets/images/logo/slogan-logo.svg"
            width={160}
            height={50}
            alt="لوگوی شعار"
          />
        </div>
        {/* Title */}
        <div className="flex items-center justify-between mt-9">
          <h1 className="font-bold text-primary text-lg">
            ورود به حساب کاربری
          </h1>
          <StrokeArrowLeftIcon
            size={20}
            onClick={handlePreviousStep}
            className="lg:hidden"
          />
        </div>
        {/* Main content */}
        <div className="mt-7">
          <OtpInput
            label={`کد تایید (${receivedOtp})`}
            value={otp}
            setValue={setOtp}
            error={error}
            disabled={isLoading}
          />

          <div className="flex items-center gap-2 mt-4 mr-4">
            <HintIcon size={20} />
            <p className="text-gray-600">
              کد تایید به شماره 09158427785 ارسال{" "}
              {isResendActive ? "می‌شود" : "شده است"}
            </p>
          </div>
        </div>
      </div>
      {/* Resend code */}
      <button
        onClick={handleResend}
        disabled={!isResendActive}
        className={`w-full mt-6 mb-4 rounded-md transition-all duration-300 font-bold ${
          isResendActive
            ? "text-primary cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        {isResendActive ? (
          "ارسال مجدد کد تایید"
        ) : (
          <span dir="ltr">
            ارسال مجدد کد تایید تا{" "}
            <span className="text-error-medium">{formatTime(timeLeft)}</span>{" "}
            دقیقه دیگر
          </span>
        )}
      </button>
    </div>
  );
}

export default LoginOtp;
