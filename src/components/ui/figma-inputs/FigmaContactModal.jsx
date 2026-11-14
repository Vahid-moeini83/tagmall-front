"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useFigmaDialog } from "./useFigmaDialog";
import typography from "./FigmaTypography.module.css";

/** Phone and email add flows from Figma 177:4878 and 177:4928. */
export function FigmaContactModal({
  type = "phone",
  onClose,
  returnFocusRef,
  onRequestCode,
  onResendCode,
  onRequestError,
  onCodeChange,
  onCodeComplete,
  onVerifyCode,
  onVerified,
  onVerificationError,
  initialStage = "entry",
  initialValue = "",
  initialSeconds = 120,
}) {
  const [value, setValue] = useState(initialValue);
  const [stage, setStage] = useState(initialStage);
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [pending, setPending] = useState(false);
  const [focusedDigit, setFocusedDigit] = useState(0);
  const digitRefs = useRef([]);
  const verifying = useRef(false);
  const wallet = type === "wallet";
  const phone = type === "phone" || wallet;
  const dialogRef = useFigmaDialog(onClose, true, returnFocusRef);

  useEffect(() => {
    if (stage !== "otp") return;
    const frame = requestAnimationFrame(() => digitRefs.current[0]?.focus());
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  useEffect(() => {
    if (stage !== "otp" || seconds <= 0) return;
    const timer = setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, [stage, seconds]);

  const send = async () => {
    if (!value.trim() || !onRequestCode || pending) return;
    setPending(true);
    try {
      const result = await onRequestCode(value);
      if (result === true || result?.success === true) {
        setSeconds(120);
        setStage("otp");
      }
    } catch (error) {
      onRequestError?.(error);
    } finally {
      setPending(false);
    }
  };
  const resend = async () => {
    if (!onResendCode || pending) return;
    setPending(true);
    try {
      const result = await onResendCode(value);
      if (result === true || result?.success === true) setSeconds(120);
    } catch (error) {
      onRequestError?.(error);
    } finally {
      setPending(false);
    }
  };
  const title = wallet
    ? "درخواست وجه از کیف پول اعتباری"
    : phone
      ? "افزودن شماره تماس به حساب کاربری:"
      : "افزودن پست الکترونیک به حساب کاربری:";
  const timerText =
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`.replace(
      /\d/g,
      (d) => "۰۱۲۳۴۵۶۷۸۹"[d],
    );
  const updateDigits = async (next) => {
    setDigits(next);
    const code = next.join("");
    onCodeChange?.(code);
    if (!next.every(Boolean)) return;
    onCodeComplete?.(code, value);
    if (!onVerifyCode || verifying.current) return;
    verifying.current = true;
    setPending(true);
    try {
      const result = await onVerifyCode({ code, value, type });
      if (result === true || result?.success === true) onVerified?.(value, result);
    } catch (error) {
      onVerificationError?.(error);
    } finally {
      verifying.current = false;
      setPending(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="figma-contact-title"
        dir="rtl"
        className={`${typography.root} flex w-[460px] max-w-full flex-col gap-8 rounded-[28px] border border-border-default bg-white p-10 text-text-primary`}
      >
        <div dir="ltr" className="flex h-8 w-full items-center justify-between gap-2">
          <button
            type="button"
            aria-label="بستن"
            onClick={onClose}
            className="size-8 shrink-0 border-0 bg-transparent p-0"
          >
            <Image src="/assets/figma-inputs/close.svg" alt="" width={32} height={32} unoptimized />
          </button>
          <h2
            id="figma-contact-title"
            dir="rtl"
            className={`${wallet ? "w-[256px]" : phone ? "w-[282px]" : "w-[306px]"} m-0 text-right text-[18px] font-semibold leading-[26px]`}
          >
            {title}
          </h2>
        </div>
        {stage === "entry" ? (
          <div className="flex flex-col gap-3">
            <input
              type={phone ? "tel" : "email"}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={phone ? "شماره تماس" : "پست الکترونیک"}
              aria-label={phone ? "شماره تماس" : "پست الکترونیک"}
              className={`${typography.input16} h-[57px] w-full rounded-[8px] border border-border-default bg-white pl-2 pr-[18px] text-center leading-[26px] text-text-primary outline-none placeholder:text-text-disabled`}
            />
            {phone && (
              <div className="flex h-[22px] items-center gap-2 text-sm leading-[22px] text-text-secondary">
                <Image
                  src="/assets/figma-inputs/message.svg"
                  alt=""
                  width={20}
                  height={20}
                  unoptimized
                />
                <span className="min-w-0 flex-1 text-right">شماره تماس باید به نام شما باشد.</span>
              </div>
            )}
            <button
              type="button"
              onClick={send}
              disabled={pending}
              className="flex h-[57px] items-center justify-center rounded-[10px] bg-success-strong text-base font-normal leading-[26px] text-white"
            >
              <span className="w-[97px] text-center">ارسال کد تایید</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div dir="ltr" className="flex h-[61.714px] items-center justify-between">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    digitRefs.current[index] = element;
                  }}
                  aria-label={`رقم ${index + 1} کد تایید`}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onFocus={() => setFocusedDigit(index)}
                  onChange={(event) => {
                    const char = event.target.value.slice(-1);
                    if (char && !/[0-9۰-۹٠-٩]/.test(char)) return;
                    const next = digits.map((v, i) => (i === index ? char : v));
                    updateDigits(next);
                    if (char && index < 4) digitRefs.current[index + 1]?.focus();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !digits[index] && index > 0)
                      digitRefs.current[index - 1]?.focus();
                  }}
                  onPaste={(event) => {
                    const chars = event.clipboardData
                      .getData("text")
                      .match(/[0-9۰-۹٠-٩]/g)
                      ?.slice(0, 5);
                    if (!chars?.length) return;
                    event.preventDefault();
                    const next = Array.from({ length: 5 }, (_, i) => chars[i] ?? "");
                    updateDigits(next);
                    digitRefs.current[Math.min(chars.length, 4)]?.focus();
                  }}
                  className={`${typography.input18} w-[60px] ${index === 3 ? "h-[61.714px]" : "h-[60px]"} rounded-[16px] border bg-transparent text-center text-lg outline-none ${index === focusedDigit ? "border-primary" : "border-border-default"}`}
                />
              ))}
            </div>
            <div className="flex h-[22px] items-center gap-2 text-sm leading-[22px] text-text-secondary">
              <Image
                src={
                  phone ? "/assets/figma-inputs/message.svg" : "/assets/figma-inputs/mailbox.svg"
                }
                alt=""
                width={20}
                height={20}
                unoptimized
              />
              <span className="min-w-0 flex-1 text-right">
                {wallet
                  ? "کد تایید به شماره شما پیامک شده است."
                  : phone
                    ? `کد تایید به ${value} پیامک شده است.`
                    : `کد تایید به ${value} ارسال شده است.`}
              </span>
            </div>
            {seconds > 0 ? (
              <div
                className={`${wallet ? "mt-5 " : ""}flex h-[50px] items-center justify-center rounded-[16px] border border-figma-auth-timer-border text-base font-normal leading-[26px]`}
              >
                <span>
                  ارسال مجدد کد تایید تا <span className="text-figma-error">{timerText}</span> دیگر
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={resend}
                disabled={pending}
                className="mt-5 flex h-[57px] items-center justify-center gap-2 rounded-[10px] bg-success-strong text-base font-normal leading-[26px] text-white"
              >
                {!wallet && (
                  <Image
                    src="/assets/figma-inputs/resend.svg"
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                )}
                <span className="w-[138px] text-center">ارسال مجدد کد تایید</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
