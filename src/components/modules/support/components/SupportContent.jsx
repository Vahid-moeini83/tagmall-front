"use client";

import { useState, useEffect } from "react";
import MainNavigation from "@/components/layout/navigation-menu";
import { SearchInput, SearchBox } from "@/components/ui/search";
import { SupportChats, SupportOrders } from "..";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import usePublicStore from "@/app/store/publicStore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getActiveTabFromParams(searchParams) {
  if (searchParams.get("conversationId")) return "chats";

  const tab = searchParams.get("tab");
  if (tab === "orders" || tab === "chats") return tab;

  return "chats";
}

function SupportContent({ conversations, initialOrders }) {
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() =>
    getActiveTabFromParams(searchParams),
  );

  useEffect(() => {
    setActiveTab(getActiveTabFromParams(searchParams));
  }, [searchParams]);

  const handleSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchBoxOpen(true);
  };

  return (
    <>
      {/* Search Box */}
      <SearchBox
        isOpen={searchBoxOpen}
        onClose={() => setSearchBoxOpen(false)}
        isHomePage={false}
      />

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          {/* Top Section - Search Input */}
          <div className="flex items-center gap-[25px] pr-8 relative">
            <Link href={"/"}>
              <Image
                src="/assets/images/logo/small-logo.svg"
                width={40}
                height={40}
                alt="لوگو"
                className="z-70"
              />
            </Link>
            <div className="flex-1">
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                readOnly
                bgColor="bg-white"
                className="max-w-[642px]"
                onClick={handleSearchClick}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative rounded-lg overflow-y-auto flex-1 min-h-0">
            {/* Main Navigation */}
            <div className="fixed right-[65px] bottom-[55px]">
              <MainNavigation hasSearchBox isHomePage={false} />
            </div>

            {/* Content */}
            <div className="space-y-1.5 bg-gray-200">
              {/* First White Box - Cart Items */}
              <div className="bg-white rounded-t-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                <SupportChats conversations={conversations} />
              </div>

              {/* Second White Box - Order Summary */}
              <div className="bg-white rounded-b-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                <SupportOrders initialOrders={initialOrders} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="fixed top-0 py-6 left-0 right-0 bg-white px-[10px] z-20">
            <TabsList
              dir="rtl"
              className="w-full bg-gray-200 rounded-lg! max-w-[540px] flex items-center gap-1 h-14!"
            >
              <TabsTrigger
                value="chats"
                className="data-[state=active]:bg-white rounded-lg! flex-1 shadow-none! text-gray-600 data-[state=active]:text-primary font-bold! h-[48px]"
              >
                پیام ها
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-white rounded-lg! flex-1 shadow-none! text-gray-600 data-[state=active]:text-primary font-bold! h-[48px]"
              >
                پیگیری سفارشات
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent className="pt-[90px] px-[10px]" value="chats" dir="rtl">
            <div className="overflow-y-auto">
              <SupportChats isMobile={true} conversations={conversations} />
            </div>
          </TabsContent>
          <TabsContent
            className="pt-[90px] pb-[140px]"
            value="orders"
            dir="rtl"
          >
            <SupportOrders initialOrders={initialOrders} />
          </TabsContent>
        </Tabs>
        {/* Main Navigation */}
        <MainNavigation isHomePage={false} />
      </div>
    </>
  );
}

export default SupportContent;
