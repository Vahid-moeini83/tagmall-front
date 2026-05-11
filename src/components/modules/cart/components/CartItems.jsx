"use client";

import { useState } from "react";
import Image from "next/image";
import {
  VerifyIcon,
  SquarePlusIcon,
  NoteIcon,
  MinusIcon,
  PlusIcon,
  MoreSquareIcon,
} from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DialogWrapper, {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/client/utils";
import ResponsiveModal from "@/components/ui/responsive-modal";

const mockCartItems = [
  {
    id: 1,
    name: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    img: "/assets/images/fallback/phone.png",
    price: 34580000,
    purchaseType: "online", // "online" or "in-person"
    shippingCost: 50000,
    seller: {
      name: "دیجی‌کالا",
      profileImage: "/assets/images/fallback/avatar.png",
    },
  },
  {
    id: 2,
    name: "گوشی موبایل اپل iPhone 15 Pro Max",
    img: "/assets/images/fallback/phone.png",
    price: 36500000,
    purchaseType: "in-person",
    shippingCost: 0,
    seller: {
      name: "موبایل سنتر",
      profileImage: "/assets/images/fallback/avatar.png",
    },
  },
  {
    id: 3,
    name: "گوشی موبایل شیائومی 11T",
    img: "/assets/images/fallback/phone.png",
    price: 15000000,
    purchaseType: "online",
    shippingCost: 30000,
    seller: {
      name: "موبایل سنتر",
      profileImage: "/assets/images/fallback/avatar.png",
    },
  },
  {
    id: 4,
    name: "گوشی موبایل شیائومی 11T",
    img: "/assets/images/fallback/phone.png",
    price: 15000000,
    purchaseType: "online",
    shippingCost: 25000,
    seller: {
      name: "موبایل سنتر",
      profileImage: "/assets/images/fallback/avatar.png",
    },
  },
  {
    id: 5,
    name: "گوشی موبایل شیائومی 11T",
    img: "/assets/images/fallback/phone.png",
    price: 15000000,
    purchaseType: "in-person",
    shippingCost: 0,
    seller: {
      name: "موبایل سنتر",
      profileImage: "/assets/images/fallback/avatar.png",
    },
  },
];

function CartItems({ handleNextStep, isMobile = false }) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [quantities, setQuantities] = useState(
    mockCartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {}),
  );

  const handleQuantityChange = (productId, action) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]:
        action === "increase"
          ? prev[productId] + 1
          : Math.max(1, prev[productId] - 1),
    }));
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible={isMobile ? false : true}
        defaultValue="cart-items"
      >
        <AccordionItem value="cart-items">
          {!isMobile && (
            <AccordionTrigger className="font-bold text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
              سبد خرید ( 3 کالا )
            </AccordionTrigger>
          )}
          <AccordionContent className="lg:mt-4 ">
            <div className={isMobile ? "space-y-4" : "space-y-10"}>
              {mockCartItems.map((product, index) => (
                <div
                  key={product.id}
                  className={`${isMobile ? "pb-4" : "pb-8"} ${mockCartItems.length - 1 === index ? "" : "border-b-2 border-gray-100"}`}
                >
                  {isMobile ? (
                    // Mobile Layout
                    <div className="flex flex-col gap-3">
                      {/* Seller and Timer Box */}
                      <div className="flex items-center justify-between pb-3">
                        <div
                          className={`flex items-end gap-1  ${product.id === 1 ? "text-error-medium" : "text-gray-600"}`}
                        >
                          {product.id === 1 ? (
                            <span className="text-error-medium font-bold">
                              فروشنده ویژه
                            </span>
                          ) : (
                            <span className="text-gray-600 font-bold">
                              فروشنده
                            </span>
                          )}
                          {product.seller.name}
                        </div>
                        {product.id === 1 && (
                          <span className="text-error-medium text-xl">
                            00:00:00
                          </span>
                        )}
                      </div>

                      {/* Product Details Box */}
                      <div className="flex gap-3">
                        <div className="relative w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0">
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
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-1">
                              <p className="font-bold text-gray-600 line-clamp-2 text-xs">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-1 text-gray-600 text-xs">
                                <p>
                                  <span>
                                    <span className="font-bold">قیمت</span>
                                    <span>
                                      {formatPrice(product.price)} تومان
                                    </span>
                                  </span>
                                  {product.purchaseType === "online" &&
                                    product.shippingCost > 0 && (
                                      <span>
                                        {" "}
                                        و{" "}
                                        <span className="font-bold">
                                          هزینه ارسال
                                        </span>
                                        <span>
                                          {formatPrice(product.shippingCost)}{" "}
                                          تومان
                                        </span>
                                        <span className="text-gray-600">
                                          {" "}
                                          (خرید آنلاین)
                                        </span>
                                      </span>
                                    )}
                                  {product.purchaseType === "in-person" && (
                                    <span className="text-gray-600">
                                      {" "}
                                      (خرید حضوری)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <NoteIcon
                                size={20}
                                color="#000000"
                                className="cursor-pointer"
                                onClick={() => setNoteDialogOpen(true)}
                              />
                              <div className="flex items-center gap-1 pl-[11px] border-2 border-gray-200 rounded-md p-2">
                                <MinusIcon
                                  size={20}
                                  onClick={() =>
                                    handleQuantityChange(product.id, "decrease")
                                  }
                                  className={`cursor-pointer ${quantities[product.id] <= 1 ? "text-gray-400" : "text-error-medium"}`}
                                />
                                <span className="text-gray-600 min-w-[30px] text-center select-none">
                                  {quantities[product.id]}
                                </span>
                                <PlusIcon
                                  size={20}
                                  onClick={() =>
                                    handleQuantityChange(product.id, "increase")
                                  }
                                  className="text-primary cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 cursor-pointer pl-3 mt-4">
                            <span className="text-primary font-bold text-xs">
                              لوازم جانبی و قطعات مرتبط
                            </span>
                            <SquarePlusIcon
                              size={20}
                              className="text-primary"
                            />
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
                      <div className="flex flex-col items-start justify-start gap-6">
                        {/* Seller Info and timer */}
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
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {product.seller.name}
                              </span>
                              <VerifyIcon size={20} />
                            </div>
                          </div>
                          <span className="text-error-medium text-xl">
                            00:00:00
                          </span>
                        </div>

                        {/* Product Info */}
                        <div className="pr-14 w-full">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-gray-600 line-clamp-1 mb-4">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-4 mb-4">
                              <NoteIcon
                                size={20}
                                color="#000000"
                                className="cursor-pointer"
                                onClick={() => setNoteDialogOpen(true)}
                              />
                              <div className="flex items-center p-4 gap-1 border-2 border-gray-200 rounded-lg">
                                <MinusIcon
                                  size={24}
                                  onClick={() =>
                                    handleQuantityChange(product.id, "decrease")
                                  }
                                  className={`cursor-pointer ${quantities[product.id] <= 1 ? "text-gray-400" : "text-error-medium"}`}
                                />
                                <span className="text-gray-600 min-w-[30px] text-center select-none">
                                  {quantities[product.id]}
                                </span>
                                <PlusIcon
                                  size={24}
                                  onClick={() =>
                                    handleQuantityChange(product.id, "increase")
                                  }
                                  className="text-primary cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2 text-gray-600">
                            <p>
                              <span className="font-bold">قیمت</span>
                              <span>{formatPrice(product.price)} تومان</span>
                              {product.purchaseType === "online" &&
                                product.shippingCost > 0 && (
                                  <span>
                                    {" "}
                                    و{" "}
                                    <span className="font-bold">
                                      هزینه ارسال
                                    </span>
                                    <span>
                                      {formatPrice(product.shippingCost)} تومان
                                    </span>
                                    <span className="text-gray-600">
                                      (خرید آنلاین)
                                    </span>
                                  </span>
                                )}
                              {product.purchaseType === "in-person" && (
                                <span className="text-gray-600">
                                  {" "}
                                  (خرید حضوری)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Related Accessories */}
                        <div className="flex items-center gap-4 cursor-pointer pr-3.5">
                          <SquarePlusIcon size={20} className="text-primary" />
                          <span className="text-primary">
                            لوازم جانبی و قطعات مرتبط
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="fixed bg-white right-0 left-0 bottom-18 py-4 lg:static flex items-center justify-center lg:justify-end lg:pl-[140px] lg:mt-4">
              <button
                onClick={handleNextStep}
                className="lg:text-xl text-primary cursor-pointer"
              >
                ثبت سفارش ( مبلغ {formatPrice(51530000)} تومان )
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ResponsiveModal
        isHintBox
        title={"یادداشت"}
        isOpen={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
      >
        <p className="text-gray-600 leading-7 text-justify">
          این یک متن تستی برای یادداشت محصول است. می‌توانید یادداشت‌های خود را
          در اینجا مشاهده و ویرایش کنید.
        </p>
      </ResponsiveModal>
    </>
  );
}

export default CartItems;
