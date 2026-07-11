"use client";

import { LogoutIcon, UserIcon } from "@/icons";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";

function ProfileLogoutContent({ user, isLoading, onLogout }) {
  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`relative w-[50px] h-[50px] rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center ${user?.avatar ? "bg-white" : "bg-gray-200"}`}
          >
            {user?.avatar ? (
              <Image
                src={user.avatar}
                fill
                alt="avatar"
                className="object-cover"
              />
            ) : (
              <UserIcon />
            )}
          </div>

          <h1 className="text-gray-600 text-base">
            {user?.name} {user?.family}
          </h1>
        </div>
      </div>

      {/* 8px space */}
      <div className="mt-2" />

      {/* Logout Action */}
      <div
        className={`flex items-center gap-2 border-2 border-error-medium rounded-full py-2 px-4 justify-center text-error-medium text-base my-2 ${
          isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        onClick={isLoading ? undefined : onLogout}
      >
        <LogoutIcon size={20} />
        <span>{isLoading ? "در حال خروج..." : "خروج از حساب کاربری"}</span>
      </div>
    </div>
  );
}

export default ProfileLogoutContent;
