"use client";
import { DragHandler } from "@/components/ui/drag-handler";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { PlusIcon, StrokeArrowLeftIcon } from "@/icons";
import { Check, Edit, Trash2, MapPin, User, Camera } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ProfileEditInfo = ({ setIsEditingProfile }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      text: "تهران، خیابان ولیعصر، کوچه سوم، پلاک ۱۲۳",
      postalCode: "۱۲۳۴۵۶۷۸۹۰",
    },
    {
      text: "اصفهان، خیابان چهارباغ، نبش خیابان شعا، پلاک ۴۵",
      postalCode: "۰۹۸۷۶۵۴۳۲۱",
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null);
  const [showAddAddressInput, setShowAddAddressInput] = useState(false);
  const [newAddressText, setNewAddressText] = useState("");
  const [newAddressPostalCode, setNewAddressPostalCode] = useState("");
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleOpenAddNewAddress = () => {
    setShowAddAddressInput(true);
    setEditingAddressIndex(null);
    setNewAddressText("");
    setNewAddressPostalCode("");
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const addressValue = newAddressText.trim();
    const postalCodeValue = newAddressPostalCode.trim();

    if (!addressValue) return;

    if (editingAddressIndex !== null) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editingAddressIndex] = {
        text: addressValue,
        postalCode: postalCodeValue,
      };
      setAddresses(updatedAddresses);
      setEditingAddressIndex(null);
    } else {
      const newAddressObj = {
        text: addressValue,
        postalCode: postalCodeValue,
      };
      setAddresses([newAddressObj, ...addresses]);
      setShowAddAddressInput(false);
    }
    setNewAddressText("");
    setNewAddressPostalCode("");
  };

  const handleDeleteAddress = (indexToDelete) => {
    const updatedAddresses = addresses.filter(
      (_, index) => index !== indexToDelete,
    );
    setAddresses(updatedAddresses);
    if (
      selectedAddress &&
      selectedAddress.text === addresses[indexToDelete].text
    ) {
      setSelectedAddress(updatedAddresses[0] || null);
    }
  };

  const handleEditClick = (index, addressObj) => {
    setEditingAddressIndex(index);
    setNewAddressText(addressObj.text);
    setNewAddressPostalCode(addressObj.postalCode);
    setShowAddAddressInput(false);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
  };

  return (
    <div className="h-full select-none flex flex-col bg-gray-50/50">
      {/* Drag handle */}
      <div className="absolute top-2 right-1/2 translate-x-1/2 z-50">
        <DragHandler
          hasCloseEvent={true}
          onClose={() => setIsEditingProfile(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto px-6 pb-24 pt-10 flex flex-col">
        {/* --- Header Redesign --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 mb-8">
          <div className="relative group">
            <label
              htmlFor="modalProfileImage"
              className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 group-hover:border-primary transition-colors bg-gray-50"
            >
              {profileImage ? (
                <Image
                  src={URL.createObjectURL(profileImage)}
                  fill
                  alt="پروفایل"
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Camera size={20} />
                  <span className="text-[10px] mt-1">تصویر</span>
                </div>
              )}
            </label>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <Camera className="text-white" size={18} />
            </div>
            <input
              type="file"
              id="modalProfileImage"
              name="modalProfileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              ویرایش مشخصات
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              لطفا اطلاعات هویتی و آدرس‌های خود را به‌روزرسانی نمایید.
            </p>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="space-y-6">
          <Input
            label={"نام و نام خانوادگی"}
            type="text"
            id="m_fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label={"تلفن همراه"}
            type="number"
            id="m_phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Input
            label={"کد ملی"}
            type="number"
            id="m_nationalCode"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
          />
        </div>

        {/* Address Section Redesign */}
        <div className="mt-10 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <label className="text-lg font-bold text-gray-800">آدرس‌ها</label>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAddNewAddress()}
              className="flex items-center gap-2 text-primary text-sm font-medium"
            >
              <PlusIcon size={16} />
              افزودن آدرس جدید
            </button>
          </div>

          {/* Add Address Input Area */}
          {showAddAddressInput && (
            <div className="border-2 border-primary rounded-md p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Input
                type="text"
                placeholder="آدرس دقیق خود را وارد کنید..."
                value={newAddressText}
                onChange={(e) => setNewAddressText(e.target.value)}
                containerClassName="w-full"
              />
              <Input
                type="number"
                placeholder="کد پستی ۱۰ رقمی..."
                value={newAddressPostalCode}
                onChange={(e) => setNewAddressPostalCode(e.target.value)}
                containerClassName="w-full"
              />
              <div className="flex items-center justify-end gap-2 mt-1">
                <button
                  onClick={() => setShowAddAddressInput(false)}
                  className="text-gray-600 px-4 py-2 rounded-lg text-sm cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSaveAddress}
                  className="bg-primary text-white px-6 py-2 rounded-md text-sm shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer"
                >
                  ثبت آدرس
                </button>
              </div>
            </div>
          )}

          {/* Address List */}
          <div className="flex flex-col gap-3">
            {addresses.map((addressObj, index) => (
              <div
                key={index}
                className={`relative group rounded-md border-2 transition-all duration-200 overflow-hidden ${
                  selectedAddress && selectedAddress.text === addressObj.text
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                {editingAddressIndex === index ? (
                  // Edit Mode
                  <div className="p-4 flex flex-col gap-3 bg-white">
                    <div className="flex items-center gap-2 text-primary text-sm font-bold mb-1">
                      <Edit size={14} />
                      <span>ویرایش آدرس</span>
                    </div>
                    <Input
                      type="text"
                      placeholder="آدرس..."
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                      autoFocus
                      containerClassName="w-full"
                    />
                    <Input
                      type="text"
                      placeholder="کد پستی..."
                      value={newAddressPostalCode}
                      onChange={(e) => setNewAddressPostalCode(e.target.value)}
                      containerClassName="w-full"
                    />
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <button
                        onClick={() => setEditingAddressIndex(null)}
                        className="text-gray-500 px-4 py-2 rounded-md text-sm cursor-pointer"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        className="bg-primary text-white px-6 py-2 rounded-md text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        ذخیره تغییرات
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-4 flex items-start gap-3">
                    <div
                      className="mt-1 cursor-pointer"
                      onClick={() => setSelectedAddress(addressObj)}
                    >
                      <Radio
                        checked={
                          selectedAddress &&
                          selectedAddress.text === addressObj.text
                        }
                        onChange={() => setSelectedAddress(addressObj)}
                      />
                    </div>
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedAddress(addressObj)}
                    >
                      <span className="text-sm text-gray-800 font-medium leading-6 block">
                        {addressObj.text}
                      </span>
                      <span className="text-xs text-gray-800 mt-1.5 flex items-center gap-1">
                        کد پستی: {addressObj.postalCode || "ثبت نشده"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(index, addressObj)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                        title="ویرایش"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(index)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Submit Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <button
          onClick={handleProfileSubmit}
          className="bg-primary text-white rounded-md w-full h-12 flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] font-medium text-base"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
};

export default ProfileEditInfo;
