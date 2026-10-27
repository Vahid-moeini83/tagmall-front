"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { extendTailwindMerge } from "tailwind-merge";
import SellerFinancialReport from "./SellerFinancialReport";
import SellerWallet from "./SellerWallet";
import useSellerProfileSection from "../hooks/useSellerProfileSection";
import SellerHeader from "./SellerHeader";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EditIcon,
  MessageTextIcon,
  PlusSimpleIcon,
  ReceiptIcon,
  ShareIcon,
  StoreIcon,
  ChevronDownIcon,
  SupportIcon,
  CheckCircleIcon,
  CloseCircleIcon,
} from "@/icons";

// Register project typography tokens so class merging keeps font sizes and colors distinct.
export const mergeProfileClasses = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "body",
            "small",
            "caption",
            "label",
          ],
        },
      ],
    },
  },
});

const PROFILE_SECTIONS = [
  {
    id: "contact",
    title: "اطلاعات ارتباطی:",
    icon: SupportIcon,
    fields: [
      { label: "شماره تماس", value: "۰۹۰۲۱۲۳۲۳۲۳", dropdown: true },
      { label: "شماره تلفن ثابت", value: "۰۲۱۲۲۴۴۵۴", dropdown: true },
      {
        label: "پست الکترونیک شرکتی",
        value: "meymandiarman@gmail.com",
        dropdown: true,
      },
      {
        label: "نشانی های اینترنتی ( ip )",
        value: "192.168.1.1",
        dropdown: true,
      },
    ],
  },
  {
    id: "finance",
    title: "اطلاعات مالی",
    icon: ReceiptIcon,
    fields: [
      { label: "نام بانک", value: "بانک ملی ایران", dropdown: true },
      { label: "شماره حساب بانکی", value: "۱۲۳۴۵۶۷۸۹۰" },
      { label: "شماره کارت", value: "۶۰۳۷۱۰۲۴۹۵۰۴۸۲۴" },
      { label: "شماره شبا (IBAN)", value: "IR۹۵۰۱۷۰۰۰۰۰۰۰۳۴۰۵۶۲۰۹MDA" },
    ],
  },
];

const SOCIAL_FIELDS = [
  { label: "اینستاگرام", value: "digikit_official", strong: true },
  { label: "تلگرام", value: "t.me/digikit", muted: true },
  { label: "وب‌سایت", value: "https://digikit.ir", muted: true },
];

