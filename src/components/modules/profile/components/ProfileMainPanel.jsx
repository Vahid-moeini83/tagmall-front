"use client";

import { DragHandler } from "@/components/ui/drag-handler";
import { Skeleton } from "@/components/ui/loading";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  PanelIcon,
  PlusIcon,
  ShareIcon,
  StoreIcon,
} from "@/icons";
import { formatPrice } from "@/lib/client/utils";
import { getWalletAmount, sellerPanelUrl } from "@/lib/server/actions/profile";
import { getToken } from "@/lib/server/cookies";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProfilePartnership, ProfileReceivedLinks, ProfileWallet } from "..";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function ProfileMainPanel({
  setIsWalletOpen,
  setIsEditingProfile,
  onWalletAmountUpdate,
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [isLoading, setIsLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("partnership");

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
      const balance = getWalletRes?.data?.balance;
      setWalletAmount(balance);
      if (onWalletAmountUpdate) {
        onWalletAmountUpdate(balance);
      }
    } else if (getWalletErr) {
      toast.error("خطا در نمایش موجودی کیف پول");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWalletAmount();
  }, []);

  return (
    <>
      <div className="h-full flex flex-col justify-between py-6 px-[10px] lg:p-[50px]">
        <div>
          {/* Wallet section */}
          <div
            onClick={() => setIsWalletOpen(true)}
            className="relative w-full lg:w-ful lg:mx-auto mb-5 cursor-pointer"
          >
            <Image
              src="/assets/images/wallet-bg.svg"
              fill
              alt="wallet background"
              className="object-cover rounded-lg"
            />
            <div className="relative flex flex-col gap-[56px] p-3 bg-[#2C8DF8]/70  rounded-lg h-full">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-white">
                  کیف پول اعتباری
                </span>
                <Image
                  src="/assets/images/logo/gray-logo.svg"
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
                {/* <button
                  onClick={() => setIsWalletOpen(true)}
                  className="bg-white text-primary flex items-center gap-2 h-9 pl-1 pr-2 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <PlusIcon size={14} className="text-primary" />
                  افزایش موجودی
                </button> */}
              </div>
            </div>
          </div>
          {/* Seller panel section */}
          <div className="pb-7">
            <div
              onClick={handleClickSellerPanel}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-3 lg:gap-4 mr-4">
                <StoreIcon size={20} />
                <span className="text-gray-600 font-semibold cursor-pointer">
                  پنل فروشندگان
                </span>
              </div>
              <button className="hover:opacity-80 transition-opacity ml-4">
                <ExternalLinkIcon size={20} />
              </button>
            </div>
            <p className="font-iransans font-bold lg:font-normal text-xs lg:text-sm text-gray-600 pr-10 leading-7">
              با ثبت محصولات و بهره مند از خدمات ما ، بازدید و فروش بیش تر و
              تجربه بی نظیری برای مشتریان خود فراهم کنید
            </p>
          </div>
          {/* Partnership section */}
          <div className="border-t-2 border-gray-200 pt-3">
            <div
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-3 lg:gap-4 mr-4">
                <ShareIcon size={20} className="text-gray-800" />
                <span className="text-gray-600 font-semibold cursor-pointer">
                  مشارکت در فروش
                </span>
              </div>
              <button className="hover:opacity-80 transition-opacity ml-4">
                <ChevronLeftIcon size={20} />
              </button>
            </div>
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
            مشخصات کاربری
          </button>
        </div>
      </div>

      {isDesktop ? (
        isOpen && (
          <div className="fixed inset-0 z-1000 bg-white h-screen">
            {activeSection === "partnership" && (
              <ProfilePartnership
                setIsOpen={setIsOpen}
                setActiveSection={setActiveSection}
              />
            )}
            {activeSection === "links" && (
              <ProfileReceivedLinks
                setIsOpen={setIsOpen}
                setActiveSection={setActiveSection}
              />
            )}
          </div>
        )
      ) : (
        <Drawer open={isOpen} onOpenChange={() => setIsOpen(false)}>
          <DrawerContent
            className="z-100! px-[10px] h-[96%]!"
            overlayClassName="z-100 lg:hidden"
          >
            {activeSection === "partnership" && (
              <ProfilePartnership
                setIsOpen={setIsOpen}
                setActiveSection={setActiveSection}
              />
            )}
            {activeSection === "links" && (
              <ProfileReceivedLinks
                setIsOpen={setIsOpen}
                setActiveSection={setActiveSection}
              />
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default ProfileMainPanel;
