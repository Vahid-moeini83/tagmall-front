"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/client/utils";
import { getFigmaInputSize } from "./FigmaInputSizes";

const iconAssets = {
  mobileMuted: "/assets/figma-inputs/mobile-muted.svg",
  mobileDefault: "/assets/figma-inputs/mobile-default.svg",
  mobileFocused: "/assets/figma-inputs/mobile-focused.svg",
  mobileError: "/assets/figma-inputs/mobile-error.svg",
  eyeOff: "/assets/figma-inputs/eye-off.svg",
  eye: "/assets/figma-inputs/eye.svg",
  lockMuted: "/assets/figma-inputs/lock-muted.svg",
  lockError: "/assets/figma-inputs/lock-error.svg",
  lockFocused: "/assets/figma-inputs/lock-focused.svg",
  alert: "/assets/figma-inputs/alert.svg",
};

function FigmaIcon({ src, alt = "", className = "" }) {
  return (
    <Image
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={24}
      height={24}
      unoptimized
      className={className}
    />
  );
}

const inputTypes = {
  text: { placeholder: "نام و نام خانوادگی", error: "لطفاً نام خود را وارد کنید" },
  phone: { placeholder: "شماره موبایل", error: "شماره وارد شده معتبر نیست" },
  password: {
    placeholder: "رمز عبور خود را وارد کنید",
    error: "رمز عبور باید حداقل ۸ کاراکتر باشد",
  },
};

/** TagMall Figma inputs. Measurements and colors follow Figma COMPONENT_SET 177:3314–177:3351. */
export function FigmaInput({
  variant = "text",
  state = "default",
  value,
  defaultValue,
  onChange,
  errorMessage,
  placeholder,
  width,
  size = "large",
  className,
  controlClassName,
  inputClassName,
  id,
  disabled,
  dir,
  ...inputProps
}) {
  const [visible, setVisible] = useState(state === "visible");
  const config = inputTypes[variant] ?? inputTypes.text;
  const resolvedWidth = width ?? (variant === "password" && state === "default" ? 246 : 220);
  const sizeTokens = getFigmaInputSize(size);
  const isError = state === "error";
  const isDisabled = disabled || state === "disabled";
  const isFocus = state === "focus";
  const hasValue = state === "filled" || state === "visible" || (value ?? defaultValue);
  const password = variant === "password";
  const resolvedType = password && !visible ? "password" : (inputProps.type ?? "text");
  const leadingIcon =
    variant === "phone" ? (
      <FigmaIcon
        src={
          isError
            ? iconAssets.mobileError
            : isFocus || hasValue
              ? iconAssets.mobileFocused
              : isDisabled
                ? iconAssets.mobileMuted
                : iconAssets.mobileDefault
        }
        className="size-6 shrink-0"
      />
    ) : password && !isError ? (
      <span className="flex size-5 shrink-0 items-center justify-center">
        <FigmaIcon
          src={isFocus || hasValue ? iconAssets.lockFocused : iconAssets.lockMuted}
          className="size-5 shrink-0"
        />
      </span>
    ) : null;

  return (
    <div className={cn("flex flex-col gap-[6px]", className)} style={{ width: resolvedWidth }}>
      <div
        dir="ltr"
        className={cn(
          "flex w-full items-center gap-2 border font-[YekanBakh] transition-none",
          sizeTokens.height,
          isError ? "px-[11px]" : variant === "text" && isFocus ? "px-[10px]" : sizeTokens.padding,
          sizeTokens.radius,
          isDisabled ? "border-border-default bg-surface-muted" : "bg-transparent",
          isError
            ? "border border-figma-error"
            : isFocus
              ? "border-2 border-primary shadow-figma-input-focus"
              : "border border-border-default",
          controlClassName,
        )}
      >
        {variant === "text" && isFocus && (
          <span
            aria-hidden="true"
            className="h-[26px] w-1 shrink-0 after:ml-[1px] after:block after:h-[26px] after:w-px after:bg-text-primary"
          />
        )}
        {password && (
          <button
            type="button"
            aria-label={visible ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
            onClick={() => setVisible(!visible)}
            className="flex size-5 shrink-0 items-center justify-center border-0 bg-transparent p-0"
          >
            <FigmaIcon src={visible ? iconAssets.eye : iconAssets.eyeOff} className="size-5" />
          </button>
        )}
        <input
          {...inputProps}
          id={id}
          type={resolvedType}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={isDisabled}
          placeholder={placeholder ?? config.placeholder}
          dir={dir ?? (variant === "password" ? "ltr" : "rtl")}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent p-0 font-[YekanBakh] text-text-primary outline-none placeholder:text-text-disabled placeholder:opacity-100 focus:ring-0 disabled:cursor-not-allowed",
            sizeTokens.text,
            variant === "password" && "text-right",
            inputClassName,
          )}
        />
        {isError &&
          (password ? (
            <span className="flex size-5 shrink-0 items-center justify-center">
              <FigmaIcon src={iconAssets.lockError} className="size-5 shrink-0" />
            </span>
          ) : variant === "phone" ? (
            <FigmaIcon src={iconAssets.mobileError} className="size-6 shrink-0" />
          ) : (
            <span className="flex size-5 shrink-0 items-center justify-center">
              <FigmaIcon src={iconAssets.alert} className="size-5 shrink-0" />
            </span>
          ))}
        {!isError && leadingIcon && (
          <span className="flex shrink-0 items-center justify-center">{leadingIcon}</span>
        )}
      </div>
      {isError && (
        <p className="m-0 text-right font-[YekanBakh] text-sm font-normal leading-[22px] text-figma-error">
          {errorMessage ?? config.error}
        </p>
      )}
    </div>
  );
}

export function FigmaTextInput(props) {
  return <FigmaInput variant="text" {...props} />;
}
export function FigmaPhoneInput(props) {
  return <FigmaInput variant="phone" {...props} />;
}
export function FigmaPasswordInput(props) {
  return <FigmaInput variant="password" {...props} />;
}
