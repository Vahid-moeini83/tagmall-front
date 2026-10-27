"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SellerHeader from "./SellerHeader";
import {
  ProfileCard,
  SectionHeader,
  mergeProfileClasses,
} from "./SellerProfile";
import ProfileAddressContent from "@/components/modules/profile/components/ProfileAddressContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  EditIcon,
  LocationPinLineIcon,
  MessageTextIcon,
  PlusSimpleIcon,
  ReceiptIcon,
} from "@/icons";

const INITIAL_ADDRESS =
  "خیابان ولیعصر، تقاطع بزرگمهر، مجتمع تجاری بزرگمهر، طبقه دوم، واحد ۲۴";
const INITIAL_IMAGES = [
  {
    src: "/assets/images/seller/branches/interior.png",
    alt: "نمای داخلی شعبه",
  },
  {
    src: "/assets/images/seller/branches/exterior.png",
    alt: "نمای بیرونی شعبه",
  },
];
const INITIAL_HOURS = {
  firstFrom: "16:00",
  firstTo: "21:00",
  secondFrom: "16:00",
  secondTo: "21:00",
};
const TIME_OPTIONS = Array.from(
  { length: 48 },
  (_, index) =>
    `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`,
);
const PERSIAN_DIGITS = (value) =>
  value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
const CONTROL =
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none";
const PRIMARY = `flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-small font-semibold text-text-on-primary hover:bg-primary-600 ${CONTROL}`;

