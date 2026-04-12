"use client";

import Image from "next/image";
import { VerifyIcon, SquarePlusIcon, NoteIcon } from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useState } from "react";
import DialogWrapper, {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mockOrderItems = [
  {
    id: 1,
    name: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    img: "/assets/images/fallback/phone.png",
    quantity: "یک عدد",
    seller: {
      name: "دیجی‌کالا",
      profileImage: "/assets/images/fallback/avatar.png",
    },
    status: "در حال پردازش (خرید آنلاین)",
    lastUpdate: "1 دقیقه پیش",
  },
  {
    id: 2,
    name: "گوشی موبایل اپل iPhone 15 Pro Max",
    img: "/assets/images/fallback/phone.png",
    quantity: "دو عدد",
    seller: {
      name: "موبایل سنتر",
      profileImage: "/assets/images/fallback/avatar.png",
    },
    status: "در حال پردازش (خرید آنلاین)",
    lastUpdate: "1 دقیقه پیش",
  },
];

function OrderItems({ isMobile = false }) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);

  return (
    <>
      <div className="block lg:hidden font-iransans text-center text-gray-600 pb-6">
        خرید شما با موفقیت انجام شد؛ با تشکر از اعتماد شما به ما
      </div>
      <Accordion type="single" collapsible defaultValue="order-items">
        <AccordionItem value="order-items">
          {!isMobile && (
            <AccordionTrigger className="font-bold text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
              سفارشات
            </AccordionTrigger>
          )}
          <AccordionContent className="lg:mt-4">
            <div className="space-y-4 lg:space-y-10">
              {mockOrderItems.map((product, index) => (
                <div
                  key={product.id}
                  className={`pb-1 lg:pb-8 lg:mx-4 xl:mx-8 ${mockOrderItems.length - 1 === index ? "" : "lg:border-b-2 lg:border-gray-100"}`}
                >
                  {isMobile ? (
                    // Mobile Layout
                    <div className="flex flex-col gap-3">
                      {/* Seller and Update Box */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-600">
                          <span className="font-bold">فروشنده</span>
                          {product.seller.name}
                        </div>
                        <span className="text-gray-400 text-xs">
                          بروزرسانی {product.lastUpdate}
                        </span>
                      </div>

                      {/* Product Details Box */}
                      <div className="flex gap-3">
                        <div className="relative w-25 h-25 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={
                              product.img ||
                              "/assets/images/fallback/no-photo.jpg"
                            }
                            fill
                            alt={product.name}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-gray-600 line-clamp-1 text-xs mb-0!">
                              {product.name}
                            </p>
                            <NoteIcon
                              size={20}
                              onClick={() => setNoteDialogOpen(true)}
                              className="cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <span className="font-bold">تعداد</span>
                            <span>{product.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <span className="font-bold">وضعیت</span>
                            <span>{product.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Desktop Layout
                    <div className="grid grid-cols-2">
                      <div className="flex justify-center items-center">
                        <div className="relative w-50 h-50 rounded-lg overflow-hidden">
                          <Image
                            src={
                              product.img ||
                              "/assets/images/fallback/no-photo.jpg"
                            }
                            fill
                            alt={product.name}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-8 pl-8">
                        {/* Seller Info */}
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                product.seller.profileImage ||
                                "/assets/images/fallback/no-photo.jpg"
                              }
                              width={48}
                              height={48}
                              alt="seller"
                              className="rounded-lg"
                            />
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600">
                                {product.seller.name}
                              </span>
                              <VerifyIcon size={20} />
                            </div>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="w-full space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-gray-600 line-clamp-1 mb-0!">
                              {product.name}
                            </p>
                            <NoteIcon
                              size={20}
                              onClick={() => setNoteDialogOpen(true)}
                              className="cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <span className="font-bold">تعداد</span>
                            <span>{product.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <span className="font-bold">وضعیت</span>
                            <span>{product.status}</span>
                            <span className="text-gray-400">
                              بروزرسانی {product.lastUpdate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Success Message */}
            <p className="hidden lg:block font-iransans text-gray-600 text-xl text-center mt-8">
              خرید شما با موفقیت انجام شد؛ با تشکر از اعتماد شما به ما
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <DialogWrapper
        title={"یادداشت"}
        isOpen={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
      >
        <p className="text-gray-600">
          این یک متن تستی برای یادداشت محصول است. می‌توانید یادداشت‌های خود را
          در اینجا مشاهده و ویرایش کنید.
        </p>
      </DialogWrapper>
    </>
  );
}

export default OrderItems;
