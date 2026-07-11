"use client";

import Image from "next/image";
import MainNavigation from "@/components/layout/navigation-menu/MainNavigation";
import { SearchInput } from "@/components/ui/search";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/loading";
import { CartItemsSkeleton } from "@/components/ui/loading/cart";
import { ChevronDownIcon } from "@/icons";

function CartLoadingPage() {
  return (
    <>
      {/* Mobile Layout */}
      <div className="flex lg:hidden h-screen bg-white flex-col">
        <div className="px-[10px] pt-20 pb-52">
          {/* Steps */}
          <div className="fixed top-0 right-0 left-0 bg-white py-4 px-[10px] flex items-center justify-center gap-1 z-50">
            <div className="rounded-2xl h-10 flex flex-1 items-center justify-center bg-gray-200 text-primary text-sm font-bold">
              سبد خرید
            </div>
            <div className="w-5 h-[2px] bg-gray-200 shrink-0" />
            <div className="rounded-2xl h-10 flex flex-1 items-center justify-center text-gray-400 text-sm font-bold">
              تحویل گیرنده
            </div>
            <div className="w-5 h-[2px] bg-gray-200 shrink-0" />
            <div className="rounded-2xl h-10 flex flex-1 items-center justify-center text-gray-400 text-sm font-bold">
              پرداخت
            </div>
          </div>

          <CartItemsSkeleton isMobile count={2} />
        </div>

        {/* Mobile footer skeleton */}
        <div className="fixed right-0 left-0 bottom-18 z-40 bg-white px-[10px] py-4 space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3">
            <div className="relative flex w-full items-center justify-center">
              <ChevronDownIcon
                size={20}
                className="text-gray-800 shrink-0 absolute left-1.5"
              />
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        <MainNavigation isHomePage={false} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          <div className="flex items-center gap-[25px] pr-6">
            <Image
              src="/assets/images/logo/small-logo.svg"
              width={40}
              height={40}
              alt="لوگو"
              className="z-70"
            />

            <div className="flex-1">
              <SearchInput
                value=""
                onChange={() => {}}
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
              <div className="bg-white rounded-t-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                <Accordion type="single" collapsible defaultValue="cart-items">
                  <AccordionItem value="cart-items">
                    <AccordionTrigger className="font-bold text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
                      <Skeleton className="h-6 w-40" />
                    </AccordionTrigger>

                    <AccordionContent className="lg:mt-4">
                      <CartItemsSkeleton count={2} />

                      <div className="lg:static flex items-center justify-end lg:pl-[140px] lg:mt-4">
                        <Skeleton className="h-7 w-72" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartLoadingPage;
