"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FigmaContactModal } from "./FigmaContactModal";
import { useFigmaDialog } from "./useFigmaDialog";
import typography from "./FigmaTypography.module.css";

/** Wallet credit and withdrawal frames from Figma 177:4763. */
export function FigmaWalletModal({
  mode = "credit",
  initialStage = "entry",
  initialAmount = "",
  balanceLabel,
  onClose,
  onSubmit,
  onRequestCode,
  onResendCode,
  onVerifyCode,
  onActionError,
  successDescription,
}) {
  const withdraw = mode === "withdraw";
  const [stage, setStage] = useState(initialStage);
  const [amount, setAmount] = useState(initialAmount);
  const [description, setDescription] = useState(successDescription);
  const [pending, setPending] = useState(false);
  const dialogRef = useFigmaDialog(onClose, stage !== "otp" && stage !== "resend");
  const submit = async () => {
    const callback = withdraw ? onRequestCode : onSubmit;
    if (!callback || !amount.trim() || pending) return;
    setPending(true);
    try {
      const result = await callback({ amount, mode });
      if (withdraw && (result === true || result?.success === true)) setStage("otp");
      else if (!withdraw && result?.success === true) {
        setDescription(result.description);
        setStage("success");
      }
    } catch (error) {
      onActionError?.(error);
    } finally {
      setPending(false);
    }
  };
  const verify = async (code) => {
    if (!onVerifyCode || pending) return;
    setPending(true);
    try {
      const result = await onVerifyCode({ code, amount });
      if (result?.success === true) {
        setDescription(result.description);
        setStage("success");
      }
    } catch (error) {
      onActionError?.(error);
    } finally {
      setPending(false);
    }
  };
  if (stage === "otp" || stage === "resend")
    return (
      <FigmaContactModal
        type="wallet"
        initialStage="otp"
        initialSeconds={stage === "resend" ? 0 : 120}
        onClose={onClose}
        onResendCode={onResendCode ? () => onResendCode({ amount, mode }) : undefined}
        onRequestError={onActionError}
        onCodeComplete={verify}
      />
    );
  const title = withdraw ? "درخواست وجه از کیف پول اعتباری" : "افزایش اعتبار کیف پول اعتباری";
  const message =
    description ??
    `مبلغ ${amount} تومان ${withdraw ? "در درخواست وجه ثبت شد." : "به کیف پول اعتباری شما واریز شد."}`;
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
        aria-labelledby="figma-wallet-title"
        dir="rtl"
        className={`${typography.root} flex w-[460px] max-w-full flex-col gap-8 rounded-[28px] border border-border-default bg-white p-10 text-text-primary`}
      >
        {stage === "success" ? (
          <>
            <div className="flex size-12 self-center rounded-full bg-figma-success-surface p-3">
              <Image
                src="/assets/figma-inputs/wallet-check.svg"
                alt=""
                width={24}
                height={24}
                unoptimized
              />
            </div>
            <h2
              id="figma-wallet-title"
              className={`${withdraw ? "w-[265px]" : "w-[313px]"} m-0 self-center text-center text-[18px] font-semibold leading-[26px] text-success-strong`}
            >
              {withdraw
                ? "درخواست وجه با موفقیت انجام شد"
                : "افزایش اعتبار با موفقیت انجام شده است."}
            </h2>
            <p className="m-0 w-[386px] max-w-none self-center text-center text-base font-normal leading-[26px]">
              {message}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="h-[57px] w-full rounded-[10px] bg-success-strong text-base font-normal leading-[26px] text-white"
            >
              بستن
            </button>
          </>
        ) : (
          <>
            <div dir="ltr" className="flex h-8 items-center justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن"
                className="size-8 border-0 bg-transparent p-0"
              >
                <Image
                  src="/assets/figma-inputs/close.svg"
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                />
              </button>
              <h2
                id="figma-wallet-title"
                dir="rtl"
                className={`${withdraw ? "w-[256px]" : "w-[233px]"} m-0 text-right text-[18px] font-semibold leading-[26px]`}
              >
                {title}
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex h-[57px] items-center justify-center gap-[10px] rounded-[8px] border border-figma-modal-border bg-white px-2">
                <input
                  aria-label="مبلغ"
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder={withdraw ? "مبلغ" : ""}
                  className={`${typography.input18} ${withdraw && !amount ? "w-[30px] text-center" : "w-[75px] text-right"} bg-transparent font-semibold leading-[26px] text-text-primary outline-none placeholder:text-base placeholder:font-normal placeholder:text-text-disabled`}
                />
                {!withdraw && (
                  <span className="text-base leading-[26px] text-text-disabled">تومان</span>
                )}
              </div>
              {withdraw && balanceLabel && (
                <p className="m-0 text-right text-base leading-[26px] text-text-disabled">
                  {balanceLabel}
                </p>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={submit}
                className="flex h-[57px] items-center justify-center gap-2 rounded-[10px] bg-success-strong text-base font-normal leading-[26px] text-white"
              >
                <Image
                  src={
                    withdraw
                      ? "/assets/figma-inputs/wallet-withdraw.svg"
                      : "/assets/figma-inputs/wallet-add.svg"
                  }
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
                />
                <span className={`${withdraw ? "w-[96px]" : "w-[88px]"} text-left`}>
                  {withdraw ? "درخواست وجه" : "افزایش اعتبار"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
