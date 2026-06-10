"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  VerifyIcon,
  NoteIcon,
  MinusIcon,
  PlusIcon,
  SquarePlusIcon2,
} from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { formatPrice } from "@/lib/client/utils";
import ResponsiveModal from "@/components/ui/responsive-modal";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import {
  updateCartItem,
  deleteCartItem,
  getCartItemNotes,
} from "@/lib/server/actions/cart";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";

function CartItems({
  handleNextStep,
  isMobile = false,
  cartData,
  onCartUpdate,
  isSubmitting,
}) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedItemNotes, setSelectedItemNotes] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});
  const [localQuantities, setLocalQuantities] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});
  const [deletedItems, setDeletedItems] = useState(new Set());

  // فیلتر کردن آیتم‌های حذف شده از cartData
  const items = Array.isArray(cartData?.data)
    ? cartData.data.filter((item) => !deletedItems.has(item.id))
    : [];
  const summary = cartData?.summary || {};

  // محاسبه قیمت کل بر اساس تعداد محلی
  const calculateLocalTotal = () => {
    let subtotal = 0;
    let shippingTotal = 0;

    items.forEach((item) => {
      const quantity = localQuantities[item.id] ?? item.quantity;
      const itemTotal = parseFloat(item.unit_price) * quantity;
      const shippingCost =
        item.delivery_type === "shipping"
          ? parseFloat(item.shipping_cost) * quantity
          : 0;

      subtotal += itemTotal;
      shippingTotal += shippingCost;
    });

    return {
      subtotal,
      shippingTotal,
      total: subtotal + shippingTotal,
      items_count: items.reduce(
        (acc, item) => acc + (localQuantities[item.id] ?? item.quantity),
        0,
      ),
    };
  };

  const localSummary =
    Object.keys(localQuantities).length > 0 ? calculateLocalTotal() : summary;

  const handleQuantityChange = (itemId, currentQuantity, action) => {
    const current = localQuantities[itemId] ?? currentQuantity;

    // اگر تعداد 1 هست و minus زده شد، حذف کن
    if (current === 1 && action === "decrease") {
      handleDeleteItem(itemId);
      return;
    }

    const newQuantity = action === "increase" ? current + 1 : current - 1;

    if (newQuantity < 0) return;

    setLocalQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    setPendingChanges((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  const handleDeleteItem = async (itemId) => {
    setIsUpdating((prev) => ({ ...prev, [itemId]: true }));

    const token = await getToken();
    if (!token) {
      toast.error("لطفا ابتدا وارد شوید");
      setIsUpdating((prev) => ({ ...prev, [itemId]: false }));
      return;
    }

    const { deleteCartItemRes, deleteCartItemErr } = await deleteCartItem(
      token,
      itemId,
    );

    if (deleteCartItemErr) {
      toast.error("خطا در حذف محصول");
      return;
    }

    toast.success("محصول از سبد خرید حذف شد");

    // اضافه کردن آیتم به لیست حذف شده‌ها برای حذف فوری از UI
    setDeletedItems((prev) => new Set([...prev, itemId]));

    // حذف از local quantities و pending changes
    setLocalQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[itemId];
      return newQuantities;
    });

    setPendingChanges((prev) => {
      const newChanges = { ...prev };
      delete newChanges[itemId];
      return newChanges;
    });

    // به‌روزرسانی داده‌های سبد خرید از سرور
    if (onCartUpdate) await onCartUpdate();

    setIsUpdating((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleShowNotes = async (itemId) => {
    const token = await getToken();
    if (!token) {
      toast.error("لطفا ابتدا وارد شوید");
      return;
    }

    const { notesRes, notesErr } = await getCartItemNotes(token, itemId);

    if (notesRes) {
      setSelectedItemNotes(notesRes.data || []);
      setNoteDialogOpen(true);
    } else if (notesErr) {
      toast.error("خطا در دریافت یادداشت‌ها");
    }
  };

  const syncCartChanges = async () => {
    const token = await getToken();

    if (!token) {
      toast.error("لطفا ابتدا وارد شوید");
      return false;
    }

    try {
      setIsUpdating((prev) => ({ ...prev, syncing: true }));

      for (const [itemId, quantity] of Object.entries(pendingChanges)) {
        if (quantity === 0) {
          await deleteCartItem(token, itemId);
        } else {
          await updateCartItem(token, itemId, {
            quantity,
          });
        }
      }

      if (onCartUpdate) {
        await onCartUpdate();
      }

      setPendingChanges({});

      return true;
    } catch {
      toast.error("خطا در بروزرسانی سبد خرید");
      return false;
    } finally {
      setIsUpdating({});
    }
  };

  const handleConfirmCart = async () => {
    const synced = await syncCartChanges();

    if (synced) {
      handleNextStep();
    }
  };

  useEffect(() => {
    const quantities = {};

    const currentItems = Array.isArray(cartData?.data) ? cartData.data : [];

    currentItems.forEach((item) => {
      quantities[item.id] = item.quantity;
    });

    setLocalQuantities(quantities);

    // پاک کردن لیست حذف شده‌ها وقتی cartData به‌روز میشه
    setDeletedItems(new Set());
  }, [cartData]);

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
              سبد خرید ( {localSummary.items_count || 0} کالا )
            </AccordionTrigger>
          )}
          <AccordionContent className="lg:mt-4 ">
            {items.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                سبد خرید شما خالی است
              </div>
            ) : (
              <div className={isMobile ? "space-y-4" : "space-y-10"}>
                {items.map((item, index) => {
                  const product = item.product || {};
                  const seller = item.seller || {};
                  const store = item.store || {};
                  const isOnline = item.delivery_type === "shipping";

                  return (
                    <div
                      key={item.id}
                      className={`${isMobile ? "pb-4" : "pb-8"} ${items.length - 1 === index ? "" : "border-b-2 border-gray-100"}`}
                    >
                      {isMobile ? (
                        <div className="flex flex-col gap-1">
                          {/* Seller and Timer */}
                          <div className="flex items-center justify-between pb-3">
                            <div className="flex items-center gap-2 mr-1">
                              <Image
                                src={
                                  seller.avatar ||
                                  "/assets/images/fallback/avatar.png"
                                }
                                width={40}
                                height={40}
                                alt="seller"
                                className="rounded-md"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  {seller.name || store.name}
                                </span>
                                <VerifyIcon size={20} />
                              </div>
                            </div>
                          </div>

                          {/* Product Row */}
                          <div className="flex gap-3">
                            {/* Image + Compare Icon */}
                            <div className="flex flex-col justify-between items-center">
                              <div className="relative w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={
                                    product.image ||
                                    "/assets/images/fallback/no-photo.jpg"
                                  }
                                  fill
                                  alt={product.name}
                                  className="object-cover"
                                />
                              </div>
                              <SquarePlusIcon2
                                size={20}
                                className="text-primary mb-2"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col gap-3">
                              <div className="flex justify-between mt-4">
                                {/* Product Name */}
                                <p className="font-bold text-gray-600 line-clamp-2 text-xs leading-5">
                                  {product.name}
                                </p>
                                {item.notes && item.notes.length > 0 && (
                                  <NoteIcon
                                    size={20}
                                    color="#000000"
                                    className="cursor-pointer ml-[10px]"
                                    onClick={() => handleShowNotes(item.id)}
                                  />
                                )}
                              </div>

                              {/* Price + Controls Row */}
                              <div className="flex items-center justify-between gap-2">
                                {/* Price & Shipping */}
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-gray-600">
                                      قیمت:
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {formatPrice(item.unit_price)} تومان
                                    </span>
                                  </div>
                                  {isOnline && item.shipping_cost > 0 && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs font-bold text-gray-600">
                                        هزینه ارسال:
                                      </span>
                                      <span className="text-xs font-bold text-gray-600">
                                        {formatPrice(item.shipping_cost)} تومان
                                      </span>
                                    </div>
                                  )}
                                  {!isOnline && (
                                    <span className="text-xs font-bold text-gray-600">
                                      (خرید حضوری)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Accessories + Actions */}
                              <div className="flex items-center justify-between mt-1 gap-3">
                                <div className="flex items-center gap-1 cursor-pointer">
                                  <span className="text-primary font-bold text-xs">
                                    لوازم جانبی و قطعات مرتبط
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="flex items-center gap-1 border-2 border-gray-200 rounded-md px-2 py-1.5">
                                    {isUpdating[item.id] &&
                                    (localQuantities[item.id] ??
                                      item.quantity) === 1 ? (
                                      <SpinnerLoading
                                        size={20}
                                        className="border-error-medium"
                                      />
                                    ) : (
                                      <MinusIcon
                                        size={20}
                                        onClick={() =>
                                          !isUpdating[item.id] &&
                                          handleQuantityChange(
                                            item.id,
                                            item.quantity,
                                            "decrease",
                                          )
                                        }
                                        className={`cursor-pointer ${
                                          (localQuantities[item.id] ??
                                            item.quantity) === 1
                                            ? "text-error-medium"
                                            : "text-gray-800"
                                        } ${isUpdating[item.id] ? "opacity-50" : ""}`}
                                      />
                                    )}

                                    <span className="text-gray-600 min-w-[24px] text-center select-none text-sm">
                                      {localQuantities[item.id] ??
                                        item.quantity}
                                    </span>

                                    <PlusIcon
                                      size={20}
                                      onClick={() =>
                                        !isUpdating[item.id] &&
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity,
                                          "increase",
                                        )
                                      }
                                      className={`text-primary cursor-pointer`}
                                    />
                                  </div>
                                </div>
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
                                  product.image ||
                                  "/assets/images/fallback/no-photo.jpg"
                                }
                                fill
                                alt={product.name}
                                className="object-contain"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-start justify-start gap-6">
                            {/* Seller Info */}
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={
                                    seller.avatar ||
                                    "/assets/images/fallback/avatar.png"
                                  }
                                  width={48}
                                  height={48}
                                  alt="seller"
                                  className="rounded-lg"
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">
                                    {seller.name || store.name}
                                  </span>
                                  <VerifyIcon size={20} />
                                 </div>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="pr-14 w-full">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-gray-600 line-clamp-1 mb-4">
                                  {product.name}
                                </p>
                                {item.notes && item.notes.length > 0 && (
                                  <NoteIcon
                                    size={20}
                                    color="#000000"
                                    className="cursor-pointer mb-4 ml-3"
                                    onClick={() => handleShowNotes(item.id)}
                                  />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <p>
                                  <span className="font-bold">قیمت</span>
                                  <span>
                                    {formatPrice(item.unit_price)} تومان
                                  </span>
                                  {isOnline && item.shipping_cost > 0 && (
                                    <span>
                                      {" "}
                                      و{" "}
                                      <span className="font-bold">
                                        هزینه ارسال
                                      </span>
                                      <span className="mr-0.5">
                                        {formatPrice(item.shipping_cost)} تومان
                                      </span>
                                    </span>
                                  )}
                                  {!isOnline && (
                                    <span className="text-gray-600">
                                      {" "}
                                      (خرید حضوری)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Related Accessories + Actions */}
                            <div className="flex items-center justify-between w-full pr-3.5">
                              <div className="flex items-center gap-4 cursor-pointer">
                                <SquarePlusIcon2
                                  size={20}
                                  className="text-primary"
                                />
                                <span className="text-primary">
                                  لوازم جانبی و قطعات مرتبط
                                </span>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center px-3 py-2 gap-1 border-2 border-gray-200 rounded-md">
                                  {isUpdating[item.id] &&
                                  (localQuantities[item.id] ??
                                    item.quantity) === 1 ? (
                                    <SpinnerLoading
                                      size={20}
                                      className="border-error-medium"
                                    />
                                  ) : (
                                    <MinusIcon
                                      size={20}
                                      onClick={() =>
                                        !isUpdating[item.id] &&
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity,
                                          "decrease",
                                        )
                                      }
                                      className={`cursor-pointer ${
                                        (localQuantities[item.id] ??
                                          item.quantity) === 1
                                          ? "text-error-medium"
                                          : "text-gray-800"
                                      } ${isUpdating[item.id] ? "opacity-50" : ""}`}
                                    />
                                  )}

                                  <span className="text-gray-600 min-w-[30px] text-center select-none">
                                    {localQuantities[item.id] ?? item.quantity}
                                  </span>

                                  <PlusIcon
                                    size={20}
                                    onClick={() =>
                                      !isUpdating[item.id] &&
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity,
                                        "increase",
                                      )
                                    }
                                    className={`text-primary cursor-pointer ${isUpdating[item.id] ? "opacity-50" : ""}`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {items.length > 0 && (
              <div className="fixed bg-white right-0 left-0 bottom-18 py-4 lg:static flex items-center justify-center lg:justify-end lg:pl-[140px] lg:mt-4">
                <button
                  onClick={handleConfirmCart}
                  className="lg:text-xl text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={items.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <SpinnerLoading size={20} className="border-primary" />
                      <span>در حال پردازش</span>
                    </>
                  ) : (
                    <>
                      ثبت سفارش ( مبلغ {formatPrice(localSummary.total || 0)}{" "}
                      تومان )
                    </>
                  )}
                </button>
              </div>
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
        {selectedItemNotes.length > 0 ? (
          <div className="space-y-3">
            {selectedItemNotes.map((note) => (
              <div
                key={note.id}
                className="text-gray-600 leading-7 text-justify border-b pb-3 last:border-0"
              >
                {note.body}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 leading-7 text-justify">
            یادداشتی برای این محصول ثبت نشده است.
          </p>
        )}
      </ResponsiveModal>
    </>
  );
}

export default CartItems;
