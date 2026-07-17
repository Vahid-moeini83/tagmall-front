"use client";

import Image from "next/image";
import { StrokeArrowLeftIcon, UserIcon } from "@/icons";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ProfileAvatarContent = ({
  user,
  isUpdating,
  onAdd,
  onChange,
  onRemove,
}) => {
  const hasImage = Boolean(user?.avatar);
  const isDrawer = !useMediaQuery("(min-width: 1024px)");

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
            className={`w-full text-center flex items-center justify-center gap-2 py-2 px-4 border-2 ${
              isDrawer ? "mt-[5px] mb-3 rounded-full" : "my-4 rounded-lg"
            } ${
              isUpdating
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-primary border-primary cursor-pointer"
            }`}
            onClick={onAdd}
            disabled={isUpdating}
          >
            افزودن تصویر به حساب کاربری
          </button>
        ) : (
          <div className="flex items-center gap-2 mt-[5px] mb-3">
            <div
              className={`flex-1 text-base text-center border-2 rounded-full py-2 px-4 ${
                isUpdating
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-primary border-primary cursor-pointer"
              }`}
              onClick={isUpdating ? undefined : onChange}
            >
              {isUpdating ? "در حال آپلود..." : "تغییر تصویر"}
            </div>

            <div
              className={`flex-1 text-center text-base ${
                isUpdating
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-error-medium cursor-pointer"
              }`}
              onClick={isUpdating ? undefined : onRemove}
            >
              حذف تصویر
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatarContent;
