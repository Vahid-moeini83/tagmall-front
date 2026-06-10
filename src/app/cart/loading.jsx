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

function CartLoadingPage() {
  return (
    <>
      {/* Mobile Layout */}
      <div className="flex lg:hidden h-screen bg-white flex-col">
        {/* Main Content */}
        <div className="px-[10px] pt-20 pb-40">
          {/* Steps */}
          <div className="fixed top-0 right-0 left-0 bg-white py-4 px-[10px] flex items-center justify-center z-50">
            <div className="rounded-md w-25 h-10 flex flex-1 items-center justify-center bg-gray-200 text-primary">
              سبد خرید
            </div>

            <div className="w-7 h-[3px] bg-gray-200" />

            <div className="rounded-md w-25 h-10 flex flex-1 items-center justify-center bg-gray-200 text-gray-400">
              صورت حساب
            </div>

            <div className="w-7 h-[3px] bg-gray-200" />

            <div className="rounded-md w-25 h-10 flex flex-1 items-center justify-center bg-gray-200 text-gray-400">
              سفارشات
            </div>
          </div>

          {/* Cart Items */}
          <Accordion
            type="single"
            collapsible={false}
            defaultValue="cart-items"
          >
            <AccordionItem value="cart-items">
              <AccordionContent className="mt-2">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="pb-4 border-b-2 border-gray-100">
                      <div className="flex flex-col gap-1">
                        {/* Seller */}
                        <div className="flex items-center justify-between pb-3">
                          <div className="flex items-center gap-2 mr-1">
                            <Skeleton className="w-10 h-10 rounded-md" />

                            <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-28" />
                              <Skeleton className="w-5 h-5 rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Product Row */}
                        <div className="flex gap-3">
                          {/* Image */}
                          <div className="flex flex-col justify-between items-center">
                            <Skeleton className="w-[50px] h-[50px] rounded-lg" />

                            <Skeleton className="w-5 h-5 rounded-md mb-2" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col gap-3">
                            <div className="flex justify-between mt-4">
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                              </div>

                              <Skeleton className="w-5 h-5 rounded-md ml-[10px]" />
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-2">
                              <Skeleton className="h-4 w-40" />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-1 gap-3">
                              <Skeleton className="h-4 w-40" />

                              <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center gap-2 border-2 border-gray-200 rounded-md px-2 py-1.5">
                                  <Skeleton className="w-5 h-5 rounded-full" />
                                  <Skeleton className="w-6 h-5" />
                                  <Skeleton className="w-5 h-5 rounded-full" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Button */}
                <div className="fixed bg-white right-0 left-0 bottom-18 py-4 flex items-center justify-center">
                  <Skeleton className="h-6 w-60" />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Main Navigation */}
        <MainNavigation isHomePage={false} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          {/* Top Section */}
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

          {/* Main Content */}
          <div className="relative rounded-lg overflow-y-auto flex-1 min-h-0">
            {/* Navigation */}
            <div className="fixed right-[65px] bottom-[55px]">
              <MainNavigation hasSearchBox isHomePage={false} />
            </div>

            <div className="space-y-1.5 bg-gray-200">
              {/* Cart Items Box */}
              <div className="bg-white rounded-t-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                <Accordion type="single" collapsible defaultValue="cart-items">
                  <AccordionItem value="cart-items">
                    <AccordionTrigger className="font-bold text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
                      سبد خرید ( 3 کالا )
                    </AccordionTrigger>

                    <AccordionContent className="lg:mt-4">
                      <div className="space-y-10">
                        {[1, 2].map((item, index) => (
                          <div
                            key={item}
                            className={`pb-8 ${
                              index !== 1 ? "border-b-2 border-gray-100" : ""
                            }`}
                          >
                            <div className="grid grid-cols-2">
                              {/* Product Image */}
                              <div className="flex justify-center items-center">
                                <Skeleton className="w-50 h-50 rounded-lg" />
                              </div>

                              {/* Product Info */}
                              <div className="flex flex-col items-start justify-start gap-6">
                                {/* Seller */}
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2">
                                    <Skeleton className="w-12 h-12 rounded-lg" />

                                    <div className="flex items-center gap-2">
                                      <Skeleton className="h-5 w-32" />
                                      <Skeleton className="w-5 h-5 rounded-full" />
                                    </div>
                                  </div>
                                </div>

                                {/* Product Details */}
                                <div className="pr-14 w-full">
                                  <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-5 w-3/4" />

                                    <Skeleton className="w-5 h-5 rounded-md ml-3" />
                                  </div>

                                  <div className="space-y-2">
                                    <Skeleton className="h-5 w-80" />
                                    <Skeleton className="h-5 w-52" />
                                  </div>
                                </div>

                                {/* Bottom Actions */}
                                <div className="flex items-center justify-between w-full pr-3.5">
                                  <div className="flex items-center gap-4">
                                    <Skeleton className="w-5 h-5 rounded-md" />
                                    <Skeleton className="h-5 w-48" />
                                  </div>

                                  <div className="flex items-center px-3 py-2 gap-2 border-2 border-gray-200 rounded-md">
                                    <Skeleton className="w-5 h-5 rounded-full" />
                                    <Skeleton className="w-8 h-5" />
                                    <Skeleton className="w-5 h-5 rounded-full" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Submit Button */}
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
