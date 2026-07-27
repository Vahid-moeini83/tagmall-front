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
      <div className="h-full flex flex-col justify-between pt-6 pb-[10px] px-[10px] lg:p-[50px]">
        <div>
          {/* Wallet section */}
          {isLoading ? (
            <Skeleton className="w-full h-[150px] mb-6 lg:mb-[50px]" />
          ) : (
            <div
              onClick={() => setIsWalletOpen(true)}
              className="relative w-full lg:w-full lg:mx-auto mb-6 lg:mb-[50px] cursor-pointer"
            >
              <div className="relative flex flex-col gap-10 pt-6 pb-3 px-3 bg-primary rounded-lg h-full">
                <div className="flex items-center justify-center">
                  <Image
                    src="/assets/images/logo/wallet-logo.svg"
                    width={126}
                    height={48}
                    alt="لوگو"
                  />
                </div>
                <p className="font-extralight text-center lg:text-base text-white">
                  <span className="font-bold">موجودی: </span>
                  {formatPrice(walletAmount)} تومان
                </p>
              </div>
              <Image
                src="/assets/images/wallet-bg.svg"
                fill
                alt="wallet background"
                className="object-cover rounded-lg"
              />
            </div>
          )}
          {/* Seller panel section */}
          <div
            onClick={handleClickSellerPanel}
            className="border-2 border-gray-200 rounded-lg pt-3 mb-[10px] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 lg:gap-4 mr-4">
                <StoreIcon size={20} />
                <span className="text-gray-600 font-bold">پنل فروشندگان</span>
              </div>
              <button className="hover:opacity-80 transition-opacity ml-4">
                <ExternalLinkIcon size={20} />
              </button>
            </div>
            <p className="font-iransans font-bold lg:font-normal text-xs lg:text-sm text-gray-600 pr-12 pl-[5px] lg:pl-[10px] leading-7 lg:leading-12">
              با ثبت محصولات و بهره مند از خدمات ما ، بازدید و فروش بیش تر و
              تجربه بی نظیری برای مشتریان خود فراهم کنید
            </p>
          </div>
          {/* Partnership section */}
          <div
            onClick={() => setIsOpen(true)}
            className="border-2 border-gray-200 rounded-lg pt-3 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 lg:gap-4 mr-4">
                <ShareIcon size={20} className="text-gray-800" />
                <span className="text-gray-600 font-bold">مشارکت در فروش</span>
              </div>
              <button className="hover:opacity-80 transition-opacity ml-5">
                <ChevronLeftIcon size={20} />
              </button>
            </div>
            <p className="font-iransans font-bold lg:font-normal text-xs lg:text-sm text-gray-600 pr-12 pl-[5px] lg:pl-[10px] leading-7 lg:leading-12">
              با به اشتراک گذاری لینک فروش محصولات ، به ازای فروش هر کالا از
              مزایای فروش کالا بهره مند شوید .
            </p>
          </div>
        </div>
        {/* Edit profile button */}
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="text-primary border-2 border-primary rounded-full w-full px-4 py-2 hover:opacity-80 transition-opacity cursor-pointer"
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
