"use client";

import { useState } from "react";
import DialogWrapper from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProfileWalletTypeContent from "./ProfileWalletTypeContent";
import ProfileWalletAmountContent from "./ProfileWalletAmountContent";
import { ProfilePhoneOtpContent } from "..";
import { chargeWalletAmount } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";

function ProfileWallet({ isOpen, setIsOpen, walletBalance = 0 }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [step, setStep] = useState(1); // 1: type selection, 2: amount, 3: otp (for withdraw)
  const [selectedType, setSelectedType] = useState(null); // "increase" | "withdraw"
  const [isLoading, setIsLoading] = useState(false);

  const close = () => {
    setStep(1);
    setSelectedType(null);
    setIsOpen(false);
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
    }

    if (step === 3) {
      setStep(2);
    }
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleAmountSubmit = async (amount) => {
    if (selectedType === "increase") {
      // افزایش اعتبار - اتصال به API
      const payload = { amount };
      const token = await getToken();

      setIsLoading(true);
      const { chargeWalletRes, chargeWalletErr } = await chargeWalletAmount(
        token,
        payload,
      );
      if (chargeWalletRes) {
        window.open(
          chargeWalletRes?.data?.payment_url,
          "_blank",
          "noopener,noreferrer",
        );
        close();
      } else if (chargeWalletErr) {
        toast.error("خطا در شارژ کیف پول");
      }
      setIsLoading(false);
    } else if (selectedType === "withdraw") {
      // درخواست وجه - رفتن به مرحله OTP
      setStep(3);
    }
  };

  const handleOtpVerify = ({ phone, otp }) => {
    toast.success("درخواست وجه با موفقیت ثبت شد");
    close();
  };

  const renderContent = () => {
    if (step === 1) {
      return <ProfileWalletTypeContent onSelectType={handleSelectType} />;
    }

    if (step === 2) {
      return (
        <ProfileWalletAmountContent
          type={selectedType}
          walletBalance={walletBalance}
          onBack={handlePreviousStep}
          onNext={handleAmountSubmit}
        />
      );
    }

    if (step === 3 && selectedType === "withdraw") {
      return (
        <ProfilePhoneOtpContent
          phone="09158427785"
          onBack={handlePreviousStep}
          otpExpire={120}
          onVerify={handleOtpVerify}
        />
      );
    }
  };

  return isDesktop ? (
    <DialogWrapper
      isOpen={isOpen}
      onClose={close}
      onBack={step === 2 || step === 3 ? handlePreviousStep : null}
    >
      {renderContent()}
    </DialogWrapper>
  ) : (
    <Drawer open={isOpen} onOpenChange={close}>
      <DrawerContent
        className="z-100! px-[10px]"
        overlayClassName="z-100 lg:hidden"
      >
        {renderContent()}
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileWallet;
