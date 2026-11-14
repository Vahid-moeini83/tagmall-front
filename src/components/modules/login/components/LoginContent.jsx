"use client";

import { useState } from "react";
import { LoginEnterPhone, LoginOtp, LoginUserRegisteration } from "..";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DialogWrapper from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

function LoginContent({ isOpen, setIsOpen }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
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

  const close = () => {
    setIsOpen(false);
    setCurrentStep(1);
    setPhoneNumber("");
    setEnteredOtp("");
    setIsNewUser(null);
    setOtpExpireTime(0);
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <LoginEnterPhone
          handleNextStep={handleNextStep}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setOtpExpireTime={setOtpExpireTime}
          setIsNewUser={setIsNewUser}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <LoginOtp
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
          phoneNumber={phoneNumber}
          setEnteredOtp={setEnteredOtp}
          otpExpireTime={otpExpireTime}
          isNewUser={isNewUser}
          onSuccess={close}
        />
      );
    }

    return (
      <LoginUserRegisteration phoneNumber={phoneNumber} enteredOtp={enteredOtp} onSuccess={close} />
    );
  };

  return isDesktop ? (
    <DialogWrapper
      ariaTitle="ورود به حساب کاربری"
      onBack={currentStep == 2 ? handlePreviousStep : null}
      isOpen={isOpen}
      onClose={close}
    >
      {renderStep()}
    </DialogWrapper>
  ) : (
    <Drawer open={isOpen} onOpenChange={close}>
      <DrawerContent
        className="z-100! h-[96%]! px-[10px]"
        overlayClassName="z-100"
        aria-describedby={undefined}
      >
        <DrawerTitle className="sr-only">ورود به حساب کاربری</DrawerTitle>
        {renderStep()}
      </DrawerContent>
    </Drawer>
  );
}

export default LoginContent;
