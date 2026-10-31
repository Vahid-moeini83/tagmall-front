import Image from "next/image";
import Link from "next/link";
import SellerHeader from "./SellerHeader";
import { SellerUserIcon, ToteBagIcon } from "@/icons";

const ORDER_ITEMS = [
  {
    image: "/assets/images/seller/poco-1.png",
    variant: "مشکی | ۲۵۶ گیگ",
    quantity: "۱ عدد",
  },
  {
    image: "/assets/images/seller/poco-2.png",
    variant: "مشکی | ۲۵۶ گیگ",
    quantity: "۱ عدد",
  },
  {
    image: "/assets/images/seller/poco-3.png",
    variant: "مشکی | ۲۵۶ گیگ",
    quantity: "۱ عدد",
  },
  {
    image: "/assets/images/seller/poco-4.png",
    variant: "مشکی | ۲۵۶ گیگ",
    quantity: "۱ عدد",
  },
];

function SellerOrderDetail({ orderId = "DM-۴۸۱۹" }) {
  return (
    <div className="mx-auto flex w-full max-w-[1140px] flex-1 flex-col gap-6 px-4 pb-28 pt-5 sm:p-6 lg:p-10 lg:pb-10">
      <div className="hidden lg:block">
        <SellerHeader />
      </div>

      <div className="mx-auto flex w-full flex-col gap-6 lg:max-w-[1058px]">
        <section
          dir="ltr"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6"
        >
          <article
            dir="rtl"
            className="rounded-card bg-surface p-5 lg:h-[252px] lg:p-6"
          >
            <div className="flex h-10 items-center gap-3 border-b border-border-subtle pb-4 text-text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <SellerUserIcon size={20} />
              </span>
              <h2 className="text-h5 font-semibold">اطلاعات خریدار</h2>
            </div>
            <dl className="mt-4 flex flex-col gap-2 text-small leading-[26px] text-text-primary">
              <div>
                <dt className="inline">نام خریدار: </dt>
                <dd className="inline">سهراب سپهری</dd>
              </div>
              <div>
                <dt className="inline">شماره تماس: </dt>
                <dd className="inline" dir="ltr">
                  ۰۹۰۲۹۳۲۰۹۱۸
                </dd>
              </div>
              <div>
                <dt className="inline">آدرس تحویل: </dt>
                <dd className="inline">
                  تهران، خیابان ولیعصر، نرسیده به میدان ونک، کوچه حمید، پلاک ۱۲
                </dd>
              </div>
              <div>
                <dt className="inline">کد پستی: </dt>
                <dd className="inline">۷۴۷۴۱۴۴۸۵۷</dd>
              </div>
            </dl>
          </article>

          <article
            dir="rtl"
            className="rounded-card bg-surface p-5 lg:h-[252px] lg:p-6"
          >
            <div className="flex h-10 items-center gap-3 border-b border-border-subtle pb-4 text-text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <ToteBagIcon size={20} />
              </span>
              <h2 className="text-h5 font-semibold">اطلاعات کلی سفارش</h2>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-small leading-[26px] text-text-primary">
              <p className="flex items-center gap-3">
                <span>شماره سفارش: {orderId}</span>
                <span className="flex h-[30px] w-[107px] items-center justify-center rounded-md bg-secondary-50 text-[14px] font-normal text-secondary">
                  در انتظار تأیید
                </span>
              </p>
              <p>تاریخ ثبت: ۳۰ مرداد ۱۴۰۵ ساعت ۱۲:۲۴</p>
              <p>روش تحویل: تحویل در فروشگاه</p>
              <p>تعهد ارسال: آماده‌سازی و ارسال در ۱ روز کاری</p>
            </div>
          </article>
        </section>

        <section className="rounded-card bg-surface p-5 lg:h-[451px] lg:p-6">
          <h2 className="mb-4 text-h5 font-semibold text-text-primary">
            اقلام سفارش
          </h2>
          <div className="overflow-x-auto">
            <div className="min-w-[850px]">
              <div className="grid h-[46px] grid-cols-[64px_minmax(190px,1fr)_130px_80px_140px_140px_104px] items-center justify-items-center rounded-xl bg-surface-muted px-4 text-center text-caption font-semibold text-text-muted">
                <span>تصویر</span>
                <span>نام محصول و کد کالا</span>
                <span>تنوع/ویژگی</span>
                <span>تعداد</span>
                <span>قیمت واحد (تومان)</span>
                <span>قیمت کل (تومان)</span>
                <span>لیبل محصول</span>
              </div>
              {ORDER_ITEMS.map((item, index) => (
                <div
                  key={item.image}
                  className="grid h-[68px] grid-cols-[64px_minmax(190px,1fr)_130px_80px_140px_140px_104px] items-center justify-items-center border-b border-border-subtle px-4 text-center text-small text-text-primary last:border-0"
                >
                  <Image
                    src={item.image}
                    alt="گوشی شیائومی پوکو X6 پرو ۵G"
                    width={44}
                    height={44}
                    className="h-11 w-11 justify-self-center rounded-lg object-cover"
                  />
                  <div className="flex flex-col items-center gap-0.5 text-center">
                    <span>گوشی شیائومی پوکو X6 پرو ۵G</span>
                    <span className="text-caption text-text-muted">
                      DKP-۴۲۱
                    </span>
                  </div>
                  <span className="text-text-muted">{item.variant}</span>
                  <span>{item.quantity}</span>
                  <span>۱۷,۴۹۰,۰۰۰</span>
                  <span>۱۷,۴۹۰,۰۰۰</span>
                  <button
                    type="button"
                    aria-label={`مشاهده لیبل محصول ${index + 1}`}
                    className="flex h-8 w-8 items-center justify-center justify-self-center rounded-lg bg-surface-subtle text-primary"
                  >
                    <Image src="/assets/icons/seller/order-label.svg" alt="" width={20} height={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer
          dir="ltr"
          className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="/seller/orders"
            className="inline-flex h-[46px] items-center justify-center rounded-xl border border-border-default bg-surface px-5 text-small text-text-primary"
          >
            لغو سفارش
          </Link>
          <div dir="ltr" className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="h-[46px] rounded-xl bg-primary px-6 text-small font-semibold text-white"
            >
              چاپ لیبل بسته‌بندی
            </button>
            <button
              type="button"
              className="h-[46px] rounded-xl bg-success-strong px-6 text-small font-semibold text-white"
            >
              ثبت کد رهگیری
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SellerOrderDetail;
