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
    <div className="bg-white rounded-2xl border border-[#f3f4f6] shadow-[0_2px_12px_rgba(0,0,0,0.06)] pt-7 px-8 pb-6 flex flex-col justify-between h-[399px]">
      {/* Header with Title and Legend */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#1a1a2e]">
          نمودار فروش ماهانه (۶ ماه اخیر)
        </h2>

        {/* Legend */}
        <div className="flex items-center gap-5 text-[12px] text-[#1a1a2e]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3d3183]" />
            <span>امسال</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d1d6e0]" />
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
              <span className="w-6 text-[11px] text-[#898781] text-left font-normal select-none">
                {step}
              </span>
              <div className="flex-1 border-t border-[#eeeff6]" />
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
                  <div className="absolute -top-10 bg-[#1a1a2e] text-white text-[11px] px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-20 pointer-events-none">
                    امسال: {item.thisYear} | پارسال: {item.lastYear}
                  </div>
                )}

                {/* Bars Pair */}
                <div className="flex items-end gap-1 h-[210px]">
                  {/* This Year bar */}
                  <div
                    style={{ height: `${item.thisYearHeight}%` }}
                    className="w-7 rounded-t-lg bg-[#3d3183] transition-all duration-200 group-hover:brightness-110"
                  />
                  {/* Last Year bar */}
                  <div
                    style={{ height: `${item.lastYearHeight}%` }}
                    className="w-7 rounded-t-lg bg-[#eeeff6] transition-all duration-200 group-hover:bg-[#e2e4ef]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Month Labels */}
        <div className="flex justify-between items-center pr-10 pl-6 pt-1 text-[12px] text-[#1a1a2e] font-normal">
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
