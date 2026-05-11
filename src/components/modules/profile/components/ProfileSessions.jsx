"use client";

import { useState, useEffect } from "react";
import ResponsiveModal from "@/components/ui/responsive-modal";
import { ProfileSessionsContent } from "..";
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

  const fetchSessions = async () => {
    if (!phone) return;

    setIsLoading(true);
    const token = await getToken();
    const { getSessionsRes, getSessionsErr } = await getUserSessions(
      token,
      phone,
    );
    if (getSessionsRes) {
      // استخراج sessions از ساختار تو در تو
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
  };

  const handleDeleteSessions = async () => {
    if (selectedSessions.length === 0) return;

    setIsDeleting(true);
    const token = await getToken();
    const { deleteSessionsRes, deleteSessionsErr } =
      await deleteMultipleSessions(token, {
        ids: selectedSessions,
      });

    if (deleteSessionsRes) {
      setSelectedSessions([]);
      await fetchSessions();
    } else {
      const errorMessage =
        deleteSessionsErr?.response?.data?.message || "خطا در حذف نشست‌ها";
      toast.error(errorMessage);
    }
    setIsDeleting(false);
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={close}>
      <ProfileSessionsContent
        sessions={sessions}
        phone={phone}
        selectedSessions={selectedSessions}
        setSelectedSessions={setSelectedSessions}
        onDeleteSessions={handleDeleteSessions}
        isLoading={isLoading}
        isDeleting={isDeleting}
        setIsSessionsHintOpen={setIsSessionsHintOpen}
      />
    </ResponsiveModal>
  );
}

export default ProfileSessions;
