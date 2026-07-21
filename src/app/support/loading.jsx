"use client";

import { Suspense } from "react";
import MainNavigation from "@/components/layout/navigation-menu";
import { Skeleton } from "@/components/ui/loading";
import { SupportOrdersSkeleton } from "@/components/ui/loading/support";
import { SearchInput } from "@/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function SupportLoadingView({ activeTab }) {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          <div className="flex items-center gap-[25px] pr-6 relative">
            <Image
              src="/assets/images/logo/small-logo.svg"
              width={40}
              height={40}
              alt="لوگو"
              className="z-70"
            />
            <div className="flex-1">
              <SearchInput
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                readOnly
                bgColor="bg-white"
                className="max-w-[642px]"
              />
            </div>
          </div>

          <div className="relative rounded-lg overflow-y-auto flex-1 min-h-0">
            <div className="fixed right-[65px] bottom-[55px]">
              <MainNavigation hasSearchBox isHomePage={false} />
            </div>

            <div className="space-y-1.5 bg-gray-200">
              <div className="bg-white rounded-t-lg py-[50px] px-[100px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold font-iransans text-xl text-primary">
                    پیام ها
                  </h2>
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-2 h-[500px] mt-4">
                  <div className="flex-1 space-y-6">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start gap-3 pb-3">
                        <Skeleton className="w-10 h-10 rounded-[14px] shrink-0" />
                        <div className="flex-1 space-y-6 pt-2">
                          <Skeleton className="h-5 w-40" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-5 w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-[480px] w-1/2 rounded-lg" />
                </div>
              </div>

              <div className="bg-white rounded-b-lg py-[50px] px-[100px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-xl text-primary">
                    پیگیری سفارشات
                  </h2>
                </div>

                <div className="flex items-center gap-0 mt-4">
                  <div className="flex items-center gap-5 pl-[18px] border-l-2 border-gray-200">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex items-center gap-5">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                  <div className="px-4 border-l-2 border-gray-200">
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <div className="px-4 border-l-2 border-gray-200">
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="pr-4">
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>

                <SupportOrdersSkeleton isMobile={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Tabs value={activeTab}>
          <TabsList
            dir="rtl"
            className="fixed top-6 left-[10px]! right-[10px]! bg-gray-200 rounded-lg! max-w-[540px] flex items-center gap-1 h-14! mx-auto! z-20"
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

          <TabsContent className="pt-[90px] px-[10px]" value="chats" dir="rtl">
            <div className="flex flex-col gap-1 pr-1 mt-2 pb-40">
              <div className="relative mt-2">
                <Skeleton className="h-[120px] rounded-lg" />
              </div>

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item}>
                  <div className="flex items-start gap-[6px] pt-1 pb-1">
                    <Skeleton className="w-10 h-10 rounded-[14px] shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <Skeleton className="h-3 w-25" />
                      <Skeleton className="h-3 w-44" />
                    </div>
                  </div>
                  <div className="w-full h-[2px] bg-gray-200 mr-12" />
                </div>
              ))}
            </div>

            <div className="fixed bottom-17 right-0 left-0 bg-white py-4 px-[10px]">
              <div className="w-full text-primary border-2 border-primary py-2 rounded-full text-center">
                پاک کردن پیام ها
              </div>
            </div>
          </TabsContent>

          <TabsContent
            className="pt-[90px] pb-[140px]"
            value="orders"
            dir="rtl"
          >
            <SupportOrdersSkeleton isMobile />
          </TabsContent>
        </Tabs>

        <MainNavigation isHomePage={false} />
      </div>
    </>
  );
}

function SupportLoadingContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "orders" ? "orders" : "chats";

  return <SupportLoadingView activeTab={activeTab} />;
}

function SupportLoadingFallback() {
  return <SupportLoadingView activeTab="orders" />;
}

function SupportLoading() {
  return (
    <Suspense fallback={<SupportLoadingFallback />}>
      <SupportLoadingContent />
    </Suspense>
  );
}

export default SupportLoading;
