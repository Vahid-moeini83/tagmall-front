"use client";

import { useState } from "react";
import MainNavigation from "@/components/layout/navigation-menu";
import { SearchInput, SearchBox } from "@/components/ui/search";
import { SupportChats, SupportOrders } from "..";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import usePublicStore from "@/app/store/publicStore";
import Link from "next/link";

function SupportContent({ conversations }) {
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);

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
          <div className="flex items-center gap-[25px] pr-6 relative">
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
                <SupportOrders />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden px-[10px]">
        <Tabs defaultValue="chats">
          <TabsList
            dir="rtl"
            className="fixed top-0 right-0 left-0 bg-white! z-20 w-full max-w-[540px] flex items-center px-0! py-0! h-12! mx-auto"
          >
            <TabsTrigger
              value="chats"
              className="flex-1 shadow-none! rounded-none! h-full! text-gray-600 data-[state=active]:text-primary border-b-2 border-gray-200 data-[state=active]:border-primary font-bold!"
            >
              پیام ها
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex-1 shadow-none! rounded-none! h-full! text-gray-600 data-[state=active]:text-primary border-b-2 border-gray-200 data-[state=active]:border-primary font-bold!"
            >
              پیگیری سفارشات
            </TabsTrigger>
          </TabsList>
          <TabsContent className="pt-10" value="chats" dir="rtl">
            <div className="overflow-y-auto">
              <SupportChats isMobile={true} conversations={conversations} />
            </div>
          </TabsContent>
          <TabsContent className="pt-10" value="orders" dir="rtl">
            <SupportOrders />
          </TabsContent>
        </Tabs>
        {/* Main Navigation */}
        <MainNavigation isHomePage={false} />
      </div>
    </>
  );
}

export default SupportContent;
