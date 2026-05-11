"use client";

import { useState } from "react";
import ResponsiveModal from "@/components/ui/responsive-modal";
import ProfileLogoutContent from "./ProfileLogoutContent";
import { logoutUser } from "@/lib/server/actions/profile";
import { getToken, deleteTokenUserCookie } from "@/lib/server/cookies";
import usePublicStore from "@/app/store/publicStore";
import toast from "react-hot-toast";

function ProfileLogout({ isOpen, setIsOpen, user, onLogout }) {
  const [isLoading, setIsLoading] = useState(false);
  const clearUserInfo = usePublicStore((state) => state.clearUserInfo);
  const clearToken = usePublicStore((state) => state.clearToken);

  const close = () => setIsOpen(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const token = await getToken();
    const { logoutRes, logoutErr } = await logoutUser(token);
    if (logoutRes) {
      await deleteTokenUserCookie();
      clearUserInfo();
      clearToken();
      toast.success("با موفقیت خارج شدید");
      close();
      onLogout();
    } else if (logoutErr) {
      toast.error("خطا در خروج از حساب کاربری");
    }
    setIsLoading(false);
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={close}>
      <ProfileLogoutContent
        user={user}
        isLoading={isLoading}
        onLogout={handleLogout}
      />
    </ResponsiveModal>
  );
}

export default ProfileLogout;
