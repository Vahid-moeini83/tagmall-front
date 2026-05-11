import ResponsiveModal from "@/components/ui/responsive-modal";

function PartnershipHintDialog({ open, setIsHintBoxOpen }) {
  return (
    <ResponsiveModal
      isOpen={open}
      onClose={() => setIsHintBoxOpen(false)}
      title="بررسی بازدهی لینک های به اشتراک گذاشته شده"
      isHintBox
    >
      <div className="border-b-2 border-gray-200 pb-3">
        <h3 className="text-xs lg:text-base text-gray-600 font-bold">
          بازدیدها و ثبت سفارش ها
        </h3>
        <p className="text-xs/8 lg:text-sm/8 text-gray-600 mt-3 text-justify">
          با بررسی بازدهی لینک های به اشتراک گذاشته شده؛ می‌توانید عملکرد بهتری
          داشته باشید و سود بیشتری کسب کنید.
          <br />
          شما می‌توانید پس از به اشتراک گذاشتن لینک فروش محصولات، بازدهی لینک ها
          که براساس آمار بازدید و سفارش های ثبت شده است را بررسی کنید
        </p>
      </div>

      <div className="mt-3">
        <h3 className="text-xs lg:text-base text-gray-600 font-bold">
          خرید موفق و سود مشارکت
        </h3>
        <p className="text-xs/8 lg:text-sm/8 text-gray-600 mt-3 text-justify">
          با بررسی بازدهی لینک های به اشتراک گذاشته شده؛ می‌توانید عملکرد بهتری
          داشته باشید و سود بیشتری کسب کنید.
          <br />
          شما می‌توانید پس از به اشتراک گذاشتن لینک فروش محصولات، بازدهی لینک ها
          که براساس آمار بازدید و سفارش های ثبت شده است را بررسی کنید
        </p>
      </div>
    </ResponsiveModal>
  );
}

export default PartnershipHintDialog;
