"use client";

import { useId, useState } from "react";
import Image from "next/image";
import typography from "./FigmaTypography.module.css";
import { getFigmaInputSize } from "./FigmaInputSizes";

const initialAccounts = [
  {
    id: "melli",
    label: "بانک ملی (۱۲۵۲۳۵۳۴۷)",
    icon: "/assets/figma-inputs/bank-melli.svg",
    iconHeight: 25.19685,
  },
  {
    id: "mellat",
    label: "بانک ملت (۴۳۷۶۴۵۷۸)",
    icon: "/assets/figma-inputs/bank-mellat.svg",
    iconHeight: 18,
  },
];

/** Figma bank-account list and inline add state (177:4665). */
export function FigmaBankDropdown({
  accounts: accountsProp,
  value,
  defaultValue = "melli",
  onChange,
  onDeleteAccount,
  onAddAccount,
  onAccountAdded,
  onAddError,
  state = "default",
  size = "large",
}) {
  const id = useId();
  const [localAccounts, setLocalAccounts] = useState(initialAccounts);
  const [localValue, setLocalValue] = useState(defaultValue);
  const [open, setOpen] = useState(state === "selected" || state === "add");
  const [adding, setAdding] = useState(state === "add");
  const [iban, setIban] = useState("");
  const [pending, setPending] = useState(false);
  const accounts = accountsProp ?? localAccounts;
  const selected = value === undefined ? localValue : value;
  const selectedAccount = accounts.find((account) => account.id === selected);
  const sizeTokens = getFigmaInputSize(size);
  const choose = (account) => {
    if (value === undefined) setLocalValue(account.id);
    onChange?.(account.id, account);
    setOpen(false);
  };
  const remove = (account) => {
    onDeleteAccount?.(account);
    if (accountsProp !== undefined) return;
    const next = accounts.filter((item) => item.id !== account.id);
    setLocalAccounts(next);
    if (selected === account.id) {
      const nextAccount = next[0];
      if (value === undefined) setLocalValue(nextAccount?.id ?? "");
      onChange?.(nextAccount?.id ?? "", nextAccount);
    }
  };
  const add = async () => {
    if (!onAddAccount || !iban.trim() || pending) return;
    setPending(true);
    try {
      const result = await onAddAccount(iban.trim());
      const account = result?.account;
      if (result?.success !== true || !account?.id || !account?.label) return;
      if (accountsProp === undefined)
        setLocalAccounts((current) =>
          current.some((item) => item.id === account.id) ? current : [...current, account],
        );
      if (value === undefined) setLocalValue(account.id);
      onChange?.(account.id, account);
      onAccountAdded?.(account, result);
      setIban("");
      setAdding(false);
      setOpen(false);
    } catch (error) {
      onAddError?.(error);
    } finally {
      setPending(false);
    }
  };
  return (
    <div className={`${typography.root} flex w-[474px] flex-col gap-2`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setAdding(false);
          setOpen((current) => !current);
        }}
        dir="ltr"
        className={`flex w-full items-center gap-2 border border-border-default bg-transparent ${sizeTokens.height} ${sizeTokens.radius} ${sizeTokens.padding}`}
      >
        <Image
          src="/assets/figma-inputs/phone-field-chevron.svg"
          alt=""
          width={20}
          height={20}
          unoptimized
        />
        <span dir="rtl" className={`flex-1 text-right text-text-primary ${sizeTokens.text}`}>
          {selectedAccount?.label ?? "حساب بانکی را انتخاب کنید"}
        </span>
      </button>
      {open &&
        (adding ? (
          <div
            dir="rtl"
            className="h-[216px] w-full overflow-hidden rounded-[12px] bg-surface-subtle pt-6"
          >
            <div className="flex flex-col gap-2 px-3">
              <div className="h-[26px] px-3 text-right text-base leading-[26px] text-text-primary">
                افزودن شماره شبا
              </div>
              <div
                dir="ltr"
                className="flex h-[50px] items-center gap-[10px] rounded-[8px] bg-surface-muted px-3"
              >
                <Image
                  src="/assets/figma-inputs/bank-mellat.svg"
                  alt=""
                  width={18}
                  height={18}
                  unoptimized
                />
                <input
                  dir="ltr"
                  value={iban}
                  onChange={(event) => setIban(event.target.value)}
                  placeholder="IR95 0170 0000 0034 0562 0900 04"
                  aria-label="شماره شبا"
                  className={`${typography.input16} min-w-0 flex-1 bg-transparent text-left leading-[26px] text-figma-input-strong outline-none placeholder:text-figma-input-strong`}
                />
              </div>
              <div className="flex h-[22px] items-center gap-2 text-sm leading-[22px] text-text-primary">
                <Image
                  src="/assets/figma-inputs/bank-info.svg"
                  alt=""
                  width={20}
                  height={20}
                  unoptimized
                />
                <span>شماره شبا باید به نام شما باشد</span>
              </div>
              <button
                type="button"
                onClick={add}
                disabled={pending}
                className="h-[46px] rounded-[12px] bg-success-strong text-sm leading-[22px] text-white"
              >
                افزودن حساب بانکی
              </button>
            </div>
          </div>
        ) : (
          <div
            dir="ltr"
            className="box-border h-auto min-h-[163px] w-full overflow-hidden rounded-[12px] bg-surface-subtle px-3 pb-1 pt-3"
          >
            {accounts.map((account) => {
              const checked = account.id === selected;
              return (
                <div
                  key={account.id}
                  className={`flex h-[50px] items-center gap-[10px] rounded-[8px] px-3 ${checked ? "bg-primary-50 text-primary" : "text-figma-input-strong"}`}
                >
                  <button
                    type="button"
                    onClick={() => remove(account)}
                    aria-label={`حذف ${account.label}`}
                    className="size-5 shrink-0 border-0 bg-transparent p-0"
                  >
                    <Image
                      src={
                        checked
                          ? "/assets/figma-inputs/phone-field-trash-selected.svg"
                          : "/assets/figma-inputs/phone-field-trash-unselected.svg"
                      }
                      alt=""
                      width={20}
                      height={20}
                      unoptimized
                    />
                  </button>
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-[10px]">
                    <span dir="rtl" className="min-w-0 flex-1 text-right text-base leading-[26px]">
                      {account.label}
                    </span>
                    {account.icon && (
                      <Image
                        src={account.icon}
                        alt=""
                        width={18}
                        height={account.iconHeight || 18}
                        unoptimized
                        className="h-auto w-[18px]"
                      />
                    )}
                    <input
                      type="radio"
                      name={`${id}-account`}
                      checked={checked}
                      onChange={() => choose(account)}
                      aria-label={account.label}
                      className={`size-5 shrink-0 appearance-none rounded-full border border-border-default bg-white checked:border-primary ${checked ? "bg-[radial-gradient(circle,var(--color-primary)_0_5px,white_5px)]" : ""}`}
                    />
                  </label>
                </div>
              );
            })}
            <div className="h-px bg-border-default" />
            <button
              type="button"
              dir="ltr"
              onClick={() => setAdding(true)}
              className="flex h-[46px] w-full items-center gap-[10px] border-0 bg-transparent px-3"
            >
              <span dir="rtl" className="flex-1 text-right text-sm leading-[22px] text-primary">
                افزودن حساب بانکی
              </span>
              <Image
                src="/assets/figma-inputs/phone-field-plus.svg"
                alt=""
                width={20}
                height={20}
                unoptimized
              />
            </button>
          </div>
        ))}
    </div>
  );
}
