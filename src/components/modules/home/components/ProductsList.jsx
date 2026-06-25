"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { NoteIcon, StrokeArrowLeftIcon } from "@/icons";
import { DialogWrapper } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import ProductsListSlidePanel from "./ProductsListSlidePanel";
import { useRouter } from "next/navigation";
import usePublicStore from "@/app/store/publicStore";
import { getToken } from "@/lib/server/cookies";
import { createConversation } from "@/lib/server/actions/support";
import toast from "react-hot-toast";

export default function ProductsList({
  onClose,
  specialProducts,
  purchasedProducts,
  filterMode,
  remainingTime,
}) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const router = useRouter();
  const setLoginOpen = usePublicStore((state) => state.setLoginOpen);

  const showSpecial = filterMode !== "visit";
  const showOrders = filterMode !== "special";

  const slides = useMemo(() => {
    const items = [];
    if (showSpecial) items.push("special");
    if (showOrders) items.push("orders");
    return items;
  }, [showSpecial, showOrders]);

  const handleNoteClick = (product) => {
    setSelectedProduct(product);
    setIsNoteOpen(true);
  };

  const handleShippingChangeSupport = async () => {
    const token = await getToken();

    if (!token) {
      setLoginOpen(true);
      return;
    }

    const bodyData = {
      department: 2,
    };

    const { createConversationRes, createConversationErr } =
      await createConversation(token, bodyData);

    if (createConversationRes) {
      const conversationId = createConversationRes.data?.id;

      if (conversationId) {
        router.push(`/support?conversationId=${conversationId}`);
      } else {
        toast.error("خطا در برقراری ارتباط با پشتیبانی");
      }
    } else if (createConversationErr) {
      toast.error("خطا در برقراری ارتباط با پشتیبانی");
    }
  };

  if (slides.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 hidden lg:flex items-center justify-center bg-gray-400/50 backdrop-blur-sm py-10 px-12 animate-in fade-in duration-300">
      <div className="relative w-full h-full overflow-hidden">
        <Swiper
          dir="rtl"
          slidesPerView={slides.length === 1 ? 1 : 1.2}
          centeredSlides={slides.length > 1}
          spaceBetween={0}
          grabCursor
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="h-full"
        >
          {showSpecial && (
            <SwiperSlide className="flex items-center h-full">
              <ProductsListSlidePanel
                isActive={activeSlide === slides.indexOf("special")}
                footer={
                  <div className="grid grid-cols-3 mt-6 pt-4 shrink-0">
                    <StrokeArrowLeftIcon
                      className="cursor-pointer text-right"
                      onClick={onClose}
                      size={20}
                    />
                    <span className="text-primary text-center">
                      کالای خاصی در نظر دارید؟
                    </span>
                  </div>
                }
              >
                <h3 className="font-bold text-error-medium text-xl mb-8 shrink-0">
                  فروش ویژه
                </h3>

                <div className="space-y-8 overflow-y-auto flex-1 min-h-0">
                  {specialProducts.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">
                      محصول فروش ویژه‌ای در این ناحیه یافت نشد
                    </p>
                  ) : (
                    specialProducts.map((product) => (
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
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                                <Image
                                  src={
                                    product.seller.profileImage ||
                                    "/assets/images/fallback/no-photo.jpg"
                                  }
                                  fill
                                  alt={
                                    product.seller.storeName ||
                                    product.seller.name
                                  }
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm text-gray-600 truncate">
                                {product.seller.storeName ||
                                  product.seller.name}
                              </span>
                            </div>
                            {remainingTime && (
                              <span className="text-error-medium tabular-nums shrink-0">
                                {remainingTime}
                              </span>
                            )}
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
                                    {product.formattedPrice ||
                                      Number(product.finalPrice).toLocaleString(
                                        "fa-IR",
                                      )}{" "}
                                    تومان
                                  </span>
                                </div>
                                {product.discountPercent > 0 && (
                                  <span className="text-gray-400 line-through text-sm">
                                    {Number(product.price).toLocaleString(
                                      "fa-IR",
                                    )}{" "}
                                    تومان
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="font-bold">قیمت نامشخص</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ProductsListSlidePanel>
            </SwiperSlide>
          )}

          {showOrders && (
            <SwiperSlide className="flex items-center h-full">
              <ProductsListSlidePanel
                isActive={activeSlide === slides.indexOf("orders")}
                footer={
                  <div className="grid grid-cols-[0.1fr_1.8fr_0.1fr] mt-6 pt-4 shrink-0">
                    <StrokeArrowLeftIcon
                      className="text-center cursor-pointer"
                      onClick={onClose}
                      size={20}
                    />
                    <span className="text-gray-600 text-center">
                      کاربر محترم در صورتی که امکان مراجعه به فروشگاه را ندارید،
                      با{" "}
                      <button
                        type="button"
                        onClick={handleShippingChangeSupport}
                        className="cursor-pointer text-primary"
                      >
                        درخواست تغییر در شیوه ارسال
                      </button>{" "}
                      سفارش را دریافت کنید.
                    </span>
                  </div>
                }
              >
                <h3 className="font-bold text-primary text-xl mb-8 shrink-0">
                  سفارشات <span className="font-extralight">(خرید حضوری)</span>
                </h3>

                <div className="space-y-8 overflow-y-auto flex-1 min-h-0">
                  {purchasedProducts.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">
                      سفارشی در این ناحیه یافت نشد
                    </p>
                  ) : (
                    purchasedProducts.map((product) => (
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
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={
                                    product.seller.profileImage ||
                                    "/assets/images/fallback/no-photo.jpg"
                                  }
                                  width={32}
                                  height={32}
                                  alt={
                                    product.seller.storeName ||
                                    product.seller.name
                                  }
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm text-gray-600 truncate">
                                {product.seller.storeName ||
                                  product.seller.name}
                              </span>
                            </div>
                            {product.orderHistory?.userNote && (
                              <button
                                type="button"
                                onClick={() => handleNoteClick(product)}
                                aria-label="مشاهده یادداشت"
                              >
                                <NoteIcon className="text-gray-600 cursor-pointer w-6 h-6" />
                              </button>
                            )}
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
                              <span className="font-bold">
                                {product.orderHistory?.statusLabel ??
                                  "آماده تحویل"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ProductsListSlidePanel>
            </SwiperSlide>
          )}
        </Swiper>
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
          "یادداشت کاربر: لطفا محصول را در بسته بندی تیره قرار دهید. ممنون!"}
      </DialogWrapper>
    </div>
  );
}
