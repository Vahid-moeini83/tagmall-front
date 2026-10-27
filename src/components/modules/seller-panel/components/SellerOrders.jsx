"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  EditIcon,
  MessageTextIcon,
  SearchIcon,
} from "@/icons";

const ORDERS = [
  { id: "DM-۴۸۱۹", date: "۵ دقیقه پیش", buyer: "سهراب سپهری", items: "۳ کالا", method: "پرداخت آنلاین", promise: "۱ روز کاری", status: "در انتظار تأیید" },
  { id: "DM-۴۸۱۸", date: "۱۵ دقیقه پیش", buyer: "نیما یوشیج", items: "۱ کالا", method: "کارت به کارت", promise: "کارت به کارت", status: "ارسال شده" },
  { id: "DM-۴۸۱۷", date: "۲ ساعت پیش", buyer: "سیمین بهبهانی", items: "۵ کالا", method: "کیف پول", promise: "کیف پول", status: "تحویل داده شده" },
  { id: "DM-۴۸۱۶", date: "دیروز", buyer: "پروین اعتصامی", items: "۲ کالا", method: "پرداخت آنلاین", promise: "پرداخت آنلاین", status: "لغو شده" },
  { id: "DM-۴۸۱۵", date: "۲۸ مرداد ۱۴۰۵", buyer: "جلال آل احمد", items: "۴ کالا", method: "پرداخت آنلاین", promise: "پرداخت آنلاین", status: "در حال پردازش" },
  { id: "DM-۴۸۱۴", date: "۲۷ مرداد ۱۴۰۵", buyer: "فروغ فرخزاد", items: "۱ کالا", method: "پرداخت آنلاین", promise: "پرداخت آنلاین", status: "تحویل داده شده" },
  { id: "DM-۴۸۱۳", date: "۲۷ مرداد ۱۴۰۵", buyer: "هوشنگ ابتهاج", items: "۲ کالا", method: "کارت به کارت", promise: "کارت به کارت", status: "در حال پردازش" },
  { id: "DM-۴۸۱۲", date: "۲۶ مرداد ۱۴۰۵", buyer: "مهدی اخوان ثالث", items: "۸ کالا", method: "کیف پول", promise: "کیف پول", status: "ارسال شده" },
  { id: "DM-۴۸۱۱", date: "۲۵ مرداد ۱۴۰۵", buyer: "احمد شاملو", items: "۳ کالا", method: "پرداخت آنلاین", promise: "پرداخت آنلاین", status: "تحویل داده شده" },
  { id: "DM-۴۸۱۰", date: "۲۴ مرداد ۱۴۰۵", buyer: "شهریار تبریزی", items: "۱ کالا", method: "پرداخت آنلاین", promise: "پرداخت آنلاین", status: "لغو شده" },
];

const ORDER_STATUSES = [
  { label: "همه سفارشات", count: "۱۴۸" },
  { label: "در انتظار تأیید", count: "۱۲" },
  { label: "در حال پردازش", count: "۲۴" },
  { label: "ارسال شده", count: "۸۵" },
  { label: "تحویل داده شده", count: "۲۲" },
  { label: "لغو شده", count: "۵" },
];

const STATUS_STYLES = {
  "در انتظار تأیید": "bg-secondary-100 text-secondary",
  "در حال پردازش": "bg-secondary-100 text-secondary",
  "ارسال شده": "bg-primary-100 text-primary",
  "تحویل داده شده": "bg-success-light text-success",
  "لغو شده": "bg-error-light text-error",
};

const TABLE_COLUMNS = [
  "شماره سفارش",
  "تاریخ ثبت",
  "نام خریدار",
  "تعداد اقلام",
  "روش تحویل",
  "تعهد ارسال / تحویل",
  "وضعیت",
  "عملیات",
];

const formatNumber = (value) => new Intl.NumberFormat("fa-IR").format(value);

