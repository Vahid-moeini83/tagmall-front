"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

function OrderDateRangeFilterContent({
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gray-200 pb-2">
      <DatePicker
        value={fromDate}
        onChange={(value) => {
          onFromDateChange(value);
          if (value && toDate && value > toDate) {
            onToDateChange(null);
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
            className="flex w-full items-center justify-center border-0 bg-transparent py-4"
          >
            <span className={fromDate ? "text-gray-600" : "text-gray-400"}>
              {fromDate ? fromDate.format("YYYY/MM/DD") : "از"}
            </span>
          </button>
        }
      />

      <div className="border-t border-white">
        <DatePicker
          value={toDate}
          onChange={onToDateChange}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          minDate={fromDate}
          calendarPosition="bottom-center"
          containerClassName="w-full"
          render={
            <button
              type="button"
              className="flex w-full items-center justify-center border-0 bg-transparent py-4"
            >
              <span className={toDate ? "text-gray-600" : "text-gray-400"}>
                {toDate ? toDate.format("YYYY/MM/DD") : "تا"}
              </span>
            </button>
          }
        />
      </div>
    </div>
  );
}

export default OrderDateRangeFilterContent;
