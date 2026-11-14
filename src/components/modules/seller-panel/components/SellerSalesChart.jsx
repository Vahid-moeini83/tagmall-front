"use client";

import { useState } from "react";

const CHART_DATA = [
  {
    month: "مهر",
    thisYear: 150,
    lastYear: 90,
    thisYearHeight: 75,
    lastYearHeight: 45,
  },
  {
    month: "آبان",
    thisYear: 120,
    lastYear: 110,
    thisYearHeight: 60,
    lastYearHeight: 55,
  },
  {
    month: "آذر",
    thisYear: 90,
    lastYear: 70,
    thisYearHeight: 45,
    lastYearHeight: 35,
  },
  {
    month: "دی",
    thisYear: 190,
    lastYear: 140,
    thisYearHeight: 95,
    lastYearHeight: 70,
  },
  {
    month: "بهمن",
    thisYear: 130,
    lastYear: 80,
    thisYearHeight: 65,
    lastYearHeight: 40,
  },
  {
    month: "اسفند",
    thisYear: 170,
    lastYear: 100,
    thisYearHeight: 85,
    lastYearHeight: 50,
  },
];

const Y_AXIS_STEPS = [200, 150, 100, 50, 0];
const MOBILE_Y_AXIS_LABELS = ["۲۰۰", "۱۵۰", "۱۰۰", "۵۰", "۰"];
const DESKTOP_MONTH_LABEL_WIDTHS = [19, 20, 15, 17, 28, 32];

