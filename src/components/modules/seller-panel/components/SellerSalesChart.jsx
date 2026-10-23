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


function SellerSalesChart() {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  return (
    <div className="bg-surface rounded-2xl border border-border-subtle shadow-card pt-7 px-8 pb-6 flex flex-col justify-between h-[399px]">
      {/* Header with Title and Legend */}
      <div className="flex items-center justify-between">
        <h2 className="text-body font-bold text-text-primary">
          نمودار فروش ماهانه (۶ ماه اخیر)
        </h2>

        {/* Legend */}
        <div className="flex items-center gap-5 text-caption text-text-primary">
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
      <div className="relative flex-1 mt-6 flex flex-col justify-between">
        {/* Horizontal Grid lines with Y-Axis Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {Y_AXIS_STEPS.map((step) => (
            <div key={step} className="flex items-center gap-3 w-full">
              <span className="w-6 text-[11px] text-text-muted text-left font-normal select-none">
                {step}
              </span>
              <div className="flex-1 border-t border-primary-50" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex-1 flex items-end justify-between pr-9 pl-4 pb-6 h-[220px]">
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
                <div className="flex items-end gap-1 h-[210px]">
                  {/* This Year bar */}
                  <div
                    style={{ height: `${item.thisYearHeight}%` }}
                    className="w-7 rounded-t-lg bg-primary transition-all duration-200 group-hover:brightness-110"
                  />
                  {/* Last Year bar */}
                  <div
                    style={{ height: `${item.lastYearHeight}%` }}
                    className="w-7 rounded-t-lg bg-primary-50 transition-all duration-200 group-hover:bg-primary-100"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Month Labels */}
        <div className="flex justify-between items-center pr-10 pl-6 pt-1 text-caption text-text-primary font-normal">
          {CHART_DATA.map((item) => (
            <span key={item.month} className="w-16 text-center">
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerSalesChart;
