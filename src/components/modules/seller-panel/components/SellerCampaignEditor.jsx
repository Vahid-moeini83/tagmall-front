"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import DateRangeFilterContent from "@/components/ui/date-range/DateRangeFilterContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ReceiptIcon,
  ChartLineDownSquareIcon,
  SearchIcon,
  CloseCircleIcon,
  TicketSimplePercentIcon,
  TagSimpleIcon,
  MessageTextIcon,
  BoxShieldIcon,
  HintIcon,
} from "@/icons";
import SellerHeader from "./SellerHeader";
import { ProfileCard } from "./SellerProfile";
import {
  CAMPAIGN_CONTROL,
  CampaignProduct,
  CampaignSelect,
} from "./SellerCampaigns";
import {
  CAMPAIGN_EVENTS,
  CAMPAIGN_PRODUCTS,
  formatCampaignNumber as number,
} from "../data/campaigns";

const PRIORITIES = [
  {
    id: "purchases",
    title: "خریدهای قبلی کاربران",
    description: "اولویت با کالاهای خریداری‌شده قبلی",
  },
  {
    id: "visits",
    title: "پربازدیدترین کالاها",
    description: "بر اساس بیشترین بازدید کاربران",
  },
  {
    id: "sales",
    title: "پرفروش‌ترین کالاها",
    description: "بر اساس بیشترین فروش در بازار",
  },
];

