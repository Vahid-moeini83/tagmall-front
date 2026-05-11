"use client";

import { StrokeArrowLeftIcon } from "@/icons";
import { useRef, useState } from "react";

function OtpInput({
  label = "کد تایید",
  value,
  setValue,
  length = 5,
  error = "",
  disabled = false,
  onBack,
  className,
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleEnter = (e) => {
    const v = e.target.value;
    if (/^\d*$/.test(v) && v.length <= length) setValue(v);
  };

  const handleContainerClick = () => {
    if (!disabled) inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {/* Label */}
        <label
          htmlFor="otp"
          className={`text-lg transition-colors ${
            error ? "text-error-medium" : ""
          }`}
        >
          {label}
        </label>
        {onBack ? (
          <StrokeArrowLeftIcon className="ml-4" onClick={onBack} size={20} />
        ) : null}
      </div>

      {/* OtpInput box */}
      <div
        onClick={handleContainerClick}
        className={`relative w-full h-12 rounded-md border-2 flex items-center justify-center transition-colors
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-text"}
          ${
            error
              ? "border-error-medium hover:border-error-medium"
              : "border-gray-300 hover:border-gray-400 focus-within:border-primary"
          } ${className}`}
      >
        {/* Hidden input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={value}
          onChange={handleEnter}
          maxLength={length}
          className="absolute opacity-0 w-full h-full"
          autoComplete="one-time-code"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        />

        {/* Boxes */}
        <div dir="ltr" className="flex items-center gap-2">
          {Array.from({ length }).map((_, index) => {
            const active = isFocused && value.length === index;

            return (
              <div
                key={index}
                className="flex flex-col items-center w-8 relative"
              >
                {/* number */}
                <span className="text-xl font-medium h-6">
                  {value[index] ? value[index] : ""}
                </span>

                {/* Cursor */}
                {active && (
                  <div className="absolute bottom-1.5 w-[2px] h-4 bg-gray-800 animate-bounce" />
                )}

                {/* Line */}
                <div
                  className={`w-4 h-0.5 rounded-full transition-colors ${
                    value[index]
                      ? error
                        ? "bg-error-medium"
                        : "bg-primary"
                      : error
                        ? "bg-error-medium"
                        : "bg-gray-400"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {error && <p className="text-xs text-error-medium mt-1">{error}</p>}
    </div>
  );
}

export default OtpInput;
