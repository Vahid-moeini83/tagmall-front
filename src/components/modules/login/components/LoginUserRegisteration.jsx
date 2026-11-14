"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { isValidIranianNationalCode } from "@/lib/client/validations";
import { toEnglishNumber } from "@/lib/client/utils";
import { getAuthErrorMessage, persistAuthSession } from "@/lib/client/auth";
import { registerUser } from "@/lib/server/actions/auth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import usePublicStore from "@/app/store/publicStore";
import Image from "next/image";
import ResponsiveModal from "@/components/ui/responsive-modal";

function LoginUserRegisteration({ phoneNumber, enteredOtp, onSuccess }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    mobile: "",
    otp: "",
  });
  const requestInFlight = useRef(false);
  const setUserInfo = usePublicStore((state) => state.setUserInfo);
  const setAccessToken = usePublicStore((state) => state.setAccessToken);

  const isFormValid =
    Boolean(firstName.trim()) &&
    Boolean(lastName.trim()) &&
    isValidIranianNationalCode(nationalCode) &&
    acceptedTerms;

  const openTerms = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTermsOpen(true);
  };

  const closeTerms = () => {
    setIsTermsOpen(false);
  };

  const handleConfirm = async (event) => {
    event?.preventDefault();
    if (requestInFlight.current) return;

    const newErrors = {
      firstName: "",
      lastName: "",
      nationalCode: "",
      mobile: "",
      otp: "",
    };

    let hasError = false;

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();

    if (!normalizedFirstName) {
      newErrors.firstName = "لطفا نام را وارد نمایید";
      hasError = true;
    }

    if (!normalizedLastName) {
      newErrors.lastName = "لطفا نام خانوادگی را وارد نمایید";
      hasError = true;
    }

    if (!isValidIranianNationalCode(nationalCode)) {
      newErrors.nationalCode = "کد ملی وارد شده نامعتبر است";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      mobile: phoneNumber,
      otp: enteredOtp,
      name: normalizedFirstName,
      family: normalizedLastName,
      national_code: toEnglishNumber(nationalCode).replace(/[^0-9]/g, ""),
    };

    requestInFlight.current = true;
    setIsConfirming(true);

    try {
      const { registerRes, registerErr } = await registerUser(payload);

      if (registerRes?.data) {
        await persistAuthSession({
          authData: registerRes.data,
          setAccessToken,
          setUserInfo,
        });
        toast.success("ورود با موفقیت انجام شد");
        onSuccess?.();
        router.push("/");
        return;
      }

      const apiErrors = registerErr?.response?.data?.errors;
      if (apiErrors && Object.keys(apiErrors).length > 0) {
        const fieldMap = {
          name: "firstName",
          family: "lastName",
          national_code: "nationalCode",
          mobile: "mobile",
          otp: "otp",
        };
        const mappedErrors = { ...newErrors };
        let firstApiMessage;

        Object.entries(apiErrors).forEach(([key, value]) => {
          const stateKey = fieldMap[key];
          const message = Array.isArray(value) ? value[0] : value;
          if (typeof message === "string" && !firstApiMessage) firstApiMessage = message;
          if (stateKey && typeof message === "string") {
            mappedErrors[stateKey] = message;
          }
        });

        setErrors(mappedErrors);
        if (firstApiMessage) toast.error(firstApiMessage);
      } else {
        toast.error(getAuthErrorMessage(registerErr, "ثبت‌نام انجام نشد. دوباره تلاش کنید."));
      }
    } catch (requestError) {
      toast.error(getAuthErrorMessage(requestError, "ثبت‌نام انجام نشد. دوباره تلاش کنید."));
    } finally {
      requestInFlight.current = false;
      setIsConfirming(false);
    }
  };

  return (
    <form
      className="h-full flex flex-col justify-between overflow-y-auto scroll-hidden mt-6 lg:mt-0"
      onSubmit={handleConfirm}
    >
      <div>
        {/* Slogan logo */}
        <div className="relative w-[150px] h-[50px] lg:w-[330px] lg:h-[100px] mx-auto flex items-center justify-center">
          <Image src="/assets/images/logo/slogan-logo.svg" fill alt="لوگوی شعار" />
        </div>
        {/* Title */}
        <h1 className="font-bold text-primary text-base mt-9 lg:mt-12">ایجاد حساب کاربری:</h1>
        {/* Main content */}
        <div className="bg-gray-200 rounded-lg overflow-hidden mt-4">
          <div>
            <Input
              type="text"
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isConfirming}
              placeholder="نام"
              className={`text-center border-0! h-[50px] ${errors.firstName ? "" : "border-b-2!"} border-white rounded-none placeholder:text-gray-400`}
            />
            {errors.firstName && (
              <div className="px-4 py-2 border-b-2 border-white">
                <p className="text-xs text-center text-error-medium">{errors.firstName}</p>
              </div>
            )}
          </div>
          <div>
            <Input
              type="text"
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isConfirming}
              placeholder="نام خانوادگی"
              className={`text-center border-0! h-[50px] ${errors.lastName ? "" : "border-b-2!"} border-white rounded-none placeholder:text-gray-400`}
            />
            {errors.lastName && (
              <div className="px-4 py-2 border-b-2 border-white">
                <p className="text-xs text-center text-error-medium">{errors.lastName}</p>
              </div>
            )}
          </div>
          <div>
            <Input
              id="nationalCode"
              numeric
              maxLength={10}
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              disabled={isConfirming}
              placeholder="کد ملی"
              className="text-center border-0! h-[50px] placeholder:text-gray-400"
            />
            {errors.nationalCode && (
              <div className="px-4 py-2">
                <p className="text-xs text-center text-error-medium">{errors.nationalCode}</p>
              </div>
            )}
          </div>
        </div>
        {/* Checkbox */}
        <div className="mt-4 mr-4">
          <Checkbox
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
            className="bg-gray-200! border-0!"
            label={
              <>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={openTerms}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openTerms(e);
                  }}
                  className="text-primary cursor-pointer"
                >
                  شرایط
                </span>{" "}
                بهره مندی از خدمات تگ مال را می پذیرم
              </>
            }
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isConfirming || !isFormValid}
        className={`font-bold font-iransans w-full mt-6 mb-2 border-2 py-2 rounded-full ${
          isConfirming || !isFormValid
            ? "text-gray-400 border-gray-400 cursor-not-allowed"
            : "text-primary border-primary cursor-pointer"
        }`}
      >
        بهره مندی از خدمات ما :)
      </button>

      <ResponsiveModal
        isOpen={isTermsOpen}
        onClose={closeTerms}
        title="شرایط و قوانین تگ مال"
        nested
        isHintBox
      >
        <div className="text-sm text-gray-600 leading-8 text-justify space-y-3">
          <p>
            استفاده از خدمات تگ مال به معنای پذیرش شرایط و قوانین زیر است. این متن فعلاً برای تست
            نمایش داده می‌شود و نسخه نهایی قوانین به‌زودی جایگزین آن خواهد شد.
          </p>
          <p>
            کاربران موظف‌اند اطلاعات صحیح وارد کنند و از هرگونه سوءاستفاده از سرویس خودداری نمایند.
            تگ مال حق به‌روزرسانی این شرایط را برای خود محفوظ می‌دارد.
          </p>
          <p>
            در صورت نیاز به پشتیبانی، می‌توانید از بخش پشتیبانی داخل اپلیکیشن با ما در ارتباط باشید.
          </p>
        </div>
      </ResponsiveModal>
    </form>
  );
}

export default LoginUserRegisteration;
