"use client";
import { DragHandler } from "@/components/ui/drag-handler";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { PlusIcon, StrokeArrowLeftIcon } from "@/icons";
import { Check, Edit, Trash2 } from "lucide-react";
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

  // Handle save
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
    <div className="h-full select-none">
      {/* Drag handle */}
      <div className="absolute top-2 right-1/2 translate-x-1/2">
        <DragHandler
          hasCloseEvent={true}
          onClose={() => setIsEditingProfile(false)}
        />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto bg-white px-6 pb-6 pt-10 flex flex-col">
        <div className="flex items-start justify-between">
          {/* Title Section */}
          <div className="flex flex-col gap-2 mb-10">
            <h1 className="text-xl lg:text-2xl font-bold">ویرایش مشخصات</h1>
            <span className="text-gray-600">
              لطفا اطلاعات خود را وارد نمایید.
            </span>
          </div>
          {/* Profile Image Box (Left) */}
          <label
            htmlFor="modalProfileImage"
            className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-md border-2 border-primary overflow-hidden flex items-center justify-center cursor-pointer transition-colors"
          >
            {profileImage ? (
              <Image
                src={URL.createObjectURL(profileImage)}
                fill
                alt="پروفایل"
                className="object-cover"
              />
            ) : (
              <span className="text-xs text-center text-primary">
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
        </div>
        {/* Inputs Section */}
        <div className="space-y-8">
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

          {/* Address Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="lg:text-lg font-bold text-gray-800">
                آدرس‌ها
              </label>
              <button
                type="button"
                onClick={() => handleOpenAddNewAddress()}
                className="flex items-center gap-2 text-primary text-sm cursor-pointer hover:opacity-80"
              >
                <PlusIcon size={16} />
                افزودن آدرس جدید
              </button>
            </div>
            {/* Add Address Input */}
            {showAddAddressInput && (
              <div className="flex flex-col gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="آدرس جدید..."
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  containerClassName="w-full"
                />
                <Input
                  type="number"
                  placeholder="کد پستی..."
                  value={newAddressPostalCode}
                  onChange={(e) => setNewAddressPostalCode(e.target.value)}
                  containerClassName="w-full"
                />
                <div className="self-end flex items-center gap-1">
                  <button
                    onClick={handleSaveAddress}
                    className="bg-primary text-white px-4 h-10 rounded-md cursor-pointer hover:bg-opacity-90 transition-all"
                  >
                    ثبت
                  </button>
                  <button
                    onClick={() => setShowAddAddressInput(false)}
                    className="text-gray-400 border-2 border-gray-400 px-4 h-10 rounded-md cursor-pointer hover:bg-opacity-90 transition-all"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            )}
            {/* Address List */}
            <div className="flex flex-col gap-2">
              {addresses.map((addressObj, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-md border-2 transition-all ${
                    selectedAddress && selectedAddress.text === addressObj.text
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <div
                    className="mt-1"
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
                  <div className="flex-1 flex flex-col justify-center">
                    {editingAddressIndex === index ? (
                      <div className="flex flex-col gap-2 w-full">
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
                          onChange={(e) =>
                            setNewAddressPostalCode(e.target.value)
                          }
                          containerClassName="w-full"
                        />
                        <button
                          onClick={handleSaveAddress}
                          className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer self-end"
                        >
                          ثبت
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full group">
                        <div
                          className="flex flex-col cursor-pointer"
                          onClick={() => setSelectedAddress(addressObj)}
                        >
                          <span className="text-sm text-gray-700 leading-6">
                            {addressObj.text}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            کد پستی: {addressObj.postalCode || "ثبت نشده"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(index, addressObj)}
                            className="p-1.5 text-primary hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            className="p-1.5 text-error-medium hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex flex-col gap-3 mt-12 bg-white border-t border-gray-100">
          <button
            onClick={handleProfileSubmit}
            className="bg-primary text-white rounded-md w-full h-12 flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:gap-3 cursor-pointer"
          >
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileEditInfo;
