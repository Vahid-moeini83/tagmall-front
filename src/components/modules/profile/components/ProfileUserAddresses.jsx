"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { PlusIcon } from "@/icons";
import { Edit, Trash2 } from "lucide-react";
import {
  deleteUserAddress,
  getUserAddresses,
  submitUserAddress,
  updateUserAddress,
} from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import { Skeleton } from "@/components/ui/loading";
import toast from "react-hot-toast";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";

import http from "@/app/api/axiosInstance";

function ProfileUserAddresses() {
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null);
  const [showAddAddressInput, setShowAddAddressInput] = useState(false);
  const [newAddressText, setNewAddressText] = useState("");
  const [newAddressPostalCode, setNewAddressPostalCode] = useState("");
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  // Get user addresses
  const getUserAddressesData = async () => {
    const token = await getToken();

    setIsLoadingAddress(true);
    const { getAddressesRes, getAddressesErr } = await getUserAddresses(token);
    if (getAddressesRes) {
      console.log(getAddressesRes);
      setAddresses(getAddressesRes?.data);
    } else if (getAddressesErr) {
      console.log(getAddressesErr);
    }
    setIsLoadingAddress(false);
  };

  const handleOpenAddNewAddress = () => {
    setShowAddAddressInput(true);
    setEditingAddressIndex(null);
    setNewAddressText("");
    setNewAddressPostalCode("");
  };

  const handleSubmitNewAddress = async () => {
    const token = await getToken();

    const bodyData = {
      address: newAddressText.trim(),
      postal_code: newAddressPostalCode.trim(),
    };

    setIsSubmittingAddress(true);

    const { submitAddressRes, submitAddressErr } = await submitUserAddress(
      token,
      bodyData,
    );

    if (submitAddressRes) {
      console.log(submitAddressRes);
      toast.success("آدرس جدید با موفقیت ثبت شد");
      setAddresses([submitAddressRes.data, ...addresses]);
      setShowAddAddressInput(false);
    } else if (submitAddressErr) {
      toast.error("خطا در ثبت آدرس جدید");
      console.log(submitAddressErr);
    }
    setIsSubmittingAddress(false);
    setNewAddressText("");
    setNewAddressPostalCode("");
  };

  const handleUpdateAddress = async () => {
    const token = await getToken();

    const addressItem = addresses[editingAddressIndex];

    const bodyData = {
      address: newAddressText.trim(),
      postal_code: newAddressPostalCode.trim(),
      is_default: selectedAddress?.id === addressItem.id, // اگر این آدرس انتخاب شده بود
    };

    setIsUpdatingAddress(true);
    const { updateAddressRes, updateAddressErr } = await updateUserAddress(
      token,
      bodyData,
      addressItem.id,
    );

    if (updateAddressRes) {
      console.log(updateAddressRes);
      const updated = [...addresses];
      updated[editingAddressIndex] = updateAddressRes.data;
      setAddresses(updated);

      if (bodyData.is_default) {
        setSelectedAddress(updateAddressRes.data);
      }

      setEditingAddressIndex(null);
    } else if (updateAddressErr) {
      console.log(updateAddressErr);
    }

    setIsUpdatingAddress(false);

    setNewAddressText("");
    setNewAddressPostalCode("");
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();

    if (!newAddressText.trim()) return;

    if (editingAddressIndex !== null) {
      handleUpdateAddress();
    } else {
      handleSubmitNewAddress();
    }
  };

  const handleDeleteAddress = async (id) => {
    const token = await getToken();

    setDeletingAddressId(id);
    const { deleteAddressRes, deleteAddressErr } = await deleteUserAddress(
      token,
      id,
    );
    if (deleteAddressErr) {
      toast.error("مشکلی در حذف آدرس پیش آمده");
    } else {
      setAddresses((prev) => {
        const updated = prev.filter((addr) => addr.id !== id);

        if (selectedAddress?.id === id) {
          setSelectedAddress(updated[0] || null);
        }
        return updated;
      });
    }

    setDeletingAddressId(null);
  };

  const handleSelectAddress = async (address) => {
    const token = await getToken();

    setSelectedAddress(address);
    setIsUpdatingAddress(true);
    const bodyData = {
      address: address.address,
      postal_code: address.postal_code,
      is_default: true,
    };

    const { updateAddressRes, updateAddressErr } = await updateUserAddress(
      token,
      bodyData,
      address.id,
    );

    if (updateAddressRes) {
      console.log(updateAddressRes);
      const refreshed = addresses.map((a) => ({
        ...a,
        is_default: a.id === address.id,
      }));
      setAddresses(refreshed);
    } else if (updateAddressErr) {
      console.log(updateAddressErr);
    }
    setIsUpdatingAddress(false);
  };

  const handleEditClick = (index, addressObj) => {
    setEditingAddressIndex(index);
    setNewAddressText(addressObj.address);
    setNewAddressPostalCode(addressObj.postal_code);
    setShowAddAddressInput(false);
  };

  useEffect(() => {
    getUserAddressesData();
  }, []);

  useEffect(() => {
    if (addresses.length) {
      const defaultAddress = addresses.find((addr) => addr.is_default);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else {
        setSelectedAddress(addresses[0]);
      }
    }
  }, [addresses]);

  return (
    <div className="bg-gray-50 rounded-md p-4 border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          <label className="text-lg font-bold text-gray-800">آدرس‌های من</label>
        </div>

        <button
          type="button"
          onClick={handleOpenAddNewAddress}
          className="flex items-center gap-1 text-primary text-sm font-bold cursor-pointer"
        >
          <PlusIcon size={14} />
          ثبت آدرس جدید
        </button>
      </div>

      {showAddAddressInput && (
        <div className="flex flex-col gap-3 mb-4 p-3 bg-white rounded-md border border-gray-200 shadow-sm">
          <Input
            type="text"
            placeholder="آدرس جدید..."
            value={newAddressText}
            onChange={(e) => setNewAddressText(e.target.value)}
          />

          <Input
            type="number"
            placeholder="کد پستی..."
            value={newAddressPostalCode}
            onChange={(e) => setNewAddressPostalCode(e.target.value)}
          />

          <div className="self-end flex items-center gap-2">
            <button
              onClick={handleSaveAddress}
              disabled={isSubmittingAddress || isUpdatingAddress}
              className="bg-primary text-white px-4 h-9 rounded-md text-xs flex items-center justify-center"
            >
              {isSubmittingAddress || isUpdatingAddress ? (
                <SpinnerLoading size={16} />
              ) : (
                "ذخیره آدرس"
              )}
            </button>

            <button
              onClick={() => setShowAddAddressInput(false)}
              className="text-gray-500 px-4 h-9 rounded-md text-xs"
            >
              لغو
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {isLoadingAddress ? (
          <div className="flex items-start gap-3 p-3 rounded-md border-2 bg-white border-gray-200">
            <Skeleton className="w-4 h-4 rounded-full mt-1" />

            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-gray-400 text-center pt-4 py-2">
            آدرسی ثبت نشده است
          </div>
        ) : (
          addresses.map((address, index) => (
            <div
              key={address?.id}
              className={`flex items-start gap-3 p-3 rounded-md border-2 bg-white ${
                selectedAddress?.id === address.id
                  ? "border-primary ring-1 ring-primary/20"
                  : "border-gray-200"
              }`}
            >
              <Radio
                checked={selectedAddress?.id === address.id}
                disabled={isUpdatingAddress}
                onChange={() => handleSelectAddress(address)}
              />

              <div className="flex-1 flex flex-col gap-2">
                {editingAddressIndex === index ? (
                  <>
                    <Input
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                    />

                    <Input
                      value={newAddressPostalCode}
                      onChange={(e) => setNewAddressPostalCode(e.target.value)}
                    />

                    <button
                      onClick={handleSaveAddress}
                      disabled={isUpdatingAddress}
                      className="bg-primary text-white px-4 py-2 rounded-md text-xs self-end flex items-center justify-center"
                    >
                      {isUpdatingAddress ? (
                        <SpinnerLoading size={16} />
                      ) : (
                        "بروزرسانی"
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-between group">
                    <div>
                      <span className="text-sm text-gray-800 font-medium">
                        {address.address}
                      </span>

                      <span className="text-xs text-gray-400 block mt-1">
                        کد پستی: {address.postal_code || "ثبت نشده"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEditClick(index, address)}
                        className="text-primary"
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-error-medium w-4 h-4 flex items-center justify-center"
                      >
                        {deletingAddressId === address.id ? (
                          <SpinnerLoading
                            className="border-error-medium"
                            size={16}
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfileUserAddresses;
