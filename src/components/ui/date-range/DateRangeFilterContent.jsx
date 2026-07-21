"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { formatPersianDate } from "@/lib/client/utils";
import { CloseSquareIcon } from "@/icons";

export function formatDateRangeLabel(fromDate, toDate) {
  if (fromDate && toDate) {
    const fromFormatted = formatPersianDate(
      fromDate.format("YYYY/MM/DD", false),
    );
    const toFormatted = formatPersianDate(toDate.format("YYYY/MM/DD", false));
    return `از ${fromFormatted} تا ${toFormatted}`;
  }
  return "";
}

function DateRangeFilterContent({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  showLabel = true,
}) {
  const dateRangeLabel = formatDateRangeLabel(fromDate, toDate);

  return (
    <div className="flex flex-col gap-4 pb-[5px]">
      {showLabel && (
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          <span className="text-gray-600 font-bold">بازه زمانی:</span>
          {dateRangeLabel && (
            <span className="text-gray-600 font-extralight">
              {dateRangeLabel}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center justify-between gap-2">
        <div className="bg-gray-200 rounded-lg w-full">
          <div className="relative">
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
                  className="w-full text-center border-0! h-[50px] border-b-2! border-white rounded-none placeholder:text-gray-400"
                >
                  <span
                    className={fromDate ? "text-gray-800" : "text-gray-400"}
                  >
                    {fromDate ? fromDate.format("YYYY/MM/DD") : "از تاریخ"}
                  </span>
                </button>
              }
            />
            <button
              type="button"
              aria-label="پاک کردن از تاریخ"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFromDate(null);
              }}
              className={`absolute left-[14px] top-1/2 z-10 -translate-y-1/2 cursor-pointer ${
                fromDate ? "text-gray-800" : "text-gray-400"
              }`}
            >
              <CloseSquareIcon size={20} />
            </button>
          </div>

          <div className="relative">
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
                  className="w-full text-center border-0! h-[50px] border-b-2! border-white rounded-none placeholder:text-gray-400"
                >
                  <span className={toDate ? "text-gray-800" : "text-gray-400"}>
                    {toDate ? toDate.format("YYYY/MM/DD") : "تا تاریخ"}
                  </span>
                </button>
              }
            />
            <button
              type="button"
              aria-label="پاک کردن تا تاریخ"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setToDate(null);
              }}
              className={`absolute left-[14px] top-1/2 z-10 -translate-y-1/2 cursor-pointer ${
                toDate ? "text-gray-800" : "text-gray-400"
              }`}
            >
              <CloseSquareIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateRangeFilterContent;
