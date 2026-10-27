"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  EditIcon,
  MessageTextIcon,
  PlusSimpleIcon,
  SearchIcon,
} from "@/icons";
import SellerHeader from "./SellerHeader";
import { ProfileCard, mergeProfileClasses } from "./SellerProfile";
import {
  CAMPAIGN_PRODUCTS,
  CAMPAIGN_STATUSES,
  CAMPAIGN_STATUS_STYLE,
  formatCampaignNumber as number,
} from "../data/campaigns";

export const CAMPAIGN_CONTROL =
  "inline-flex items-center justify-center gap-2 rounded-lg text-small transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50";

export function CampaignSelect({
  label,
  value,
  onChange,
  options,
  className = "",
  disabled = false,
}) {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          disabled={disabled}
          className={mergeProfileClasses(
            CAMPAIGN_CONTROL,
            "h-10 justify-between border border-border-default bg-surface px-3 text-text-primary",
            className,
          )}
        >
          <span>{options.find((option) => option.value === value)?.label}</span>
          <ChevronDownIcon size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        dir="rtl"
        className="theme-new border border-border-default bg-surface text-text-primary shadow-dropdown"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="text-small focus:bg-primary-50 focus:text-primary"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CampaignProduct({ product, code = product.id }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-right">
      <Image
        src={product.image}
        alt={product.name}
        width={70}
        height={70}
        className="size-[70px] shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0">
        <p className="text-small text-text-primary">{product.name}</p>
        <p className="mt-1 text-[13px] leading-5 text-text-secondary" dir="ltr">
          PRD–{code}
        </p>
      </div>
    </div>
  );
}

