"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeftIcon, SupportIcon } from "@/icons";
import { useCallback, useMemo, useRef, useState } from "react";
import { FilterOrdersDrawer, OrderStatusFilterDialog } from "..";
import { getToken } from "@/lib/server/cookies";
import { useRouter } from "next/navigation";
import usePublicStore from "@/app/store/publicStore";
import toast from "react-hot-toast";
import { createConversation } from "@/lib/server/actions/support";
import { buildSupportConversation } from "../utils/conversation";
import { getUserOrders } from "@/lib/server/actions/cart";
import { SupportOrdersSkeleton } from "@/components/ui/loading/support";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SupportOrderCard from "./SupportOrderCard";
import SupportOrderDesktop from "./SupportOrderDesktop";
import { getOrderStatusLabel } from "./OrderStatusFilterContent";

const sortOptions = [
  { id: "pickup", label: "خرید حضوری" },
  { id: "shipping", label: "خرید آنلاین" },
];

const statusMatchers = {
  processing: ["processing", "در حال پردازش"],
  ready_to_ship: ["ready_to_ship", "ready_to_send", "آماده ارسال"],
  ready_for_pickup: ["ready_for_pickup", "ready_for_delivery", "آماده تحویل"],
  shipped: ["shipped", "sending", "in_transit", "ارسال شده", "در حال ارسال"],
  delivered: ["delivered", "تحویل داده شده"],
  returned: ["returned", "refunded", "مرجوع شده"],
};

function matchesOrderStatus(item, orderStatus) {
  const slug = String(item.status_slug ?? item.status ?? "").toLowerCase();
  const label = String(item.status ?? "");
  const targets = statusMatchers[orderStatus] ?? [];

  return targets.some(
    (target) =>
      slug === target.toLowerCase() ||
      label === target ||
      label.includes(target),
  );
}

function matchesDateRange(createdAt, fromDate, toDate) {
  if (!fromDate && !toDate) return true;
  if (!createdAt) return true;

  const orderDate = new Date(createdAt);
  if (Number.isNaN(orderDate.getTime())) return true;

  if (fromDate) {
    const from = fromDate.toDate();
    from.setHours(0, 0, 0, 0);
    if (orderDate < from) return false;
  }

  if (toDate) {
    const to = toDate.toDate();
    to.setHours(23, 59, 59, 999);
    if (orderDate > to) return false;
  }

  return true;
}

function mapOrdersFromApi(ordersList = []) {
  return ordersList.map((order) => {
    const items = order.items || [];
    const firstItem = items[0] || {};

    return {
      order_id: order.id ?? order.order_id,
      order_number: order.order_number,
      created_at: order.created_at,
      store_name: firstItem.store_name ?? order.store_name ?? "نامشخص",
      store_avatar:
        firstItem.store_avatar ??
        order.store_avatar ??
        "/assets/images/fallback/avatar.png",
      delivery_type:
        firstItem.delivery_type ?? order.delivery_type ?? "shipping",
      items: items.map((item) => ({
        id: item.id,
        product_name: item.product_name ?? item.product?.name ?? "نامشخص",
        image:
          item.image ??
          item.product?.image ??
          "/assets/images/fallback/no-photo.jpg",
        quantity: item.quantity ?? 1,
        status: item.status_label ?? item.status ?? "نامشخص",
        status_slug: item.status,
        updated_at: item.updated_at ?? order.created_at,
        delivery_type: item.delivery_type ?? item.delivery_method,
      })),
    };
  });
}

