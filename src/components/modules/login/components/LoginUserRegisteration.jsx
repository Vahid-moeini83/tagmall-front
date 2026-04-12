"use client";

import { Input } from "@/components/ui/input";
import { isValidIranianNationalCode } from "@/lib/client/validations";
import { checkAuthValidation, registerUser } from "@/lib/server/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import http from "@/app/api/axiosInstance";
import { saveTokenUser } from "@/lib/server/cookies";
import usePublicStore from "@/app/store/publicStore";

function LoginUserRegisteration({ phoneNumber, enteredOtp }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    mobile: "",
    otp: "",
  });
  const setUserInfo = usePublicStore((state) => state.setUserInfo);
  const setAccessToken = usePublicStore((state) => state.setAccessToken);

  const handleConfirm = async () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      nationalCode: "",
      mobile: "",
      otp: "",
    };

    let hasError = false;

    if (!firstName) {
      newErrors.firstName = "لطفا نام را وارد نمایید";
      hasError = true;
    }

    if (!lastName) {
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
      name: firstName,
      family: lastName,
      national_code: nationalCode,
    };

    setIsConfirming(true);

    const { registerRes, registerErr } = await registerUser(payload);

    if (registerRes) {
      console.log(registerRes);
      toast.success("ورود با موفقیت انجام شد");
      router.push("/");
      setAccessToken(registerRes?.data?.token);
      setUserInfo(registerRes?.data?.user);
      await saveTokenUser(
        registerRes?.data?.token,
        JSON.stringify(registerRes?.data?.user),
      );
    } else if (registerErr) {
      const apiErrors = registerErr?.response?.data?.errors;

      if (apiErrors) {
        const fieldMap = {
          name: "firstName",
          family: "lastName",
          national_code: "nationalCode",
          mobile: "mobile",
          otp: "otp",
        };
        const mappedErrors = { ...newErrors };

        Object.keys(apiErrors).forEach((key) => {
          const stateKey = fieldMap[key];
          if (stateKey) {
            mappedErrors[stateKey] = apiErrors[key][0];
          }
        });

        setErrors(mappedErrors);

        if (apiErrors.mobile) {
          toast.error(apiErrors.mobile[0]);
        }

        if (apiErrors.otp) {
          toast.error(apiErrors.otp[0]);
        }
      } else {
        toast.error("خطا در برقراری ارتباط");
      }
    }

    setIsConfirming(false);
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto scroll-hidden">
      <div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">تکمیل ثبت‌نام</h1>
          <span className="text-gray-600 text-base">
            لطفا اطلاعات زیر را وارد نمایید.
          </span>
        </div>
        <div className="mt-10 space-y-8">
          <Input
            label={"نام"}
            type="text"
            id="firstname"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (errors.firstName) setErrors({ ...errors, firstName: "" });
            }}
            disabled={isConfirming}
            error={errors.firstName}
          />
          <Input
            label={"نام خانوادگی"}
            type="text"
            id="lastname"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (errors.lastName) setErrors({ ...errors, lastName: "" });
            }}
            disabled={isConfirming}
            error={errors.lastName}
          />
          <Input
            label={"کد ملی"}
            id="nationalCode"
            numeric
            maxLength={10}
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            disabled={isConfirming}
            error={errors.nationalCode}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-10">
        <span className="text-sm text-gray-600">
          ثبت نام به منزله پذیرش{" "}
          <span className="text-primary underline underline-offset-4 cursor-pointer">
            قوانین و مقررات Tagmall
          </span>{" "}
          است.
        </span>
        <button
          disabled={isConfirming}
          onClick={handleConfirm}
          className="bg-primary text-white rounded-md w-full h-12 flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:gap-3 cursor-pointer"
        >
          تکمیل ثبت‌نام
        </button>
      </div>
    </div>
  );
}
export default LoginUserRegisteration;
