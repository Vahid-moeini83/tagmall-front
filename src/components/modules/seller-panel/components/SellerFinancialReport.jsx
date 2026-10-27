"use client";

import { Fragment, useState } from "react";
import DateRangeFilterContent from "@/components/ui/date-range/DateRangeFilterContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SellerHeader from "./SellerHeader";
import SellerStats from "./SellerStats";
import SellerSalesChart from "./SellerSalesChart";
import { ListIcon } from "@/icons";

const PERIODS = ["امروز", "این هفته", "این ماه", "۳ ماه اخیر", "سفارشی"];
const REPORT_DATE = 14050530;
const PERIOD_START = {
  امروز: REPORT_DATE,
  "این هفته": 14050524,
  "این ماه": 14050501,
  "۳ ماه اخیر": 14050301,
};

function dateKey(date) {
  return date ? date.year * 10000 + date.month.number * 100 + date.day : null;
}
const CATEGORIES = [
  { label: "دیجیتال (۵۵٪)", color: "bg-primary" },
  { label: "پوشاک (۲۵٪)", color: "bg-secondary" },
  { label: "خانه و آشپزخانه (۲۰٪)", color: "bg-success-strong" },
];
const TRANSACTIONS = [
  {
    id: "settlement",
    type: "income",
    description: "تسویه بابت سفارش",
    order: "DM-۴۸۱۹",
    amount: "۱,۴۹۰,۰۰۰",
    balance: "۹۸,۲۰۰,۰۰۰",
  },
  {
    id: "commission",
    type: "expense",
    description: "سهم پلتفرم بابت سفارش",
    order: "DM-۴۸۱۹",
    amount: "۱۳۴,۰۰۰",
    balance: "۹۶,۷۱۰,۰۰۰",
  },
];
const CONTROL_STYLE =
  "rounded-md text-[13px] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none";