function SellerSalesChart({ variant = "default" }) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  if (variant === "financial") {
    return (
      <section
        aria-labelledby="weekly-revenue-title"
        className="flex h-[310px] min-w-[min(100%,380px)] flex-[37] flex-col gap-5 rounded-card bg-surface p-6"
        dir="rtl"
      >
        <div className="flex h-[25px] items-center justify-between gap-3">
          <h2 id="weekly-revenue-title" className="text-body font-semibold">
            نمودار درآمد هفتگی
          </h2>
          <div className="flex flex-row-reverse items-center gap-2 text-caption text-text-secondary">
            <span className="size-2 rounded-full bg-primary" />
            درآمد روزانه (تومان)
          </div>
        </div>
        <div className="border-t border-border-subtle" />
        <div className="flex h-40 items-start justify-center py-5" dir="ltr">
          <svg
            viewBox="0 0 450 103"
            role="img"
            aria-label="روند درآمد هفتگی از شنبه تا جمعه"
            className="h-[103px] w-[450px] max-w-full overflow-visible text-primary"
          >
            <polyline
              points="0,100 75,72 150,89 225,33 300,56 375,17 450,0"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div className="flex justify-between text-[11px] leading-[17px] text-text-muted" dir="ltr">
          {["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="bg-surface rounded-xl border-0 shadow-none p-4 sm:p-6 lg:rounded-xl lg:ring-1 lg:ring-inset lg:ring-border-subtle lg:shadow-card lg:pt-7 lg:px-8 lg:pb-6 flex flex-col justify-start gap-4 sm:gap-0 h-auto min-h-[332px] lg:h-[399px]">
      {/* Header with Title and Legend */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div>
          <h2 className="text-[18px] leading-[26px] [font-weight:450] text-text-primary sm:text-body sm:leading-[25px] sm:[font-weight:600]">
            نمودار فروش ماهانه <span className="hidden sm:inline">(۶ ماه اخیر)</span>
          </h2>
          <p className="mt-[2px] text-[12px] leading-[18px] [font-weight:325] text-text-muted sm:hidden">۶ ماه اخیر</p>
        </div>

        {/* Legend */}
        <div className="flex h-[18px] items-center gap-4 sm:gap-5 text-caption leading-[18px] [font-weight:325] text-text-secondary sm:text-text-primary">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>امسال</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-100 sm:bg-primary-50" />
            <span>سال گذشته</span>
          </div>
        </div>
      </div>

      {/* Mobile chart: month order and value axis follow the PWA frame. */}
      <div className="relative flex h-[204px] w-full gap-2 sm:hidden" dir="rtl">
        <div className="flex h-[184px] w-6 shrink-0 flex-col justify-between text-[12px] leading-[18px] [font-weight:325] text-text-muted">
          {MOBILE_Y_AXIS_LABELS.map((step) => (
            <span key={step} className="w-6 text-right">{step}</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-[176px] w-full">
            <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[176px] flex-col justify-between">
              {Y_AXIS_STEPS.map((step) => (
                <span key={step} className="w-full border-t border-primary-50" />
              ))}
            </div>
            <div className="absolute inset-0 flex h-[176px] items-end justify-between" dir="ltr">
              {[...CHART_DATA].reverse().map((item) => {
                const isHovered = hoveredMonth === item.month;

                return (
                  <div
                    key={item.month}
                    className="group relative flex h-[176px] w-11 shrink-0 cursor-pointer items-end justify-center"
                    onMouseEnter={() => setHoveredMonth(item.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {isHovered && (
                      <div className="absolute -top-10 z-20 whitespace-nowrap rounded-md bg-text-primary px-2.5 py-1 text-[11px] text-surface shadow-card">
                        امسال: {item.thisYear} | پارسال: {item.lastYear}
                      </div>
                    )}
                    <div className="flex h-[168px] items-end gap-1" dir="rtl">
                      <div
                        style={{ height: `${item.thisYearHeight}%` }}
                        className="w-[13px] rounded-t-[4px] bg-primary transition-all duration-200 group-hover:brightness-110"
                      />
                      <div
                        style={{ height: `${item.lastYearHeight}%` }}
                        className="w-[13px] rounded-t-[4px] bg-primary-50 transition-all duration-200 group-hover:bg-primary-100"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-[10px] flex h-[18px] w-full items-center justify-between gap-[6px] text-[12px] leading-[18px] [font-weight:325] text-text-secondary" dir="ltr">
            {[...CHART_DATA].reverse().map((item) => (
              <span key={item.month} className="w-11 shrink-0 text-center">
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop chart */}
      <div className="relative mt-6 hidden flex-1 flex-col justify-between sm:flex sm:min-h-0">
        {/* Horizontal Grid lines with Y-Axis Labels */}
        <div className="pointer-events-none absolute left-0 top-0 flex h-[256px] w-full flex-col justify-between">
          {Y_AXIS_STEPS.map((step) => (
            <div key={step} className="flex h-[13px] w-full shrink-0 items-center" dir="ltr">
              <span className="w-[21px] select-none text-left text-[11px] leading-[13px] font-normal text-text-primary [font-family:Inter,Arial,sans-serif]">
                {step}
              </span>
              <div className="flex-1 border-t border-primary-50" />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex h-[220px] flex-1 items-end justify-between pb-6 pl-8 pr-4 lg:h-[246px] lg:pb-5" dir="ltr">
          {CHART_DATA.map((item) => {
            const isHovered = hoveredMonth === item.month;

            return (
              <div
                key={item.month}
                className="group relative flex cursor-pointer flex-col items-center"
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {isHovered && (
                  <div className="pointer-events-none absolute -top-10 z-20 whitespace-nowrap rounded-md bg-text-primary px-2.5 py-1 text-[11px] text-surface shadow-card">
                    امسال: {item.thisYear} | پارسال: {item.lastYear}
                  </div>
                )}
                <div className="flex h-[210px] items-end gap-1 lg:h-[246px]" dir="ltr">
                  <div
                    style={{ height: `${item.thisYearHeight}%` }}
                    className="w-6 rounded-t-lg bg-primary transition-all duration-200 group-hover:brightness-110 lg:w-7"
                  />
                  <div
                    style={{ height: `${item.lastYearHeight}%` }}
                    className="w-6 rounded-t-lg bg-primary-50 transition-all duration-200 group-hover:bg-primary-100 lg:w-7"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative flex items-center justify-between pl-[36px] pr-0 pt-1 text-[11px] [font-weight:325] text-text-primary sm:text-caption" dir="ltr">
          {CHART_DATA.map((item, index) => (
            <span
              key={item.month}
              className="shrink-0 text-right"
              style={{ width: `${DESKTOP_MONTH_LABEL_WIDTHS[index]}px` }}
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerSalesChart;
