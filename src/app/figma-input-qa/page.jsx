"use client";

import { useState } from "react";
import {
  FigmaContactModal,
  FigmaDropdown,
  FigmaInput,
  FigmaPhoneFieldContainer,
  FigmaSearchInput,
  FigmaWalletModal,
  FigmaTextarea,
  FigmaToggle,
  FigmaRadio,
  FigmaCheckbox,
} from "@/components/ui/figma-inputs";
import { FigmaAuthCard } from "@/components/ui/figma-auth";

const sellerOptions = [
  { label: "همه فروشنده ها", value: "all", width: 109 },
  { label: "فروشگاه رسمی", value: "official", width: 102 },
  { label: "فروشگاه برگزیده", value: "featured", width: 107 },
  { label: " فروشندگان بومی", value: "local", width: 117 },
];

function StateGroup({ title, items }) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-[#1a1a2e]">{title}</h2>
      <div
        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${items.some((item) => item.wide) ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}
      >
        {items.map((item) => (
          <div key={item.label} className="space-y-3">
            <h3 className="text-sm text-[#4d4d4d]">{item.label}</h3>
            {item.control}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function FigmaInputQaPage() {
  const [defaultSearch, setDefaultSearch] = useState("");
  const [filledSearch, setFilledSearch] = useState("کیف چرمی زنانه");
  const [seller, setSeller] = useState("all");
  const [modalPreview, setModalPreview] = useState(null);
  const [walletPreview, setWalletPreview] = useState(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [simulateVerifyFailure, setSimulateVerifyFailure] = useState(false);
  const [radioChoice, setRadioChoice] = useState("selected");

  const groups = [
    {
      title: "Figma Input/Text · اندازه‌ها",
      items: [
        { label: "Large", control: <FigmaInput variant="text" size="large" state="default" /> },
        { label: "Medium", control: <FigmaInput variant="text" size="medium" state="default" /> },
        { label: "Small", control: <FigmaInput variant="text" size="small" state="default" /> },
        {
          label: "وضعیت‌های Figma · Large",
          wide: true,
          control: (
            <div className="flex flex-wrap gap-4">
              {["filled", "focus", "disabled", "error"].map((state) => (
                <FigmaInput
                  key={state}
                  variant="text"
                  size="large"
                  state={state}
                  defaultValue={
                    state === "error" ? "آرش" : state === "filled" ? "آرش اسفندیاری" : undefined
                  }
                />
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: "Figma Input/Phone · اندازه‌ها",
      items: [
        { label: "Large", control: <FigmaInput variant="phone" size="large" state="default" /> },
        { label: "Medium", control: <FigmaInput variant="phone" size="medium" state="default" /> },
        { label: "Small", control: <FigmaInput variant="phone" size="small" state="default" /> },
        {
          label: "وضعیت‌های Figma · Large",
          wide: true,
          control: (
            <div className="flex flex-wrap gap-4">
              {["filled", "focus", "disabled", "error"].map((state) => (
                <FigmaInput
                  key={state}
                  variant="phone"
                  size="large"
                  state={state}
                  defaultValue={
                    ["filled", "focus", "error"].includes(state) ? "۰۹۱۲ ۳۴۵ ۶۷۸۹" : undefined
                  }
                />
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: "Figma Input/Password · اندازه‌ها",
      items: [
        ...[
          ["large", "Large"],
          ["medium", "Medium"],
          ["small", "Small"],
        ].map(([size, label]) => ({
          label,
          wide: true,
          control: (
            <div className="space-y-4">
              {[
                ["default", "پیش‌فرض", undefined],
                ["visible", "پرشده · نمایان", "TagMall@2024"],
                ["error", "خطا", "123456"],
              ].map(([state, stateLabel, value]) => (
                <div key={`${size}-${state}`} className="space-y-2">
                  <p className="m-0 text-xs text-text-secondary">{stateLabel}</p>
                  <FigmaInput variant="password" size={size} state={state} defaultValue={value} />
                </div>
              ))}
            </div>
          ),
        })),
      ],
    },
    {
      title: "Figma Input/Search · اندازه‌ها",
      items: [
        {
          label: "Large · پیش‌فرض",
          control: (
            <FigmaSearchInput
              size="large"
              value={defaultSearch}
              onChange={(event) => setDefaultSearch(event.target.value)}
              placeholder="جستجو در تگ مال..."
            />
          ),
        },
        {
          label: "Large · پرشده / پاک‌کردن",
          control: (
            <FigmaSearchInput
              size="large"
              value={filledSearch}
              onChange={(event) => setFilledSearch(event.target.value)}
              onClear={() => setFilledSearch("")}
            />
          ),
        },
        {
          label: "Medium",
          control: <FigmaSearchInput size="medium" placeholder="جستجو در تگ مال..." />,
        },
        {
          label: "Small",
          control: <FigmaSearchInput size="small" placeholder="جستجو در تگ مال..." />,
        },
      ],
    },
    {
      title: "Figma Input/Dropdown · اندازه‌ها",
      items: [
        {
          label: "Large · پیش‌فرض",
          control: (
            <FigmaDropdown
              size="large"
              value=""
              onChange={() => {}}
              placeholder="استان خود را انتخاب کنید"
              options={sellerOptions}
            />
          ),
        },
        {
          label: "انتخاب‌شده: تهران",
          control: <FigmaDropdown defaultValue="تهران" placeholder="استان خود را انتخاب کنید" />,
        },
        {
          label: "نمونهٔ منو: برای بازکردن کلیک کن",
          control: <FigmaDropdown value={seller} onChange={setSeller} options={sellerOptions} />,
        },
        {
          label: "Medium",
          control: (
            <FigmaDropdown
              size="medium"
              placeholder="استان خود را انتخاب کنید"
              options={sellerOptions}
            />
          ),
        },
        {
          label: "Small",
          control: (
            <FigmaDropdown
              size="small"
              placeholder="استان خود را انتخاب کنید"
              options={sellerOptions}
            />
          ),
        },
      ],
    },
    {
      title: "Figma PhoneFieldContainer · اندازه‌ها",
      items: [
        {
          label: "Large · پیش‌فرض",
          wide: true,
          control: <FigmaPhoneFieldContainer size="large" state="default" />,
        },
        {
          label: "اندازهٔ Medium",
          wide: true,
          control: <FigmaPhoneFieldContainer state="default" size="medium" />,
        },
        {
          label: "اندازهٔ Small",
          wide: true,
          control: <FigmaPhoneFieldContainer state="default" size="small" />,
        },
        {
          label: "باز / شمارهٔ انتخاب‌شده",
          wide: true,
          control: (
            <FigmaPhoneFieldContainer
              state="selected"
              onRequestCode={() => !simulateFailure}
              onResendCode={() => !simulateFailure}
              onVerifyCode={() => !simulateVerifyFailure}
            />
          ),
        },
        {
          label: "ایمیل / فهرست باز",
          wide: true,
          control: (
            <FigmaPhoneFieldContainer
              type="email"
              state="selected"
              onRequestCode={() => !simulateFailure}
              onResendCode={() => !simulateFailure}
              onVerifyCode={() => !simulateVerifyFailure}
            />
          ),
        },
        {
          label: "آدرس / فهرست باز",
          wide: true,
          control: (
            <FigmaPhoneFieldContainer
              type="address"
              state="selected"
              onAddAddress={() => !simulateFailure}
              onVerifyAddress={() => !simulateVerifyFailure}
            />
          ),
        },
        {
          label: "حساب بانکی / فهرست باز · Large",
          wide: true,
          control: <FigmaPhoneFieldContainer type="bank" state="selected" size="large" />,
        },
        {
          label: "حساب بانکی · Medium",
          wide: true,
          control: <FigmaPhoneFieldContainer type="bank" state="default" size="medium" />,
        },
        {
          label: "حساب بانکی · Small",
          wide: true,
          control: <FigmaPhoneFieldContainer type="bank" state="default" size="small" />,
        },
        {
          label: "حساب بانکی / افزودن شبا",
          wide: true,
          control: (
            <FigmaPhoneFieldContainer
              type="bank"
              state="add"
              onAddAccount={(iban) => ({
                success: !simulateFailure,
                account: { id: iban, label: iban, icon: "/assets/figma-inputs/bank-mellat.svg" },
              })}
            />
          ),
        },
      ],
    },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-white p-4 font-[YekanBakh] text-[#1a1a2e] sm:p-10">
      <h1 className="mb-10 text-xl font-semibold">پیش‌نمایش موقت stateهای کامپوننت‌های Figma</h1>
      <button
        type="button"
        onClick={() => setSimulateFailure((value) => !value)}
        aria-pressed={simulateFailure}
        className="mb-8 rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-sm"
      >
        پاسخ آزمایشی: {simulateFailure ? "ناموفق" : "موفق"}
      </button>
      <button
        type="button"
        onClick={() => setSimulateVerifyFailure((value) => !value)}
        aria-pressed={simulateVerifyFailure}
        className="mb-8 mr-3 rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-sm"
      >
        تأیید آزمایشی: {simulateVerifyFailure ? "ناموفق" : "موفق"}
      </button>
      <div className="w-full max-w-[1240px] space-y-10">
        {groups.map((group) => (
          <StateGroup key={group.title} title={group.title} items={group.items} />
        ))}
        <StateGroup
          title="Figma Input/Toggle"
          items={[
            { label: "پیش‌فرض", control: <FigmaToggle defaultChecked={false} /> },
            { label: "فعال", control: <FigmaToggle defaultChecked /> },
            { label: "غیرفعال · متن کم‌رنگ", control: <FigmaToggle disabled mutedDisabled /> },
          ]}
        />
        <StateGroup
          title="Figma Input/Radio"
          items={[
            {
              label: "انتخاب نشده",
              control: (
                <FigmaRadio
                  name="qa-radio"
                  checked={radioChoice === "unselected"}
                  onChange={() => setRadioChoice("unselected")}
                />
              ),
            },
            {
              label: "انتخاب شده",
              control: (
                <FigmaRadio
                  name="qa-radio"
                  checked={radioChoice === "selected"}
                  onChange={() => setRadioChoice("selected")}
                />
              ),
            },
            { label: "غیرفعال", control: <FigmaRadio name="qa-radio-disabled" disabled /> },
          ]}
        />
        <StateGroup
          title="Figma Input/Checkbox"
          items={[
            { label: "انتخاب نشده", control: <FigmaCheckbox /> },
            { label: "انتخاب شده", control: <FigmaCheckbox defaultChecked /> },
            { label: "غیرفعال", control: <FigmaCheckbox disabled /> },
          ]}
        />
        <StateGroup
          title="Figma Input/Textarea"
          items={[
            {
              label: "پیش‌فرض و شمارندهٔ کاراکتر",
              wide: true,
              control: <FigmaTextarea aria-label="توضیحات" />,
            },
          ]}
        />
        <section className="space-y-4">
          <h2 className="text-base font-semibold">پیش‌نمایش مراحل کد تأیید</h2>
          <div className="flex flex-wrap gap-3">
            {[
              ["phone", 120, "کد شماره"],
              ["phone", 0, "ارسال مجدد شماره"],
              ["email", 120, "کد ایمیل"],
              ["email", 0, "ارسال مجدد ایمیل"],
            ].map(([type, seconds, title]) => (
              <button
                key={title}
                type="button"
                onClick={() => setModalPreview({ type, seconds })}
                className="rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-sm"
              >
                {title}
              </button>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-base font-semibold">پیش‌نمایش کیف پول</h2>
          <div className="flex flex-wrap gap-3">
            {[
              ["credit", "entry", "افزایش اعتبار"],
              ["credit", "success", "موفقیت افزایش اعتبار"],
              ["withdraw", "entry", "درخواست وجه"],
              ["withdraw", "otp", "کد درخواست وجه"],
              ["withdraw", "resend", "ارسال مجدد درخواست"],
              ["withdraw", "success", "موفقیت درخواست وجه"],
            ].map(([mode, stage, title]) => (
              <button
                key={title}
                type="button"
                onClick={() => setWalletPreview({ mode, stage })}
                className="rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-sm"
              >
                {title}
              </button>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Figma ورود و ثبت‌نام · component set 177:3144</h2>
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
            {[
              ["phone", "ورود با شماره موبایل"],
              ["otp-timer", "ورود با کد · زمان باقی‌مانده"],
              ["otp-resend", "ورود با کد · ارسال دوباره"],
              ["register", "ایجاد حساب"],
            ].map(([variant, label]) => (
              <div key={variant} className="space-y-3">
                <h3 className="text-sm text-[#4d4d4d]">{label}</h3>
                <FigmaAuthCard variant={variant} />
              </div>
            ))}
          </div>
        </section>
      </div>
      {modalPreview && (
        <FigmaContactModal
          type={modalPreview.type}
          initialStage="otp"
          initialSeconds={modalPreview.seconds}
          initialValue={modalPreview.type === "phone" ? "09029320918" : "tagmall@info.ir"}
          onResendCode={() => !simulateFailure}
          onClose={() => setModalPreview(null)}
        />
      )}
      {walletPreview && (
        <FigmaWalletModal
          mode={walletPreview.mode}
          initialStage={walletPreview.stage}
          initialAmount={walletPreview.mode === "credit" ? "۱.۰۰۰.۰۰۰" : ""}
          balanceLabel="موجودی شما ۱.۰۰۰.۰۰۰ تومان می‌باشد."
          successDescription={
            walletPreview.mode === "credit"
              ? "مبلغ ۱.۰۰۰.۰۰۰ تومان در ۱ فروردین ۱۴۰۵ ساعت ۰۳:۴۵ به کیف پول اعتباری شما واریز شد."
              : "مبلغ ۱.۰۰۰.۰۰۰ تومان در ۱ فروردین ۱۴۰۵ ساعت ۰۳:۴۵ به حساب شما واریز واریز می شود"
          }
          onClose={() => setWalletPreview(null)}
          onSubmit={() => ({ success: !simulateFailure, description: "پاسخ آزمایشی پیش‌نمایش" })}
          onRequestCode={() => !simulateFailure}
          onResendCode={() => !simulateFailure}
          onVerifyCode={() => ({
            success: !simulateVerifyFailure,
            description: "پاسخ آزمایشی پیش‌نمایش",
          })}
        />
      )}
      <p className="mt-8 text-xs text-[#7a7a96]">
        این پیش‌نمایش از پاسخ آزمایشی استفاده می‌کند؛ کد واقعی ارسال نمی‌شود و آدرس ثبت نمی‌شود.
      </p>
    </main>
  );
}
