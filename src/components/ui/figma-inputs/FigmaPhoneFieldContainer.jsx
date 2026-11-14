"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/client/utils";
import { FigmaContactModal } from "./FigmaContactModal";
import { FigmaBankDropdown } from "./FigmaBankDropdown";
import { FigmaAddressModal } from "./FigmaAddressModal";
import typography from "./FigmaTypography.module.css";
import { getFigmaInputSize } from "./FigmaInputSizes";

const icons = {
  chevron: "/assets/figma-inputs/phone-field-chevron.svg",
  trashSelected: "/assets/figma-inputs/phone-field-trash-selected.svg",
  trashUnselected: "/assets/figma-inputs/phone-field-trash-unselected.svg",
  plus: "/assets/figma-inputs/phone-field-plus.svg",
};

const defaultPhones = [
  { id: "primary", value: "۰۹۰۲۹۳۲۰۹۱۸" },
  { id: "secondary", value: "۰۹۱۲۵۵۵۱۲۳۴" },
];
const defaultEmails = [{ id: "email", value: "tagmall@info.ir" }];
const defaultAddresses = [{ id: "address", value: "آدرس خود را انتخاب کنید" }];

function FigmaPhoneFieldIcon({ src, className = "" }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={20}
      height={20}
      unoptimized
      className={cn("size-5 shrink-0", className)}
    />
  );
}

