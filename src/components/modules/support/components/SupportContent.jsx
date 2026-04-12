"use client";

import MainNavigation from "@/components/layout/navigation-menu";
import { SearchInput } from "@/components/ui/search";
import { SupportChats, SupportOrders } from "..";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SupportContent() {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          {/* Top Section - Search Input */}
          <div className="flex items-center gap-[25px]">
            {/* <div className="w-[50px] h-[50px] bg-gray-400 rounded-lg shrink-0" /> */}
            <div className="flex-1">
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                // showSearchIcon={false}
                readOnly
                bgColor="bg-white"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative rounded-lg overflow-y-auto flex-1 min-h-0">
            {/* Main Navigation */}
            <div className="fixed right-[65px] bottom-[55px]">
              <MainNavigation isHomePage={false} />
            </div>

            {/* Content */}
            <div className="space-y-1.5 bg-gray-200">
              {/* First White Box - Cart Items */}
              <div className="bg-white rounded-t-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                <SupportChats />
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
            className="w-full max-w-[540px] flex items-center px-0! mt-2"
          >
            <TabsTrigger
              value="chats"
              className="flex-1 shadow-none! rounded-none! text-gray-600 data-[state=active]:text-primary border-b-2 border-gray-200 data-[state=active]:border-primary font-bold! h-[48px]"
            >
              پیام ها
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex-1 shadow-none! rounded-none! text-gray-600 data-[state=active]:text-primary border-b-2 border-gray-200 data-[state=active]:border-primary font-bold! h-[48px]"
            >
              پیگیری سفارشات
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chats" dir="rtl">
            <div className="overflow-y-auto">
              <SupportChats isMobile={true} />
            </div>
          </TabsContent>
          <TabsContent value="orders" dir="rtl">
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
