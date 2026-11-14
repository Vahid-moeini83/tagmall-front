"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SupportChatContent } from "@/components/modules/support";
import { Input } from "@/components/ui/input";
import { FigmaDropdown } from "@/components/ui/figma-inputs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreSquareIcon, MessageTextIcon, SellerUserIcon } from "@/icons";
import { MESSAGE_SECTIONS } from "../data/messageSections";

const CITY_OPTIONS = ["تهران", "اصفهان", "مشهد", "شیراز"].map((city) => ({
  label: city,
  value: city,
}));

// These preview conversations mirror the selected Figma screens.
function getConversations(category) {
  if (category === "products") {
    return Array.from({ length: 12 }, (_, index) => ({
      id: `product-${index + 1}`,
      name: "گوشی شیائومی پوکو X6 ...",
      summary: "DKP-۴۲۱",
      image: `/assets/images/seller/messages/product-${[1, 3, 6, 9, 11].includes(index) ? "watch" : "phone"}.png`,
      date: "۲۸ اسفند",
      city: "تهران",
      isProduct: true,
    }));
  }

  return Array.from({ length: category === "reviews" ? 5 : 11 }, (_, index) => {
    const isSupport = category !== "reviews" && [2, 5].includes(index);
    return {
      id: `${category}-${index + 1}`,
      name: isSupport ? "واحد پشتیبانی" : "فروشنده ابزار صنعتی",
      summary: isSupport
        ? "سلام، ممنون. وقت شما به خیر..."
        : "بسته به واحد ارسال تحویل داده شد",
      date: isSupport ? "۱۰:۴۲" : "۲۸ اسفند",
      city: "تهران",
      isSupport,
      unread: isSupport,
    };
  });
}