/** Figma PhoneFieldContainer (177:3411), including its collapsed and open menu states. */
function FigmaContactFieldContainer({
  type = "phone",
  state = "default",
  size = "large",
  value,
  defaultValue,
  phones: phonesProp,
  onChange,
  onAddPhone,
  onRequestCode,
  onResendCode,
  onCodeChange,
  onCodeComplete,
  onVerifyCode,
  onVerified,
  onVerificationError,
  onRequestError,
  onAddAddress,
  onVerifyAddress,
  onDeletePhone,
  label,
  required = true,
  disabled = false,
  className,
}) {
  const id = useId();
  const triggerRef = useRef(null);
  const isEmail = type === "email";
  const isAddress = type === "address";
  const initialOptions = isEmail ? defaultEmails : isAddress ? defaultAddresses : defaultPhones;
  const [internalValue, setInternalValue] = useState(defaultValue ?? initialOptions[0].value);
  const [internalPhones, setInternalPhones] = useState(initialOptions);
  const [open, setOpen] = useState(state === "selected");
  const [adding, setAdding] = useState(false);
  const controlled = value !== undefined;
  const controlledPhones = phonesProp !== undefined;
  const phoneOptions = phonesProp ?? internalPhones;
  const selectedValue = controlled ? value : internalValue;
  const selectedPhone = phoneOptions.find((phone) => phone.value === selectedValue);
  const sizeTokens = getFigmaInputSize(size);

  const selectPhone = (phone) => {
    if (!controlled) setInternalValue(phone.value);
    onChange?.(phone.value, phone);
    setOpen(false);
  };

  const deletePhone = (phone) => {
    onDeletePhone?.(phone);
    if (controlledPhones) return;

    const nextPhones = phoneOptions.filter(
      (item) => (item.id ?? item.value) !== (phone.id ?? phone.value),
    );
    setInternalPhones(nextPhones);
    if (phone.value === selectedValue) {
      const nextPhone = nextPhones[0];
      if (!controlled) setInternalValue(nextPhone?.value ?? "");
      onChange?.(nextPhone?.value ?? "", nextPhone);
    }
  };

  const addVerified = (newValue, result) => {
    const item = result?.item ?? { id: newValue, value: newValue };
    if (!controlledPhones)
      setInternalPhones((current) =>
        current.some((option) => option.value === item.value) ? current : [...current, item],
      );
    if (!controlled) setInternalValue(item.value);
    onChange?.(item.value, item);
    onVerified?.(item, result);
    setAdding(false);
  };

  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) setOpen(false);
      }}
      className={cn(typography.root, "flex w-[474px] flex-col gap-2", className)}
    >
      <div dir="ltr" className="flex h-[22px] w-full items-start justify-end gap-1">
        {required && (
          <span
            aria-hidden="true"
            className="w-[9px] shrink-0 text-center text-sm font-normal leading-[22px] text-figma-error"
          >
            *
          </span>
        )}
        <span
          id={`${id}-label`}
          dir="rtl"
          className={cn(
            "shrink-0 text-right text-sm font-normal leading-[22px] text-text-secondary",
            !isEmail && !isAddress && !label && "w-[79px]",
          )}
        >
          {label ?? (isEmail ? "پست الکترونیک" : isAddress ? "آدرس" : "شماره موبایل")}
          {required && <span className="sr-only"> (اجباری)</span>}
        </span>
      </div>

      <button
        ref={triggerRef}
        type="button"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-expanded={open}
        aria-controls={`${id}-options`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        dir="ltr"
        className={cn(
          "flex w-full items-center gap-2 border border-border-default bg-transparent text-left disabled:cursor-not-allowed",
          sizeTokens.height,
          sizeTokens.radius,
          sizeTokens.padding,
        )}
      >
        <FigmaPhoneFieldIcon src={icons.chevron} />
        <span
          id={`${id}-value`}
          dir="rtl"
          className={cn(
            "min-w-0 flex-1 truncate text-right font-normal text-text-primary",
            sizeTokens.text,
          )}
        >
          {selectedPhone?.value ?? selectedValue}
        </span>
      </button>

      {open && (
        <div
          id={`${id}-options`}
          role="group"
          aria-label={
            isEmail
              ? "ایمیل‌های ذخیره‌شده"
              : isAddress
                ? "آدرس‌های ذخیره‌شده"
                : "شماره‌های ذخیره‌شده"
          }
          className="box-border h-auto min-h-[163px] w-full overflow-hidden rounded-[12px] bg-surface-subtle px-3 pb-[6px] pt-3"
        >
          <div className="flex flex-col">
            {phoneOptions.map((phone) => {
              const selected = phone.value === selectedValue;
              return (
                <div
                  key={phone.id ?? phone.value}
                  dir="ltr"
                  className={cn(
                    "flex h-[49px] w-full shrink-0 items-center gap-[10px] rounded-[8px] px-3",
                    selected && "bg-primary-50",
                  )}
                >
                  <button
                    type="button"
                    aria-label={`حذف ${isEmail ? "ایمیل" : isAddress ? "آدرس" : "شماره"} ${phone.value}`}
                    disabled={disabled}
                    onClick={() => deletePhone(phone)}
                    className="flex size-5 shrink-0 items-center justify-center border-0 bg-transparent p-0 disabled:cursor-not-allowed"
                  >
                    <FigmaPhoneFieldIcon
                      src={selected ? icons.trashSelected : icons.trashUnselected}
                    />
                  </button>
                  <label
                    onClick={() => {
                      if (selected) setOpen(false);
                    }}
                    dir="ltr"
                    className={cn(
                      "flex h-full min-w-0 flex-1 cursor-pointer items-center gap-[10px]",
                      selected ? "text-primary" : "text-figma-input-strong",
                    )}
                  >
                    <span
                      dir="rtl"
                      className="min-w-0 flex-1 truncate text-right text-base font-normal leading-[25px]"
                    >
                      {phone.value}
                    </span>
                    <input
                      type="radio"
                      name={`${id}-phone`}
                      value={phone.value}
                      checked={selected}
                      disabled={disabled}
                      onChange={() => selectPhone(phone)}
                      aria-label={phone.value}
                      className={`size-5 shrink-0 appearance-none rounded-full border border-border-default bg-white outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 checked:border-primary ${selected ? "bg-[radial-gradient(circle,var(--color-primary)_0_5px,white_5px)]" : ""}`}
                    />
                  </label>
                </div>
              );
            })}
            <div aria-hidden="true" className="h-px w-full shrink-0 bg-border-default" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setAdding(true);
                if (!isEmail && !isAddress) onAddPhone?.();
              }}
              disabled={disabled}
              dir="ltr"
              className="flex h-[46px] w-full shrink-0 items-center justify-between gap-[10px] border-0 bg-transparent px-3 py-0 text-left disabled:cursor-not-allowed"
            >
              <span
                dir="rtl"
                className="min-w-0 flex-1 text-right text-sm font-normal leading-[22px] text-primary"
              >
                {isEmail
                  ? "افزودن پست الکترونیک"
                  : isAddress
                    ? "افزودن آدرس جدید"
                    : "افزودن شماره تماس جدید"}
              </span>
              <FigmaPhoneFieldIcon src={icons.plus} />
            </button>
          </div>
        </div>
      )}
      {adding &&
        (isAddress ? (
          <FigmaAddressModal
            returnFocusRef={triggerRef}
            onClose={() => setAdding(false)}
            onAddAddress={onAddAddress}
            onVerifyAddress={onVerifyAddress}
            onVerified={addVerified}
            onVerificationError={onVerificationError}
          />
        ) : (
          <FigmaContactModal
            returnFocusRef={triggerRef}
            type={type}
            onClose={() => setAdding(false)}
            onRequestCode={onRequestCode}
            onResendCode={onResendCode}
            onRequestError={onRequestError}
            onCodeChange={onCodeChange}
            onCodeComplete={onCodeComplete}
            onVerifyCode={onVerifyCode}
            onVerified={addVerified}
            onVerificationError={onVerificationError}
          />
        ))}
    </div>
  );
}

export function FigmaPhoneFieldContainer({ type = "phone", ...props }) {
  return type === "bank" ? (
    <FigmaBankDropdown {...props} />
  ) : (
    <FigmaContactFieldContainer type={type} {...props} />
  );
}
