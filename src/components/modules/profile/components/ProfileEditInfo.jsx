"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { CheckIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Skeleton,
  EmailsSkeleton,
  MobilesSkeleton,
  AddressesSkeleton,
  BankAccountsSkeleton,
} from "@/components/ui/loading";

import usePublicStore from "@/app/store/publicStore";
import {
  getUserProfile,
  updateUserProfileAvatar,
  getUserEmails,
  setDefaultEmail,
  getUserMobiles,
  setDefaultMobile,
  getUserBankAccounts,
  setDefaultBankAccount,
  submitBankAccount,
  getUserAddresses,
  setDefaultAddress,
  submitUserAddress,
} from "@/lib/server/actions/profile";
import { getToken, saveUser } from "@/lib/server/cookies";
import { CustomAccordion } from "@/components/ui/accordion";
import { getBankBySheba } from "@/lib/client/banks";
import { formatSheba } from "@/lib/client/utils";
import { IranianBank } from "iranian-bank-logo-react";
import { CustomOptions } from "@/components/ui/option";
import { HintIcon, LogoutIcon, UserIcon } from "@/icons";
import Link from "next/link";
import {
  ProfileAddress,
  ProfileAvatar,
  ProfileBankAccount,
  ProfileEmail,
  ProfileLogout,
  ProfilePhone,
  ProfileSessions,
  ProfileSessionsHint,
} from "..";
import { Checkbox } from "@/components/ui/checkbox";
import DialogWrapper from "@/components/ui/dialog";