function SellerOrders() {
  const [activeStatus, setActiveStatus] = useState("همه سفارشات");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const visibleOrders = useMemo(() => {
    const normalizedQuery = query.trim();

    return ORDERS.filter((order) => {
      const matchesStatus =
        activeStatus === "همه سفارشات" || order.status === activeStatus;
      const matchesQuery =
        !normalizedQuery ||
        order.id.includes(normalizedQuery) ||
        order.buyer.includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [activeStatus, query]);

  return (
    <div className="mx-auto flex w-full max-w-[1140px] flex-1 flex-col gap-6 px-4 pb-28 pt-5 sm:p-6 lg:p-10 lg:pb-10">
      <header className="hidden flex-col gap-1 text-right lg:flex">
        <h1 className="text-h4 font-semibold text-text-primary">پنل فروشگاه تگ مال</h1>
        <p className="text-caption text-text-muted">امروز ۳۰ مرداد ماه ۱۴۰۵ ساعت ۱۲:۲۴</p>
      </header>

      <section aria-label="وضعیت سفارش‌ها" className="flex gap-2 overflow-x-auto pb-1 lg:justify-start">
        {ORDER_STATUSES.map((status) => {
          const isActive = activeStatus === status.label;

          return (
            <button
              key={status.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveStatus(status.label)}
              className={`inline-flex h-[43px] shrink-0 items-center gap-2 rounded-lg border px-4 text-small font-semibold transition-colors ${isActive ? "border-primary bg-primary text-white" : "border-border-default bg-surface text-text-primary hover:bg-surface-subtle"}`}
            >
              <span className={`rounded-md px-1.5 py-0.5 text-caption ${isActive ? "bg-white/20 text-white" : "bg-surface-muted text-text-primary"}`}>
                {status.count}
              </span>
              {status.label}
            </button>
          );
        })}
      </section>

      <div className="flex flex-col gap-6">
        <section aria-label="جستجو و فیلتر سفارش‌ها" dir="ltr" className="mx-auto flex w-full flex-col gap-3 rounded-xl bg-surface p-4 lg:h-[72px] lg:max-w-[1060px] lg:flex-row lg:items-center lg:gap-3 lg:rounded-2xl lg:bg-surface lg:p-4">
          <button type="button" dir="ltr" className="flex h-10 shrink-0 items-center justify-between rounded-[15px] border border-border-default bg-surface px-4 text-small text-text-primary lg:w-[280px]">
            <ChevronDownIcon size={20} className="text-text-secondary" />
            <span dir="rtl" className="flex-1 text-right">تهران</span>
          </button>
          <button type="button" dir="ltr" className="flex h-10 shrink-0 items-center justify-between rounded-[15px] border border-border-default bg-surface px-4 text-small text-text-primary lg:w-[280px]">
            <ChevronDownIcon size={20} className="text-text-secondary" />
            <span dir="rtl" className="flex-1 text-right">تهران</span>
          </button>
          <label dir="rtl" className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-xl bg-surface-muted px-4 text-text-muted lg:w-[444px] lg:flex-none">
            <SearchIcon size={20} className="shrink-0" />
            <input
              aria-label="جستجو در شماره سفارش یا نام خریدار"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجو در شماره سفارش، نام خریدار"
              className="min-w-0 flex-1 bg-transparent text-small text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>
        </section>

        <section aria-label="فهرست سفارش‌ها" className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-card lg:h-[700px] lg:rounded-[20px] lg:border-0 lg:p-6 lg:shadow-none">
          <div className="overflow-x-auto">
            <div className="min-w-[940px]">
              <div className="grid h-11 grid-cols-[140px_110px_100px_100px_110px_125px_108px_100px] items-center justify-between rounded-xl bg-surface-muted px-4 text-caption font-semibold text-text-muted lg:rounded-lg lg:text-[13px] lg:leading-5">
                {TABLE_COLUMNS.map((column) => <span key={column} className={column === "عملیات" ? "lg:text-center" : ""}>{column}</span>)}
              </div>

              <div className="mt-1 lg:mt-0 lg:space-y-1">
                {visibleOrders.map((order) => (
                  <div key={order.id} className="grid h-[56px] grid-cols-[140px_110px_100px_100px_110px_125px_108px_100px] items-center justify-between border-b border-border-subtle px-4 text-small text-text-primary last:border-b-0 lg:h-[52px] lg:border-border-default lg:last:border-b">
                    <Link href={`/seller/orders/${encodeURIComponent(order.id)}`} dir="ltr" className="text-right font-semibold text-primary hover:underline">{order.id}</Link>
                    <span>{order.date}</span>
                    <span>{order.buyer}</span>
                    <span>{order.items}</span>
                    <span>{order.method}</span>
                    <span>{order.promise}</span>
                    <span className={`inline-flex h-[27px] w-fit items-center justify-center rounded-[8px] px-3 text-caption font-semibold lg:w-[108px] ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    <span dir="ltr" className="flex items-center justify-center gap-2 lg:gap-3">
                      <button type="button" aria-label={`ویرایش سفارش ${order.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-subtle text-text-primary hover:bg-surface-muted lg:rounded-md">
                        <EditIcon size={20} />
                      </button>
                      <button type="button" aria-label={`پیام درباره سفارش ${order.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-subtle text-text-primary hover:bg-surface-muted lg:rounded-md">
                        <MessageTextIcon size={20} />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <footer dir="ltr" className="mt-5 flex flex-col-reverse items-center justify-between gap-3 text-caption text-text-muted sm:flex-row lg:text-[13px] lg:leading-5">
            <span dir="rtl">نمایش {visibleOrders.length ? "۱" : "۰"} تا {formatNumber(visibleOrders.length)} از ۱۴۸ مورد</span>
            <nav dir="ltr" aria-label="صفحه‌بندی سفارش‌ها" className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} className="h-8 rounded-lg border border-border-default px-3 text-small text-text-primary lg:rounded-md lg:text-[13px] lg:leading-5">قبلی</button>
              <span className="flex items-center gap-1">
                {[1, 2, 3].map((pageNumber) => (
                  <button key={pageNumber} type="button" aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`h-7 min-w-7 rounded-md px-2 text-caption lg:w-7 lg:px-0 lg:rounded-[6px] lg:text-[13px] lg:leading-5 ${page === pageNumber ? "bg-primary text-white" : "bg-surface-muted text-text-primary"}`}>
                    {pageNumber === 1 ? "۱" : pageNumber}
                  </button>
                ))}
                <span className="px-1 lg:px-0">…</span>
                <button type="button" onClick={() => setPage(15)} className="h-7 min-w-7 rounded-md bg-surface-muted px-2 text-caption text-text-primary lg:w-7 lg:px-0 lg:rounded-[6px] lg:text-[13px] lg:leading-5">۱۵</button>
              </span>
              <button type="button" onClick={() => setPage((value) => Math.min(15, value + 1))} className="h-8 rounded-lg border border-border-default px-3 text-small text-text-primary lg:rounded-md lg:text-[13px] lg:leading-5">بعدی</button>
            </nav>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default SellerOrders;