export function SectionHeader({
  title,
  Icon,
  action,
  className = "",
  titleClassName,
  iconClassName,
  iconSize = 20,
  titleGroupClassName,
}) {
  return (
    <div
      className={mergeProfileClasses(
        "flex h-10 items-center justify-between gap-3",
        className,
      )}
    >
      <div
        className={mergeProfileClasses(
          "flex items-center gap-3",
          titleGroupClassName,
        )}
      >
        <span
          className={mergeProfileClasses(
            "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-text-secondary",
            iconClassName,
          )}
        >
          <Icon size={iconSize} />
        </span>
        <h2
          className={mergeProfileClasses(
            "text-body font-semibold text-text-primary",
            titleClassName,
          )}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function ProfileField({
  label,
  value,
  dropdown,
  required = true,
  strong = false,
}) {
  const [selectedValue, setSelectedValue] = useState(value);
  const fieldId = `seller-profile-${label}`;

  return (
    <div className="flex min-w-0 flex-col gap-2 text-small text-text-secondary">
      <span className="flex items-center justify-start gap-1">
        <label htmlFor={fieldId}>{label}</label>
        {required && <span className="text-error">*</span>}
      </span>
      <span className="relative block">
        {dropdown ? (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <button
                id={fieldId}
                type="button"
                aria-label={label}
                className={`flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-border-default bg-surface-subtle px-3 text-right text-small ${strong ? "text-text-primary" : "text-text-disabled"} focus-visible:border-primary focus-visible:outline-none`}
              >
                <span dir="auto" lang={/[A-Za-z0-9]/.test(value) ? "en" : "fa"}>
                  {selectedValue}
                </span>
                <ChevronDownIcon
                  size={18}
                  className="shrink-0 text-text-muted"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              dir="rtl"
              align="start"
              className="theme-new border border-border-default bg-surface py-1 shadow-dropdown"
            >
              <DropdownMenuRadioGroup
                value={selectedValue}
                onValueChange={setSelectedValue}
              >
                <DropdownMenuRadioItem
                  value={value}
                  className="justify-start px-3 text-right text-small text-text-primary"
                >
                  {value}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Input
            id={fieldId}
            aria-label={label}
            defaultValue={value}
            variant={strong ? "sellerProfileStrong" : "sellerProfile"}
            dir="auto"
            lang={/[A-Za-z0-9]/.test(value) ? "en" : "fa"}
            className="w-full text-right"
          />
        )}
      </span>
    </div>
  );
}

export function ProfileCard({
  children,
  className = "",
  radiusClassName = "rounded-card",
  ...props
}) {
  return (
    <section
      className={mergeProfileClasses(
        radiusClassName,
        "bg-surface p-5 lg:p-7",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

function ProfileFormSection({ section }) {
  const Icon = section.icon;

  return (
    <ProfileCard>
      <SectionHeader title={section.title} Icon={Icon} />
      <div className="mt-5 border-t border-border-subtle pt-[19px]">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2">
          {section.fields.map((field) => (
            <div
              key={field.label}
              className={field.full ? "lg:col-start-1" : ""}
            >
              <ProfileField {...field} />
            </div>
          ))}
        </div>
      </div>
    </ProfileCard>
  );
}

function ProfileIdentityCard() {
  return (
    <ProfileCard>
      <SectionHeader title="اطلاعات هویتی" Icon={StoreIcon} />
      <div className="mt-5 border-t border-border-subtle pt-[19px]">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2">
          <ProfileField
            label="نام شرکت"
            value="نوآوران گسترش فناوری راه ابریشم"
          />
          <ProfileField label="شناسه ملی شرکت" value="14012051005" />
          <div className="lg:col-start-1">
            <ProfileField label="کد اقتصادی" value="14012051005" />
          </div>
        </div>
        <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-xl border border-dashed border-border-default p-4 lg:h-[110px] lg:flex-row lg:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-text-secondary">
              <EditIcon size={24} />
            </span>
            <div className="text-right">
              <h3 className="text-body font-semibold text-text-primary">
                در اطلاعات هویتی شرکت تغییری داشتید؟
              </h3>
              <p className="mt-1 text-small text-text-muted">
                اطلاعات پس از بررسی آخرین روزنامه رسمی ویرایش می شود
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.error("ثبت درخواست ویرایش فعلاً در دسترس نیست")
            }
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-small font-semibold text-text-on-primary transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>درخواست ویرایش اطلاعات</span>
            <MessageTextIcon size={20} />
          </button>
        </div>
      </div>
    </ProfileCard>
  );
}

function SellerPermits() {
  const columns = [
    "شناسه صنفی",
    "تاریخ انقضا",
    "رسته فعالیت",
    "وضعیت",
    "عملیات",
  ];

  return (
    <ProfileCard>
      <SectionHeader
        title="مجوزها"
        Icon={ReceiptIcon}
        className="h-11"
        action={
          <button
            type="button"
            onClick={() => toast.error("افزودن مجوز فعلاً در دسترس نیست")}
            className="flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-small font-semibold text-text-on-primary transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>افزودن مجوز فروش</span>
            <PlusSimpleIcon size={20} />
          </button>
        }
      />
      <div className="mt-5 overflow-x-auto border-t border-border-subtle pt-[19px]">
        <div className="min-w-[760px]">
          <div className="grid h-[46px] grid-cols-[1fr_1fr_2fr_1fr_1fr] items-center rounded-md bg-surface-subtle text-center text-small text-text-muted">
            {columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          <div className="mt-4 grid h-14 grid-cols-[1fr_1fr_2fr_1fr_1fr] items-center rounded-md border border-border-subtle text-center text-small text-text-primary">
            <span>۰۲۱۸۸۸۸۴۴۲۲</span>
            <span>۱۴۰۵/۰۵/۱۲</span>
            <span>عرضه انواع کالا و خدمات در فروشگاه های مجازی</span>
            <span className="mx-auto rounded-sm bg-success/10 px-2 py-1 text-caption font-semibold text-success">
              تایید شده
            </span>
            <span className="flex items-center justify-center gap-2">
              <button
                type="button"
                aria-label="ویرایش مجوز"
                onClick={() => toast.error("ویرایش مجوز فعلاً در دسترس نیست")}
                className="flex size-8 items-center justify-center rounded-md bg-surface-subtle text-text-secondary"
              >
                <EditIcon size={20} />
              </button>
              <button
                type="button"
                aria-label="پیام درباره مجوز"
                onClick={() => toast.error("ارسال پیام فعلاً در دسترس نیست")}
                className="flex size-8 items-center justify-center rounded-md bg-surface-subtle text-text-secondary"
              >
                <MessageTextIcon size={20} />
              </button>
            </span>
          </div>
        </div>
      </div>
    </ProfileCard>
  );
}

function SellerSocialLinks() {
  return (
    <ProfileCard>
      <SectionHeader title="شبکه‌های اجتماعی و وب‌سایت" Icon={ShareIcon} />
      <div className="mt-5 space-y-4 border-t border-border-subtle pt-[19px]">
        {SOCIAL_FIELDS.map((field) => (
          <ProfileField key={field.label} {...field} required={false} />
        ))}
      </div>
    </ProfileCard>
  );
}

function SellerSettings() {
  const [settings, setSettings] = useState({
    storeActive: true,
    receiveMessages: true,
  });
  const rows = [
    {
      key: "storeActive",
      title: "فعالیت و نمایش فروشگاه",
      icon: StoreIcon,
      iconSize: 22,
      settingTitle: "وضعیت فعال بودن فروشگاه",
      description: "فعال یا غیرفعال بودن فروشگاه را برای کاربران مشخص کنید.",
    },
    {
      key: "receiveMessages",
      title: "ارتباط با کاربران",
      icon: MessageTextIcon,
      iconSize: 24,
      settingTitle: "امکان دریافت پیام از کاربر",
      description:
        "اجازه دهید کاربران برای فروشگاه پیام بفرستند؛ این گزینه مربوط به دریافت پیام است.",
    },
  ];

  const submit = (event) => {
    event.preventDefault();
    toast.error(
      "ذخیرهٔ تنظیمات فروشگاه هنوز به سرویس متصل نیست؛ تغییرات فقط در پیش‌نمایش این صفحه هستند.",
      { className: "theme-new" },
    );
  };

  return (
    <div className="flex-1 bg-surface-muted bg-pattern-diagonal-fine">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 pb-24 pt-8 lg:min-h-[1032px] lg:px-10 lg:pb-10 lg:pt-10">
        <SellerHeader />
        <form
          onSubmit={submit}
          className="flex flex-col gap-6"
          aria-label="تنظیمات فروشگاه"
        >
          {rows.map((row) => (
            <ProfileCard
              key={row.key}
              aria-label={row.title}
              className="flex flex-col gap-4 p-6 lg:p-6"
            >
              <SectionHeader
                title={row.title}
                Icon={row.icon}
                iconSize={row.iconSize}
                iconClassName={`rounded-none bg-transparent text-primary ${row.key === "storeActive" ? "size-[22px]" : "size-6"}`}
                titleClassName="text-h5 leading-[26px]"
                titleGroupClassName="gap-2"
                className={
                  row.key === "storeActive"
                    ? "h-auto min-h-7 flex-wrap lg:h-7 lg:flex-nowrap"
                    : "h-auto min-h-[26px] flex-wrap lg:h-[26px] lg:flex-nowrap"
                }
                action={
                  row.key === "storeActive" ? (
                    <span
                      role="status"
                      dir="ltr"
                      className={`inline-flex min-h-7 min-w-[142px] items-center justify-center gap-[6px] rounded-md px-[10px] py-[5px] text-caption ${settings.storeActive ? "bg-success-strong/10 text-success-strong" : "bg-error/10 text-error"}`}
                    >
                      <span>
                        {settings.storeActive
                          ? "فروشگاه فعال است"
                          : "فروشگاه غیرفعال است"}
                      </span>
                      {settings.storeActive ? (
                        <CheckCircleIcon size={14} />
                      ) : (
                        <CloseCircleIcon size={14} />
                      )}
                    </span>
                  ) : (
                    <span className="text-caption text-text-muted">
                      ۲ تنظیم مستقل
                    </span>
                  )
                }
              />
              <div className="h-px bg-border-subtle" />
              <div className="flex min-h-[52px] flex-col items-start justify-between gap-4 lg:flex-row lg:items-center lg:gap-8">
                <div className="min-w-0 flex-1">
                  <h3 id={`seller-setting-${row.key}`} className="text-body">
                    {row.settingTitle}
                  </h3>
                  <p
                    id={`seller-setting-${row.key}-description`}
                    className="mt-1 text-small text-text-secondary"
                  >
                    {row.description}
                  </p>
                </div>
                <fieldset
                  aria-labelledby={`seller-setting-${row.key}`}
                  aria-describedby={`seller-setting-${row.key}-description`}
                  className="m-0 flex h-10 w-48 shrink-0 items-center gap-1 rounded-lg border border-border-default bg-surface-subtle p-[3px]"
                >
                  <legend className="sr-only">{row.settingTitle}</legend>
                  {[
                    { value: true, label: "فعال" },
                    { value: false, label: "غیرفعال" },
                  ].map((option) => (
                    <Radio
                      key={option.label}
                      variant="segmented"
                      name={`seller-${row.key}`}
                      value={String(option.value)}
                      label={option.label}
                      checked={settings[row.key] === option.value}
                      onChange={() =>
                        setSettings((current) => ({
                          ...current,
                          [row.key]: option.value,
                        }))
                      }
                    />
                  ))}
                </fieldset>
              </div>
            </ProfileCard>
          ))}
          <footer className="flex flex-wrap items-center gap-3" dir="ltr">
            <button
              type="submit"
              className="flex h-11 w-[159px] items-center justify-center gap-2 rounded-lg bg-primary px-6 text-small text-text-on-primary transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
              dir="rtl"
            >
              <CheckCircleIcon size={18} variant="plain" />
              <span>ذخیره تغییرات</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setSettings({ storeActive: true, receiveMessages: true })
              }
              className="h-11 w-[83px] rounded-lg border border-border-default bg-surface px-5 text-small text-text-secondary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
            >
              انصراف
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default function SellerProfile() {
  const section = useSellerProfileSection();
  const handleSubmit = (event) => {
    event.preventDefault();
    toast.error("ذخیره اطلاعات پروفایل فعلاً به سرویس متصل نیست");
  };

  if (section === "financial") return <SellerFinancialReport />;
  if (section === "wallet") return <SellerWallet />;
  if (section === "settings") return <SellerSettings />;

  return (
    <main className="mx-auto w-full max-w-[1140px] px-4 pb-10 pt-8 lg:px-10 lg:pt-10">
      <header className="mb-6 flex h-[52px] items-center justify-between">
        <div className="text-right">
          <h1 className="text-h4 font-semibold text-text-primary">
            پنل فروشگاه تگ مال
          </h1>
          <p className="text-caption text-text-muted">
            امروز ۳۰ مرداد ماه ۱۴۰۵ ساعت ۱۲:۲۴
          </p>
        </div>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <ProfileCard className="flex min-h-[108px] items-center justify-between gap-4 rounded-xl px-5 py-4 lg:px-6 lg:py-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative size-[60px] shrink-0">
              <Image
                src="/assets/images/seller/profile/store-logo.png"
                alt="لوگوی فروشگاه"
                fill
                sizes="60px"
                className="rounded-full object-cover"
              />
              <button
                type="button"
                aria-label="ویرایش تصویر فروشگاه"
                onClick={() =>
                  toast.error("ویرایش تصویر فروشگاه فعلاً در دسترس نیست")
                }
                className="absolute left-[18px] top-[44px] z-10 flex size-[26px] items-center justify-center rounded-full border border-primary bg-surface text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <EditIcon size={12} />
              </button>
            </div>
            <div className="min-w-0 text-right">
              <h2 className="text-h5 font-semibold text-text-primary">
                آرمان میمندی نژاد
              </h2>
              <p className="mt-2 text-small text-text-secondary">
                با تأیید هویت، نشست‌های فعال را مدیریت و از خدمات کیف پول
                اعتباری بهره‌مند شوید.
              </p>
            </div>
          </div>
        </ProfileCard>

        <ProfileIdentityCard />

        {PROFILE_SECTIONS.map((section) => (
          <ProfileFormSection key={section.id} section={section} />
        ))}

        <SellerPermits />
        <SellerSocialLinks />

        <div className="flex items-center gap-4" dir="ltr">
          <button
            type="submit"
            dir="rtl"
            className="h-[50px] rounded-md bg-primary px-8 text-small font-semibold text-text-on-primary transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            ذخیره تغییرات
          </button>
          <button
            type="reset"
            dir="rtl"
            className="h-[50px] rounded-md border border-border-default bg-surface px-8 text-small font-semibold text-text-secondary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            انصراف
          </button>
        </div>
      </form>
    </main>
  );
}
