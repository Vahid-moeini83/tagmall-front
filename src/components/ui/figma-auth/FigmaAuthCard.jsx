"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const AUTH_VARIANTS = {
  phone: {
    title: "ورود به حساب کاربری",
    description: "جهت ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید.",
    descriptionClassName: "w-[305px]",
    action: "ارسال پیامکی کد تایید",
    actionClassName: "w-[169px]",
    gap: 32,
  },
  "otp-timer": {
    title: "ورود به حساب کاربری",
    description: "کد ارسال شده به شماره خود را وارد نمایید.",
    descriptionClassName: "w-[249px]",
    gap: 32,
  },
  "otp-resend": {
    title: "ورود به حساب کاربری",
    description: "کد تایید منقضی شده است. می‌توانید مجدداً درخواست کنید.",
    descriptionClassName: "w-[352px]",
    action: "ارسال مجدد کد تایید",
    actionClassName: "w-[155px]",
    gap: 32,
  },
  register: {
    title: "ایجاد حساب کاربری",
    titleClassName: "w-[172px]",
    description: "اطلاعات خود را جهت ثبت‌نام وارد کنید.",
    descriptionClassName: "w-[223px]",
    action: "ثبت نام",
    actionClassName: "w-[59px]",
    gap: 24,
  },
};

function BrandRow({ showBack, onBack }) {
  return (
    <div className="relative flex h-[65.8995px] w-full items-center justify-center [flex:0_0_auto]">
      {showBack && (
        <button
          type="button"
          aria-label="بازگشت"
          onClick={onBack}
          className={`absolute left-0 top-[21px] size-6 border-0 bg-transparent p-0 ${onBack ? "cursor-pointer" : "cursor-default"}`}
        >
          <Image
            src="/assets/figma-auth/arrow-left.svg"
            alt=""
            aria-hidden
            width={24}
            height={24}
            unoptimized
            className="block size-6"
          />
        </button>
      )}
      <Image
        src="/assets/figma-auth/tagmall-logo.svg"
        alt="تگ مال"
        width={171}
        height={66}
        unoptimized
        className="block h-[65.8995px] w-[170.18px] [flex:0_0_auto]"
      />
    </div>
  );
}

export function FigmaAuthHeader({ title, titleClassName, description, descriptionClassName }) {
  return (
    <header className="flex h-[60px] w-full flex-col items-end gap-2 [flex:0_0_auto]">
      <h1
        dir="rtl"
        className={`box-border max-w-full ${titleClassName ?? "w-[195px]"} m-0 text-right font-[inherit] text-[22px] [font-weight:450] leading-[30px] tracking-[0] text-figma-auth-title`}
      >
        {title}
      </h1>
      <p
        dir="rtl"
        className={`box-border max-w-full ${descriptionClassName} m-0 text-right font-[inherit] text-sm [font-weight:325] leading-[22px] tracking-[0] text-figma-auth-description`}
      >
        {description}
      </p>
    </header>
  );
}

