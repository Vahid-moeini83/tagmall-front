"use client";

import { useState } from "react";
import { LoginEnterPhone, LoginOtp, LoginUserRegisteration } from "..";
import Image from "next/image";
import { DragHandler } from "@/components/ui/drag-handler";

function LoginContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpExpireTime, setOtpExpireTime] = useState(0);
  const [isNewUser, setIsNewUser] = useState(null);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden lg:block bg-gray-100 h-screen py-10 px-12 xl:px-50 select-none">
        {/* Main wrapper */}
        <div className="rounded-lg overflow-hidden h-full shadow-lg flex">
          {/* Content */}
          <div className="bg-white w-1/2 py-16 px-16">
            {currentStep === 1 && (
              <LoginEnterPhone
                handleNextStep={handleNextStep}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                setOtpExpireTime={setOtpExpireTime}
                setIsNewUser={setIsNewUser}
              />
            )}
            {currentStep === 2 && (
              <LoginOtp
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
                phoneNumber={phoneNumber}
                setEnteredOtp={setEnteredOtp}
                otpExpireTime={otpExpireTime}
                isNewUser={isNewUser}
              />
            )}
            {currentStep === 3 && (
              <LoginUserRegisteration
                phoneNumber={phoneNumber}
                enteredOtp={enteredOtp}
              />
            )}
          </div>
          {/* Background */}
          <div className="relative bg-primary w-1/2 flex items-center justify-center">
            <Image
              src="/assets/images/login-bg.jpg"
              fill
              alt="پس زمینه ورود"
              objectFit="cover"
            />
            <Image
              width={200}
              height={80}
              src="/assets/images/logo/white-logo.svg"
              alt="لوگوی تگ‌‌مال"
              className="mx-auto z-10"
            />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden h-screen select-none">
        {/* Fixed background */}
        <Image
          src="/assets/images/login-bg.jpg"
          fill
          alt="پس زمینه ورود"
          objectFit="cover"
          className="fixed inset-0"
        />
        <Image
          src="/assets/images/logo/white-logo.svg"
          width={160}
          height={80}
          alt="لوگو تگمال"
          className="z-10 absolute right-1/2 translate-x-1/2 top-20"
        />

        {/* Content */}
        <div className="fixed right-0 left-0 bottom-0 h-[70%] overflow-hidden pt-10 pb-6 px-6 bg-white rounded-t-xl">
          <div className="absolute top-1.5 right-1/2 translate-x-1/2">
            <DragHandler />
          </div>
          {currentStep === 1 && (
            <LoginEnterPhone
              handleNextStep={handleNextStep}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              setOtpExpireTime={setOtpExpireTime}
              setIsNewUser={setIsNewUser}
            />
          )}
          {currentStep === 2 && (
            <LoginOtp
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              phoneNumber={phoneNumber}
              setEnteredOtp={setEnteredOtp}
              otpExpireTime={otpExpireTime}
              isNewUser={isNewUser}
            />
          )}
          {currentStep === 3 && (
            <LoginUserRegisteration
              phoneNumber={phoneNumber}
              enteredOtp={enteredOtp}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default LoginContent;
