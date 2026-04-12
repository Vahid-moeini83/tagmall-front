"use client";

import { Skeleton } from "@/components/ui/loading";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  PanelIcon,
  PlusIcon,
} from "@/icons";
import { formatPrice } from "@/lib/client/utils";
import { getWalletAmount, sellerPanelUrl } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ProfileMainPanel({ setIsWalletOpen, setIsEditingProfile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);

  const handleClickSellerPanel = async () => {
    const token = await getToken();

    const { sellerPanelRes, sellerPanelErr } = await sellerPanelUrl(token);
    if (sellerPanelRes) {
      window.open(
        sellerPanelRes?.data?.seller_panel_url,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (sellerPanelErr) {
      console.log(sellerPanelErr);
    }
  };

  const fetchWalletAmount = async () => {
    setIsLoading(true);
    const token = await getToken();
    const { getWalletRes, getWalletErr } = await getWalletAmount(token);
    if (getWalletRes) {
      setWalletAmount(getWalletRes?.data?.balance);
    } else if (getWalletErr) {
      toast.error("خطا در نمایش موجودی کیف پول");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWalletAmount();
  }, []);

  return (
    <div className="h-full flex flex-col justify-between px-[20px] py-6">
      <div>
        {/* Wallet section */}
        <div className="relative w-full lg:w-ful lg:mx-auto mb-5">
          <Image
            src="/assets/images/wallet-bg.svg"
            fill
            alt="wallet background"
            className="object-cover rounded-lg"
          />
          <div className="relative flex flex-col gap-[56px] p-3 bg-linear-to-tl from-primary via-primary/70 to-primary/50 rounded-lg h-full">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-white">
                کیف پول اعتباری
              </span>
              <Image
                src="/assets/images/logo/small-logo.svg"
                width={32}
                height={32}
                alt="لوگو"
              />
            </div>
            <div className="flex items-center justify-between">
              {!isLoading ? (
                <span className="text-sm lg:text-base text-white">
                  <span className="font-semibold text-xl">
                    {formatPrice(walletAmount)}
                  </span>{" "}
                  تومان
                </span>
              ) : (
                <Skeleton className="w-24 h-6 rounded-sm" />
              )}
              <button
                onClick={() => setIsWalletOpen(true)}
                className="bg-white text-primary flex items-center gap-2 h-9 pl-1 pr-2 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                <PlusIcon size={14} className="text-primary" />
                افزایش موجودی
              </button>
            </div>
          </div>
        </div>
        {/* Seller panel section */}
        <div className="pb-7">
          <div
            onClick={handleClickSellerPanel}
            className="flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <PanelIcon size={24} className="text-gray-800" />
              <span className="text-gray-600 font-semibold cursor-pointer">
                پنل فروشندگان
              </span>
            </div>
            <button className="hover:opacity-80 transition-opacity">
              <ArrowRightIcon size={20} className="-rotate-45" />
            </button>
          </div>
          <p className="font-iransans font-bold lg:font-normal text-xs lg:text-sm text-gray-600 pr-10 leading-7">
            با ثبت محصولات و بهره مند از خدمات ما ، بازدید و فروش بیش تر و تجربه
            بی نظیری برای مشتریان خود فراهم کنید
          </p>
        </div>
        {/* Partnership section */}
        <div className="border-t-2 border-gray-200 pt-3">
          <Link
            href="/profile/partnership"
            className="flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-4">
              <ExternalLinkIcon size={20} className="text-gray-800" />
              <span className="text-gray-600 font-semibold cursor-pointer">
                مشارکت در فروش
              </span>
            </div>
            <button className="hover:opacity-80 transition-opacity">
              <ChevronLeftIcon size={20} />
            </button>
          </Link>
          <p className="font-iransans font-bold lg:font-normal text-xs lg:text-sm text-gray-600 pr-10 leading-7">
            با به اشتراک گذاری لینک فروش محصولات ، به ازای فروش هر کالا از
            مزایای فروش کالا بهره مند شوید .
          </p>
        </div>
      </div>
      {/* Edit profile button */}
      <div className="mt-2 text-center">
        <button
          onClick={() => setIsEditingProfile(true)}
          className="text-primary hover:opacity-80 transition-opacity cursor-pointer"
        >
          ویرایش مشخصات
        </button>
      </div>
    </div>
  );
}

export default ProfileMainPanel;
