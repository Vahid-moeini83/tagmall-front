"use client";

import { useState, useEffect } from "react";
import { OtpInput } from "@/components/ui/otp";

export default function ReceiptStepTwo({ onNext, onBack, orderData }) {
  const [otpCode, setOtpCode] = useState("");
  const [timer, setTimer] = useState(10); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Auto navigate when OTP is complete
  useEffect(() => {
    if (otpCode.length === 5) {
      const timeout = setTimeout(() => {
        onNext();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [otpCode, onNext]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(120);
      setCanResend(false);
      setOtpCode("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Three info texts */}
      <div className="space-y-4">
        <p className="text-gray-600 text-xs lg:text-base">
          <span className="font-bold">تعداد</span> {orderData.quantity}{" "}
          {orderData.productName}
        </p>
        <p className="text-gray-600 text-xs lg:text-base">
          <span className="font-bold">بازه زمانی مراجعه به فروشگاه</span>{" "}
          {orderData.visitDate}
        </p>
        <p className="text-gray-600 text-xs lg:text-base">
          <span className="font-bold">وضعیت سفارش</span> {orderData.status}{" "}
          <span className="text-gray-400">
            به روز رسانی {orderData.lastUpdate}
          </span>
        </p>
      </div>

      {/* Dashed separator with semi-circles */}
      <div className="relative my-4">
        <div className="border-t-6 border-dotted border-white" />
        <div className="absolute -right-5 lg:-right-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-l-full" />
        <div className="absolute -left-5 lg:-left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-r-full" />
      </div>

      {/* Code verification header */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-gray-600 text-sm lg:text-base font-bold">
          کد تحویل سفارش
        </span>
        <span className="text-error-medium text-sm lg:text-base font-bold">
          {formatTime(timer)}
        </span>
      </div>

      {/* OTP Input */}
      <OtpInput
        value={otpCode}
        setValue={setOtpCode}
        length={5}
        label=""
        className="border-gray-400"
      />

      {/* Resend button */}
      <button
        onClick={handleResend}
        disabled={!canResend}
        className={`text-sm lg:text-base w-full my-4 ${
          canResend
            ? "text-primary cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        ارسال مجدد کد تایید
      </button>
    </div>
  );
}
