"use client";

import Image from "next/image";
import { StrokeArrowLeftIcon, UserIcon } from "@/icons";

function ProfileAvatarSourceContent({
  user,
  isUpdating,
  onBack,
  onCamera,
  onGallery,
  onRemove,
}) {
  const hasImage = Boolean(user?.avatar);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`relative w-[50px] h-[50px] rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center ${hasImage ? "bg-white" : "bg-gray-200"}`}
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

        <StrokeArrowLeftIcon
          size={20}
          onClick={isUpdating ? undefined : onBack}
          className={`translate-x-4 ${isUpdating ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        />
      </div>

      <div className="my-2 space-y-[10px]">
        <div
          className={`text-center text-gray-600 text-base border-2 border-gray-400 rounded-full py-2 px-4 ${
            isUpdating ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={isUpdating ? null : onCamera}
        >
          تصویر گرفتن با دوربین گوشی موبایل
        </div>

        <div
          className={`text-center text-gray-600 text-base border-2 border-gray-400 rounded-full py-2 px-4 ${
            isUpdating ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={isUpdating ? null : onGallery}
        >
          انتخاب تصویر از گالری
        </div>
      </div>
    </div>
  );
}

export default ProfileAvatarSourceContent;