export default function SellerMessages({ category = "experts" }) {
  const section =
    MESSAGE_SECTIONS.find((item) => item.id === category) ||
    MESSAGE_SECTIONS[0];
  const conversations = useMemo(() => getConversations(category), [category]);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("تهران");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(
    ["experts", "customers"].includes(category) ? `${category}-3` : null,
  );
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const selected = conversations.find((item) => item.id === selectedId);

  const visibleConversations = useMemo(() => {
    const search = query.trim();
    return conversations.filter(
      (item) =>
        (!search || `${item.name} ${item.summary}`.includes(search)) &&
        (!unreadOnly || item.unread) &&
        (category !== "experts" || item.city === city),
    );
  }, [conversations, query, unreadOnly, category, city]);

  const chooseConversation = (conversation) => {
    setSelectedId(conversation.id);
    setMobileChatOpen(true);
  };

  return (
    <div
      dir="rtl"
      className="flex h-[calc(100dvh-136px)] min-h-0 shrink-0 bg-surface font-extralight lg:h-dvh"
    >
      {/* The list stays to the right of the conversation on desktop. */}
      <aside
        aria-label={section.label}
        className={`${mobileChatOpen ? "hidden lg:flex" : "flex"} min-h-0 w-full shrink-0 flex-col gap-4 border-l border-border-default bg-surface px-4 pb-2 pt-6 lg:w-[345px] lg:pt-8`}
      >
        <header className="flex h-[26px] shrink-0 items-center justify-between text-body text-text-primary">
          <h2>پیام‌ها</h2>
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger
              id={`seller-messages-options-${category}`}
              className="flex h-6 w-6 items-center justify-center rounded-sm text-text-secondary focus-visible:outline-2 focus-visible:outline-primary"
              aria-label="گزینه‌های پیام‌ها"
            >
              <MoreSquareIcon
                size={48}
                className="shrink-0 rotate-90 [&>path:first-child]:hidden"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="theme-new w-52 border border-border-default bg-surface text-text-primary"
            >
              <DropdownMenuItem
                onSelect={() => {
                  setQuery("");
                  setUnreadOnly(false);
                }}
              >
                همهٔ گفتگوها
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setUnreadOnly(true)}>
                فقط خوانده‌نشده‌ها
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <Input
          variant="seller"
          aria-label="جستجو در پیام‌ها"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="جستجو در پیام ها"
          containerClassName="shrink-0"
          className="pr-11 text-small text-text-primary placeholder:text-text-muted"
        />

        <nav
          aria-label="دسته‌های پیام‌ها"
          className="flex shrink-0 gap-2 overflow-x-auto lg:hidden"
        >
          {MESSAGE_SECTIONS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={item.id === category ? "page" : undefined}
              className={`shrink-0 rounded-md px-3 py-2 text-caption ${item.id === category ? "bg-primary text-white" : "bg-surface-muted text-text-secondary"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {category === "experts" && (
          <FigmaDropdown
            aria-label="شهر گفتگوها"
            size="small"
            className="w-full shrink-0"
            value={city}
            onChange={setCity}
            options={CITY_OPTIONS}
          />
        )}

        <div
          className={`relative min-h-0 flex-1 ${category === "reviews" ? "" : "lg:max-h-[820px]"}`}
        >
          <div
            className={`seller-panel-scroll h-full overflow-y-auto ${category === "reviews" ? "" : "pl-4"}`}
            aria-label="فهرست گفتگوها"
          >
            <div
              className={`mb-2 flex items-center text-caption leading-4 text-text-disabled ${category === "products" ? "h-10" : category === "reviews" ? "h-4" : "h-6"}`}
            >
              {section.label}
            </div>
            <div className="flex flex-col gap-2">
              {visibleConversations.map((item) => {
                const emphasized =
                  !item.isProduct &&
                  (selectedId === item.id ||
                    (category === "customers" && item.isSupport));
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selectedId === item.id}
                    onClick={() => chooseConversation(item)}
                    className={`relative flex w-full shrink-0 flex-col gap-1 rounded-lg py-2 text-right transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${item.isProduct ? "h-[60px] px-0" : "h-[62px] px-3"} ${emphasized ? "bg-primary-50" : "bg-surface"}`}
                  >
                    {item.isProduct ? (
                      <div className="flex h-full items-center gap-2">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={44}
                          height={44}
                          className="h-11 w-11 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1 self-start">
                          <p className="truncate text-caption leading-4 text-text-primary">
                            {item.name}
                          </p>
                          <p className="mt-1 text-[11px] leading-[17px] text-text-muted">
                            {item.summary}
                          </p>
                        </div>
                        <time className="shrink-0 self-start text-caption leading-4 text-text-disabled">
                          {item.date}
                        </time>
                      </div>
                    ) : (
                      <>
                        <div className="flex h-6 items-center justify-between gap-2">
                          <span
                            className={`flex min-w-0 items-center gap-2 text-caption leading-4 ${item.isSupport ? "text-primary" : "text-text-primary"}`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${item.isSupport ? "bg-primary text-white" : "bg-surface-subtle text-text-primary"}`}
                            >
                              {item.isSupport ? (
                                <MessageTextIcon size={14} />
                              ) : (
                                <SellerUserIcon size={14} />
                              )}
                            </span>
                            <span className="truncate">{item.name}</span>
                          </span>
                          <time
                            className={`shrink-0 text-[11px] leading-4 ${item.isSupport ? "font-semibold text-primary" : "text-text-disabled"}`}
                          >
                            {item.date}
                          </time>
                        </div>
                        <div className="flex h-[18px] items-center justify-between gap-2">
                          <p className="truncate text-caption text-text-secondary">
                            {item.summary}
                          </p>
                          {item.unread && (
                            <span
                              aria-label="پیام خوانده‌نشده"
                              className="h-[7px] w-[7px] shrink-0 rounded-circle bg-error"
                            />
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
              {visibleConversations.length === 0 && (
                <p
                  role="status"
                  className="py-8 text-center text-small text-text-muted"
                >
                  گفتگویی پیدا نشد.
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`${mobileChatOpen ? "flex" : "hidden lg:flex"} min-h-0 min-w-0 flex-1`}
      >
        <SupportChatContent
          key={`${category}-${selectedId || "support"}`}
          variant="seller"
          contact={selected}
          onBack={() => setMobileChatOpen(false)}
        />
      </div>
    </div>
  );
}