export default function SellerBranches() {
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [logo, setLogo] = useState(
    "/assets/images/seller/profile/store-logo.png",
  );
  const [addresses, setAddresses] = useState([
    { address: INITIAL_ADDRESS, postalCode: "" },
  ]);
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [hours, setHours] = useState(INITIAL_HOURS);
  const [dialog, setDialog] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hourError, setHourError] = useState("");
  const logoInput = useRef(null);
  const imageInput = useRef(null);
  const temporaryUrls = useRef([]);

  useEffect(
    () => () =>
      temporaryUrls.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );

  const handleImages = (event, isLogo = false) => {
    const files = [...(event.target.files || [])];
    if (!files.length) return;
    const accepted = files.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= 5 * 1024 * 1024,
    );
    if (accepted.length !== files.length)
      toast.error("تصویر باید JPG، PNG یا WebP و حداکثر ۵ مگابایت باشد.");
    const uploaded = accepted
      .slice(0, isLogo ? 1 : Math.max(0, 10 - images.length))
      .map((file) => {
        const src = URL.createObjectURL(file);
        temporaryUrls.current.push(src);
        return { src, alt: file.name };
      });
    if (isLogo && uploaded[0]) setLogo(uploaded[0].src);
    else if (uploaded.length) setImages((current) => [...current, ...uploaded]);
    else if (accepted.length)
      toast.error("حداکثر ۱۰ تصویر برای پیش‌نمایش شعبه قابل انتخاب است.");
    event.target.value = "";
  };

  const reset = () => {
    setImages(INITIAL_IMAGES);
    setLogo("/assets/images/seller/profile/store-logo.png");
    setAddresses([{ address: INITIAL_ADDRESS, postalCode: "" }]);
    setAddress(INITIAL_ADDRESS);
    setHours(INITIAL_HOURS);
    setHourError("");
    temporaryUrls.current.forEach((url) => URL.revokeObjectURL(url));
    temporaryUrls.current = [];
  };

  const submit = (event) => {
    event.preventDefault();
    if (
      hours.firstFrom >= hours.firstTo ||
      hours.secondFrom >= hours.secondTo
    ) {
      setHourError("در هر بازه، ساعت پایان باید پس از ساعت شروع باشد.");
      return;
    }
    setHourError("");
    toast.error(
      "ذخیرهٔ تغییرات شعبه هنوز به سرویس متصل نیست؛ تغییرات فقط در پیش‌نمایش این صفحه هستند.",
    );
  };

  return (
    <div className="flex-1 bg-surface-muted bg-pattern-diagonal-fine">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 pb-24 pt-8 lg:px-10 lg:pb-10 lg:pt-10">
        <SellerHeader />
        <form onSubmit={submit} className="flex flex-col gap-6">
          <ProfileCard
            aria-label="تصویر و لوگو فروشگاه"
            radiusClassName="rounded-xl"
            className="flex flex-col gap-6 p-6 lg:p-6"
          >
            <div className="flex h-[60px] items-center gap-3">
              <div className="relative size-[60px] shrink-0">
                <Image
                  src={logo}
                  alt="لوگوی فروشگاه"
                  width={60}
                  height={60}
                  className="size-[60px] rounded-full object-cover"
                  unoptimized={logo.startsWith("blob:")}
                />
                <button
                  type="button"
                  aria-label="ویرایش لوگوی فروشگاه"
                  onClick={() => logoInput.current?.click()}
                  className={`absolute left-[18px] top-[44px] flex size-[26px] items-center justify-center rounded-full border border-primary bg-surface text-primary ${CONTROL}`}
                >
                  <EditIcon size={12} />
                </button>
                <input
                  ref={logoInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => handleImages(event, true)}
                  className="hidden"
                  aria-label="انتخاب لوگوی فروشگاه"
                />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <h2 className="text-h5 font-normal leading-7">
                  تصویر و لوگو فروشگاه
                </h2>
                <button
                  type="button"
                  onClick={() => setDialog("rules")}
                  className={`mt-2 text-small text-text-secondary hover:text-primary ${CONTROL}`}
                >
                  قوانین آپلود تصویر
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-border-default p-6 lg:min-h-[110px] lg:flex-row lg:items-center lg:gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-text-secondary">
                  <EditIcon size={24} />
                </span>
                <div>
                  <h3 className="text-h5 font-normal leading-7">
                    برند شما ثبت شده است؟
                  </h3>
                  <p className="mt-3 text-small text-text-secondary">
                    اطلاعات پس از بررسی آخرین روزنامه رسمی ویرایش می شود
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDialog("brand")}
                className={mergeProfileClasses(
                  PRIMARY,
                  "h-[50px] w-full px-6 text-small font-normal lg:w-64 lg:text-body",
                )}
              >
                <MessageTextIcon size={24} />
                <span>درخواست ویرایش اطلاعات</span>
              </button>
            </div>
          </ProfileCard>

          <ProfileCard
            aria-label="تصاویر شعبه"
            radiusClassName="rounded-2xl"
            className="flex flex-col gap-3 p-6 lg:p-6"
          >
            <SectionHeader
              title="تصاویر شعبه"
              Icon={ReceiptIcon}
              titleClassName="text-h5 leading-[26px]"
              className="h-auto flex-wrap gap-y-3 lg:h-11 lg:flex-nowrap"
              action={
                <button
                  type="button"
                  onClick={() => imageInput.current?.click()}
                  className={`${PRIMARY} h-11`}
                >
                  <PlusSimpleIcon size={24} />
                  افزودن تصاویر جدید
                </button>
              }
            />
            <input
              ref={imageInput}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImages}
              className="hidden"
              aria-label="انتخاب تصاویر شعبه"
            />
            <div className="flex min-h-[132px] flex-wrap gap-3">
              {images.map((item) => (
                <button
                  key={item.src}
                  type="button"
                  aria-label={`نمایش ${item.alt}`}
                  onClick={() => {
                    setPreview(item);
                    setDialog("preview");
                  }}
                  className={`size-[132px] overflow-hidden rounded-lg ${CONTROL}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={132}
                    height={132}
                    className="size-[132px] object-cover"
                    unoptimized={item.src.startsWith("blob:")}
                  />
                </button>
              ))}
              {!images.length && (
                <p className="py-8 text-small text-text-muted">
                  هنوز تصویری برای شعبه انتخاب نشده است.
                </p>
              )}
            </div>
          </ProfileCard>

          <ProfileCard
            aria-label="آدرس فروشگاه"
            className="flex flex-col gap-4 p-6 lg:p-6"
          >
            <SectionHeader
              title="آدرس فروشگاه"
              Icon={ReceiptIcon}
              titleClassName="text-h5 leading-[26px]"
              className="h-auto flex-wrap gap-y-3 lg:h-11 lg:flex-nowrap"
              action={
                <button
                  type="button"
                  onClick={() => setDialog("address")}
                  className={`${PRIMARY} h-11`}
                >
                  <PlusSimpleIcon size={24} />
                  افزودن آدرس
                </button>
              }
            />
            <div className="h-px bg-border-subtle" />
            <div className="flex flex-col gap-2">
              <label
                id="branch-address-label"
                className="flex items-center gap-1 text-small text-text-muted"
              >
                شناسه صنفی <span className="text-error">*</span>
              </label>
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-labelledby="branch-address-label"
                    className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-lg border border-border-default bg-surface-subtle px-3 py-3 text-right text-small ${CONTROL}`}
                  >
                    <span>{address}</span>
                    <ChevronDownIcon
                      size={20}
                      className="shrink-0 text-text-muted"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="theme-new border border-border-default bg-surface text-text-primary shadow-dropdown"
                  dir="rtl"
                >
                  <DropdownMenuRadioGroup
                    value={address}
                    onValueChange={setAddress}
                  >
                    {addresses.map((item) => (
                      <DropdownMenuRadioItem
                        key={item.address}
                        value={item.address}
                        className="text-right text-small focus:bg-primary-50"
                      >
                        {item.address}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ProfileCard>

          <ProfileCard
            aria-label="ساعت کاری امروز"
            className="flex flex-col gap-5 p-7 lg:p-7"
          >
            <SectionHeader
              title="ساعت کاری امروز"
              Icon={LocationPinLineIcon}
              className="h-11"
              titleClassName="font-normal"
              iconClassName="size-11"
              iconSize={24}
            />
            <div className="relative h-0 after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-border-subtle" />
            <div
              className="flex min-h-[102px] flex-col items-center justify-between gap-4 rounded-lg border border-border-default bg-surface-subtle px-4 py-[14px] lg:flex-row"
              dir="ltr"
            >
              <div className="flex w-full min-w-0 flex-1 flex-wrap items-center gap-x-[88px] gap-y-4">
                {[
                  { title: "بازه دوم", key: "second", label: false },
                  { title: "بازه اول", key: "first", label: true },
                ].map((period) => (
                  <fieldset
                    key={period.key}
                    className={`flex max-w-full shrink-0 items-end gap-6 ${period.label ? "w-[298px]" : "w-[301px] pt-[7px]"}`}
                    dir="rtl"
                  >
                    <legend className="sr-only">{period.title}</legend>
                    <span
                      className={`flex h-11 shrink-0 items-center text-small text-text-muted ${period.label ? "w-12" : "w-[51px]"}`}
                    >
                      {period.title}
                    </span>
                    <div className="flex min-w-0 flex-1 items-end gap-[10px]">
                      {["From", "To"].map((edge) => (
                        <div
                          key={edge}
                          className="flex min-w-0 flex-1 flex-col gap-[6px]"
                        >
                          <label
                            id={`branch-${period.key}-${edge}-label`}
                            className={
                              period.label && edge === "From"
                                ? "text-small text-text-muted"
                                : "text-small text-text-muted lg:sr-only"
                            }
                          >
                            {edge === "From" ? "از ساعت" : "تا ساعت"}
                          </label>
                          <DropdownMenu dir="rtl">
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                aria-label={`${period.title} ${edge === "From" ? "از ساعت" : "تا ساعت"}`}
                                className={`flex h-11 w-full items-center justify-between gap-2 rounded-md border border-border-default bg-surface px-3 text-small ${CONTROL}`}
                              >
                                <span dir="ltr">
                                  {PERSIAN_DIGITS(
                                    hours[`${period.key}${edge}`],
                                  )}
                                </span>
                                <ChevronDownIcon
                                  size={16}
                                  className="shrink-0 text-text-secondary"
                                />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="theme-new max-h-64 border border-border-default bg-surface text-text-primary shadow-dropdown"
                              dir="rtl"
                            >
                              <DropdownMenuRadioGroup
                                value={hours[`${period.key}${edge}`]}
                                onValueChange={(value) => {
                                  setHours((current) => ({
                                    ...current,
                                    [`${period.key}${edge}`]: value,
                                  }));
                                  setHourError("");
                                }}
                              >
                                {TIME_OPTIONS.map((time) => (
                                  <DropdownMenuRadioItem
                                    key={time}
                                    value={time}
                                  >
                                    {PERSIAN_DIGITS(time)}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <div
                className="order-first flex w-full shrink-0 items-center gap-3 text-small lg:order-none lg:w-[116px]"
                dir="rtl"
              >
                <span>شنبه</span>
                <span className="whitespace-nowrap text-text-muted">
                  ۱۴۰۵/۰۷/۲۹
                </span>
              </div>
            </div>
            {hourError && (
              <p role="alert" className="text-small text-error">
                {hourError}
              </p>
            )}
          </ProfileCard>

          <footer className="flex flex-wrap gap-4 pt-3" dir="ltr">
            <button
              type="submit"
              className={mergeProfileClasses(
                PRIMARY,
                "h-[50px] w-[161px] px-8 text-body font-normal",
              )}
            >
              ذخیره تغییرات
            </button>
            <button
              type="button"
              onClick={reset}
              className={`h-[50px] w-[113px] rounded-lg border border-border-default bg-surface px-8 text-body text-text-secondary hover:bg-surface-subtle ${CONTROL}`}
            >
              انصراف
            </button>
          </footer>
        </form>

        <Dialog
          open={Boolean(dialog)}
          onOpenChange={(open) => {
            if (!open) setDialog(null);
          }}
        >
          <DialogContent
            className="theme-new max-h-[80dvh] overflow-y-auto bg-surface [&>button]:left-3 [&>button]:top-3 [&>button]:size-8 [&>button]:rounded-md"
            overlayClassName="theme-new"
            dir="rtl"
          >
            <DialogHeader>
              <DialogTitle>
                {dialog === "address"
                  ? "افزودن آدرس فروشگاه"
                  : dialog === "rules"
                    ? "قوانین آپلود تصویر"
                    : dialog === "preview"
                      ? preview?.alt
                      : "درخواست ویرایش اطلاعات برند"}
              </DialogTitle>
              <DialogDescription>
                {dialog === "address"
                  ? "آدرس جدید را به فهرست ویرایش شعبه اضافه کنید."
                  : dialog === "preview"
                    ? "پیش‌نمایش تصویر شعبه"
                    : dialog === "brand"
                      ? "اطلاعات پس از بررسی آخرین روزنامه رسمی ویرایش می‌شود. ارسال درخواست هنوز به سرویس متصل نیست."
                      : "تصاویر واضح با فرمت JPG، PNG یا WebP و حداکثر حجم ۵ مگابایت انتخاب کنید. حداکثر ۱۰ تصویر در این پیش‌نمایش پذیرفته می‌شود."}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              {dialog === "address" && (
                <ProfileAddressContent
                  activeAddressAuth={false}
                  title="افزودن آدرس شعبه:"
                  submitLabel="افزودن آدرس"
                  onSubmit={async (value) => {
                    const next = value.address.trim();
                    setAddresses((current) =>
                      current.some((item) => item.address === next)
                        ? current.map((item) =>
                            item.address === next
                              ? { address: next, postalCode: value.postalCode }
                              : item,
                          )
                        : [
                            ...current,
                            { address: next, postalCode: value.postalCode },
                          ],
                    );
                    setAddress(next);
                    setDialog(null);
                  }}
                />
              )}
              {dialog === "preview" && preview && (
                <Image
                  src={preview.src}
                  alt={preview.alt}
                  width={600}
                  height={600}
                  className="max-h-[55dvh] w-full rounded-lg object-contain"
                  unoptimized={preview.src.startsWith("blob:")}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
