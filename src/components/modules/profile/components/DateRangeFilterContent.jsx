"use client";

import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { formatPersianDate } from "@/lib/client/utils";

function DateRangeFilterContent({ fromDate, setFromDate, toDate, setToDate }) {
  const getDateRangeLabel = () => {
    if (fromDate && toDate) {
      const fromFormatted = formatPersianDate(
        fromDate.format("YYYY/MM/DD", false),
      );
      const toFormatted = formatPersianDate(toDate.format("YYYY/MM/DD", false));
      return `از ${fromFormatted} تا ${toFormatted}`;
    }
    return "";
  };

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Label for desktop */}
      <div className="hidden lg:flex lg:items-center lg:gap-1">
        <span className="text-gray-600 font-bold">بازه زمانی:</span>
        {getDateRangeLabel() && (
          <span className="text-gray-600">{getDateRangeLabel()}</span>
        )}
      </div>

      <div className="relative flex items-center justify-between gap-2">
        {/* From */}
        <div className="bg-gray-200 rounded-lg w-full">
          <DatePicker
            value={fromDate}
            onChange={(value) => {
              setFromDate(value);
              if (value && toDate && value > toDate) {
                setToDate(null);
              }
            }}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            calendarPosition="bottom-center"
            containerClassName="w-full"
            render={
              <button
                type="button"
                className={`w-full text-center border-0! h-[50px] border-b-2! border-white rounded-none placeholder:text-gray-400`}
              >
                <span className={`${fromDate ? "" : "text-gray-400"}`}>
                  {fromDate ? fromDate.format("YYYY/MM/DD") : "از تاریخ"}
                </span>
              </button>
            }
          />
          <DatePicker
            value={toDate}
            onChange={setToDate}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            minDate={fromDate}
            calendarPosition="bottom-center"
            containerClassName="w-full"
            render={
              <button
                type="button"
                className={`w-full text-center border-0! h-[50px] border-b-2! border-white rounded-none placeholder:text-gray-400`}
              >
                <span className={`${toDate ? "" : "text-gray-400"}`}>
                  {toDate ? toDate.format("YYYY/MM/DD") : "تا تاریخ"}
                </span>
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default DateRangeFilterContent;
