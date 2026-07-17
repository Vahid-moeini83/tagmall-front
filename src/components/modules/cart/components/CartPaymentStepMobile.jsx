"use client";

import { useState } from "react";
import { Radio } from "@/components/ui/radio";
import { formatPrice } from "@/lib/client/utils";
import { checkoutOrder } from "@/lib/server/actions/cart";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import { HintIcon } from "@/icons";
import CartMobileInvoice from "./CartMobileInvoice";

function CartPaymentStepMobile({
  walletBalance,
  isWalletSufficient,
  billSummary,
  totalAmount,
  addressId,
  onPaymentSuccess,
  setOrderId,
}) {
  const [paymentMethod, setPaymentMethod] = useState("gateway");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const token = await getToken();

    if (!token) {
      toast.error("لطفا ابتدا وارد شوید");
      setIsProcessing(false);
      return;
    }

    if (!addressId) {
      toast.error("لطفا آدرس تحویل را انتخاب کنید");
      setIsProcessing(false);
      return;
    }

    const bodyData = {
      payment_method: paymentMethod,
      address_id: addressId,
    };

    const { checkoutRes, checkoutErr } = await checkoutOrder(token, bodyData);

    if (checkoutRes) {
      if (setOrderId && checkoutRes?.order_number) {
        setOrderId(checkoutRes?.order?.id);
      }
      onPaymentSuccess?.();
    } else if (checkoutErr) {
      toast.error("خطا در ثبت سفارش");
    }

    setIsProcessing(false);
  };

  return (
    <div className="pb-46">
      <div className="space-y-7">
        <h3 className="font-bold text-gray-600">شیوه پرداخت:</h3>
        <div className="space-y-4">
          <Radio
            name="payment"
            value="gateway"
            checked={paymentMethod === "gateway"}
            onChange={() => setPaymentMethod("gateway")}
            className="gap-5 mr-4"
            label={"درگاه بانکی"}
          />

          <div className="w-full h-[2px] bg-gray-200" />

          <Radio
            name="payment"
            value="wallet"
            checked={paymentMethod === "wallet"}
            onChange={() => setPaymentMethod("wallet")}
            className="gap-5 mr-4"
            disabled={!isWalletSufficient}
            label={"کیف پول اعتباری"}
          />
        </div>

        <div className="flex items-center gap-5 text-gray-600 mr-4">
          <HintIcon size={20} className="text-gray-800 shrink-0" />
          <span>موجودی کیف پول اعتباری {formatPrice(walletBalance)} تومان</span>
        </div>
      </div>

      <div className="fixed right-0 left-0 bottom-18 z-40 bg-white px-[10px] py-4 space-y-3">
        <CartMobileInvoice billSummary={billSummary} />
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full border-2 border-primary text-primary font-bold py-2.5 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <SpinnerLoading size={20} className="border-primary" />
              <span>در حال پردازش...</span>
            </>
          ) : paymentMethod === "gateway" ? (
            "پرداخت از درگاه بانکی"
          ) : (
            "پرداخت از کیف پول اعتباری"
          )}
        </button>
      </div>
    </div>
  );
}

export default CartPaymentStepMobile;
