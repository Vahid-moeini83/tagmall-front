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
        <div
          className="flex justify-between text-[11px] leading-[17px] text-text-muted"
          dir="ltr"
        >
          {[
            "شنبه",
            "یکشنبه",
            "دوشنبه",
            "سه‌شنبه",
            "چهارشنبه",
            "پنجشنبه",
            "جمعه",
          ].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border-subtle shadow-card p-4 sm:p-6 lg:pt-7 lg:px-8 lg:pb-6 flex flex-col justify-between h-auto min-h-[332px] lg:h-[399px]">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-body font-bold text-text-primary">
            نمودار فروش ماهانه{" "}
            <span className="hidden sm:inline">(۶ ماه اخیر)</span>
          </h2>
          <p className="text-[12px] text-text-muted sm:hidden mt-0.5">
            ۶ ماه اخیر
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 sm:gap-5 text-caption text-text-primary">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>امسال</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-200" />
            <span>سال گذشته</span>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="relative flex-1 mt-4 sm:mt-6 flex flex-col justify-between">
        {/* Horizontal Grid lines with Y-Axis Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {Y_AXIS_STEPS.map((step) => (
            <div
              key={step}
              className="flex items-center gap-2 sm:gap-3 w-full"
              dir="ltr"
            >
              <span className="w-5 sm:w-6 text-[10px] sm:text-[11px] text-text-muted text-left font-normal select-none">
                {step}
              </span>
              <div className="flex-1 border-t border-primary-50" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex-1 flex items-end justify-between pr-7 sm:pr-4 pl-2 sm:pl-8 pb-6 lg:pb-5 h-[170px] sm:h-[220px]">
          {CHART_DATA.map((item) => {
            const isHovered = hoveredMonth === item.month;

            return (
              <div
                key={item.month}
                className="flex flex-col items-center group cursor-pointer relative"
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-10 bg-text-primary text-surface text-[11px] px-2.5 py-1 rounded-md shadow-card whitespace-nowrap z-20 pointer-events-none">
                    امسال: {item.thisYear} | پارسال: {item.lastYear}
                  </div>
                )}

                {/* Bars Pair */}
                <div
                  className="flex items-end gap-1 h-[160px] sm:h-[210px] lg:h-[246px]"
                  dir="ltr"
                >
                  {/* This Year bar (13px in Figma mobile, 28px on desktop) */}
                  <div
                    style={{ height: `${item.thisYearHeight}%` }}
                    className="w-[13px] sm:w-6 lg:w-7 rounded-t-sm sm:rounded-t-lg bg-primary transition-all duration-200 group-hover:brightness-110"
                  />
                  {/* Last Year bar */}
                  <div
                    style={{ height: `${item.lastYearHeight}%` }}
                    className="w-[13px] sm:w-6 lg:w-7 rounded-t-sm sm:rounded-t-lg bg-primary-50 transition-all duration-200 group-hover:bg-primary-100"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Month Labels */}
        <div
          className="flex justify-between items-center pr-7 sm:pr-10 pl-2 sm:pl-6 pt-1 text-[11px] sm:text-caption text-text-primary font-normal"
          dir="ltr"
        >
          {CHART_DATA.map((item) => (
            <span key={item.month} className="w-8 sm:w-16 text-center">
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerSalesChart;
