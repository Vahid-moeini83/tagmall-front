"use client";

import { useState, useEffect } from "react";

const RESEND_COOLDOWN_SECONDS = 5;

function formatPersianTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;

  return formatted.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export default function ReceiptStepTwo() {
  const [timer, setTimer] = useState(RESEND_COOLDOWN_SECONDS);
  const canResend = timer <= 0;

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (!canResend) return;

    setTimer(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-base text-gray-600">
        {canResend
          ? "کد تحویل سفارش به شماره شما پیامک میشود."
          : "کد تحویل سفارش به شماره شما پیامک شده است."}
      </p>

      <button
        type="button"
        onClick={handleResend}
        disabled={!canResend}
        className={`w-full rounded-full border-2 py-2.5 text-center text-base transition-colors ${
          canResend
            ? "cursor-pointer border-primary text-primary"
            : "cursor-not-allowed border-gray-400 text-gray-400"
        }`}
      >
        {canResend ? (
          "ارسال مجدد کد تحویل سفارش"
        ) : (
          <>
            ارسال مجدد کد تحویل سفارش تا{" "}
            <span className="text-error-medium">
              {formatPersianTime(timer)}
            </span>{" "}
            دیگر
          </>
        )}
      </button>
    </div>
  );
}
