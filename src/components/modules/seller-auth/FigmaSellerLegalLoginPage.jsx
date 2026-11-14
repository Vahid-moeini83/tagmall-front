"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FigmaAuthField,
  FigmaAuthHeader,
  FigmaAuthPrimaryButton,
} from "@/components/ui/figma-auth";
import { FigmaSellerOtpStep, FigmaSellerRegistrationStep } from "./FigmaSellerAuthSteps";
import { checkAuthValidation, registerUser, sendOtp } from "@/lib/server/actions/auth";
import { isValidIranianMobile } from "@/lib/client/validations";
import { toEnglishNumber } from "@/lib/client/utils";
import {
  getAuthErrorMessage,
  getOtpExpirySeconds,
  parseAuthBoolean,
  persistAuthSession,
} from "@/lib/client/auth";
import usePublicStore from "@/app/store/publicStore";
import styles from "./FigmaSellerLegalLoginPage.module.css";

const legalTermsAlt =
  "با ورود و یا ثبت نام در تگ مال شما شرایط و قوانین استفاده از سرویس‌های سایت و قوانین حریم خصوصی آن را می‌پذیرید.";

function RebrandAnnouncement() {
  return (
    <header className={styles.announcementBar}>
      <div className={styles.announcement} dir="ltr">
        <Image
          src="/assets/figma-seller-auth/rebrand-mark.svg"
          alt=""
          aria-hidden
          width={24}
          height={24}
          unoptimized
          className="block size-6 shrink-0"
        />
        <span
          dir="rtl"
          className="h-6 w-[76px] shrink-0 whitespace-nowrap text-left font-[YekanBakh,sans-serif] text-base [font-weight:450] leading-6 text-white"
        >
          نسخه جدید
        </span>
        <span
          aria-hidden="true"
          className="h-[26px] w-[5px] shrink-0 whitespace-nowrap font-[Meem,YekanBakh,sans-serif] text-base font-normal leading-[26px] text-white"
        >
          |
        </span>
        <span
          dir="rtl"
          className="h-[26px] w-[121px] shrink-0 whitespace-nowrap text-left font-[YekanBakh,sans-serif] text-base [font-weight:325] leading-[26px] text-white"
        >
          تگ مال ریبرند کرد
        </span>
      </div>
    </header>
  );
}

