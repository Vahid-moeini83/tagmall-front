"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Radio } from "@/components/ui/radio";
import { formatPrice } from "@/lib/client/utils";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import { checkoutOrder } from "@/lib/server/actions/cart";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";
import { OrderSummarySkeleton } from "@/components/ui/loading/cart";

function OrderSummary({
  isMobile = false,
  isOrderSubmitted = false,
  openAccordion,
  setOpenAccordion,
  invoiceData,
  onPaymentSuccess,
  setOrderId,
}) {
  const [paymentMethod, setPaymentMethod] = useState("gateway");
  const [isProcessing, setIsProcessing] = useState(false);

  const user = invoiceData?.data?.user || {};
  const address = invoiceData?.data?.address || {};
  const invoice = invoiceData?.data?.invoice || {};
  const wallet = invoiceData?.data?.wallet || {};

  const receiverInfo = {
    fullName: user.full_name || "نامشخص",
    phone: user.mobile || "نامشخص",
    address: address.address || "آدرسی ثبت نشده است",
    postalCode: address.postal_code || "نامشخص",
    city: address.city || "",
    province: address.province || "",
  };

  const walletBalance = wallet.balance || 0;
  const totalAmount = invoice.total || 0;
  const isWalletSufficient = walletBalance >= totalAmount;

  const handleCheckout = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const token = await getToken();

    if (!token) {
      toast.error("لطفا ابتدا وارد شوید");
      setIsProcessing(false);
      return;
    }

    if (!address.id) {
      toast.error("لطفا آدرس تحویل را انتخاب کنید");
      setIsProcessing(false);
      return;
    }

    const bodyData = {
      payment_method: paymentMethod,
      address_id: address.id,
    };

    const { checkoutRes, checkoutErr } = await checkoutOrder(token, bodyData);

    console.log(checkoutRes);
    if (checkoutRes) {
      // if (paymentMethod === "wallet" && !checkoutRes?.payment_url) {
      //   toast.success("سفارش با موفقیت ثبت شد");
      //   onPaymentSuccess();
      // } else if (checkoutRes.payment_url) {
      //   // Redirect to payment gateway
      //   // window.location.href = checkoutRes.payment_url;
      //   // return;
      // }

      if (setOrderId && checkoutRes?.order_number) {
        setOrderId(checkoutRes?.order?.id);
      }
      onPaymentSuccess();
    } else if (checkoutErr) {
      toast.error("خطا در ثبت سفارش");
    }

    setIsProcessing(false);
  };

  // Show skeleton while loading invoice data
  if (!invoiceData) {
    return (
      <Accordion
        type="single"
        collapsible={isMobile ? false : true}
        value={
          isMobile ? "order-summary" : isOrderSubmitted ? openAccordion : ""
        }
        onValueChange={setOpenAccordion}
      >
        <AccordionItem value="order-summary">
          {!isMobile && (
            <AccordionTrigger
              className="font-bold text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer"
              disabled={!isOrderSubmitted}
              showArrow={isOrderSubmitted}
            >
              صورت حساب
            </AccordionTrigger>
          )}
          <AccordionContent className="lg:mt-4">
            <OrderSummarySkeleton isMobile={isMobile} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible={isMobile ? false : true}
      value={isMobile ? "order-summary" : isOrderSubmitted ? openAccordion : ""}
      onValueChange={setOpenAccordion}
    >
      <AccordionItem value="order-summary">
        {!isMobile && (
          <AccordionTrigger
            className="font-bold text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer"
            disabled={!isOrderSubmitted}
            showArrow={isOrderSubmitted}
          >
            صورت حساب
          </AccordionTrigger>
        )}
        <AccordionContent className="lg:mt-4">
          <div className="space-y-6">
            {/* Receiver and Orders Header */}
            <div className="flex items-center justify-between">
              <span className="font-bold lg:text-xl text-primary lg:text-gray-600">
                تحویل گیرنده
              </span>
            </div>

            {/* Receiver Information */}
            <div className="space-y-6 lg:border-b-2 lg:border-gray-200 pb-4">
              <div className="text-gray-600">
                <span className="font-bold">نام و نام خانوادگی:</span>{" "}
                {receiverInfo.fullName}
              </div>
              <div className="text-gray-600">
                <span className="font-bold">شماره تماس:</span>{" "}
                {receiverInfo.phone}
              </div>
              <div className="text-gray-600">
                <span className="font-bold">آدرس:</span>{" "}
                {receiverInfo.province && `${receiverInfo.province} - `}
                {receiverInfo.city && `${receiverInfo.city} - `}
                {receiverInfo.address}
              </div>
              <div className="text-gray-600">
                <span className="font-bold">کدپستی:</span>{" "}
                {receiverInfo.postalCode}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6 lg:space-y-4">
              <h3 className="lg:text-xl font-bold text-primary lg:text-gray-600 pr-2 lg:pr-0">
                روش پرداخت
              </h3>
              <div className="space-y-6 lg:space-y-4">
                {/* Bank Gateway */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <Radio
                    name="payment"
                    value="gateway"
                    checked={paymentMethod === "gateway"}
                    onChange={() => setPaymentMethod("gateway")}
                    className="mt-1"
                  />
                  <span className="text-gray-600">پرداخت از درگاه بانکی</span>
                </label>

                {/* Line */}
                <div className="hidden lg:block w-full h-[2px] bg-gray-200 mr-8" />

                {/* Wallet */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <Radio
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                    className="mt-1"
                    disabled={!isWalletSufficient}
                  />
                  <span
                    className={
                      isWalletSufficient ? "text-gray-600" : "text-gray-400"
                    }
                  >
                    پرداخت از کیف پول اعتباری (موجودی{" "}
                    {formatPrice(walletBalance)} تومان)
                  </span>
                </label>
              </div>
            </div>

            {/* Final Payment Info */}
            <div className="fixed right-0 left-0 bottom-26 lg:static text-center lg:mt-[114px]">
              <button
                onClick={handleCheckout}
                className="text-primary cursor-pointer lg:text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center mx-auto"
                disabled={isProcessing || (!isMobile && !isOrderSubmitted)}
              >
                {isProcessing ? (
                  <>
                    <SpinnerLoading size={20} className="border-primary" />
                    <span>در حال پردازش...</span>
                  </>
                ) : (
                  <>
                    {paymentMethod === "gateway"
                      ? "پرداخت از درگاه بانکی"
                      : "پرداخت از کیف پول اعتباری"}{" "}
                    (مبلغ {formatPrice(totalAmount)} تومان)
                  </>
                )}
              </button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default OrderSummary;