export function FigmaAuthField({
  placeholder,
  icon,
  iconWidth = 24,
  iconHeight = 24,
  placeholderTone = "placeholder",
  strokeAlign = "inside",
  type = "text",
  value,
  defaultValue,
  onChange,
  autoComplete,
  inputMode,
  maxLength,
  disabled = false,
  ariaLabel,
}) {
  const strokeClassName =
    strokeAlign === "center"
      ? "border-0 [box-shadow:0_0_0_0.5px_var(--color-border-default)]"
      : "border border-border-default";
  const iconClassName =
    iconWidth === 20 ? "size-5" : iconHeight === 24.38095 ? "h-[24.38095px] w-6" : "size-6";
  return (
    <label
      className={`box-border flex h-14 w-full items-center gap-2 rounded-[15px] bg-transparent p-3 [direction:ltr] ${strokeClassName}`}
    >
      <input
        aria-label={ariaLabel ?? placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        dir="rtl"
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
        defaultValue={defaultValue}
        className={`box-border h-[26px] min-w-0 w-full border-0 bg-transparent p-0 text-right font-[inherit] text-base [font-weight:325] leading-[26px] tracking-[0] text-text-primary outline-none ${placeholderTone === "disabled" ? "placeholder:text-text-disabled" : "placeholder:text-figma-auth-placeholder"}`}
      />
      <Image
        src={icon}
        alt=""
        aria-hidden
        width={24}
        height={24}
        unoptimized
        className={`block shrink-0 ${iconClassName}`}
      />
    </label>
  );
}

function OtpFields({ code, onCodeChange }) {
  const [localCode, setLocalCode] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);
  const resolvedCode = code ?? localCode;

  function updateCode(index, nextCharacter) {
    const characters = resolvedCode.split("");
    characters[index] = nextCharacter.slice(-1);
    const nextCode = characters.join("").slice(0, 5);
    if (code === undefined) setLocalCode(nextCode);
    onCodeChange?.(nextCode);
    if (nextCharacter && index < 4) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  }

  return (
    <div
      dir="ltr"
      role="group"
      aria-label="کد تأیید پیامکی"
      className="flex h-[61.7143px] w-full items-center justify-between [flex:0_0_auto]"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const active = activeIndex === index;
        const sizeClassName = index === 3 ? "h-[61.7143px]" : "h-[60px]";
        const borderClassName = active
          ? "border border-primary"
          : index === 3
            ? "border-[0.857143px] border-border-default"
            : "border-[0.833333px] border-border-default";
        return (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            aria-label={`رقم ${index + 1} کد تأیید`}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            inputMode="numeric"
            maxLength={1}
            onChange={(event) => updateCode(index, event.target.value)}
            onFocus={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !resolvedCode[index] && index > 0) {
                setActiveIndex(index - 1);
                inputRefs.current[index - 1]?.focus();
              }
            }}
            type="text"
            value={resolvedCode[index] ?? ""}
            className={`box-border w-[60px] shrink-0 rounded-[16px] bg-transparent p-0 text-center font-[inherit] text-lg font-normal leading-6 tracking-[0] text-text-primary outline-none [flex:0_0_60px] ${sizeClassName} ${borderClassName}`}
          />
        );
      })}
    </div>
  );
}

function OtpForm({ code, onCodeChange }) {
  return (
    <div className="flex w-full flex-col gap-3 [flex:0_0_auto]">
      <OtpFields code={code} onCodeChange={onCodeChange} />
      <div dir="ltr" className="flex h-[22px] w-full items-center justify-between [flex:0_0_auto]">
        <p
          dir="rtl"
          className="box-border w-[350px] max-w-[calc(100%_-_28px)] m-0 text-right font-[inherit] text-sm [font-weight:325] leading-[22px] tracking-[0] text-figma-auth-description"
        >
          کد تایید به شماره شما پیامک شده است.
        </p>
        <Image
          src="/assets/figma-auth/message-text.svg"
          alt=""
          aria-hidden
          width={20}
          height={20}
          unoptimized
          className="block size-5 [flex:0_0_auto]"
        />
      </div>
    </div>
  );
}

function TimerButton() {
  return (
    <button
      type="button"
      disabled
      className="box-border flex h-[50px] w-full items-center justify-center rounded-[16px] border border-figma-auth-timer-border bg-white px-0 py-[11px] font-[inherit] text-lg [font-weight:450] leading-[26px] tracking-[0] text-text-primary cursor-default [flex:0_0_auto]"
    >
      <span dir="rtl" className="block w-[258px] max-w-full whitespace-nowrap text-center">
        ارسال مجدد کد تایید تا <span className="text-figma-error">۰۲:۰۰</span> دیگر
      </span>
    </button>
  );
}

