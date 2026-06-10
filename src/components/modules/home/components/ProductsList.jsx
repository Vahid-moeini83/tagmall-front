"use client";

import Image from "next/image";
import { NoteIcon, StrokeArrowLeftIcon } from "@/icons";
import { useKeenSlider } from "keen-slider/react";
import Dialog, { DialogWrapper } from "@/components/ui/dialog";
import { useState } from "react";

export default function ProductsList({
  onClose,
  specialProducts,
  purchasedProducts,
}) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [listSliderRef] = useKeenSlider({
    rtl: true,
    loop: false,
    slides: {
      perView: 1.1,
      spacing: 24,
    },
  });

  const handleNoteClick = (product) => {
    setSelectedProduct(product);
    setIsNoteOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm py-10 px-12 animate-in fade-in duration-300">
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="keen-slider full-screen-products-slider h-full"
          ref={listSliderRef}
        >
          <div className="keen-slider__slide bg-white rounded-2xl shadow-2xl">
            <div className="flex flex-col justify-between h-full py-12 px-16">
              <h3 className="font-bold text-error-medium text-xl mb-8">
                فروش ویژه
              </h3>

              <div className="space-y-8 overflow-y-auto">
                {specialProducts.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-2 border-b border-gray-100 pb-8"
                  >
                    <div className="flex justify-center items-center">
                      <div className="relative w-40 xl:w-50 h-40 xl:h-50 rounded-lg overflow-hidden">
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
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                            <Image
                              src={product.seller.profileImage}
                              width={32}
                              height={32}
                              alt={product.seller.name}
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.seller.name}
                          </span>
                        </div>
                        <span className="text-error-medium">00:00:00</span>
                      </div>

                      <div className="pr-6">
                        <p className="font-medium text-gray-800 line-clamp-1 mb-4">
                          {product.name}
                        </p>
                        {product.finalPrice > 0 ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span>قیمت</span>
                              <span className="font-bold">
                                {Number(product.finalPrice).toLocaleString(
                                  "fa-IR",
                                )}{" "}
                                تومان
                              </span>
                            </div>
                            {product.discountPercent > 0 && (
                              <span className="text-gray-400 line-through text-sm">
                                {Number(product.price).toLocaleString("fa-IR")}{" "}
                                تومان
                              </span>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold">قیمت نامشخص</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 mt-6 pt-4">
                <StrokeArrowLeftIcon
                  className="cursor-pointer text-right"
                  onClick={onClose}
                  size={20}
                />
                <span className="text-primary text-center">
                  کالای خاصی در نظر دارید؟
                </span>
              </div>
            </div>
          </div>

          <div className="keen-slider__slide overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="flex flex-col justify-between h-full py-12 px-16">
              <h3 className="font-bold text-primary text-xl mb-8">
                خرید حضوری
              </h3>

              <div className="space-y-8 overflow-y-auto">
                {purchasedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-2 border-b border-gray-100 pb-8 lg:mx-4 xl:mx-8"
                  >
                    <div className="flex justify-center items-center">
                      <div className="relative w-40 xl:w-50 h-40 xl:h-50 rounded-lg overflow-hidden">
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
                    <div className="flex flex-col items-start justify-start gap-8">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                            <Image
                              src={product.seller.profileImage}
                              width={32}
                              height={32}
                              alt={product.seller.name}
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.seller.name}
                          </span>
                        </div>
                        <NoteIcon
                          className="text-gray-600 cursor-pointer w-6 h-6"
                          onClick={() => handleNoteClick(product)}
                        />
                      </div>

                      <div className="pr-6">
                        <p className="font-medium text-gray-800 line-clamp-1 mb-4">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-1 mb-1">
                          <span>تعداد</span>
                          <span className="font-bold">1 عدد</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <span>وضعیت:</span>
                          <span className="font-bold">در حال آماده سازی</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[0.1fr_1.8fr_0.1fr] mt-6 pt-4">
                <StrokeArrowLeftIcon
                  className="text-center cursor-pointer"
                  onClick={onClose}
                  size={20}
                />
                <span className="text-gray-600 text-center">
                  کاربر محترم در صورتی که امکان مراجعه به فروشگاه را ندارید، با{" "}
                  <span className="-600 cursor-pointer">
                    درخواست تغییر در شیوه ارسال
                  </span>{" "}
                  سفارش را دریافت کنید.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogWrapper
        title={selectedProduct?.name || "اسم محصول"}
        isOpen={isNoteOpen}
        onClose={() => {
          setIsNoteOpen(false);
          setSelectedProduct(null);
        }}
      >
        {selectedProduct?.orderHistory?.userNote ||
          "یادداشت کاربر: لطفا محصول را در بسته بندی تیره قرار دهید. این یادداشت جهت تست قرار گرفته است!"}
      </DialogWrapper>
    </div>
  );
}