function SellerTypeTabs({ value, onChange }) {
  const sellerTypes = [
    { id: "legal", label: "فروشنده حقوقی", labelClassName: styles.legalTabLabel },
    { id: "individual", label: "فروشنده حقیقی", labelClassName: styles.individualTabLabel },
  ];

  return (
    <div
      aria-label="نوع فروشنده"
      className={styles.sellerTypeTabs}
      data-figma-node="240:1789"
      dir="ltr"
      role="tablist"
    >
      {sellerTypes.map((sellerType) => {
        const selected = value === sellerType.id;

        return (
          <button
            key={sellerType.id}
            aria-selected={selected}
            className={`${styles.sellerTypeTab} ${
              selected ? styles.sellerTypeTabSelected : styles.sellerTypeTabIdle
            } ${sellerType.id === "legal" ? styles.legalTab : styles.individualTab}`}
            onClick={() => onChange(sellerType.id)}
            role="tab"
            type="button"
          >
            <span dir="rtl" className={sellerType.labelClassName}>
              {sellerType.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function LegalSellerField({
  label,
  placeholder,
  icon,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
  onChange,
  value,
  hideIconOnMobile = false,
}) {
  return (
    <div className={styles.field} data-hide-icon-on-mobile={hideIconOnMobile ? "true" : undefined}>
      <label className={styles.fieldLabel}>{label}</label>
      <FigmaAuthField
        ariaLabel={label}
        autoComplete={autoComplete}
        icon={icon}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        placeholderTone="disabled"
        type={type}
        value={value}
      />
    </div>
  );
}

function MobileSubmitButton({ label, disabled }) {
  return (
    <button className={styles.mobileSubmitButton} type="submit" disabled={disabled}>
      <Image
        src="/assets/figma-seller-auth/arrow-left-mobile.svg"
        alt=""
        aria-hidden
        width={18}
        height={18}
        unoptimized
        className={styles.mobileSubmitIcon}
      />
      <span className={styles.mobileSubmitLabel} dir="rtl">
        {label}
      </span>
    </button>
  );
}

export function FigmaSellerLegalLoginPage() {
  const router = useRouter();
  const setUserInfo = usePublicStore((state) => state.setUserInfo);
  const setAccessToken = usePublicStore((state) => state.setAccessToken);
  const [sellerType, setSellerType] = useState("legal");
  const [stage, setStage] = useState("credentials");
  const [companyNationalId, setCompanyNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [otpExpiresIn, setOtpExpiresIn] = useState(120);
  const [otpResetKey, setOtpResetKey] = useState(0);
  const [otpTimerResetKey, setOtpTimerResetKey] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const isLegalSeller = sellerType === "legal";
  const submitLabel = "ارسال پیامکی کد تایید";

  function handleCredentialsSubmit(event) {
    event.preventDefault();
    handleStartAuth();
  }

  async function handleStartAuth() {
    if (isBusy) return;
    const normalizedPhone = toEnglishNumber(phone).replace(/[^0-9]/g, "");
    const normalizedCompanyId = toEnglishNumber(companyNationalId).replace(/[^0-9]/g, "");

    if (isLegalSeller && !/^\d{11}$/.test(normalizedCompanyId)) {
      toast.error("شناسه ملی شرکت باید ۱۱ رقم باشد.");
      return;
    }
    if (!isValidIranianMobile(normalizedPhone)) {
      toast.error("شماره موبایل معتبر نیست.");
      return;
    }

    setIsBusy(true);
    try {
      const { sendOtpRes, sendOtpErr } = await sendOtp({ mobile: normalizedPhone });
      const responseData = sendOtpRes?.data;
      const isNewUserValue = parseAuthBoolean(responseData?.is_new_user);
      if (!responseData || isNewUserValue === null) {
        toast.error(getAuthErrorMessage(sendOtpErr, "ارسال کد تأیید انجام نشد."));
        return;
      }

      setPhone(normalizedPhone);
      if (isLegalSeller) setCompanyNationalId(normalizedCompanyId);
      setIsNewUser(isNewUserValue);
      setOtpExpiresIn(getOtpExpirySeconds(responseData.expires_in_seconds));
      setOtpResetKey((key) => key + 1);
      setOtpTimerResetKey((key) => key + 1);
      setStage("otp");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "ارسال کد تأیید انجام نشد."));
    } finally {
      setIsBusy(false);
    }
  }

  async function completeAuthentication(registerRes) {
    try {
      await persistAuthSession({
        authData: registerRes?.data,
        setAccessToken,
        setUserInfo,
      });
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "ذخیره‌سازی اطلاعات ورود انجام نشد."));
      return false;
    }

    toast.success("ورود با موفقیت انجام شد.");
    router.push("/seller");
    return true;
  }

  async function handleVerifyOtp(otp) {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const { checkRes, checkErr } = await checkAuthValidation({ otp, mobile: phone });
      const isOtpValid = parseAuthBoolean(checkRes?.data?.valid);
      if (!checkRes?.data || isOtpValid === null) {
        toast.error(getAuthErrorMessage(checkErr, "بررسی کد تأیید انجام نشد."));
        setOtpResetKey((key) => key + 1);
        return;
      }
      if (!isOtpValid) {
        toast.error("کد تأیید واردشده صحیح نیست.");
        setOtpResetKey((key) => key + 1);
        return;
      }

      setVerifiedOtp(otp);
      if (isNewUser) {
        setStage("register");
        return;
      }

      const { registerRes, registerErr } = await registerUser({ mobile: phone, otp });
      if (!registerRes) {
        toast.error(getAuthErrorMessage(registerErr, "ورود به پنل فروشندگان انجام نشد."));
        return;
      }
      await completeAuthentication(registerRes);
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "بررسی کد تأیید انجام نشد."));
      setOtpResetKey((key) => key + 1);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleResendOtp() {
    if (isBusy) return 0;
    setIsBusy(true);
    try {
      const { sendOtpRes, sendOtpErr } = await sendOtp({ mobile: phone });
      const responseData = sendOtpRes?.data;
      if (!responseData) {
        toast.error(getAuthErrorMessage(sendOtpErr, "ارسال مجدد کد انجام نشد."));
        return 0;
      }
      const duration = getOtpExpirySeconds(responseData.expires_in_seconds);
      setOtpExpiresIn(duration);
      setOtpResetKey((key) => key + 1);
      setOtpTimerResetKey((key) => key + 1);
      toast.success("کد تأیید مجدداً ارسال شد.");
      return duration;
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "ارسال مجدد کد انجام نشد."));
      return 0;
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRegister(registration) {
    if (isBusy) return;
    const submittedPhone = toEnglishNumber(registration.mobile).replace(/[^0-9]/g, "");
    if (submittedPhone !== phone) {
      toast.error("برای تغییر شماره، به مرحله تأیید برگردید و کد تازه دریافت کنید.");
      return;
    }

    const fullName =
      registration.sellerType === "legal" ? registration.managerName : registration.individualName;
    const [name = "", ...familyParts] = fullName.trim().split(/\s+/).filter(Boolean);
    const payload = {
      mobile: phone,
      otp: verifiedOtp,
      name,
      family: familyParts.join(" "),
      national_code:
        registration.sellerType === "legal"
          ? registration.managerNationalId
          : registration.nationalId,
      seller_type: registration.sellerType,
    };

    if (registration.sellerType === "legal") {
      payload.company_name = registration.companyName;
      payload.company_national_code = registration.companyNationalId;
      payload.manager_name = registration.managerName;
      payload.manager_national_code = registration.managerNationalId;
    }

    setIsBusy(true);
    try {
      const { registerRes, registerErr } = await registerUser(payload);
      if (!registerRes) {
        toast.error(getAuthErrorMessage(registerErr, "ثبت‌نام فروشنده انجام نشد."));
        return;
      }
      await completeAuthentication(registerRes);
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "ثبت‌نام فروشنده انجام نشد."));
    } finally {
      setIsBusy(false);
    }
  }

  function handleBackToCredentials() {
    if (isBusy) return;
    setStage("credentials");
  }

  return (
    <main className={styles.page} data-figma-node="240:1746" dir="rtl">
      <div aria-hidden="true" className={styles.backgroundPattern} />
      <RebrandAnnouncement />

      <section
        aria-label="ورود فروشنده"
        className={styles.card}
        data-figma-node={
          stage === "credentials"
            ? isLegalSeller
              ? "240:1757"
              : "240:1821"
            : stage === "otp"
              ? "240:2243"
              : isLegalSeller
                ? "240:2422"
                : "240:2363"
        }
        data-auth-stage={stage === "credentials" ? undefined : stage}
        data-seller-type={sellerType}
      >
        {stage === "credentials" ? (
          <form className={styles.credentialsForm} onSubmit={handleCredentialsSubmit}>
            <div className={styles.headingBlock} data-figma-node="240:1758">
              <div className={styles.logoSlot} data-figma-node="240:1759">
                <Image
                  src="/assets/figma-seller-auth/legal-seller-logo.svg"
                  alt="تگ مال"
                  width={170.18}
                  height={65.8995285}
                  unoptimized
                  className={styles.logo}
                  data-figma-node="240:1760"
                />
              </div>

              <div className={styles.titleContainer} dir="ltr">
                <FigmaAuthHeader
                  title="ورود به حساب کاربری"
                  titleClassName="w-[195px]"
                  description="جهت ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید."
                  descriptionClassName="w-[305px]"
                />
              </div>

              <SellerTypeTabs value={sellerType} onChange={setSellerType} />
            </div>

            <div
              className={styles.fields}
              data-figma-node={isLegalSeller ? "240:1793" : "240:1857"}
              data-seller-type={sellerType}
            >
              {isLegalSeller && (
                <LegalSellerField
                  label="شناسه ملی شرکت"
                  placeholder="شناسه ملی شرکت را وارد کنید"
                  icon="/assets/figma-seller-auth/company-id.svg"
                  inputMode="numeric"
                  maxLength={11}
                  value={companyNationalId}
                  onChange={(event) =>
                    setCompanyNationalId(
                      toEnglishNumber(event.target.value)
                        .replace(/[^0-9]/g, "")
                        .slice(0, 11),
                    )
                  }
                  hideIconOnMobile
                />
              )}
              <LegalSellerField
                label="شماره موبایل"
                placeholder="شماره موبایل خود را وارد کنید"
                icon="/assets/figma-seller-auth/mobile.svg"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={11}
                value={phone}
                onChange={(event) =>
                  setPhone(
                    toEnglishNumber(event.target.value)
                      .replace(/[^0-9]/g, "")
                      .slice(0, 11),
                  )
                }
                hideIconOnMobile={isLegalSeller}
              />
            </div>

            <div className={styles.submitArea}>
              <FigmaAuthPrimaryButton
                label={submitLabel}
                labelWidth="w-[169px]"
                icon="/assets/figma-seller-auth/arrow-left.svg"
                type="submit"
                disabled={isBusy}
              />
              <MobileSubmitButton label={submitLabel} disabled={isBusy} />
            </div>
          </form>
        ) : stage === "otp" ? (
          <FigmaSellerOtpStep
            initialSeconds={otpExpiresIn}
            timerResetKey={otpTimerResetKey}
            resetKey={otpResetKey}
            isBusy={isBusy}
            onBack={handleBackToCredentials}
            onResend={handleResendOtp}
            onVerify={handleVerifyOtp}
          />
        ) : (
          <FigmaSellerRegistrationStep
            key={`${sellerType}-${phone}-${companyNationalId}`}
            sellerType={sellerType}
            initialPhone={phone}
            initialCompanyNationalId={companyNationalId}
            isBusy={isBusy}
            onRegister={handleRegister}
          />
        )}
      </section>

      <footer className={styles.legalTermsDesktop}>
        <Image
          src="/assets/figma-seller-auth/legal-terms.svg"
          alt={legalTermsAlt}
          width={810}
          height={26}
          unoptimized
          className={styles.legalTermsDesktopImage}
          data-figma-node="240:1809"
        />
      </footer>

      <footer className={styles.legalTermsMobile} data-auth-stage={stage}>
        <Image
          src="/assets/figma-seller-auth/legal-terms-mobile.svg"
          alt={legalTermsAlt}
          width={358}
          height={44}
          unoptimized
          className={styles.legalTermsMobileImage}
          data-figma-node="240:1926"
        />
      </footer>
    </main>
  );
}

export default FigmaSellerLegalLoginPage;