export function FigmaAuthPrimaryButton({
  label,
  labelWidth,
  onClick,
  icon,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`box-border flex h-[50px] w-full items-center justify-center rounded-[16px] border border-figma-auth-title bg-primary px-0 py-[11px] font-[inherit] text-lg [font-weight:450] leading-[26px] tracking-[0] text-white [flex:0_0_auto] ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {icon ? (
        <span dir="ltr" className="flex h-[26px] max-w-full items-center">
          <Image
            src={icon}
            alt=""
            aria-hidden
            width={24}
            height={24}
            unoptimized
            className="block size-6 shrink-0"
          />
          <span
            dir="rtl"
            className={`block h-[26px] max-w-full whitespace-nowrap text-center ${labelWidth}`}
          >
            {label}
          </span>
        </span>
      ) : (
        <span
          dir="rtl"
          className={`block h-[26px] max-w-full whitespace-nowrap text-center ${labelWidth}`}
        >
          {label}
        </span>
      )}
    </button>
  );
}

/**
 * TagMall authentication card based on Figma component set 177:3144.
 * `variant` matches the four authored Figma states; no app flow is coupled here.
 */
export function FigmaAuthCard({
  variant = "phone",
  phone,
  onPhoneChange,
  onPhoneSubmit,
  code,
  onCodeChange,
  onResendCode,
  name,
  onNameChange,
  nationalId,
  onNationalIdChange,
  registrationPhone,
  onRegistrationPhoneChange,
  onRegister,
  onBack,
  className = "",
}) {
  const config = AUTH_VARIANTS[variant] ?? AUTH_VARIANTS.phone;
  const showOtp = variant === "otp-timer" || variant === "otp-resend";
  const showRegister = variant === "register";
  const showBack = showOtp || showRegister;

  return (
    <section
      dir="rtl"
      aria-label={config.title}
      className={`box-border flex w-[min(100%,460px)] flex-col items-stretch rounded-[28px] border border-border-default bg-white p-10 font-[YekanBakh,sans-serif] [flex:0_0_auto] ${showRegister ? "gap-6" : "gap-8"} ${className}`}
      data-figma-node="177:3144"
      data-figma-variant={variant}
    >
      <BrandRow showBack={showBack} onBack={onBack} />
      <FigmaAuthHeader
        title={config.title}
        titleClassName={config.titleClassName}
        description={config.description}
        descriptionClassName={config.descriptionClassName}
      />
      {variant === "phone" && (
        <FigmaAuthField
          ariaLabel="شماره موبایل"
          autoComplete="tel"
          icon="/assets/figma-auth/phone-login.svg"
          inputMode="tel"
          onChange={onPhoneChange}
          placeholder="شماره موبایل"
          placeholderTone="disabled"
          type="tel"
          value={phone}
        />
      )}
      {showOtp && <OtpForm code={code} onCodeChange={onCodeChange} />}
      {variant === "otp-timer" && <TimerButton />}
      {variant === "otp-resend" && (
        <FigmaAuthPrimaryButton
          label={config.action}
          labelWidth={config.actionClassName}
          onClick={onResendCode}
        />
      )}
      {showRegister && (
        <div className="flex w-full flex-col gap-4 [flex:0_0_auto]">
          <FigmaAuthField
            ariaLabel="نام و نام خانوادگی"
            icon="/assets/figma-auth/user.svg"
            onChange={onNameChange}
            placeholder="نام و نام خانوادگی"
            strokeAlign="center"
            value={name}
          />
          <FigmaAuthField
            ariaLabel="شناسه ملی"
            icon="/assets/figma-auth/barcode-read.svg"
            onChange={onNationalIdChange}
            placeholder="شناسه ملی"
            strokeAlign="center"
            value={nationalId}
          />
          <FigmaAuthField
            ariaLabel="شماره موبایل"
            autoComplete="tel"
            icon="/assets/figma-auth/mobile.svg"
            iconHeight={24.38095}
            inputMode="tel"
            onChange={onRegistrationPhoneChange}
            placeholder="شماره موبایل"
            strokeAlign="center"
            type="tel"
            value={registrationPhone}
          />
        </div>
      )}
      {variant === "phone" && (
        <FigmaAuthPrimaryButton
          label={config.action}
          labelWidth={config.actionClassName}
          onClick={onPhoneSubmit}
        />
      )}
      {showRegister && (
        <FigmaAuthPrimaryButton
          label={config.action}
          labelWidth={config.actionClassName}
          onClick={onRegister}
        />
      )}
    </section>
  );
}

export default FigmaAuthCard;