function StepHeading({ step, title, description, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-50 text-small font-semibold text-primary">
          {number(step)}
        </span>
        <div className="flex flex-col gap-[3px]">
          <h2 className="text-body font-normal text-text-primary">{title}</h2>
          <p className="text-small text-text-muted">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function PricingHeader({ special, checkbox, allChecked, onCheck, readOnly }) {
  return (
    <div
      role="row"
      className="grid h-11 grid-cols-[minmax(240px,1fr)_85px_125px_125px_165px_125px] items-center rounded-xl bg-surface-subtle px-3 text-center text-[13px] leading-5 text-text-muted"
    >
      <div role="columnheader" className="flex items-center gap-3 text-right">
        {checkbox && (
          <Checkbox
            variant="seller"
            aria-label="انتخاب همه کالاها"
            checked={allChecked}
            onChange={onCheck}
            disabled={readOnly}
            className={
              allChecked
                ? "border-primary bg-primary text-text-on-primary"
                : "border-border-default"
            }
          />
        )}
        محصول و شناسه محصول
      </div>
      {[
        "بازدید",
        "کم‌ترین قیمت",
        "قیمت فعلی",
        "قیمت فروش ویژه",
        special ? "تعداد فروش ویژه" : "تعداد در کمپین",
      ].map((title) => (
        <span role="columnheader" key={title}>
          {title}
        </span>
      ))}
    </div>
  );
}

function PricingRows({
  products,
  values,
  onChange,
  onToggle,
  readOnly,
  special = false,
  sectionId,
}) {
  return products.map((product) => {
    const value = values[product.id];
    const selected = value.selected;
    const discount =
      selected && Number(value.price) > 0
        ? Math.round((1 - Number(value.price) / product.price) * 100)
        : 0;
    return (
      <div
        role="row"
        key={product.id}
        className="grid min-h-[98px] grid-cols-[minmax(240px,1fr)_85px_125px_125px_165px_125px] items-center border-b border-border-subtle px-3 py-3 text-center text-[13px] leading-5"
      >
        <div role="cell" className="flex items-center gap-3">
          <Checkbox
            variant="seller"
            aria-label={`انتخاب ${product.name} در ${special ? "فروش ویژه" : "کمپین"}`}
            checked={selected}
            onChange={() => onToggle(product.id)}
            disabled={readOnly}
            className={
              selected
                ? "border-primary bg-primary text-text-on-primary"
                : "border-border-default"
            }
          />
          <CampaignProduct product={product} />
        </div>
        <div role="cell" className="text-text-secondary">
          {number(product.visits)}
          <p className="mt-1 text-caption text-text-muted">۷۲ ساعت</p>
        </div>
        {[2100000, product.price].map((price, index) => (
          <div role="cell" key={index} className="text-text-secondary">
            {number(price)}
            <p className="mt-1 text-caption text-text-muted">تومان</p>
          </div>
        ))}
        <div role="cell" className="px-1">
          <div className="relative">
            <Input
              id={`${sectionId}-price-${product.id}`}
              aria-label={`قیمت فروش ویژه ${product.name}`}
              variant="plain"
              numeric
              readOnly={readOnly}
              disabled={!selected}
              value={
                selected
                  ? value.price === ""
                    ? ""
                    : number(Number(value.price))
                  : "—"
              }
              onChange={(event) =>
                onChange(product.id, "price", event.target.value)
              }
              className={`h-10! rounded-md border pr-2 pl-10 text-right text-small ${selected ? "border-border-default bg-surface font-semibold" : "border-border-subtle bg-surface-muted text-text-disabled"}`}
            />
            <span className="pointer-events-none absolute top-3 left-2 text-caption text-text-muted">
              تومان
            </span>
          </div>
          <p
            className={`mt-1.5 text-caption ${selected && discount > 0 ? "text-success-strong" : "text-text-muted"}`}
          >
            {selected
              ? `${number(discount)}٪ تخفیف`
              : "ابتدا کالا را انتخاب کنید"}
          </p>
        </div>
        <div role="cell" className="px-1">
          <div className="relative">
            <Input
              id={`${sectionId}-quantity-${product.id}`}
              aria-label={`تعداد ${product.name} در ${special ? "فروش ویژه" : "کمپین"}`}
              variant="plain"
              numeric
              maxLength={4}
              readOnly={readOnly}
              disabled={!selected}
              value={
                selected
                  ? value.quantity === ""
                    ? ""
                    : number(Number(value.quantity))
                  : "—"
              }
              onChange={(event) =>
                onChange(product.id, "quantity", event.target.value)
              }
              className={`h-10! rounded-md border pr-2 pl-8 text-right text-small ${selected ? "border-border-default bg-surface font-semibold" : "border-border-subtle bg-surface-muted text-text-disabled"}`}
            />
            <span className="pointer-events-none absolute top-3 left-2 text-caption text-text-muted">
              عدد
            </span>
          </div>
          <p className="mt-1.5 text-caption text-text-muted">
            موجودی: {number(product.stock)} عدد
          </p>
        </div>
      </div>
    );
  });
}

export default function SellerCampaignEditor({
  initialMode = "campaign",
  readOnly = false,
}) {
  const [mode, setMode] = useState(initialMode);
  const [eventId, setEventId] = useState("yalda");
  const [carousel, setCarousel] = useState(0);
  const [priority, setPriority] = useState("purchases");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [dateDialog, setDateDialog] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [dateLabel, setDateLabel] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [request, setRequest] = useState("");
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      CAMPAIGN_PRODUCTS.slice(0, 4).map((product, index) => [
        product.id,
        {
          selected: index < 3,
          price: String(product.offer),
          quantity: String(product.quantity),
        },
      ]),
    ),
  );
  const special = mode === "special";
  const grouped = readOnly || mode !== "campaign";
  const selectedEvent = CAMPAIGN_EVENTS.find((event) => event.id === eventId);
  const displayedEvents =
    mode === "campaign" && !readOnly
      ? CAMPAIGN_EVENTS
      : [
          ...CAMPAIGN_EVENTS.slice(0, 2),
          eventId === "halloween-next"
            ? CAMPAIGN_EVENTS[3]
            : CAMPAIGN_EVENTS[2],
        ];
  const products = CAMPAIGN_PRODUCTS.slice(0, 4)
    .filter(
      (product) =>
        !search.trim() ||
        `${product.name} PRD-${product.id}`.includes(search.trim()),
    )
    .sort((a, b) =>
      priority === "sales"
        ? b.sold - a.sold
        : priority === "visits"
          ? b.visits - a.visits
          : sort === "oldest"
            ? a.id.localeCompare(b.id)
            : 0,
    );
  const selectedCount = products.filter(
    (product) => values[product.id].selected,
  ).length;
  const toggleProduct = (id) =>
    setValues((previous) => ({
      ...previous,
      [id]: { ...previous[id], selected: !previous[id].selected },
    }));
  const changeValue = (id, field, value) =>
    setValues((previous) => ({
      ...previous,
      [id]: { ...previous[id], [field]: value },
    }));
  const applyDates = () => {
    if (!fromDate || !toDate) {
      toast.error("تاریخ شروع و پایان را انتخاب کنید.");
      return;
    }
    if (fromDate.toUnix() > toDate.toUnix()) {
      toast.error("تاریخ پایان باید پس از تاریخ شروع باشد.");
      return;
    }
    const key = (date) =>
      date.year * 10000 + date.month.number * 100 + date.day;
    const matchingEvent = CAMPAIGN_EVENTS.find(
      (event) => key(fromDate) <= event.end && key(toDate) >= event.start,
    );
    if (matchingEvent) setEventId(matchingEvent.id);
    setMode(matchingEvent ? "combined" : "special");
    setDateLabel(
      `${fromDate.format("DD MMMM YYYY")} تا ${toDate.format("DD MMMM YYYY")}`,
    );
    setDateDialog(false);
  };
  const submit = (draft = false) => {
    const selected = CAMPAIGN_PRODUCTS.slice(0, 4).filter(
      (product) => values[product.id].selected,
    );
    if (!draft && !selected.length) {
      toast.error("حداقل یک کالا انتخاب کنید.");
      return;
    }
    if (
      !draft &&
      selected.some(
        (product) =>
          Number(values[product.id].price) <= 0 ||
          Number(values[product.id].price) >= product.price ||
          Number(values[product.id].quantity) < 1 ||
          Number(values[product.id].quantity) > product.stock,
      )
    ) {
      toast.error(
        "قیمت باید کمتر از قیمت فعلی و تعداد بین ۱ و موجودی کالا باشد.",
      );
      return;
    }
    toast.error(
      draft
        ? "ذخیره پیش‌نویس به سرویس متصل نشده است؛ اطلاعات فقط در همین صفحه باقی می‌ماند."
        : "ثبت کمپین هنوز به سرویس متصل نشده است؛ تغییری در حساب شما ثبت نشد.",
    );
  };
  return (
    <div className="flex-1 bg-surface-muted bg-pattern-diagonal-fine">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 pb-24 pt-8 lg:p-10">
        <div className="flex flex-col gap-2">
          <SellerHeader />
          {!readOnly && mode !== "campaign" && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-small">
              <h1>
                {special
                  ? "بازه بدون کمپین فروش"
                  : "بازه هم‌زمان کمپین فروش و فروش ویژه"}
              </h1>
              <p className="text-caption text-text-muted">
                <Link href="/seller/discounts" className="hover:text-primary">
                  تخفیف‌های فعال
                </Link>{" "}
                / ایجاد کمپین
              </p>
            </div>
          )}
        </div>
        {readOnly && (
          <div className="flex items-center gap-3 rounded-lg bg-primary-50 p-4 text-text-secondary">
            <BoxShieldIcon size={24} className="shrink-0 text-primary" />
            <div>
              <p className="text-body">
                کمپین شما ثبت شده است؛ اطلاعات فقط قابل مشاهده‌اند.
              </p>
              <p className="mt-1 text-small text-text-muted">
                ویرایش پس از ثبت صرفاً توسط واحد پشتیبانی انجام می‌شود. از دکمه
                درخواست ویرایش کمپین در پایین صفحه استفاده کنید.
              </p>
            </div>
          </div>
        )}
        <ProfileCard className="flex flex-col gap-5 p-6 lg:p-6">
          <div className="border-b border-border-subtle pb-5">
            <StepHeading
              step={1}
              title="بازه زمانی فروش ویژه"
              description={
                mode === "campaign"
                  ? "نزدیک‌ترین رویداد به‌صورت پیش‌فرض انتخاب شده است؛ می‌توانید بازه دیگری را انتخاب کنید."
                  : "بازه زمانی دلخواه را انتخاب کنید؛ در این بازه می‌توانید کالاهای خود را در فروش ویژه عرضه کنید."
              }
              action={
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => setDateDialog(true)}
                  className={`${CAMPAIGN_CONTROL} min-h-10 border border-border-default bg-surface px-3 text-text-secondary`}
                >
                  <ReceiptIcon size={18} />
                  {dateLabel ||
                    (readOnly ? "بازه زمانی ۲۹ آذر ۱۴۰۵" : "انتخاب بازه زمانی")}
                </button>
              }
            />
          </div>
          {special ? (
            <>
              <div className="flex min-h-[58px] items-center gap-3 rounded-lg bg-info/15 px-4 py-3 text-small text-text-secondary">
                <HintIcon size={20} className="shrink-0 text-info" />
                <p>
                  کاربر محترم در این بازه زمانی کمپین فروشی ایجاد نشده است،
                  محصول شما در فروش ویژه قابل عرضه خواهد بود
                </p>
              </div>
              <p className="text-small text-text-muted">
                برای ادامه، کالاهای فروش ویژه را انتخاب و قیمت و تعداد قابل عرضه
                را تکمیل کنید.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-body">کمپین‌های پیشنهادی</h3>
              <div
                className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${mode === "campaign" && !readOnly ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
              >
                {displayedEvents.map((event) => (
                  <article
                    key={event.id}
                    className={`flex h-[188px] flex-col gap-4 rounded-lg border p-4 text-right ${eventId === event.id ? "border-primary bg-primary-50" : "border-border-default bg-surface"}`}
                  >
                    <h4
                      className={`text-body ${eventId === event.id ? "text-primary" : "text-text-primary"}`}
                    >
                      {event.title}
                    </h4>
                    <p className="text-[13px] leading-5 text-text-secondary">
                      {mode === "campaign" && !readOnly
                        ? "فردا، ۳۱ مرداد ۱۴۰۵"
                        : event.date}
                    </p>
                    <p className="text-caption text-text-muted">
                      {mode === "campaign" && !readOnly
                        ? "مهلت ثبت: فردا تا ساعت ۱۸:۰۰"
                        : eventId === event.id
                          ? "مهلت ثبت: ۲۸ آذر تا ساعت ۱۸:۰۰"
                          : "برای مشاهده، کمپین را انتخاب کنید"}
                    </p>
                    <button
                      type="button"
                      disabled={readOnly}
                      aria-pressed={eventId === event.id}
                      onClick={() => setEventId(event.id)}
                      className={`${CAMPAIGN_CONTROL} mt-auto h-[46px] w-full text-small disabled:opacity-100! ${eventId === event.id ? "bg-primary text-text-on-primary" : "bg-surface-muted text-text-secondary hover:bg-primary-50"}`}
                    >
                      {eventId === event.id && (mode !== "campaign" || readOnly)
                        ? "کمپین انتخاب‌شده"
                        : "شرکت در کمپین"}
                    </button>
                  </article>
                ))}
              </div>
              {mode === "campaign" && !readOnly && (
                <div
                  className="flex h-2.5 items-center justify-center gap-1.5"
                  dir="ltr"
                >
                  {[0, 1, 2, 3].map((index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`پیشنهاد کمپین ${number(index + 1)}`}
                      aria-pressed={carousel === index}
                      onClick={() => {
                        setCarousel(index);
                        setEventId(CAMPAIGN_EVENTS[index].id);
                      }}
                      className={`${CAMPAIGN_CONTROL} h-2.5 rounded-full ${carousel === index ? "w-5 bg-primary" : "w-2.5 bg-primary-100"}`}
                    />
                  ))}
                </div>
              )}
              <p className="flex items-center gap-2 text-small text-text-secondary">
                <ReceiptIcon size={16} className="shrink-0" />
                با شرکت در کمپین‌های فروش، محصولات شما به کاربران بیش‌تری نمایش
                داده می‌شود
              </p>
            </>
          )}
        </ProfileCard>
        <ProfileCard className="flex flex-col gap-[18px] p-6 lg:p-6">
          <StepHeading
            step={2}
            title="تحلیل بازار و اولویت‌بندی کالاها"
            description="پیشنهادها بر اساس رفتار کاربران در بازه زمانی مشخص در اولویت قرار می‌گیرند."
            action={
              <CampaignSelect
                label="مرتب‌سازی پیشنهادها"
                value={sort}
                onChange={setSort}
                disabled={readOnly}
                className="w-[238px]"
                options={[
                  {
                    value: "newest",
                    label:
                      mode === "campaign" || mode === "combined"
                        ? "مرتب‌سازی: جدیدترین"
                        : "تهران",
                  },
                  { value: "oldest", label: "مرتب‌سازی: قدیمی‌ترین" },
                ]}
              />
            }
          />
          <fieldset className="min-w-0">
            <legend
              className={`mb-3 text-small ${special || readOnly ? "block" : "sr-only"}`}
            >
              اولویت کالاها در فروش ویژه
            </legend>
            <div className="grid gap-3 lg:grid-cols-3">
              {PRIORITIES.map((item) => (
                <Radio
                  key={item.id}
                  aria-label={item.title}
                  name="campaign-priority"
                  disabled={readOnly}
                  checked={priority === item.id}
                  onChange={() => setPriority(item.id)}
                  variant="card"
                  className={`min-h-[72px] items-start gap-2.5 rounded-lg border p-3.5 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary ${priority === item.id ? "border-primary bg-primary-50" : "border-border-default"}`}
                  label={
                    <span>
                      <span
                        className={`block text-small ${priority === item.id ? "font-semibold text-primary" : "text-text-primary"}`}
                      >
                        {item.title}
                      </span>
                      <span className="mt-1 block text-caption text-text-muted">
                        {item.description}
                      </span>
                    </span>
                  }
                />
              ))}
            </div>
          </fieldset>
          <p className="flex items-center gap-2 text-small text-text-secondary">
            <ChartLineDownSquareIcon size={16} className="shrink-0" />
            به‌صورت پیش‌فرض، کالاهای ثبت‌شده در ۷۲ ساعت گذشته بر اساس رفتار
            کاربران تحلیل می‌شوند.
          </p>
        </ProfileCard>
        <ProfileCard
          className={`flex flex-col gap-[18px] p-6 lg:p-6 ${mode === "combined" && !readOnly ? "lg:py-8" : ""}`}
        >
          <StepHeading
            step={3}
            title={
              special
                ? "کالاهای فروش ویژه و قیمت رقابتی"
                : "کالاهای کمپین و قیمت رقابتی"
            }
            description="کالاهای دلخواه را انتخاب کنید؛ سپس قیمت فروش ویژه و تعداد قابل عرضه هر کالا را وارد کنید."
          />
          {readOnly && (
            <div className="overflow-x-auto">
              <div
                role="table"
                aria-label="ستون‌های اطلاعات کمپین"
                className="min-w-[960px]"
              >
                <PricingHeader special={false} />
              </div>
            </div>
          )}
          <form
            className="flex items-center gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(query);
            }}
          >
            <div className="relative min-w-0 flex-1">
              <Input
                id="campaign-product-search"
                variant="plain"
                aria-label="جست‌وجوی کالاهای قابل عرضه"
                placeholder={
                  mode === "campaign"
                    ? "گوشی موبایل سامسونگ Galaxy S24 Ultra"
                    : "کیف چرمی زنانه"
                }
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-[50px]! rounded-xl bg-surface-subtle pr-11 pl-11 text-small placeholder:text-text-primary"
              />
              <SearchIcon
                size={20}
                className="pointer-events-none absolute top-[15px] right-3 text-text-primary"
              />
              {query && (
                <button
                  type="button"
                  aria-label="پاک کردن جست‌وجوی کالا"
                  onClick={() => {
                    setQuery("");
                    setSearch("");
                  }}
                  className={`${CAMPAIGN_CONTROL} absolute top-[15px] left-3 text-text-primary`}
                >
                  <CloseCircleIcon size={20} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`${CAMPAIGN_CONTROL} h-[50px] bg-surface-subtle px-3 text-text-muted hover:bg-primary-50`}
            >
              جست‌وجو
            </button>
          </form>
          <div className="overflow-x-auto">
            <div
              className={`min-w-[960px] ${!grouped ? "relative pl-[18px] before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary-50 after:absolute after:top-0 after:left-0 after:h-[94px] after:w-0.5 after:bg-primary-400" : ""}`}
              role="table"
              aria-label="انتخاب و قیمت‌گذاری کالاهای کمپین"
            >
              {!readOnly && (
                <PricingHeader
                  special={special}
                  checkbox={!grouped}
                  allChecked={
                    products.length > 0 && selectedCount === products.length
                  }
                  onCheck={(checked) =>
                    setValues((previous) =>
                      Object.fromEntries(
                        Object.entries(previous).map(([id, value]) => [
                          id,
                          products.some((product) => product.id === id)
                            ? { ...value, selected: checked }
                            : value,
                        ]),
                      ),
                    )
                  }
                />
              )}
              {!products.length ? (
                <p
                  className="py-16 text-center text-small text-text-muted"
                  role="status"
                >
                  کالایی با این مشخصات پیدا نشد.
                </p>
              ) : grouped ? (
                (special ? ["special"] : ["campaign", "special"]).map(
                  (group) => {
                    const groupProducts = readOnly
                      ? group === "campaign"
                        ? products.slice(0, 2)
                        : products
                      : special
                        ? products
                        : group === "campaign"
                          ? products.filter(
                              (product) => Number(product.id) < 1026,
                            )
                          : products.filter(
                              (product) => Number(product.id) >= 1026,
                            );
                    const Icon =
                      group === "campaign"
                        ? TicketSimplePercentIcon
                        : TagSimpleIcon;
                    return (
                      <div role="rowgroup" key={group} className="mt-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex size-9 shrink-0 items-center justify-center rounded-md ${group === "campaign" ? "bg-primary-50 text-primary" : "bg-success-strong/10 text-success-strong"}`}
                            >
                              <Icon size={22} />
                            </span>
                            <div>
                              <h3 className="text-body">
                                محصولات قابل عرضه در{" "}
                                {group === "campaign"
                                  ? "کمپین فروش"
                                  : "فروش ویژه"}
                              </h3>
                              <p className="text-caption text-text-muted">
                                اولویت فروش ویژه: خریدهای قبلی کاربران
                              </p>
                            </div>
                          </div>
                          <p className="text-caption text-text-muted">
                            {number(
                              groupProducts.filter(
                                (product) => values[product.id].selected,
                              ).length,
                            )}{" "}
                            از {number(groupProducts.length)} کالا انتخاب شده
                          </p>
                        </div>
                        <PricingRows
                          products={groupProducts}
                          values={values}
                          onChange={changeValue}
                          onToggle={toggleProduct}
                          readOnly={readOnly}
                          special={group === "special"}
                          sectionId={group}
                        />
                      </div>
                    );
                  },
                )
              ) : (
                <PricingRows
                  products={products}
                  values={values}
                  onChange={changeValue}
                  onToggle={toggleProduct}
                  readOnly={readOnly}
                  sectionId="campaign"
                />
              )}
            </div>
          </div>
        </ProfileCard>
        {readOnly ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed border-border-default bg-surface-subtle p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <MessageTextIcon size={24} />
              </span>
              <div>
                <h2 className="text-body">نیاز به ویرایش کمپین دارید؟</h2>
                <p className="mt-1 text-small text-text-muted">
                  پس از ثبت کمپین، ویرایش صرفاً از طریق واحد پشتیبانی انجام
                  می‌شود.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRequestOpen(true)}
              className={`${CAMPAIGN_CONTROL} h-[50px] bg-primary px-4 text-text-on-primary hover:bg-primary-600`}
            >
              <MessageTextIcon size={20} />
              درخواست ویرایش کمپین
            </button>
          </div>
        ) : (
          <footer className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => submit()}
                className={`${CAMPAIGN_CONTROL} h-[50px] bg-primary px-6 text-text-on-primary hover:bg-primary-600`}
              >
                ثبت {special ? "فروش ویژه" : "کمپین فروش"}
              </button>
              <button
                type="button"
                onClick={() => submit(true)}
                className={`${CAMPAIGN_CONTROL} h-[50px] border border-primary px-6 text-primary hover:bg-primary-50`}
              >
                ذخیره پیش‌نویس
              </button>
            </div>
            <Link
              href="/seller/discounts"
              className={`${CAMPAIGN_CONTROL} h-[50px] border border-border-default bg-surface px-6 text-text-secondary hover:bg-surface-subtle`}
            >
              انصراف
            </Link>
          </footer>
        )}
        <Dialog open={dateDialog} onOpenChange={setDateDialog}>
          <DialogContent
            dir="rtl"
            overlayClassName="theme-new"
            className="theme-new max-h-[80dvh] overflow-y-auto bg-surface [&>button]:top-3 [&>button]:left-3 [&>button]:size-8"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>انتخاب بازه زمانی فروش</DialogTitle>
              <DialogDescription>
                بازه‌های هم‌زمان با رویدادهای پیشنهادی شامل کمپین فروش و فروش
                ویژه هستند؛ سایر بازه‌ها برای فروش ویژه در نظر گرفته می‌شوند.
              </DialogDescription>
            </DialogHeader>
            <DateRangeFilterContent
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              variant="seller"
            />
            <p className="text-small text-text-muted">
              کمپین انتخاب‌شده: {selectedEvent.title} ({selectedEvent.date})
            </p>
            <button
              type="button"
              onClick={applyDates}
              className={`${CAMPAIGN_CONTROL} h-11 w-full bg-primary text-text-on-primary`}
            >
              اعمال بازه زمانی
            </button>
          </DialogContent>
        </Dialog>
        <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
          <DialogContent
            dir="rtl"
            overlayClassName="theme-new"
            className="theme-new bg-surface"
          >
            <DialogHeader>
              <DialogTitle>درخواست ویرایش کمپین</DialogTitle>
              <DialogDescription>
                تغییرات مورد نیاز را برای بررسی پشتیبانی توضیح دهید.
              </DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!request.trim()) {
                  toast.error("توضیح درخواست را بنویسید.");
                  return;
                }
                toast.error(
                  "ارسال درخواست هنوز به سرویس پشتیبانی متصل نشده است.",
                );
              }}
            >
              <label htmlFor="campaign-edit-request" className="text-small">
                توضیح درخواست
              </label>
              <textarea
                id="campaign-edit-request"
                required
                value={request}
                onChange={(event) => setRequest(event.target.value)}
                className="min-h-32 rounded-lg border border-border-default bg-surface-subtle p-3 text-small outline-none focus-visible:border-primary"
              />
              <button
                type="submit"
                className={`${CAMPAIGN_CONTROL} h-11 bg-primary text-text-on-primary`}
              >
                ارسال درخواست
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
