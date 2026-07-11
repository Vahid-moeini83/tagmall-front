"use client";

export default function ReceiptStepThree() {
  return (
    <div className="space-y-4">
      <p className="text-center font-iransans text-base text-success-medium">
        خرید شما با موفقیت انجام شد؛ با تشکر از اعتماد به ما
      </p>

      <button
        type="button"
        className="w-full cursor-pointer rounded-full border-2 border-primary py-2.5 text-center font-iransans text-base text-primary"
      >
        به اشتراک گذاری تجربه خرید از فروشنده
      </button>
    </div>
  );
}
