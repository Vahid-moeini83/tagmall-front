"use client";
import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import CalendarIcon from "react-multi-date-picker/components/icon";

function DateRangeFilterContent() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="relative flex items-center justify-between gap-2">
        {/* From */}
        <div className="w-[45%]">
          <label className="block text-xs text-gray-500 mb-1">از تاریخ</label>
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
            calendarPosition="bottom-right"
            containerClassName="w-full"
            render={
              <button
                className={`w-full flex-1 h-10 border rounded-lg flex items-center justify-between gap-2 px-3 text-sm transition-colors outline-none focus:ring-1 focus:ring-primary ${
                  fromDate
                    ? "border-primary text-primary bg-primary/5"
                    : "border-gray-300 text-gray-600 bg-gray-50"
                }`}
              >
                <span>
                  {fromDate ? fromDate.format("YYYY/MM/DD") : "انتخاب تاریخ"}
                </span>
                <CalendarIcon className="w-5 h-5 opacity-50" />
              </button>
            }
          />
        </div>

        <div className="mt-4 w-10 h-px border border-dashed border-gray-400" />

        {/* To */}
        <div className="w-[45%]">
          <label className="block text-xs text-gray-500 mb-1">تا تاریخ</label>
          <DatePicker
            value={toDate}
            onChange={setToDate}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            // minDate={fromDate}
            calendarPosition="bottom-left"
            containerClassName="w-full"
            render={
              <button
                className={`w-full h-10 border rounded-lg flex items-center justify-between gap-2 px-3 text-sm transition-colors outline-none focus:ring-1 focus:ring-primary ${
                  toDate
                    ? "border-primary text-primary bg-primary/5"
                    : "border-gray-300 text-gray-600 bg-gray-50"
                }`}
              >
                <span>
                  {toDate ? toDate.format("YYYY/MM/DD") : "انتخاب تاریخ"}
                </span>
                <CalendarIcon className="w-5 h-5 opacity-50" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default DateRangeFilterContent;