function SupportOrders({ initialOrders }) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState([]);
  const [orderType, setOrderType] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [orders, setOrders] = useState(() =>
    mapOrdersFromApi(initialOrders?.data ?? []),
  );
  const [page, setPage] = useState(initialOrders?.meta?.current_page ?? 1);
  const [hasMore, setHasMore] = useState(() => {
    const currentPage = initialOrders?.meta?.current_page ?? 1;
    const lastPage = initialOrders?.meta?.last_page ?? 1;
    return currentPage < lastPage;
  });
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const observer = useRef();
  const isLoadingRef = useRef(false);

  const router = useRouter();

  const setLoginOpen = usePublicStore((state) => state.setLoginOpen);
  const openConversation = usePublicStore((state) => state.openConversation);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleFilterToggle = (filterId) => {
    setExpandedFilter((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const getStatusLabel = () => getOrderStatusLabel(orderStatus);

  const hasFiltersChanged = () =>
    orderStatus !== null || fromDate !== null || toDate !== null;

  const handleResetFilters = () => {
    setOrderStatus(null);
    setFromDate(null);
    setToDate(null);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesDeliveryType =
        !orderType || order.delivery_type === orderType;

      const matchesStatus =
        !orderStatus ||
        order.items.some((item) => matchesOrderStatus(item, orderStatus));

      const matchesDate = matchesDateRange(order.created_at, fromDate, toDate);

      return matchesDeliveryType && matchesStatus && matchesDate;
    });
  }, [orders, orderType, orderStatus, fromDate, toDate]);

  const handleSupport = async () => {
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
        openConversation(buildSupportConversation(conversationId));
        router.push(`/support?conversationId=${conversationId}&tab=chats`, {
          scroll: false,
        });
      } else {
        toast.error("Error connecting to support");
      }
    } else if (createConversationErr) {
      toast.error("Error connecting to support");
    }
  };

  const fetchOrders = useCallback(async (pageNumber = 1) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoadingOrders(true);

    const token = await getToken();

    if (!token) {
      isLoadingRef.current = false;
      setIsLoadingOrders(false);
      return;
    }

    const { ordersRes, ordersErr } = await getUserOrders(token, pageNumber);

    if (ordersRes) {
      const nextOrders = mapOrdersFromApi(ordersRes.data || []);

      setOrders((prev) =>
        pageNumber === 1 ? nextOrders : [...prev, ...nextOrders],
      );

      const currentPage = ordersRes.meta?.current_page || 1;
      const lastPage = ordersRes.meta?.last_page || 1;

      setHasMore(currentPage < lastPage);
      setPage(currentPage);
    } else if (ordersErr) {
      toast.error("Error fetching user orders");
    }

    isLoadingRef.current = false;
    setIsLoadingOrders(false);
  }, []);

  const lastOrderElementRef = useCallback(
    (node) => {
      if (isLoadingOrders || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          fetchOrders(page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingOrders, hasMore, page, fetchOrders],
  );

  return (
    <>
      <Accordion type="single" collapsible defaultValue="chats">
        <AccordionItem value="chats">
          <AccordionTrigger className="hidden lg:flex font-bold! text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
            پیگیری سفارشات
          </AccordionTrigger>
          <AccordionContent className="lg:mt-4">
            <div className="hidden lg:flex items-center gap-0">
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

              <div className="px-4 border-l-2 border-gray-200">
                <button
                  onClick={() => setIsStatusDialogOpen(true)}
                  className="text-primary shrink-0 cursor-pointer"
                >
                  وضعیت سفارش ({getStatusLabel()})
                </button>
              </div>

              <div className="px-4 border-l-2 border-gray-200">
                <button className="text-primary shrink-0 cursor-pointer">
                  جست و جوی سفارش
                </button>
              </div>

              <div className="pr-4">
                <button
                  onClick={handleSupport}
                  className="font-iransans font-semibold! text-primary shrink-0 cursor-pointer"
                >
                  ارتباط با واحد پشتیبانی
                </button>
              </div>
            </div>

            <button
              type="button"
              className="mb-[10px] mt-4 flex w-full cursor-pointer items-center justify-between px-[10px] lg:hidden"
              onClick={() => setIsFiltersDrawerOpen(true)}
            >
              <span className="text-primary">
                <span className="font-bold">سفارشات</span>{" "}
                <span className="font-extralight">{getStatusLabel()}</span>
              </span>
              <ChevronLeftIcon size={16} className="shrink-0 ml-[15px]" />
            </button>

            <div className="space-y-[5px] lg:space-y-10 lg:mt-10">
              {isLoadingOrders && orders.length === 0 ? (
                <div className="lg:px-0">
                  <SupportOrdersSkeleton isMobile={!isDesktop} />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 px-[10px] lg:px-0">
                  سفارشی با این فیلترها یافت نشد
                </div>
              ) : (
                filteredOrders.map((order, index) => (
                  <div
                    key={order.order_id ?? order.order_number}
                    ref={
                      filteredOrders.length === index + 1
                        ? lastOrderElementRef
                        : null
                    }
                    className={`lg:pb-8 lg:mx-4 xl:mx-8 ${filteredOrders.length - 1 === index ? "" : "lg:border-b-2 lg:border-gray-100"}`}
                  >
                    <div className="lg:hidden">
                      <SupportOrderCard
                        order={order}
                        isLast={filteredOrders.length - 1 === index}
                      />
                    </div>
                    <div className="hidden lg:block">
                      <SupportOrderDesktop order={order} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {isLoadingOrders && orders.length > 0 && (
              <div className="flex justify-center py-6">
                <SpinnerLoading size={28} className="border-primary" />
              </div>
            )}

            <div className="lg:hidden fixed bottom-17 right-0 left-0 bg-white py-4 px-[10px] flex justify-center items-center z-10">
              <button
                type="button"
                onClick={handleSupport}
                className="font-iransans font-semibold text-primary cursor-pointer border-2 border-primary py-2 rounded-full w-full flex items-center justify-center gap-2"
              >
                <SupportIcon size={20} />
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
        orderStatus={orderStatus}
        onStatusChange={setOrderStatus}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        hasFiltersChanged={hasFiltersChanged}
        onResetFilters={handleResetFilters}
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
