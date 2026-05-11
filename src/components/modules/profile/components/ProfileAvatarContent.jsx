"use client";

import Image from "next/image";
import { StrokeArrowLeftIcon, UserIcon } from "@/icons";

const ProfileAvatarContent = ({
  user,
  isUpdating,
  onAdd,
  onChange,
  onRemove,
}) => {
  const hasImage = Boolean(user?.avatar);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`relative w-[50px] h-[50px] rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center ${hasImage ? "bg-white" : "bg-gray-200"}`}
          >
            {hasImage ? (
              <Image
                src={user.avatar}
                fill
                alt="avatar"
                className="object-cover"
              />
            ) : (
              <UserIcon size={20} />
            )}
          </div>

          <h1 className="text-gray-600 text-base">
            {user?.name} {user?.family}
          </h1>
        </div>
      </div>

      <div className="overflow-hidden">
        {!hasImage ? (
          <button
            className={`w-full text-center py-4 flex items-center justify-center gap-2 transition-all ${
              isUpdating
                ? "text-gray-400 cursor-not-allowed"
                : "text-primary cursor-pointer"
            }`}
            onClick={onAdd}
            disabled={isUpdating}
          >
            افزودن تصویر به حساب کاربری
          </button>
        ) : (
          <>
            <div
              className={`text-base py-4 text-center ${
                isUpdating
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary cursor-pointer"
              }`}
              onClick={isUpdating ? undefined : onChange}
            >
              {isUpdating ? "در حال آپلود..." : "تغییر تصویر حساب کاربری"}
            </div>

            <div className="w-full h-[2px] bg-gray-200 mr-13" />

            <div
              className={`text-center text-base py-4 ${
                isUpdating
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-error-medium cursor-pointer"
              }`}
              onClick={isUpdating ? undefined : onRemove}
            >
              حذف تصویر حساب کاربری
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatarContent;
