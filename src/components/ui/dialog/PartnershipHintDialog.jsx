import ResponsiveModal from "@/components/ui/responsive-modal";

function PartnershipHintDialog({ open, setIsHintBoxOpen }) {
  return (
    <ResponsiveModal
      isOpen={open}
      onClose={() => setIsHintBoxOpen(false)}
      title="مشارکت در فروش"
      isHintBox
    >
      <div className="text-gray-600 text-sm lg:text-base leading-7 text-justify">
        <p className="leading-10 text-justify font-extralight">
          با به اشتراک گذاری لینک فروش محصولات،{" "}
          <span className="font-bold">یک درصد از فروش هر کالا</span> را بهره مند
          شوید.
        </p>

        <p className="leading-8 text-justify font-extralight mt-2 mb-4">
          لینک مشارکت فروش هر کالا برای شما اختصاصی می باشد.
        </p>

        <div className="space-y-2">
          <h3 className="font-bold text-gray-600">
            بررسی بازدهی لینک های به اشتراک گذاشته شده:
          </h3>
          <p className="leading-10 text-justify font-extralight">
            با بررسی لینک های به اشتراک گذاشته شده؛ عملکرد بهتر و سود بیشتری کسب
            کنید.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-gray-600">
            محاسبه و پرداخت سود مشارکت در فروش:
          </h3>
          <p className="leading-10 text-justify font-extralight">
            با توجه به امکان مرجوع شدن کالا توسط خریدار سود مشارکت در فروش پس از
            پایان <span className="text-primary">فرصت مرجوع شدن کالا</span> به
            حساب شما واریز می شود.
          </p>
        </div>
      </div>
    </ResponsiveModal>
  );
}

export default PartnershipHintDialog;
