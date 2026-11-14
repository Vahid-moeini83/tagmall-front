"use client";

import { useState } from "react";
import SellerHeader from "./SellerHeader";
import SellerStats from "./SellerStats";
import ProfileWalletAmountContent from "@/components/modules/profile/components/ProfileWalletAmountContent";
import DateRangeFilterContent, {
  formatDateRangeLabel,
} from "@/components/ui/date-range/DateRangeFilterContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FigmaDropdown } from "@/components/ui/figma-inputs";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CoinFrontSwapIcon,
  CursorClickIcon,
  PlusSimpleIcon,
} from "@/icons";
import { WALLET_TRANSACTIONS, WALLET_STATUS } from "../data/wallet";

const NUMBER = new Intl.NumberFormat("fa-IR");
const CONTROL =
  "transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none";
const COLUMNS =
  "grid grid-cols-[minmax(0,1fr)_130px_110px_100px_140px_140px] items-center gap-3 px-4";

function dateKey(date) {
  return date ? date.year * 10000 + date.month.number * 100 + date.day : null;
}

export default function SellerWallet() {
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [dialog, setDialog] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [range, setRange] = useState({
    from: 14050524,
    to: 14050530,
    label: "۲۴ تا ۳۰ مرداد ۱۴۰۵",
  });
  const [paymentMessage, setPaymentMessage] = useState("");

  const rows = WALLET_TRANSACTIONS.filter(
    (row) =>
      (status === "all" || row.status === status) &&
      (type === "all" || row.type === type) &&
      (!range.from || 14050500 + row.day >= range.from) &&
      (!range.to || 14050500 + row.day <= range.to),
  );
  const filters = [
    {
      value: status,
      onChange: setStatus,
      label: "وضعیت تراکنش",
      options: [
        { value: "all", label: "همهٔ وضعیت‌ها" },
        ...Object.entries(WALLET_STATUS).map(([value, item]) => ({
          value,
          label: item.label,
        })),
      ],
    },
    {
      value: type,
      onChange: setType,
      label: "نوع تراکنش",
      options: [
        { value: "all", label: "همهٔ تراکنش‌ها" },
        { value: "charge", label: "شارژ اعتبار" },
        { value: "click", label: "کسر هزینهٔ کلیک" },
      ],
    },
  ];
  const openDialog = (name) => {
    setPaymentMessage("");
    setDialog(name);
  };

  return (
    <div className="flex-1 bg-surface-muted bg-pattern-diagonal-fine">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 pb-24 pt-8 lg:px-10 lg:pb-10 lg:pt-10">
        <SellerHeader />

        <section
          aria-labelledby="wallet-usage-title"
          className="flex flex-col gap-3"
        >
          <div className="flex min-h-[26px] flex-wrap items-center justify-between gap-2">
            <h2 id="wallet-usage-title" className="text-body">
              خلاصهٔ مصرف اعتبار
            </h2>
            <p className="text-[13px] leading-[21px] text-text-muted">
              ۲۴ تا ۳۰ مرداد ۱۴۰۵ · ۷ روز اخیر
            </p>
          </div>
          <SellerStats variant="wallet" />
        </section>

        <section
          aria-labelledby="wallet-balance-title"
          className="flex flex-col gap-[18px] rounded-xl bg-surface p-6"
        >
          <div className="flex h-10 items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-secondary-100/50 text-secondary">
              <CoinFrontSwapIcon size={24} />
            </span>
            <h2
              id="wallet-balance-title"
              className="text-small text-text-secondary"
            >
              موجودی کیف پول
            </h2>
          </div>
          <div className="flex min-h-12 flex-wrap items-center justify-between gap-[18px]">
            <p className="flex items-baseline gap-[10px]">
              <span className="text-[38px] leading-[48px]">۲٬۵۰۰٬۰۰۰</span>
              <span className="text-body text-text-secondary">تومان</span>
            </p>
            <div className="flex flex-wrap items-center gap-3" dir="ltr">
              <button
                type="button"
                onClick={() => openDialog("withdraw")}
                className={`h-[42px] rounded-md bg-success-strong/10 px-4 text-small text-success-strong ${CONTROL}`}
              >
                درخواست وجه
              </button>
              <button
                type="button"
                onClick={() => openDialog("increase")}
                className={`flex h-[42px] items-center gap-2 rounded-md bg-primary px-4 text-small text-text-on-primary hover:bg-primary-600 ${CONTROL}`}
                dir="rtl"
              >
                <PlusSimpleIcon size={16} />
                افزایش اعتبار
              </button>
            </div>
          </div>
          <p className="flex min-h-11 items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-4 py-3 text-caption text-text-secondary">
            <CursorClickIcon size={18} className="shrink-0 text-info" />
            <span>
              هزینهٔ هر کلیک معتبر از این اعتبار کسر می‌شود. این موجودی، اعتبار
              پیش‌پرداخت است و درآمد قابل برداشت یا تسویه نیست.
            </span>
          </p>
        </section>

        <section
          aria-labelledby="wallet-history-title"
          className="flex flex-col gap-4 rounded-xl bg-surface p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 id="wallet-history-title" className="text-[17px] leading-7">
                تاریخچهٔ تراکنش‌ها
              </h2>
              <p className="mt-[3px] text-caption leading-5 text-text-muted">
                شارژ اعتبار و هزینهٔ کلیک‌ها · همهٔ مبالغ به تومان
              </p>
            </div>
            <div className="flex flex-wrap gap-2" dir="ltr">
              {filters.map((filter) => (
                <FigmaDropdown
                  key={filter.label}
                  aria-label={filter.label}
                  size="small"
                  className="w-[146px] shrink-0"
                  triggerClassName={`h-10 w-full rounded-md px-3 text-[13px] leading-5 text-text-secondary ${CONTROL}`}
                  selectedLabelClassName="text-[13px] leading-5 tracking-normal [font-weight:400] text-text-secondary!"
                  menuClassName="h-auto min-h-0 py-2"
                  optionClassName="h-8"
                  optionLabelClassName="text-[14px] leading-[22px] tracking-normal font-[YekanBakh] [font-weight:400] text-text-secondary!"
                  value={filter.value}
                  onChange={filter.onChange}
                  options={filter.options}
                />
              ))}
              <button
                type="button"
                onClick={() => openDialog("dates")}
                aria-label="بازه زمانی تراکنش‌ها"
                className={`flex h-10 w-[190px] items-center justify-between gap-3 rounded-md border border-border-default px-3 text-[13px] text-text-secondary ${CONTROL}`}
              >
                <ChevronDownIcon
                  size={12}
                  className="shrink-0 text-text-muted"
                />
                <span dir="rtl">{range.label}</span>
              </button>
            </div>
          </div>

          <div
            className="overflow-x-auto"
            role="region"
            aria-label="جدول تاریخچه تراکنش‌های کیف پول"
            tabIndex={0}
          >
            <div
              role="table"
              aria-label="تاریخچه تراکنش‌ها"
              className="min-w-[1000px]"
            >
              <div role="rowgroup">
                <div
                  role="row"
                  className={`${COLUMNS} h-11 rounded-md bg-surface-subtle text-caption leading-5 text-text-muted`}
                >
                  {[
                    "نوع تراکنش و شرح",
                    "تاریخ و ساعت",
                    "شناسه",
                    "وضعیت",
                    "مبلغ (تومان)",
                    "مانده (تومان)",
                  ].map((title) => (
                    <div role="columnheader" key={title}>
                      {title}
                    </div>
                  ))}
                </div>
              </div>
              <div role="rowgroup">
                {rows.map((row) => (
                  <div
                    role="row"
                    key={row.id}
                    className={`${COLUMNS} h-[76px] border-b border-border-subtle text-small leading-[23px]`}
                  >
                    <div role="cell">
                      <p>
                        {row.type === "click"
                          ? "کسر هزینهٔ کلیک"
                          : "شارژ اعتبار"}
                      </p>
                      <p className="mt-[2px] text-caption leading-5 text-text-muted">
                        {row.detail}
                      </p>
                    </div>
                    <div role="cell">
                      <p className="text-[13px] leading-[21px]">
                        {NUMBER.format(row.day)} مرداد ۱۴۰۵
                      </p>
                      <p className="mt-[2px] text-caption leading-5 text-text-muted">
                        {row.time}
                      </p>
                    </div>
                    <div
                      role="cell"
                      className="text-[13px] text-text-secondary"
                    >
                      <bdi>{row.id}</bdi>
                    </div>
                    <div role="cell">
                      <span
                        className={`inline-flex rounded-sm px-[10px] py-[3px] text-caption leading-5 ${WALLET_STATUS[row.status].className}`}
                      >
                        {WALLET_STATUS[row.status].label}
                      </span>
                    </div>
                    <div
                      role="cell"
                      className={
                        row.status === "success"
                          ? "text-success-strong"
                          : row.status === "failed"
                            ? "text-text-muted"
                            : "text-text-primary"
                      }
                    >
                      <bdi dir="ltr">
                        {row.amount < 0
                          ? "−"
                          : row.status === "success"
                            ? "+"
                            : ""}
                        {NUMBER.format(Math.abs(row.amount))}
                      </bdi>
                    </div>
                    <div role="cell">{NUMBER.format(row.balance)}</div>
                  </div>
                ))}
                {rows.length === 0 && (
                  <div role="row">
                    <div
                      role="cell"
                      aria-colspan={6}
                      className="py-10 text-center text-small text-text-muted"
                    >
                      تراکنشی با این فیلترها پیدا نشد.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex min-h-[45px] flex-wrap items-center justify-between gap-2 rounded-md bg-surface-subtle px-3 py-3 text-caption leading-5 text-text-secondary">
            <p>
              ماندهٔ ابتدای بازه ۱٬۰۰۰٬۰۰۰ + شارژ موفق ۳٬۰۰۰٬۰۰۰ − هزینهٔ کلیک
              ۱٬۵۰۰٬۰۰۰
            </p>
            <p className="text-primary">ماندهٔ فعلی: ۲٬۵۰۰٬۰۰۰ تومان</p>
          </div>
          <footer className="flex min-h-[30px] flex-wrap items-center justify-between gap-3 text-caption leading-5 text-text-muted">
            <p>
              نمایش {rows.length ? `۱ تا ${NUMBER.format(rows.length)}` : "۰"}{" "}
              از {NUMBER.format(rows.length)} تراکنش · داده‌ها و مبالغ این صفحه
              نمونه‌اند.
            </p>
            <nav
              aria-label="صفحه‌بندی تراکنش‌ها"
              className="flex items-center gap-2"
              dir="ltr"
            >
              <button
                type="button"
                disabled
                aria-label="صفحه قبلی"
                className="text-text-muted disabled:opacity-50"
              >
                <ChevronLeftIcon size={14} />
              </button>
              <button
                type="button"
                aria-current="page"
                className="size-[30px] rounded-md bg-primary-50 text-primary"
              >
                ۱
              </button>
              <button
                type="button"
                disabled
                aria-label="صفحه بعدی"
                className="text-text-muted disabled:opacity-50"
              >
                <ChevronRightIcon size={14} />
              </button>
            </nav>
          </footer>
        </section>

        <Dialog
          open={Boolean(dialog)}
          onOpenChange={(open) => {
            if (!open) setDialog(null);
          }}
        >
          <DialogContent
            className="theme-new seller-panel-scroll max-h-[80dvh] overflow-y-auto bg-surface"
            overlayClassName="theme-new"
            dir="rtl"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {dialog === "increase"
                  ? "افزایش اعتبار"
                  : dialog === "withdraw"
                    ? "درخواست وجه"
                    : "بازه زمانی تراکنش‌ها"}
              </DialogTitle>
              <DialogDescription>
                {dialog === "increase"
                  ? "داده‌ها و موجودی این صفحه نمونه‌اند؛ پرداخت واقعی فعال نیست."
                  : dialog === "withdraw"
                    ? "اعتبار پیش‌پرداخت هزینهٔ کلیک‌ها قابل برداشت یا تسویه نیست."
                    : "تاریخ شروع و پایان تراکنش‌ها را انتخاب کنید."}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              {dialog === "increase" && (
                <>
                  <ProfileWalletAmountContent
                    type="increase"
                    walletBalance={2500000}
                    useFigmaInput
                    onBack={() => setDialog(null)}
                    onNext={() =>
                      setPaymentMessage(
                        "پرداخت واقعی برای این صفحهٔ نمونه فعال نیست.",
                      )
                    }
                  />
                  {paymentMessage && (
                    <p role="status" className="text-small text-text-secondary">
                      {paymentMessage}
                    </p>
                  )}
                </>
              )}
              {dialog === "withdraw" && (
                <button
                  type="button"
                  onClick={() => setDialog(null)}
                  className={`mt-4 rounded-md bg-primary px-5 py-3 text-small text-text-on-primary ${CONTROL}`}
                >
                  متوجه شدم
                </button>
              )}
              {dialog === "dates" && (
                <>
                  <DateRangeFilterContent
                    variant="seller"
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                  />
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setRange({
                          from: dateKey(fromDate),
                          to: dateKey(toDate),
                          label:
                            formatDateRangeLabel(fromDate, toDate) ||
                            "همهٔ تاریخ‌ها",
                        });
                        setDialog(null);
                      }}
                      className={`rounded-md bg-primary px-5 py-3 text-small text-text-on-primary ${CONTROL}`}
                    >
                      اعمال بازه
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFromDate(null);
                        setToDate(null);
                        setRange({
                          from: 14050524,
                          to: 14050530,
                          label: "۲۴ تا ۳۰ مرداد ۱۴۰۵",
                        });
                        setDialog(null);
                      }}
                      className={`rounded-md border border-border-default px-5 py-3 text-small ${CONTROL}`}
                    >
                      بازهٔ اولیه
                    </button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
