import DialogWrapper from "./DialogWrapper";

function PartnershipHintDialog({ open, setIsHintBoxOpen }) {
  return (
    <>
      {/* Desktop */}
      <DialogWrapper
        title={"بررسی بازدهی لینک های به اشتراک گذاشته شده"}
        isOpen={open}
        onClose={() => setIsHintBoxOpen(false)}
        hideInMobile={true}
      >
        <div className="border-b-2 border-gray-200">
          <h3 className="text-xs lg:text-base text-gray-600 font-bold">
            بازدیدها و ثبت سفارش ها
          </h3>
          <p className="text-xs/8 lg:text-sm/8 text-gray-600 mt-3 text-justify">
            با بررسی بازدهی لینک های به اشتراک گذاشته شده؛ می‌توانید عملکرد
            بهتری داشته باشید و سود بیشتری کسب کنید.
            <br />
            شما می‌توانید پس از به اشتراک گذاشتن لینک فروش محصولات، بازدهی لینک
            ها که براساس آمار بازدید و سفارش های ثبت شده است را بررسی کنید
          </p>
        </div>
        <div className="mt-3">
          <h3 className="text-xs lg:text-base text-gray-600 font-bold">
            خرید موفق و سود مشارکت
          </h3>
          <p className="text-xs/8 lg:text-sm/8 text-gray-600 mt-3 text-justify">
            با بررسی بازدهی لینک های به اشتراک گذاشته شده؛ می‌توانید عملکرد
            بهتری داشته باشید و سود بیشتری کسب کنید.
            <br />
            شما می‌توانید پس از به اشتراک گذاشتن لینک فروش محصولات، بازدهی لینک
            ها که براساس آمار بازدید و سفارش های ثبت شده است را بررسی کنید
          </p>
        </div>
      </DialogWrapper>

      {/* Mobile */}
      {open && (
        <div className="lg:hidden flex flex-col justify-between flex-1 fixed inset-0 bg-white z-50 px-[10px] pt-6 pb-8">
          <div>
            <h1 className="text-primary font-bold">
              بررسی بازدهی لینک های به اشتراک گذاشته شده
            </h1>
            <div>
              <div className="mt-6 border-b-2 border-gray-200">
                <h3 className="text-xs text-gray-600 font-bold">
                  بازدیدها و ثبت سفارش ها
                </h3>
                <p className="text-xs/8 text-gray-600 mt-3 text-justify">
                  با بررسی بازدهی لینک های به اشتراک گذاشته شده؛ می‌توانید
                  عملکرد بهتری داشته باشید و سود بیشتری کسب کنید.
                  <br />
                  شما می‌توانید پس از به اشتراک گذاشتن لینک فروش محصولات، بازدهی
                  لینک ها که براساس آمار بازدید و سفارش های ثبت شده است را بررسی
                  کنید
                </p>
              </div>
              <div className="mt-3">
                <h3 className="text-xs text-gray-600 font-bold">
                  خرید موفق و سود مشارکت
                </h3>
                <p className="text-xs/8 text-gray-600 mt-3 text-justify">
                  با بررسی بازدهی لینک های به اشتراک گذاشته شده؛ می‌توانید
                  عملکرد بهتری داشته باشید و سود بیشتری کسب کنید.
                  <br />
                  شما می‌توانید پس از به اشتراک گذاشتن لینک فروش محصولات، بازدهی
                  لینک ها که براساس آمار بازدید و سفارش های ثبت شده است را بررسی
                  کنید
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsHintBoxOpen(false)}
              className="text-primary"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PartnershipHintDialog;
