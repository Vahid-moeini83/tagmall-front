"use client";
import DialogWrapper from "@/components/ui/dialog";
import { DragHandler } from "@/components/ui/drag-handler";
import { Input } from "@/components/ui/input";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import { Radio } from "@/components/ui/radio";
import { PlusIcon, StrokeArrowLeftIcon } from "@/icons";
import {
  getUserProfile,
  updateUserProfile,
} from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import { Check, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/loading";
import usePublicStore from "@/app/store/publicStore";
import { ProfileUserAddresses, ProfileUserSessions } from "..";

const ProfileEditInfo = ({ setIsEditingProfile }) => {
  const setUserInfo = usePublicStore((state) => state.setUserInfo);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  // Dialog State for Edit Session
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Image Handler
  const handleImageChange = (e) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    const maxSize = 3 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("فرمت تصویر باید jpg، png یا webp باشد");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      toast.error("حجم فایل باید حداکثر 3 مگابایت باشد");
      e.target.value = "";
      return;
    }

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const token = await getToken();

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("mobile", phoneNumber);
    formData.append("national_code", nationalCode);

    if (profileImage instanceof File) {
      formData.append("avatar", profileImage);
    }

    setIsUpdating(true);
    const { updateProfileRes, updateProfileErr } = await updateUserProfile(
      token,
      formData,
    );
    if (updateProfileRes) {
      toast.success("پروفایل با موفقیت بروزرسانی شد");
    } else if (updateProfileErr) {
      toast.error("خطا در بروزرسانی پروفایل");
    }
    setIsUpdating(false);
    setIsEditingProfile(false);
  };

  // Get user base fields
  const getUserData = async () => {
    const token = await getToken();

    setIsLoading(true);
    const { userProfileRes, userProfileErr } = await getUserProfile(token);
    if (userProfileRes) {
      console.log(userProfileRes);
      const user = userProfileRes?.data?.user;
      setUserInfo(user);
      setFullName(`${user?.name} ${user?.family}`);
      setNationalCode(user?.national_code);
      setPhoneNumber(user?.mobile);
      setProfileImage(null); // چون File نیست
      setProfilePreview(user?.avatar); // نمایش از URL
    } else if (userProfileErr) {
      console.log(userProfileErr);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="h-full select-none flex flex-col">
      <div className="absolute top-2 right-1/2 translate-x-1/2 z-50">
        <DragHandler
          hasCloseEvent={true}
          onClose={() => setIsEditingProfile(false)}
        />
      </div>
      {/* Scrollable Content Area */}
      <div className="flex-1 h-full overflow-y-auto bg-white px-6 pb-6 pt-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              ویرایش مشخصات
            </h1>
            <span className="text-base text-gray-500 font-medium">
              مشخصات خود را مدیریت کنید
            </span>
          </div>
          <div className="relative group">
            {isLoading ? (
              <Skeleton className="w-16 h-16 rounded-md" />
            ) : (
              <>
                <label
                  htmlFor="modalProfileImage"
                  className="relative w-16 h-16 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer bg-white shadow-sm"
                >
                  {profilePreview ? (
                    <Image
                      src={profilePreview}
                      fill
                      alt="پروفایل"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs text-center text-gray-400 px-1">
                      انتخاب عکس
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  id="modalProfileImage"
                  name="modalProfileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Inputs Section */}
        <div className="space-y-6 mb-8">
          <Input
            label={"نام و نام خانوادگی"}
            type="text"
            id="m_fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
          <Input
            label={"تلفن همراه"}
            type="number"
            id="m_phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
          />
          <Input
            label={"کد ملی"}
            type="number"
            id="m_nationalCode"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Address Section */}
        <ProfileUserAddresses />

        {/* Active Sessions Section */}
        <ProfileUserSessions />

        {/* Save button */}
        <button
          onClick={handleProfileSubmit}
          className="bg-primary text-white rounded-md w-full h-12 mt-12 flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:gap-3 cursor-pointer font-medium"
        >
          {isUpdating ? <SpinnerLoading /> : "ذخیره تغییرات"}
        </button>
      </div>

      {/* Edit Session Dialog */}
      <DialogWrapper
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="تغییر شماره"
      >
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 leading-7 text-sm lg:text-base">
            برای تغییر شماره همراه ابتدا باید در سامانه هدی کد ملی و شماره تلفن
            خود را تطبیق دهید
          </p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="flex-1 h-10 lg:h-12 rounded-md text-primary border-2 border-primary cursor-pointer"
            >
              انصراف
            </button>
            <button
              onClick={() => {
                window.location.href = "https://aut.ncr.ir/";
              }}
              className="flex-1 h-10 lg:h-12 rounded-md text-white bg-primary cursor-pointer"
            >
              ادامه
            </button>
          </div>
        </div>
      </DialogWrapper>
    </div>
  );
};

export default ProfileEditInfo;
