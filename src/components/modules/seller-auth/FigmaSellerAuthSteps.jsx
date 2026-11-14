"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { isValidIranianMobile, isValidIranianNationalCode } from "@/lib/client/validations";
import { toEnglishNumber } from "@/lib/client/utils";
import styles from "./FigmaSellerAuthSteps.module.css";

const AUTH_LOGO = "/assets/figma-seller-auth/legal-seller-logo.svg";

function toDigits(value) {
  return toEnglishNumber(String(value ?? "")).replace(/[^0-9]/g, "");
}

function toPersianDigits(value) {
  return String(value).replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function SellerAuthHeader({ title, description, variant }) {
  return (
    <div
      className={styles.header}
      data-figma-node={
        variant === "otp"
          ? "240:2247"
          : variant === "registration-individual"
            ? "240:2364"
            : "240:2423"
      }
      data-variant={variant}
    >
      <div
        className={styles.logoSlot}
        data-figma-node={variant === "otp" ? "240:2248" : "240:2424"}
      >
        <Image
          src={AUTH_LOGO}
          alt="تگ مال"
          width={170.18}
          height={65.8995285}
          unoptimized
          className={styles.logo}
        />
      </div>
      <div className={styles.headerCopy}>
        <h1 className={styles.title} dir="rtl">
          {title}
        </h1>
        <p className={styles.description} dir="rtl">
          {description}
        </p>
      </div>
    </div>
  );
}

function OtpFields({ disabled, error, onVerify }) {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);
  const submittedCode = useRef("");

  useEffect(() => {
    if (!disabled) inputRefs.current[0]?.focus();
  }, [disabled]);

  function commitCharacters(startIndex, rawValue) {
    const digits = toDigits(rawValue);
    if (!digits) {
      const characters = [...code];
      characters[startIndex] = "";
      setCode(characters);
      submittedCode.current = "";
      return;
    }

    const characters = [...code];
    digits
      .slice(0, 5 - startIndex)
      .split("")
      .forEach((digit, offset) => {
        characters[startIndex + offset] = digit;
      });
    const nextCode = characters.join("");
    setCode(characters);
    setActiveIndex(Math.min(startIndex + digits.length, 4));

    if (digits.length === 1 && startIndex < 4) {
      inputRefs.current[startIndex + 1]?.focus();
    }

    if (characters.every(Boolean) && submittedCode.current !== nextCode) {
      submittedCode.current = nextCode;
      onVerify(nextCode);
    }
  }

  function handleChange(index, event) {
    commitCharacters(index, event.target.value);
  }

  function handlePaste(index, event) {
    event.preventDefault();
    commitCharacters(index, event.clipboardData.getData("text"));
  }

  return (
    <div className={styles.otpFields} dir="ltr" role="group" aria-label="کد تأیید پیامکی">
      {Array.from({ length: 5 }, (_, index) => {
        const selected = activeIndex === index;
        const boxClassName = [
          styles.otpBox,
          selected ? styles.otpBoxActive : "",
          index === 3 ? styles.otpBoxFourth : "",
          error ? styles.otpBoxError : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            aria-label={`رقم ${index + 1} کد تأیید`}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            className={boxClassName}
            disabled={disabled}
            inputMode="numeric"
            maxLength={1}
            onChange={(event) => handleChange(index, event)}
            onFocus={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !code[index] && index > 0) {
                setActiveIndex(index - 1);
                inputRefs.current[index - 1]?.focus();
              }
            }}
            onPaste={(event) => handlePaste(index, event)}
            type="text"
            value={code[index]}
          />
        );
      })}
    </div>
  );
}

export function FigmaSellerOtpStep({
  initialSeconds = 120,
  isBusy = false,
  error = "",
  onBack,
  onResend,
  onVerify,
  timerResetKey = 0,
  resetKey = 0,
}) {
  return (
    <div className={styles.otpStep} data-figma-node="240:2243">
      <div className={styles.backRow} data-figma-node="240:2244" dir="ltr">
        <button
          type="button"
          className={styles.backButton}
          aria-label="بازگشت و ویرایش اطلاعات"
          onClick={onBack}
          disabled={isBusy}
        >
          <Image
            src="/assets/figma-seller-auth/otp-back.svg"
            alt=""
            aria-hidden
            width={25}
            height={25}
            unoptimized
            className={styles.backIcon}
          />
        </button>
      </div>

      <SellerAuthHeader
        variant="otp"
        title="تأیید ورود به حساب"
        description="برای ورود به پنل فروشندگان، کد پیامک‌شده را وارد کنید."
      />

      <div className={styles.otpForm} data-figma-node="240:2278">
        <OtpFields key={resetKey} disabled={isBusy} error={Boolean(error)} onVerify={onVerify} />
        <div className={styles.otpHelperRow} dir="ltr">
          <p
            className={error ? styles.otpHelperError : styles.otpHelper}
            dir="rtl"
            aria-live="polite"
          >
            {error || "کد تایید به شماره شما پیامک می‌شود"}
          </p>
          <Image
            src="/assets/figma-auth/message-text.svg"
            alt=""
            aria-hidden
            width={20}
            height={20}
            unoptimized
            className={styles.messageIcon}
          />
        </div>
      </div>

      <OtpTimerControl
        key={timerResetKey}
        initialSeconds={initialSeconds}
        isBusy={isBusy}
        onResend={onResend}
      />
    </div>
  );
}