export default function SellerFinancialReport() {
  const [period, setPeriod] = useState("امروز");
  const [filterOpen, setFilterOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [type, setType] = useState("all");
  const [filters, setFilters] = useState({ type: "all", from: null, to: null });

  // Only the two transactions supplied by the design are available locally.
  const rows = TRANSACTIONS.filter(
    (row) =>
      (filters.type === "all" || row.type === filters.type) &&
      (!filters.from || filters.from <= REPORT_DATE) &&
      (!filters.to || filters.to >= REPORT_DATE),
  );

  const applyFilters = () => {
    if (fromDate && toDate && fromDate.toUnix() > toDate.toUnix()) return;
    if (fromDate || toDate) setPeriod("سفارشی");
    setFilters({
      type,
      from: dateKey(fromDate),
      to: dateKey(toDate),
    });
    setFilterOpen(false);
  };

  return (
    <div className="flex-1 bg-surface-muted bg-pattern-diagonal-fine">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 pb-24 pt-8 lg:min-h-[1032px] lg:px-10 lg:pb-10 lg:pt-10">
        <SellerHeader />

        {/* Keep the reference's physical order while preserving Persian text direction. */}
        <section
          aria-label="بازه زمانی گزارش مالی"
          className="flex min-h-16 flex-wrap items-center justify-between gap-4 rounded-xl bg-surface p-4"
          dir="ltr"
        >
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`flex items-center gap-2 text-text-secondary hover:text-primary ${CONTROL_STYLE}`}
          >
            <ListIcon size={20} className="text-primary" />
            <span dir="rtl">فیلترهای پیشرفته</span>
          </button>
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="انتخاب بازه زمانی"
          >
            {PERIODS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={period === item}
                onClick={() => {
                  setPeriod(item);
                  if (item === "سفارشی") {
                    setFilterOpen(true);
                  } else {
                    setFromDate(null);
                    setToDate(null);
                    setFilters((current) => ({
                      ...current,
                      from: PERIOD_START[item],
                      to: REPORT_DATE,
                    }));
                  }
                }}
                className={`h-8 px-3 ${CONTROL_STYLE} ${item === period ? "bg-primary-50 font-bold text-primary" : "bg-surface-subtle text-text-secondary hover:bg-primary-50"} ${item === "سفارشی" ? "border border-border-default" : ""}`}
                dir="rtl"
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <SellerStats variant="financial" />

        <div className="flex flex-wrap gap-5" dir="ltr">
          <SellerSalesChart variant="financial" />
          <section
            aria-labelledby="revenue-category-title"
            className="flex h-[310px] min-w-[min(100%,300px)] flex-[22] flex-col gap-4 rounded-card bg-surface p-6"
            dir="rtl"
          >
            <h2
              id="revenue-category-title"
              className="text-body font-semibold leading-[25px]"
            >
              درآمد بر اساس دسته‌بندی
            </h2>
            <div className="border-t border-border-subtle" />
            <div
              className="relative flex h-[205px] items-center justify-center gap-5"
              dir="ltr"
            >
              <div
                className="flex shrink-0 flex-col items-end gap-2 text-[11px] leading-[17px] text-text-secondary"
                dir="rtl"
              >
                {CATEGORIES.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div
                role="img"
                aria-label="نمودار سهم فروش دسته‌بندی‌ها"
                className="flex size-[100px] shrink-0 items-center justify-center rounded-full bg-revenue-share"
              >
                <div className="size-[70px] rounded-full bg-surface-subtle" />
              </div>
              <p
                className="absolute left-1/2 top-[34px] -translate-x-full text-caption font-bold"
                dir="rtl"
              >
                سهم فروش
              </p>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="financial-transactions-title"
          className="flex flex-col gap-4 rounded-card bg-surface p-6"
        >
          <div className="flex min-h-[25px] items-center justify-between gap-4">
            <h2
              id="financial-transactions-title"
              className="text-body font-semibold leading-[25px]"
            >
              ریزشبک تراکنش‌ها
            </h2>
            <p className="text-small text-text-muted">نمایش ۱۰ تراکنش اخیر</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] table-fixed border-separate border-spacing-0 text-small">
              <caption className="sr-only">
                تراکنش‌های مالی فروشگاه در بازه انتخاب‌شده
              </caption>
              <colgroup>
                <col className="w-[136px]" />
                <col />
                <col className="w-[26%]" />
                <col className="w-[31%]" />
              </colgroup>
              <thead className="h-11 bg-surface-subtle text-[13px] leading-5 text-text-muted">
                <tr>
                  <th
                    scope="col"
                    className="rounded-r-lg px-4 text-right font-normal"
                  >
                    تاریخ
                  </th>
                  <th scope="col" className="text-right font-normal">
                    شرح تراکنش
                  </th>
                  <th scope="col" className="text-center font-normal">
                    مبلغ تراکنش
                  </th>
                  <th
                    scope="col"
                    className="rounded-l-lg pl-12 text-center font-normal"
                  >
                    مانده پس از تراکنش
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <Fragment key={row.id}>
                    <tr aria-hidden="true">
                      <td colSpan={4} className="h-4 p-0" />
                    </tr>
                    <tr className="h-[55px]">
                      <td className="border-b border-border-subtle px-4 text-text-secondary">
                        ۳۰ مرداد ۱۴۰۵
                      </td>
                      <td className="border-b border-border-subtle text-right">
                        {row.description} <bdi>{row.order}</bdi>
                      </td>
                      <td
                        className={`border-b border-border-subtle text-center font-semibold ${row.type === "income" ? "text-success-strong" : "text-error"}`}
                      >
                        <span className="inline-flex gap-1" dir="ltr">
                          <span>تومان</span>
                          <span>
                            {row.amount}
                            {row.type === "income" ? "+" : "−"}
                          </span>
                        </span>
                      </td>
                      <td className="border-b border-border-subtle pl-12 text-center font-semibold">
                        {row.balance} تومان
                      </td>
                    </tr>
                  </Fragment>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-text-muted"
                    >
                      تراکنشی در این بازه پیدا نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="theme-new max-h-[80dvh] overflow-y-auto bg-surface"
            overlayClassName="theme-new"
            dir="rtl"
          >
            <DialogHeader>
              <DialogTitle>فیلترهای گزارش مالی</DialogTitle>
              <DialogDescription>
                بازه زمانی و نوع تراکنش را انتخاب کنید.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-5">
              <DateRangeFilterContent
                variant="seller"
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
              />
              {fromDate && toDate && fromDate.toUnix() > toDate.toUnix() && (
                <p role="alert" className="text-small text-error">
                  تاریخ پایان باید پس از تاریخ شروع باشد.
                </p>
              )}
              <div className="flex flex-col gap-2 text-small">
                <label htmlFor="financial-transaction-type">نوع تراکنش</label>
                <select
                  id="financial-transaction-type"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="h-12 rounded-md border border-border-default bg-surface-subtle px-3"
                >
                  <option value="all">همه تراکنش‌ها</option>
                  <option value="income">واریز</option>
                  <option value="expense">برداشت</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={applyFilters}
                  className={`bg-primary px-5 py-3 text-text-on-primary ${CONTROL_STYLE}`}
                >
                  اعمال فیلترها
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFromDate(null);
                    setToDate(null);
                    setType("all");
                    setPeriod("امروز");
                    setFilters({ type: "all", from: null, to: null });
                    setFilterOpen(false);
                  }}
                  className={`border border-border-default px-5 py-3 ${CONTROL_STYLE}`}
                >
                  حذف فیلترها
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