const ProfileEditInfo = ({ setIsEditingProfile, setIsProfileOpen }) => {
  const setUserInfo = usePublicStore((state) => state.setUserInfo);

  // Basic info states
  const [fullName, setFullName] = useState();
  const [nationalCode, setNationalCode] = useState();
  const [profilePreview, setProfilePreview] = useState(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [isLoadingMobiles, setIsLoadingMobiles] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);

  // Accordion state
  const [expanded, setExpanded] = useState([
    // "contact",
    // "contact-phone",
    // "contact-email",
    // "address",
    // "bank",
  ]);
  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Option selections
  const [selectedPhoneOption, setSelectedPhoneOption] = useState(null);
  const [selectedEmailOption, setSelectedEmailOption] = useState(null);
  const [selectedAddressOption, setSelectedAddressOption] = useState(null);
  const [selectedBankOption, setSelectedBankOption] = useState(null);

  // Lists
  const [phoneList, setPhoneList] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [bankList, setBankList] = useState([]);

  // Modal or Drawers
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [activeAddressAuth, setAddressActiveAuth] = useState(false);
  const [isAddressHintOpen, setIsAddressHintOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const [selectedPhoneForSessions, setSelectedPhoneForSessions] = useState("");
  const [isSessionsHintOpen, setIsSessionsHintOpen] = useState(false);

  // Handle image upload and update to server
  const handleImageChange = async (e) => {
    if (!e.target.files.length) return;

    const file = e.target.files[0];
    const maxSize = 3 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("فرمت تصویر باید jpg، png یا webp باشد");
      return;
    }

    if (file.size > maxSize) {
      toast.error("حجم فایل باید حداکثر ۳ مگابایت باشد");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProfilePreview(imageUrl);

    // آپدیت state گلوبال
    setUserInfo((prev) => ({
      ...prev,
      avatar: imageUrl,
    }));

    await uploadAvatar(file);
  };

  // Upload avatar to server
  const uploadAvatar = async (file) => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("avatar", file);

    setIsUpdating(true);
    const { updateProfileRes } = await updateUserProfileAvatar(token, formData);

    if (updateProfileRes) {
      toast.success("تصویر پروفایل با موفقیت بروزرسانی شد");
      setUserInfo(updateProfileRes.data.user);
      await saveUser(JSON.stringify(updateProfileRes.data.user));
      setProfilePreview(updateProfileRes.data.user.avatar);
    } else {
      toast.error("خطا در بروزرسانی تصویر پروفایل");
    }

    setIsUpdating(false);
  };

  // Remove avatar from server
  const removeAvatar = async () => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("delete_avatar", "1");

    setIsUpdating(true);
    const { updateProfileRes } = await updateUserProfileAvatar(token, formData);

    if (updateProfileRes) {
      toast.success("تصویر پروفایل با موفقیت حذف شد");
      setUserInfo(updateProfileRes.data.user);
      await saveUser(JSON.stringify(updateProfileRes.data.user));
      setProfilePreview(null);
    } else {
      toast.error("خطا در حذف تصویر پروفایل");
    }

    setIsUpdating(false);
  };

  // Fetch profile data
  const getUserData = async () => {
    const token = await getToken();
    setIsLoading(true);

    const { userProfileRes } = await getUserProfile(token);

    if (userProfileRes) {
      const user = userProfileRes.data.user;
      setUserInfo(user);

      setFullName(`${user.name} ${user.family}`);
      setNationalCode(user.national_code);
      setProfilePreview(user.avatar);
    }

    setIsLoading(false);
  };

  // Fetch user emails
  const getUserEmailsList = async () => {
    const token = await getToken();
    setIsLoadingEmails(true);
    const { getEmailsRes } = await getUserEmails(token);

    if (getEmailsRes && getEmailsRes.data) {
      const emails = getEmailsRes.data.map((email) => ({
        id: email.id,
        label: email.email,
        isDefault: email.is_default,
      }));
      setEmailList(emails);

      // تنظیم ایمیل پیشفرض
      const defaultEmail = emails.find((e) => e.isDefault);
      if (defaultEmail) {
        setSelectedEmailOption(defaultEmail.id);
      }
    } else {
      setEmailList([]);
    }
    setIsLoadingEmails(false);
  };

  // Fetch user mobiles
  const getUserMobilesList = async () => {
    const token = await getToken();
    setIsLoadingMobiles(true);
    const { getMobilesRes, getMobilesErr } = await getUserMobiles(token);

    if (getMobilesRes) {
      const mobiles = getMobilesRes.data.map((mobile) => ({
        id: mobile.id,
        label: mobile.mobile,
        isDefault: mobile.is_default,
      }));
      setPhoneList(mobiles);

      // تنظیم شماره موبایل پیشفرض
      const defaultMobile = mobiles.find((m) => m.isDefault);
      if (defaultMobile) {
        setSelectedPhoneOption(defaultMobile.id);
      }
    } else if (getMobilesErr) {
      toast.error("خطا در دریافت شماره تماس");
    }
    setIsLoadingMobiles(false);
  };

  // Fetch user bank accounts
  const getUserBankAccountsList = async () => {
    const token = await getToken();
    setIsLoadingBankAccounts(true);
    const { getBankAccountsRes } = await getUserBankAccounts(token);

    if (getBankAccountsRes) {
      console.log(getBankAccountsRes);
      const bankAccounts = getBankAccountsRes.data.map((account) => ({
        id: account.id,
        label: `بانک: ${account.bank_name}`,
        sheba: account.shaba_number,
        isDefault: account.is_default,
      }));
      setBankList(bankAccounts);

      // تنظیم حساب بانکی پیشفرض
      const defaultBank = bankAccounts.find((b) => b.isDefault);
      if (defaultBank) {
        setSelectedBankOption(defaultBank.id);
      }
    } else {
      setBankList([]);
    }
    setIsLoadingBankAccounts(false);
  };

  // Fetch user addresses
  const getUserAddressesList = async () => {
    const token = await getToken();
    setIsLoadingAddresses(true);
    const { getAddressesRes, getAddressesErr } = await getUserAddresses(token);

    if (getAddressesRes) {
      const addresses = getAddressesRes.data.map((address) => ({
        id: address.id,
        label: address.address,
        isDefault: address.is_default,
        extra: address.postal_code
          ? [{ label: "کد پستی", value: address.postal_code }]
          : [],
      }));
      setAddressList(addresses);

      // تنظیم آدرس پیشفرض
      const defaultAddress = addresses.find((a) => a.isDefault);
      if (defaultAddress) {
        setSelectedAddressOption(defaultAddress.id);
      }
    } else if (getAddressesErr) {
      setAddressList([]);
    }
    setIsLoadingAddresses(false);
  };

  // Set default email
  const handleSetDefaultEmail = async (emailId) => {
    const previousSelectedEmail = selectedEmailOption;
    const token = await getToken();
    const { setDefaultEmailRes, setDefaultEmailErr } = await setDefaultEmail(
      token,
      emailId,
    );

    if (setDefaultEmailRes) {
      await getUserEmailsList();
    } else if (setDefaultEmailErr) {
      toast.error("خطا در تنظیم ایمیل پیشفرض");
      setSelectedEmailOption(previousSelectedEmail);
    }
  };

  // Set default mobile
  const handleSetDefaultMobile = async (mobileId) => {
    const previousSelectedMobile = selectedPhoneOption;
    const token = await getToken();
    const { setDefaultMobileRes, setDefaultMobileErr } = await setDefaultMobile(
      token,
      mobileId,
    );

    if (setDefaultMobileRes) {
      await getUserMobilesList();
    } else {
      toast.error("خطا در تنظیم شماره موبایل پیشفرض");
      setSelectedPhoneOption(previousSelectedMobile);
    }
  };

  // Set default address
  const handleSetDefaultAddress = async (addressId) => {
    const previousSelectedAddress = selectedAddressOption;
    const token = await getToken();
    const { setDefaultAddressRes, setDefaultAddressErr } =
      await setDefaultAddress(token, addressId);

    if (setDefaultAddressRes) {
      await getUserAddressesList();
    } else {
      toast.error("خطا در تنظیم آدرس پیشفرض");
      setSelectedAddressOption(previousSelectedAddress);
    }
  };

  // Set default bank account
  const handleSetDefaultBankAccount = async (bankId) => {
    const previousSelectedBank = selectedBankOption;
    const token = await getToken();
    const { setDefaultBankAccountRes, setDefaultBankAccountErr } =
      await setDefaultBankAccount(token, bankId);

    if (setDefaultBankAccountRes) {
      await getUserBankAccountsList();
    } else {
      toast.error("خطا در تنظیم حساب بانکی پیشفرض");
      setSelectedBankOption(previousSelectedBank);
    }
  };

  // Submit new bank account
  const handleSubmitBankAccount = async (data) => {
    const token = await getToken();
    const bodyData = {
      shaba_number: data.sheba,
    };

    const { submitBankAccountRes, submitBankAccountErr } =
      await submitBankAccount(token, bodyData);

    if (submitBankAccountRes) {
      toast.success("حساب بانکی با موفقیت اضافه شد");
      await getUserBankAccountsList();
      return true;
    } else {
      toast.error("خطا در افزودن حساب بانکی");
      return false;
    }
  };

  // Submit new address
  const handleSubmitAddress = async (data) => {
    const token = await getToken();
    const bodyData = {
      address: data.address,
      postal_code: data.postalCode || undefined,
      use_verification: activeAddressAuth,
    };

    const { submitAddressRes, submitAddressErr } = await submitUserAddress(
      token,
      bodyData,
    );

    if (submitAddressRes) {
      toast.success("آدرس با موفقیت اضافه شد");
      await getUserAddressesList();
      return true;
    } else {
      toast.error("خطا در افزودن آدرس");
      return false;
    }
  };

  useEffect(() => {
    getUserData();
    getUserEmailsList();
    getUserMobilesList();
    getUserBankAccountsList();
    getUserAddressesList();
  }, []);

  return (
    <>
      <div className="h-full overflow-y-auto scroll-hidden select-none flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between px-[10px] lg:px-[50px] lg:pt-[50px]">
          <div className="flex items-center gap-2">
            <div className="relative group">
              {isLoading ? (
                <Skeleton className="w-[50px] h-[50px] rounded-md" />
              ) : (
                <div
                  className={`relative w-[50px] h-[50px] rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center ${profilePreview ? "bg-white" : "bg-gray-200"}`}
                  onClick={() => setIsAvatarOpen(true)}
                >
                  {profilePreview ? (
                    <Image
                      src={profilePreview}
                      fill
                      alt="پروفایل"
                      className="object-cover"
                    />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
              )}
            </div>

            <h1 className="text-gray-600 text-base">
              {fullName || "اسم کاربر"}
            </h1>
          </div>

          <LogoutIcon
            onClick={() => setIsLogoutOpen(true)}
            className="text-error-medium ml-4 cursor-pointer"
            size={20}
          />
        </div>

        {/* Scrollable content */}
        <div>
          {/* Section 1: National code */}
          <div className="py-3 px-[10px] lg:px-[50px] lg:pb-[50px]">
            <div className="relative">
              <Input
                label="شناسه ملی:"
                type="number"
                id="m_nationalCode"
                value={nationalCode}
                onChange={(e) => setNationalCode(e.target.value)}
                disabled={isLoading}
                readOnly
                className="text-center text-gray-600 bg-gray-200 border-0!"
              />
              <CheckIcon
                className="text-success-medium absolute top-1/2 translate-y-1/2 left-4"
                size={16}
              />
            </div>
            <div className="flex items-start gap-4 pr-4">
              <HintIcon size={28} className="mt-2.5" />
              <p className="text-gray-600 leading-12 text-justify">
                با{" "}
                <Link href="#" className="text-primary font-bold">
                  احراز هویت
                </Link>{" "}
                نشست های فعال را مدیریت کنید و از خدمات کیف پول اعتباری بهره مند
                شوید
              </p>
            </div>
          </div>

          <div className="w-full h-[4px] bg-gray-200" />

          {/* Section 2: Contact information */}
          <div className="px-[10px] lg:px-[50px] lg:py-[50px]">
            <CustomAccordion
              id="contact"
              expandedItems={expanded}
              onToggle={toggleExpand}
              triggerClassName="lg:pt-0!"
              iconClassName="left-[18px]"
              customLabel={
                <span className="text-primary font-bold">
                  چگونه با شما در ارتباط باشیم؟
                </span>
              }
            >
              {/* Phone */}
              <CustomAccordion
                id="contact-phone"
                expandedItems={expanded}
                onToggle={toggleExpand}
                label="شماره تماس:"
                iconClassName="left-[18px]"
                labelClassName="text-gray-600!"
              >
                {isLoadingMobiles ? (
                  <MobilesSkeleton />
                ) : phoneList.length > 0 ? (
                  <CustomOptions
                    type="radio"
                    hasBorder={false}
                    value={selectedPhoneOption}
                    onChange={(value) => {
                      setSelectedPhoneOption(value);
                      handleSetDefaultMobile(value);
                    }}
                    bottomButtonText="دسترسی به شماره تماس دیگری دارید؟"
                    buttonOnClick={() => setIsPhoneOpen(true)}
                    onItemClick={(item) => {
                      setSelectedPhoneForSessions(item.label);
                      setIsSessionsOpen(true);
                    }}
                    options={phoneList}
                    centerLabel={true}
                  />
                ) : (
                  <div className="mb-4 py-4 bg-gray-200 rounded-lg">
                    <p className="text-center text-gray-600 mb-6">
                      هنوز شماره تماسی ثبت نکرده‌اید
                    </p>
                    <button
                      onClick={() => setIsPhoneOpen(true)}
                      className="w-full text-center text-primary"
                    >
                      ثبت شماره تماس
                    </button>
                  </div>
                )}
              </CustomAccordion>

              {/* Divider between phone and email when both are closed */}
              {!expanded.includes("contact-phone") && (
                <div className="w-full h-[2px] bg-gray-200" />
              )}

              {/* Email */}
              <CustomAccordion
                id="contact-email"
                expandedItems={expanded}
                onToggle={toggleExpand}
                label="پست الکترونیک:"
                iconClassName="left-[18px]"
                labelClassName="text-gray-600!"
              >
                {isLoadingEmails ? (
                  <EmailsSkeleton />
                ) : emailList.length > 0 ? (
                  <CustomOptions
                    type="radio"
                    value={selectedEmailOption}
                    onChange={(value) => {
                      setSelectedEmailOption(value);
                      handleSetDefaultEmail(value);
                    }}
                    bottomButtonText="دسترسی به پست الکترونیک دیگری دارید؟"
                    buttonOnClick={() => setIsEmailOpen(true)}
                    options={emailList}
                    centerLabel={true}
                    containerClassName="mb-[10px]"
                  />
                ) : (
                  <div className="mb-4 py-4 bg-gray-200 rounded-lg">
                    <p className="text-center text-gray-600 mb-6">
                      هنوز پست الکترونیکی ثبت نکرده‌اید
                    </p>
                    <button
                      onClick={() => setIsEmailOpen(true)}
                      className="w-full text-center text-primary"
                    >
                      {emailList.length > 0
                        ? " دسترسی به پست الکترونیک دیگری دارید؟"
                        : "ثبت پست الکترونیک"}
                    </button>
                  </div>
                )}
              </CustomAccordion>
            </CustomAccordion>
          </div>

          <div className="w-full h-[4px] bg-gray-200" />

          {/* Section 3: Addresses */}
          <div className="px-[10px] lg:px-[50px] lg:py-[50px]">
            <CustomAccordion
              id="address"
              expandedItems={expanded}
              onToggle={toggleExpand}
              triggerClassName="lg:pt-0!"
              iconClassName="left-[18px]"
              customLabel={
                <span className="text-primary font-bold">
                  سفارشات شما به کجا ارسال شود؟
                </span>
              }
            >
              <CustomAccordion
                id="order-address"
                expandedItems={expanded}
                onToggle={toggleExpand}
                label="آدرس:"
                alwaysOpen
                iconClassName="hidden"
                labelClassName="text-gray-600!"
              >
                {isLoadingAddresses ? (
                  <AddressesSkeleton />
                ) : addressList.length > 0 ? (
                  <CustomOptions
                    type="radio"
                    value={selectedAddressOption}
                    onChange={(value) => {
                      setSelectedAddressOption(value);
                      handleSetDefaultAddress(value);
                    }}
                    bottomButtonText="سفارشات به آدرس دیگری ارسال شود؟"
                    buttonOnClick={() => setIsAddressOpen(true)}
                    options={addressList}
                  />
                ) : (
                  <div className="mb-4 py-4 bg-gray-200 rounded-lg">
                    <p className="text-center text-gray-600 mb-6">
                      هنوز آدرسی ثبت نکرده‌اید
                    </p>
                    <button
                      onClick={() => setIsAddressOpen(true)}
                      className="w-full text-center text-primary"
                    >
                      ثبت آدرس
                    </button>
                  </div>
                )}
              </CustomAccordion>
              <div className="flex items-start gap-2 pr-4 pb-3 pt-4">
                <Checkbox
                  checked={activeAddressAuth}
                  onChange={() => setAddressActiveAuth(!activeAddressAuth)}
                  hasBorder={false}
                  className="bg-gray-200!"
                />
                <p className="text-justify">
                  با احراز کد پستی با اطمینان از خدمات ما بهره مند شوید
                </p>
              </div>
            </CustomAccordion>
          </div>

          <div className="w-full h-[4px] bg-gray-200" />

          {/* Section 4: Bank info */}
          <div className="px-[10px] lg:px-[50px] lg:py-[50px]">
            <CustomAccordion
              id="bank"
              expandedItems={expanded}
              onToggle={toggleExpand}
              triggerClassName="lg:pt-0!"
              iconClassName="left-[18px]"
              customLabel={
                <span className="text-primary font-bold">
                  واریز به کدام حساب بانکی شما انجام شود؟
                </span>
              }
              containerClassName="pb-0!"
            >
              <CustomAccordion
                id="contact-email"
                expandedItems={expanded}
                onToggle={toggleExpand}
                alwaysOpen
                label="شماره شبا:"
                iconClassName="hidden"
                labelClassName="text-gray-600!"
                containerClassName="pb-0!"
              >
                {isLoadingBankAccounts ? (
                  <BankAccountsSkeleton />
                ) : bankList.length > 0 ? (
                  <CustomOptions
                    type="radio"
                    value={selectedBankOption}
                    onChange={(value) => {
                      setSelectedBankOption(value);
                      handleSetDefaultBankAccount(value);
                    }}
                    bottomButtonText="واریز به حساب دیگری انجام شود؟"
                    buttonOnClick={() => setIsBankOpen(true)}
                    options={bankList}
                    containerClassName="pb-0!"
                    renderLabel={(item) => {
                      const bankInfo = getBankBySheba(item.sheba);
                      const formattedSheba = formatSheba(item.sheba);

                      return (
                        <div className="relative w-full flex justify-center">
                          <span className="pl-10">{formattedSheba}</span>
                          {bankInfo?.icon && (
                            <div className="absolute -left-1 top-1/2 -translate-y-1/2">
                              <IranianBank name={bankInfo.icon} size={24} />
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                ) : (
                  <div className="mb-4 py-4 bg-gray-200 rounded-lg">
                    <p className="text-center text-gray-600 mb-6">
                      هنوز حساب بانکی ثبت نکرده‌اید
                    </p>
                    <button
                      onClick={() => setIsBankOpen(true)}
                      className="w-full text-center text-primary"
                    >
                      ثبت حساب بانکی
                    </button>
                  </div>
                )}
              </CustomAccordion>
            </CustomAccordion>
          </div>
        </div>
      </div>

      {/* Profile avatar */}
      <ProfileAvatar
        isOpen={isAvatarOpen}
        setIsOpen={setIsAvatarOpen}
        isUpdating={isUpdating}
        user={{
          name: fullName?.split(" ")[0],
          family: fullName?.split(" ")[1],
          avatar: profilePreview,
        }}
        onUpdateAvatar={(e) => handleImageChange(e)}
        onRemoveAvatar={removeAvatar}
      />

      {/* Profile logout */}
      <ProfileLogout
        isOpen={isLogoutOpen}
        setIsOpen={setIsLogoutOpen}
        user={{
          name: fullName?.split(" ")[0],
          family: fullName?.split(" ")[1],
          avatar: profilePreview,
        }}
        onLogout={() => {
          setIsEditingProfile(false);
          setIsProfileOpen(false);
        }}
      />

      {/* Profile phone */}
      <ProfilePhone
        isOpen={isPhoneOpen}
        setIsOpen={setIsPhoneOpen}
        onVerifyOtp={() => {
          // بروزرسانی لیست شماره موبایل‌ها از سرور
          getUserMobilesList();
          setIsPhoneOpen(false);
        }}
      />

      {/* Profile email */}
      <ProfileEmail
        isOpen={isEmailOpen}
        setIsOpen={setIsEmailOpen}
        onVerifyOtp={() => {
          // بروزرسانی لیست ایمیل‌ها از سرور
          getUserEmailsList();
          setIsEmailOpen(false);
        }}
      />

      {/* Profile address */}
      <ProfileAddress
        isOpen={isAddressOpen}
        setIsOpen={setIsAddressOpen}
        activeAddressAuth={activeAddressAuth}
        onSubmit={handleSubmitAddress}
      />

      {/* Address hint box */}
      <DialogWrapper
        isOpen={isAddressHintOpen}
        onClose={() => setIsAddressHintOpen(false)}
      >
        <p className="text-center">احراز کد پستی توسط اداره پست انجام می‌شود</p>
      </DialogWrapper>

      {/* Profile bank account */}
      <ProfileBankAccount
        isOpen={isBankOpen}
        setIsOpen={setIsBankOpen}
        onSubmit={handleSubmitBankAccount}
      />

      {/* Profile sessions */}
      <ProfileSessions
        isOpen={isSessionsOpen}
        setIsOpen={setIsSessionsOpen}
        phone={selectedPhoneForSessions}
        setIsSessionsHintOpen={setIsSessionsHintOpen}
      />

      {/* Sessions hint modal */}
      <ProfileSessionsHint
        isOpen={isSessionsHintOpen}
        setIsOpen={setIsSessionsHintOpen}
      />
    </>
  );
};

export default ProfileEditInfo;
