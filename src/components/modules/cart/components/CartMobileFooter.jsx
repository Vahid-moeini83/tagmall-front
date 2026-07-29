"use client";

import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import CartMobileInvoice from "./CartMobileInvoice";

function CartMobileFooter({ billSummary, onSubmit, isSubmitting, disabled }) {
  return (
    <div className="fixed right-0 left-0 bottom-18 z-40 bg-white px-[10px] pt-4 pb-[10px] space-y-3">
      <CartMobileInvoice billSummary={billSummary} />

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || isSubmitting}
        className="w-full border-2 border-primary text-primary font-bold text-sm py-3 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <SpinnerLoading size={20} className="border-primary" />
            <span>در حال پردازش...</span>
          </>
        ) : (
          "ثبت سفارش"
        )}
      </button>
    </div>
  );
}

export default CartMobileFooter;
