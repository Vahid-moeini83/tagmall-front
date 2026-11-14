"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useFigmaDialog } from "./useFigmaDialog";
import typography from "./FigmaTypography.module.css";

/** Add-address states from Figma 177:4836. */
export function FigmaAddressModal({
  onClose,
  returnFocusRef,
  onAddAddress,
  onVerifyAddress,
  onVerified,
  onVerificationError,
}) {
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [verify, setVerify] = useState(false);
  const [pending, setPending] = useState(false);
  const dialogRef = useFigmaDialog(onClose, true, returnFocusRef);
  const submit = async (event) => {
    event.preventDefault();
    const callback = verify ? onVerifyAddress : onAddAddress;
    if (!callback || pending) return;
    setPending(true);
    try {
      const result = await callback({ address, postalCode });
      if (result === true || result?.success === true) {
        if (verify) onVerified?.(address, result);
        else setVerify(true);
      }
    } catch (error) {
      onVerificationError?.(error);
    } finally {
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
        aria-labelledby="figma-address-title"
        dir="rtl"
        className={`${typography.root} flex w-[460px] max-w-full flex-col gap-8 rounded-[28px] border border-border-default bg-white p-10 text-text-primary`}
      >
        <div dir="ltr" className="flex h-8 items-center justify-between">
          <button
            type="button"
            aria-label="بستن"
            onClick={onClose}
            className="size-8 border-0 bg-transparent p-0"
          >
            <Image src="/assets/figma-inputs/close.svg" alt="" width={32} height={32} unoptimized />
          </button>
          <h2
            id="figma-address-title"
            dir="rtl"
            className="m-0 w-[144px] text-right text-[18px] font-semibold leading-[26px]"
          >
            افزودن آدرس جدید
          </h2>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex h-[26px] items-center gap-1 text-base font-normal leading-[26px] text-text-secondary">
            <span className="w-[39px] text-right">آدرس</span>
            <span className="w-[10px] text-left text-figma-error">*</span>
          </label>
          <input
            required
            readOnly={pending}
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setVerify(false);
            }}
            aria-label="آدرس"
            placeholder="آدرس خود را وارد کنید"
            className="h-[57px] w-full rounded-[8px] border border-figma-modal-border bg-white px-2 text-right text-sm leading-[22px] outline-none placeholder:text-text-disabled"
          />
          <label className="flex h-[26px] items-center gap-1 text-base font-normal leading-[26px] text-text-secondary">
            <span className="w-[61px] text-right">کد پستی</span>
            <span className="w-[10px] text-left text-figma-error">*</span>
          </label>
          <input
            required
            readOnly={pending}
            inputMode="numeric"
            value={postalCode}
            onChange={(event) => {
              setPostalCode(event.target.value);
              setVerify(false);
            }}
            aria-label="کد پستی"
            placeholder="کد پستی خود را وارد کنید"
            className="h-[57px] w-full rounded-[8px] border border-figma-modal-border bg-white px-2 text-right text-sm leading-[22px] outline-none placeholder:text-text-disabled"
          />
          {verify && (
            <div className="flex h-[26px] items-start gap-2 text-base leading-[26px] text-text-secondary">
              <Image
                src="/assets/figma-inputs/address-info.svg"
                alt=""
                width={24}
                height={24}
                unoptimized
              />
              <span>کد پستی توسط اداره پست احراز می شود.</span>
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-[57px] rounded-[10px] bg-success-strong text-base font-normal leading-[26px] text-white"
          >
            {verify ? "احراز کد پستی" : "افزودن آدرس"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
