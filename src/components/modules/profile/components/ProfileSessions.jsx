"use client";

import { useState, useEffect } from "react";
import ResponsiveModal from "@/components/ui/responsive-modal";
import { ProfileSessionsContent, ProfileSessionsOtpContent } from "..";
import {
  getUserSessions,
  deleteMultipleSessions,
} from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";

function ProfileSessions({ isOpen, setIsOpen, phone, setIsSessionsHintOpen }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState(1);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);

  const fetchSessions = async () => {
    if (!phone) return;

    setIsLoading(true);
    const token = await getToken();
    const { getSessionsRes, getSessionsErr } = await getUserSessions(
      token,
      phone,
    );
    if (getSessionsRes) {
      const allSessions = getSessionsRes.data.flatMap(
        (item) => item.sessions || [],
      );
      setSessions(allSessions);
    } else if (getSessionsErr) {
      toast.error("خطا در دریافت نشست‌ها");
      setSessions([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen && phone) {
      fetchSessions();
    }
  }, [isOpen, phone]);

  const close = () => {
    setIsOpen(false);
    setSelectedSessions([]);
    setStep(1);
    setPendingDeleteIds([]);
    setIsDeleting(false);
  };

  const backToSessions = () => {
    setStep(1);
    setPendingDeleteIds([]);
    setIsDeleting(false);
  };

  // Only open OTP step — deletion happens after OTP is entered
  const handleOpenDeleteOtp = () => {
    if (selectedSessions.length === 0 || !phone) return;
    setPendingDeleteIds(selectedSessions);
    setStep(2);
  };

  const handleVerifyAndDelete = async ({ otp }) => {
    if (pendingDeleteIds.length === 0) return false;

    setIsDeleting(true);
    const token = await getToken();
    const { deleteSessionsRes, deleteSessionsErr } =
      await deleteMultipleSessions(token, {
        ids: pendingDeleteIds,
        otp,
      });

    if (deleteSessionsRes) {
      toast.success("نشست‌های انتخاب شده با موفقیت مسدود شد");
      setSelectedSessions([]);
      setPendingDeleteIds([]);
      setStep(1);
      await fetchSessions();
      setIsDeleting(false);
      return true;
    }

    const errorMessage =
      deleteSessionsErr?.response?.data?.message || "خطا در حذف نشست‌ها";
    toast.error(errorMessage);
    setIsDeleting(false);
    return false;
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={close}
      onBack={step === 2 ? backToSessions : undefined}
    >
      {step === 1 ? (
        <ProfileSessionsContent
          sessions={sessions}
          phone={phone}
          selectedSessions={selectedSessions}
          setSelectedSessions={setSelectedSessions}
          onDeleteSessions={handleOpenDeleteOtp}
          isLoading={isLoading}
          isDeleting={isDeleting}
          setIsSessionsHintOpen={setIsSessionsHintOpen}
        />
      ) : (
        <ProfileSessionsOtpContent
          phone={phone}
          onBack={backToSessions}
          onVerify={handleVerifyAndDelete}
        />
      )}
    </ResponsiveModal>
  );
}

export default ProfileSessions;