function OtpTimerControl({ initialSeconds, isBusy, onResend }) {
  const [secondsLeft, setSecondsLeft] = useState(Math.max(0, initialSeconds));

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  async function handleResend() {
    await onResend();
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return secondsLeft > 0 ? (
    <button type="button" className={styles.timerButton} disabled aria-live="off">
      <span dir="rtl">
        ارسال مجدد کد تایید تا{" "}
        <span className={styles.timerDigits}>{toPersianDigits(minutes + ":" + seconds)}</span> دیگر
      </span>
    </button>
  ) : (
    <button type="button" className={styles.resendButton} onClick={handleResend} disabled={isBusy}>
      ارسال مجدد کد تایید
    </button>
  );
}

function RegistrationField({
  ariaLabel,
  autoComplete,
  icon,
  iconHeight = 24,
  inputMode,
  maxLength,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  value,
}) {
  return (
    <label className={styles.registrationField}>
      <input
        aria-label={ariaLabel}
        autoComplete={autoComplete}
        disabled={disabled}
        dir="rtl"
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      <Image
        src={icon}
        alt=""
        aria-hidden
        width={24}
        height={24}
        unoptimized
        className={iconHeight === 24 ? styles.fieldIcon : styles.mobileFieldIcon}
      />
    </label>
  );
}

function FieldGroup({ children, title, dataNode }) {
  return (
    <section className={styles.fieldGroup} data-figma-node={dataNode}>
      {title && <h2 className={styles.fieldGroupTitle}>{title}</h2>}
      <div className={styles.fieldGroupInputs}>{children}</div>
    </section>
  );
}

export function FigmaSellerRegistrationStep({
  sellerType,
  initialPhone = "",
  initialCompanyNationalId = "",
  isBusy = false,
  onRegister,
}) {
  const [phone, setPhone] = useState(toDigits(initialPhone).slice(0, 11));
  const [individualName, setIndividualName] = useState("");
  const [individualNationalId, setIndividualNationalId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyNationalId, setCompanyNationalId] = useState(
    toDigits(initialCompanyNationalId).slice(0, 11),
  );
  const [managerName, setManagerName] = useState("");
  const [managerNationalId, setManagerNationalId] = useState("");
  const isLegalSeller = sellerType === "legal";

  function handleSubmit(event) {
    event.preventDefault();

    if (!isValidIranianMobile(phone)) {
      toast.error("شماره موبایل معتبر نیست.");
      return;
    }

    if (isLegalSeller) {
      if (!companyName.trim()) {
        toast.error("نام شرکت را وارد کنید.");
        return;
      }
      if (!/^\d{11}$/.test(companyNationalId)) {
        toast.error("شناسه ملی شرکت باید ۱۱ رقم باشد.");
        return;
      }
      if (managerName.trim().split(/\s+/).length < 2) {
        toast.error("نام و نام خانوادگی مدیر عامل را وارد کنید.");
        return;
      }
      if (!isValidIranianNationalCode(managerNationalId)) {
        toast.error("کد ملی مدیر عامل معتبر نیست.");
        return;
      }
      onRegister({
        sellerType,
        mobile: toDigits(phone),
        companyName: companyName.trim(),
        companyNationalId,
        managerName: managerName.trim(),
        managerNationalId: toDigits(managerNationalId),
      });
      return;
    }

    if (individualName.trim().split(/\s+/).length < 2) {
      toast.error("نام و نام خانوادگی مالک کسب و کار را وارد کنید.");
      return;
    }
    if (!isValidIranianNationalCode(individualNationalId)) {
      toast.error("کد ملی مالک کسب و کار معتبر نیست.");
      return;
    }

    onRegister({
      sellerType,
      mobile: toDigits(phone),
      individualName: individualName.trim(),
      nationalId: toDigits(individualNationalId),
    });
  }

  return (
    <form
      className={`${styles.registrationStep} ${isLegalSeller ? styles.registrationLegal : styles.registrationIndividual}`}
      data-figma-node={isLegalSeller ? "240:2422" : "240:2363"}
      onSubmit={handleSubmit}
    >
      <SellerAuthHeader
        variant={isLegalSeller ? "registration-legal" : "registration-individual"}
        title={isLegalSeller ? "ثبت نام فروشنده حقوقی" : "ثبت نام فروشنده حقیقی"}
        description={
          isLegalSeller
            ? "اطلاعات شرکت و مدیر عامل را برای ساخت حساب وارد کنید."
            : "مالک کسب و کار محترم لطفا اطلاعات هویتی خود را ثبت کنید"
        }
      />

      {isLegalSeller ? (
        <>
          <FieldGroup title="اطلاعات هویتی شرکت" dataNode="240:2454">
            <RegistrationField
              ariaLabel="نام شرکت"
              disabled={isBusy}
              icon="/assets/figma-auth/user.svg"
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="نام شرکت"
              value={companyName}
            />
            <RegistrationField
              ariaLabel="شناسه ملی شرکت"
              disabled={isBusy}
              icon="/assets/figma-auth/barcode-read.svg"
              inputMode="numeric"
              maxLength={11}
              onChange={(event) => setCompanyNationalId(toDigits(event.target.value).slice(0, 11))}
              placeholder="شناسه ملی شرکت"
              value={companyNationalId}
            />
          </FieldGroup>

          <div className={styles.legalManagerAndSubmit} data-figma-node="240:2463">
            <FieldGroup title="اطلاعات هویتی مدیر عامل" dataNode="240:2463">
              <RegistrationField
                ariaLabel="نام و نام خانوادگی مدیر عامل"
                disabled={isBusy}
                icon="/assets/figma-auth/user.svg"
                onChange={(event) => setManagerName(event.target.value)}
                placeholder="نام و نام خانوادگی مدیر عامل"
                value={managerName}
              />
              <RegistrationField
                ariaLabel="کد ملی مدیر عامل"
                disabled={isBusy}
                icon="/assets/figma-auth/barcode-read.svg"
                inputMode="numeric"
                maxLength={10}
                onChange={(event) =>
                  setManagerNationalId(toDigits(event.target.value).slice(0, 10))
                }
                placeholder="کد ملی مدیر عامل"
                value={managerNationalId}
              />
              <RegistrationField
                ariaLabel="شماره موبایل"
                disabled={isBusy}
                autoComplete="tel"
                icon="/assets/figma-auth/mobile.svg"
                iconHeight={24.38095}
                inputMode="tel"
                maxLength={11}
                onChange={(event) => setPhone(toDigits(event.target.value).slice(0, 11))}
                placeholder="شماره موبایل"
                type="tel"
                value={phone}
              />
            </FieldGroup>
            <RegistrationSubmitButton disabled={isBusy} />
          </div>
        </>
      ) : (
        <div className={styles.individualFieldsAndSubmit} data-figma-node="240:2395">
          <div className={styles.individualFields}>
            <RegistrationField
              ariaLabel="نام و نام خانوادگی مالک کسب و کار"
              disabled={isBusy}
              icon="/assets/figma-auth/user.svg"
              onChange={(event) => setIndividualName(event.target.value)}
              placeholder="نام و نام خانوادگی مالک کسب و کار"
              value={individualName}
            />
            <RegistrationField
              ariaLabel="کد ملی مالک کسب و کار"
              disabled={isBusy}
              icon="/assets/figma-auth/barcode-read.svg"
              inputMode="numeric"
              maxLength={10}
              onChange={(event) =>
                setIndividualNationalId(toDigits(event.target.value).slice(0, 10))
              }
              placeholder="کد ملی مالک کسب و کار"
              value={individualNationalId}
            />
            <RegistrationField
              ariaLabel="شماره موبایل"
              disabled={isBusy}
              autoComplete="tel"
              icon="/assets/figma-auth/mobile.svg"
              iconHeight={24.38095}
              inputMode="tel"
              maxLength={11}
              onChange={(event) => setPhone(toDigits(event.target.value).slice(0, 11))}
              placeholder="شماره موبایل"
              type="tel"
              value={phone}
            />
          </div>
          <RegistrationSubmitButton disabled={isBusy} />
        </div>
      )}
    </form>
  );
}

function RegistrationSubmitButton({ disabled }) {
  return (
    <button type="submit" className={styles.registrationSubmit} disabled={disabled} dir="ltr">
      <Image
        src="/assets/figma-seller-auth/arrow-left.svg"
        alt=""
        aria-hidden
        width={24}
        height={24}
        unoptimized
        className={styles.submitIcon}
      />
      <span dir="rtl">ادامه ثبت‌نام</span>
    </button>
  );
}
