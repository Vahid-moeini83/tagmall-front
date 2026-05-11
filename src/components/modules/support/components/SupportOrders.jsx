"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpDownIcon, NoteIcon, VerifyIcon } from "@/icons";
import Image from "next/image";
import { useState } from "react";
import { FilterOrdersDrawer, OrderStatusFilterDialog } from "..";
import { getToken } from "@/lib/server/cookies";
import { useRouter } from "next/navigation";
import usePublicStore from "@/app/store/publicStore";
import toast from "react-hot-toast";
import { createConversation } from "@/lib/server/actions/support";

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

const sortOptions = [
  { id: "in-person", label: "خرید حضوری" },
  { id: "online", label: "خرید آنلاین" },
];

function SupportOrders() {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState([]);
  const [orderType, setOrderType] = useState("in-person");
  const [orderStatus, setOrderStatus] = useState("sending");

  const router = useRouter();

  const setLoginOpen = usePublicStore((state) => state.setLoginOpen);

  const handleFilterToggle = (filterId) => {
    setExpandedFilter((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const getFilterLabel = () => {
    const option = sortOptions.find((o) => o.id === orderType);
    return option?.label || "";
  };

  const handleSupport = async () => {
    const token = await getToken();

    if (!token) {
      setLoginOpen(true);
      return;
    }

    const bodyData = {
      department: 2, // For support chat
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

  return (
    <>
      <Accordion type="single" collapsible defaultValue="chats">
        <AccordionItem value="chats">
          <AccordionTrigger className="hidden lg:flex font-bold! text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
            پیگیری سفارشات
          </AccordionTrigger>
          <AccordionContent className="lg:mt-4">
            {/* Filters (Desktop) */}
            <div className="hidden lg:flex items-center gap-0">
              {/* Sort Options */}
              <div className="flex items-center gap-5 pl-[18px] border-l-2 border-gray-200">
                <span className="text-gray-800 shrink-0">نوع سفارش:</span>

                <div className="flex items-center gap-5">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setOrderType(option.id)}
                      className={`transition-all shrink-0 cursor-pointer ${
                        orderType === option.id
                          ? "text-primary"
                          : "text-gray-600 hover:opacity-80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order situation */}
              <div className="px-4 border-l-2 border-gray-200">
                <button
                  onClick={() => setIsStatusDialogOpen(true)}
                  className="text-primary shrink-0 cursor-pointer"
                >
                  وضعیت سفارش ثبت شده
                </button>
              </div>

              {/* Search order */}
              <div className="px-4 border-l-2 border-gray-200">
                <button className="text-primary shrink-0 cursor-pointer">
                  جست و جوی سفارش
                </button>
              </div>

              {/* Support */}
              <div className="pr-4">
                <button
                  onClick={handleSupport}
                  className="font-iransans font-semibold! text-primary shrink-0 cursor-pointer"
                >
                  ارتباط با واحد پشتیبانی
                </button>
              </div>
            </div>

            {/* Filters (Mobile) */}
            <div
              className="lg:hidden text-xs flex items-center gap-2 mt-6 mb-8 pr-2 cursor-pointer"
              onClick={() => setIsFiltersDrawerOpen(true)}
            >
              <ArrowUpDownIcon size={20} />
              <span>نوع سفارش: {getFilterLabel()}</span>
            </div>

            <div className="space-y-4 lg:space-y-10 lg:mt-10">
              {mockOrderItems.map((product, index) => (
                <div
                  key={product.id}
                  className={`pb-1 lg:pb-8 lg:mx-4 xl:mx-8 ${mockOrderItems.length - 1 === index ? "" : "lg:border-b-2 lg:border-gray-100"}`}
                >
                  {/* Mobile layout */}
                  <div className="lg:hidden flex flex-col gap-3">
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
                            className="cursor-pointer ml-4"
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

                  {/* Desktop layout */}
                  <div className="hidden lg:grid grid-cols-2">
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
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {product.seller.name}
                            </span>
                            <VerifyIcon size={20} />
                          </div>
                        </div>
                        <NoteIcon size={20} className="cursor-pointer" />
                      </div>

                      {/* Product Info */}
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-gray-600 line-clamp-1 mb-0!">
                            {product.name}
                          </p>
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
                </div>
              ))}
            </div>
            <div className="lg:hidden fixed bottom-17 right-0 left-0 bg-white py-4 flex justify-center items-center">
              <button className="font-iransans font-semibold text-primary cursor-pointer">
                ارتباط با واحد پشتیبانی
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <FilterOrdersDrawer
        isOpen={isFiltersDrawerOpen}
        onClose={() => setIsFiltersDrawerOpen(false)}
        expandedFilter={expandedFilter}
        onFilterToggle={handleFilterToggle}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        orderStatus={orderStatus}
        onStatusChange={setOrderStatus}
      />
      <OrderStatusFilterDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        selectedStatus={orderStatus}
        onConfirm={(status) => {
          setOrderStatus(status);
          setIsStatusDialogOpen(false);
        }}
      />
    </>
  );
}

export default SupportOrders;
