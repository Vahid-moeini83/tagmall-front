"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpDownIcon, NoteIcon, ReceiptIcon, VerifyIcon } from "@/icons";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FilterOrdersDrawer, OrderStatusFilterDialog } from "..";
import { getToken } from "@/lib/server/cookies";
import { useRouter } from "next/navigation";
import usePublicStore from "@/app/store/publicStore";
import toast from "react-hot-toast";
import { createConversation } from "@/lib/server/actions/support";
import { getUserOrders } from "@/lib/server/actions/cart";
import { formatRelativeTime } from "@/lib/client/utils";
import { OrderItemsSkeleton } from "@/components/ui/loading/cart";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const sortOptions = [
  { id: "pickup", label: "خرید حضوری" },
  { id: "shipping", label: "خرید آنلاین" },
];

const statusOptions = [
  { id: "delivered", label: "تحویل داده شده" },
  { id: "sending", label: "در حال ارسال" },
];

function SupportOrders({ initialOrders }) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState([]);
  const [orderType, setOrderType] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const observer = useRef();

  const router = useRouter();

  const setLoginOpen = usePublicStore((state) => state.setLoginOpen);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleFilterToggle = (filterId) => {
    setExpandedFilter((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const getFilterLabel = () => {
    if (!orderType) return "انتخاب کنید";
    const option = sortOptions.find((o) => o.id === orderType);
    return option?.label || "";
  };

  const getStatusLabel = () => {
    if (!orderStatus) return "انتخاب کنید";
    const option = statusOptions.find((o) => o.id === orderStatus);
    return option?.label || "";
  };

  // Filter orders based on selected filters
  const filteredOrders = orders.filter((order) => {
    // Filter by delivery type (only if filter is selected)
    const matchesDeliveryType = !orderType || order.delivery_type === orderType;

    // Filter by status (only if filter is selected)
    let matchesStatus = true;
    if (orderStatus === "delivered") {
      matchesStatus = order.status === "delivered";
    } else if (orderStatus === "sending") {
      matchesStatus =
        order.status === "shipped" || order.status === "processing";
    }

    return matchesDeliveryType && matchesStatus;
  });

  // Handle click on support button
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
        toast.error("Error connecting to support");
      }
    } else if (createConversationErr) {
      toast.error("Error connecting to support");
    }
  };

  // Fetch user orders
  const fetchOrders = useCallback(
    async (pageNumber = 1) => {
      if (isLoadingOrders) return;

      setIsLoadingOrders(true);

      const token = await getToken();

      const { ordersRes, ordersErr } = await getUserOrders(token, pageNumber);

      if (ordersRes) {
        const newOrders = ordersRes.data || [];
        const flattenedOrders = newOrders.flatMap((order) =>
          (order.items || []).map((item) => ({
            ...item,
            order_id: order.id,
            order_number: order.order_number,
            created_at: order.created_at,
          })),
        );

        setOrders((prev) =>
          pageNumber === 1 ? flattenedOrders : [...prev, ...flattenedOrders],
        );

        const currentPage = ordersRes.meta?.current_page || 1;
        const lastPage = ordersRes.meta?.last_page || 1;

        setHasMore(currentPage < lastPage);
      } else if (ordersErr) {
        toast.error("Error fetching user orders");
      }

      setIsLoadingOrders(false);
    },
    [isLoadingOrders],
  );

  // Find last el to load more data after it
  const lastOrderElementRef = useCallback(
    (node) => {
      if (isLoadingOrders) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;

          setPage(nextPage);
          fetchOrders(nextPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingOrders, hasMore, page, fetchOrders],
  );

  // Initialize orders from server-side data
  useEffect(() => {
    if (initialOrders) {
      const newOrders = initialOrders.data || [];
      const flattenedOrders = newOrders.flatMap((order) =>
        (order.items || []).map((item) => ({
          ...item,
          order_id: order.id,
          order_number: order.order_number,
          created_at: order.created_at,
        })),
      );

      setOrders(flattenedOrders);

      const currentPage = initialOrders.meta?.current_page || 1;
      const lastPage = initialOrders.meta?.last_page || 1;

      setHasMore(currentPage < lastPage);
      setPage(currentPage);
    }
  }, [initialOrders]);

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
                  وضعیت سفارش ({getStatusLabel()})
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
              {isLoadingOrders && orders.length === 0 ? (
                <OrderItemsSkeleton isMobile={!isDesktop} />
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  سفارشی با این فیلترها یافت نشد
                </div>
              ) : (
                filteredOrders.map((product, index) => {
                  return (
                    <div
                      key={product.id}
                      ref={
                        filteredOrders.length === index + 1
                          ? lastOrderElementRef
                          : null
                      }
                      className={`pb-1 lg:pb-8 lg:mx-4 xl:mx-8 ${filteredOrders.length - 1 === index ? "" : "lg:border-b-2 lg:border-gray-100"}`}
                    >
                      {/* Mobile layout */}
                      <div className="lg:hidden flex flex-col gap-1">
                        {/* Seller and Timer */}
                        <div className="flex items-center justify-between pb-3">
                          <div className="flex items-center gap-2 mr-1">
                            <Image
                              src={
                                product?.store_avatar ??
                                "/assets/images/fallback/avatar.png"
                              }
                              width={40}
                              height={40}
                              alt="seller"
                              className="rounded-md object-cover"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 line-clamp-1 max-w-[160px]">
                                {product?.store_name}
                              </span>
                              <VerifyIcon size={20} />
                            </div>
                          </div>
                          <span className="text-gray-400 text-xs">
                            بروزرسانی {formatRelativeTime(product?.created_at)}
                          </span>
                        </div>

                        {/* Product Details Box */}
                        <div className="flex gap-3">
                          <div className="relative w-25 h-25 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={
                                product?.image ||
                                "/assets/images/fallback/no-photo.jpg"
                              }
                              fill
                              alt={product.product_name}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-gray-600 line-clamp-1 text-xs mb-0!">
                                {product?.product_name}
                              </p>
                              <ReceiptIcon
                                size={20}
                                onClick={() => setNoteDialogOpen(true)}
                                className="cursor-pointer ml-4"
                              />
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 text-xs">
                              <span className="font-bold">تعداد</span>
                              <span>{product.quantity} عدد</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 text-xs">
                              <span className="font-bold">وضعیت</span>
                              <span>{product?.status}</span>
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
                                product?.image ||
                                "/assets/images/fallback/no-photo.jpg"
                              }
                              fill
                              alt={product.product_name}
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
                                  product?.store_avatar ??
                                  "/assets/images/fallback/avatar.png"
                                }
                                width={48}
                                height={48}
                                alt="seller"
                                className="rounded-lg object-cover"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  {product?.store_name}
                                </span>
                                <VerifyIcon size={20} />
                              </div>
                            </div>
                            <ReceiptIcon size={20} className="cursor-pointer" />
                          </div>

                          {/* Product Info */}
                          <div className="w-full space-y-4">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-gray-600 line-clamp-1 mb-0!">
                                {product.product_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <span className="font-bold">تعداد</span>
                              <span>{product.quantity}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="flex items-center gap-1">
                                <span className="font-bold">وضعیت</span>
                                <span>{product?.status}</span>
                              </div>
                              <span className="text-gray-400">
                                بروزرسانی{" "}
                                {formatRelativeTime(product?.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {isLoadingOrders && orders.length > 0 && (
              <div className="mt-6">
                <OrderItemsSkeleton isMobile={!isDesktop} />
              </div>
            )}

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
