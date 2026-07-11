"use client";

import Image from "next/image";
import { VerifyIcon, ReceiptIcon } from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

import ResponsiveModal from "@/components/ui/responsive-modal";
import { getToken } from "@/lib/server/cookies";
import { getOrderById, getUserOrders } from "@/lib/server/actions/cart";
import toast from "react-hot-toast";
import { formatRelativeTime } from "@/lib/client/utils";
import { OrderItemsSkeleton } from "@/components/ui/loading/cart";
import usePublicStore from "@/app/store/publicStore";

function OrderItems({ isMobile = false, orderId }) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const openReceiptDrawer = usePublicStore((s) => s.openReceiptDrawer);

  const fetch = async () => {
    setIsLoading(true);
    const token = await getToken();
    const { orderRes, orderErr } = await getOrderById(token, orderId);
    if (orderRes) {
      console.log(orderRes);
      setOrderData(orderRes.data);
    } else if (orderErr) {
      toast.error("خطا در نمایش سفارش");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (orderId) {
      fetch();
    }
  }, [orderId]);

  // تبدیل آیتم‌های API به فرمت مورد استفاده در UI
  const orderItems =
    orderData?.items?.map((item) => {
      const deliveryTypeLabel =
        item.delivery_method === "pickup" ? "خرید حضوری" : "خرید آنلاین";

      return {
        id: item.id,
        name: item.product_name,
        img: item.image,
        quantityValue: item.quantity ?? 1,
        quantity: item.quantity === 1 ? "یک عدد" : `${item.quantity} عدد`,
        seller: {
          name: item.store_name,
          profileImage: "/assets/images/fallback/avatar.png", // API تصویر فروشنده نداده
        },
        status: `${item.status_label || "در حال بررسی"} (${deliveryTypeLabel})`,
        lastUpdate: orderData?.created_at
          ? formatRelativeTime(orderData?.created_at)
          : "نامشخص",
      };
    }) || [];

  const handleOpenReceipt = () => {
    openReceiptDrawer({
      orderId: orderData?.id ?? orderId ?? null,
      status: orderItems[0]?.status ?? "آماده تحویل",
      lastUpdate: orderItems[0]?.lastUpdate ?? "نامشخص",
      itemsCount: orderItems.length,
      seller: {
        sellerName: orderItems[0]?.seller?.name ?? "فروشگاه",
        sellerAvatar:
          orderItems[0]?.seller?.profileImage ||
          "/assets/images/fallback/avatar.png",
      },
      items: orderItems.map((item) => ({
        id: String(item.id),
        product_name: item.name,
        quantity: item.quantityValue ?? 1,
        image: item.img || "/assets/images/fallback/no-photo.jpg",
        status: item.status,
        updated_at: orderData?.created_at ?? new Date().toISOString(),
      })),
    });
  };

  return (
    <>
      <div className="block lg:hidden font-iransans text-center text-gray-600 pb-6">
        خرید شما با موفقیت انجام شد؛ با تشکر از اعتماد شما به ما
      </div>
      <Accordion type="single" defaultValue="order-items">
        <AccordionItem value="order-items">
          {!isMobile && (
            <AccordionTrigger
              showArrow={false}
              className="font-bold text-base lg:text-xl text-primary justify-between hover:no-underline"
            >
              سفارشات
            </AccordionTrigger>
          )}
          <AccordionContent className="lg:mt-4">
            {isLoading ? (
              <OrderItemsSkeleton isMobile={isMobile} />
            ) : (
              <>
                <div className="space-y-4 lg:space-y-10">
                  {orderItems.map((product, index) => (
                    <div
                      key={product.id}
                      className={`pb-1 lg:pb-8 lg:mx-4 xl:mx-8 ${orderItems.length - 1 === index ? "" : "lg:border-b-2 lg:border-gray-100"}`}
                    >
                      {isMobile ? (
                        // Mobile Layout
                        <div className="flex flex-col gap-1">
                          {/* Seller and Timer */}
                          <div className="flex items-center justify-between pb-3">
                            <div className="flex items-center gap-2 mr-1">
                              <Image
                                src={
                                  product.seller.profileImage ||
                                  "/assets/images/fallback/avatar.png"
                                }
                                width={40}
                                height={40}
                                alt="seller"
                                className="rounded-md"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 line-clamp-1">
                                  {product.seller.name}
                                </span>
                                <VerifyIcon size={20} />
                              </div>
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
                                <button
                                  type="button"
                                  onClick={handleOpenReceipt}
                                  className="cursor-pointer ml-4"
                                  aria-label="نمایش رسید تحویل"
                                >
                                  <ReceiptIcon size={20} />
                                </button>
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
                                    "/assets/images/fallback/avatar.png"
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
                            </div>

                            {/* Product Info */}
                            <div className="w-full space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-gray-600 line-clamp-1 mb-0!">
                                  {product.name}
                                </p>
                                <button
                                  type="button"
                                  onClick={handleOpenReceipt}
                                  className="cursor-pointer"
                                  aria-label="نمایش رسید تحویل"
                                >
                                  <ReceiptIcon size={20} />
                                </button>
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
                  خرید شما با موفقیت انجام شد؛ با تشکر از اعتماد به ما
                </p>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ResponsiveModal
        isHintBox
        title={"یادداشت"}
        isOpen={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
      >
        <p className="text-gray-600">
          این یک متن تستی برای یادداشت محصول است. می‌توانید یادداشت‌های خود را
          در اینجا مشاهده و ویرایش کنید.
        </p>
      </ResponsiveModal>
    </>
  );
}

export default OrderItems;
