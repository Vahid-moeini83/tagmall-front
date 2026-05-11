"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DialogWrapper from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ProfileEmailContent, ProfileEmailOtpContent } from "..";

function ProfileEmail({ isOpen, setIsOpen, onSubmitEmail, onVerifyOtp }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otpExpire, setOtpExpire] = useState(120);

  const [receivedOtp, setReceivedOtp] = useState("");

  const close = () => {
    setIsOpen(false);
    setStep(1);
    setEmail("");
    setReceivedOtp("");
  };

  const backStep = () => {
    setStep(1);
  };

  const renderStep = () => {
    if (step === 1)
      return (
        <ProfileEmailContent
          email={email}
          setEmail={setEmail}
          setReceivedOtp={setReceivedOtp}
          onNext={(resendSeconds) => {
            setOtpExpire(resendSeconds);
            setStep(2);
          }}
        />
      );

    return (
      <ProfileEmailOtpContent
        email={email}
        receivedOtp={receivedOtp}
        onBack={backStep}
        otpExpire={otpExpire}
        onVerify={onVerifyOtp}
        onClose={close}
      />
    );
  };

  return isDesktop ? (
    <DialogWrapper
      onBack={step === 2 && backStep}
      isOpen={isOpen}
      onClose={close}
    >
      {renderStep()}
    </DialogWrapper>
  ) : (
    <Drawer open={isOpen} onOpenChange={close}>
      <DrawerContent className="z-100! px-[10px]" overlayClassName="z-100">
        {renderStep()}
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileEmail;