export default function SellerCampaigns() {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("tehran");
  const [region, setRegion] = useState("tehran");
  const [page, setPage] = useState(1);
  const rows = useMemo(
    () =>
      CAMPAIGN_PRODUCTS.filter(
        (product) =>
          (status === "all" || product.status === status) &&
          (!query.trim() ||
            `${product.name} PRD-${product.id}`.includes(query.trim())) &&
          city === "tehran" &&
          region === "tehran",
      ),
    [status, query, city, region],
  );
  const filtered =
    status !== "all" ||
    query.trim() ||
    city !== "tehran" ||
    region !== "tehran";
  const visibleRows = page === 1 ? rows : [];
  return (
    <div className="flex-1 bg-surface-muted bg-pattern-diagonal-fine">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 pb-24 pt-8 lg:p-10">
        <SellerHeader />
        <section
          aria-label="وضعیت کمپین‌ها"
          className="flex gap-2 overflow-x-auto"
        >
          {CAMPAIGN_STATUSES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={status === item.id}
              onClick={() => {
                setStatus(item.id);
                setPage(1);
              }}
              className={`${CAMPAIGN_CONTROL} h-[46px] shrink-0 border px-4 text-body ${status === item.id ? "border-primary bg-primary text-text-on-primary" : "border-border-default bg-surface text-text-primary"}`}
            >
              {item.label}
              <span
                className={`rounded-md px-1.5 py-0.5 text-caption font-semibold ${status === item.id ? "bg-surface/20" : "bg-surface-muted"}`}
              >
                {number(item.count)}
              </span>
            </button>
          ))}
        </section>
        <section
          aria-label="جست‌وجو و فیلتر کمپین‌ها"
          className="grid gap-3 rounded-card bg-surface p-4 lg:grid-cols-[minmax(0,1fr)_280px_280px]"
        >
          <div className="relative min-w-0">
            <Input
              variant="plain"
              aria-label="جست‌وجوی محصول یا شناسه محصول"
              placeholder="جست‌وجو محصول یا شناسه محصول"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="h-10! rounded-lg bg-surface-muted pr-10 pl-3 text-[13px] placeholder:text-text-muted"
            />
            <SearchIcon
              size={20}
              className="pointer-events-none absolute top-2.5 right-3 text-text-muted"
            />
          </div>
          <CampaignSelect
            label="شهر"
            value={city}
            onChange={(value) => {
              setCity(value);
              setPage(1);
            }}
            options={[
              { value: "tehran", label: "تهران" },
              { value: "karaj", label: "کرج" },
              { value: "isfahan", label: "اصفهان" },
            ]}
          />
          <CampaignSelect
            label="شهر شعبه"
            value={region}
            onChange={(value) => {
              setRegion(value);
              setPage(1);
            }}
            options={[
              { value: "tehran", label: "تهران" },
              { value: "karaj", label: "کرج" },
            ]}
          />
        </section>
        <ProfileCard className="flex flex-col gap-4 p-6 lg:p-6 lg:min-h-[860px]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
            <h2 className="text-body font-semibold">کمپین‌های فروش</h2>
            <Link
              href="/seller/discounts/new"
              className={`${CAMPAIGN_CONTROL} h-11 bg-primary px-4 font-semibold text-text-on-primary hover:bg-primary-600`}
            >
              <PlusSimpleIcon size={24} />
              ایجاد کمپین فروش
            </Link>
          </div>
          <div className="overflow-x-auto">
            <div className="relative min-w-[960px] pl-4 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary-50 after:absolute after:top-0 after:left-0 after:h-[94px] after:w-0.5 after:bg-primary-400">
              <table className="w-full table-fixed text-center text-[13px] leading-5">
                <colgroup>
                  <col className="w-[27%]" />
                  <col className="w-[15%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                  <col className="w-[18%]" />
                  <col className="w-[12%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead className="h-11 bg-surface-subtle text-small font-normal text-text-muted">
                  <tr>
                    {[
                      "محصول و شناسه محصول",
                      "قیمت فروش ویژه",
                      "بازدید",
                      "فروش موفق",
                      "بازه زمانی",
                      "وضعیت",
                      "عملیات",
                    ].map((title, index) => (
                      <th
                        key={title}
                        scope="col"
                        className={`font-normal ${index === 0 ? "rounded-r-xl pr-4 text-right" : index === 6 ? "rounded-l-xl" : ""}`}
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((product) => (
                    <tr
                      key={product.id}
                      className="h-[102px] border-b border-border-subtle"
                    >
                      <td className="pr-4 py-3">
                        <CampaignProduct product={product} code="1024" />
                      </td>
                      <td className="font-semibold text-text-primary">
                        {number(product.offer)} تومان
                      </td>
                      <td className="text-text-secondary">۲۰</td>
                      <td className="text-text-secondary">
                        {number(product.sold)}
                      </td>
                      <td className="text-text-secondary">۱۴۰۱/۰۷/۳۱</td>
                      <td>
                        <span
                          className={`inline-flex h-7 w-[88px] items-center justify-center rounded-md text-caption font-semibold ${CAMPAIGN_STATUS_STYLE[product.status].className}`}
                        >
                          {CAMPAIGN_STATUS_STYLE[product.status].label}
                        </span>
                      </td>
                      <td>
                        <div
                          className="flex items-center justify-center gap-4"
                          dir="ltr"
                        >
                          <Link
                            href={`/seller/discounts/${product.id}`}
                            aria-label={`مشاهده و درخواست ویرایش ${product.name}`}
                            className={`${CAMPAIGN_CONTROL} size-8 bg-surface-subtle text-text-secondary hover:bg-primary-50`}
                          >
                            <EditIcon size={24} />
                          </Link>
                          <button
                            type="button"
                            aria-label={`پیام‌های کمپین ${product.name}`}
                            onClick={() =>
                              toast("پیامی برای این کمپین نمونه ثبت نشده است.")
                            }
                            className={`${CAMPAIGN_CONTROL} size-8 bg-surface-subtle text-text-secondary hover:bg-primary-50`}
                          >
                            <MessageTextIcon size={24} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!visibleRows.length && (
                <div
                  className="flex min-h-48 flex-col items-center justify-center gap-3 text-small text-text-muted"
                  role="status"
                >
                  <p>
                    {page > 1
                      ? "داده‌های این صفحه هنوز از سرویس دریافت نشده است."
                      : "کمپینی با این مشخصات پیدا نشد."}
                  </p>
                  <button
                    type="button"
                    className={`${CAMPAIGN_CONTROL} border border-border-default px-4 py-2 text-primary`}
                    onClick={() => {
                      setPage(1);
                      setStatus("all");
                      setQuery("");
                      setCity("tehran");
                      setRegion("tehran");
                    }}
                  >
                    نمایش کمپین‌ها
                  </button>
                </div>
              )}
            </div>
          </div>
          <footer
            className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5"
            dir="ltr"
          >
            <p className="text-[13px] leading-5 text-text-muted" dir="rtl">
              {filtered
                ? `نمایش ${number(visibleRows.length)} مورد`
                : page === 1
                  ? "نمایش ۱ تا ۱۰ از ۱۴۸ مورد"
                  : "اطلاعات این صفحه در دسترس نیست"}
            </p>
            <nav
              aria-label="صفحه‌بندی کمپین‌ها"
              className="flex items-center gap-2"
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`${CAMPAIGN_CONTROL} h-8 border border-border-default px-3 text-[13px]`}
              >
                قبلی
              </button>
              {(filtered ? [1] : [1, 2, 3, "…", 15]).map((item) =>
                item === "…" ? (
                  <span key={item} className="text-text-muted">
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    key={item}
                    aria-current={item === page ? "page" : undefined}
                    onClick={() => setPage(item)}
                    className={`${CAMPAIGN_CONTROL} size-7 rounded-md text-[13px] ${page === item ? "bg-primary text-text-on-primary" : "bg-surface-muted"}`}
                  >
                    {number(item)}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={filtered || page === 15}
                onClick={() => setPage(page + 1)}
                className={`${CAMPAIGN_CONTROL} h-8 border border-border-default px-3 text-[13px]`}
              >
                بعدی
              </button>
            </nav>
          </footer>
        </ProfileCard>
      </div>
    </div>
  );
}
