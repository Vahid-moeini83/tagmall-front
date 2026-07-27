"use client";

import { cn, toEnglishNumber } from "@/lib/client/utils";

function Input({
  containerClassName,
  label,
  labelClassName,
  id,
  disabled,
  className,
  error,
  errorClassName,
  maxLength,
  minLength,
  numeric,
  onChange,
  type,
  inputMode,
  ...props
}) {
  const handleChange = (e) => {
    let value = e.target.value;
    const shouldSanitizeNumeric = numeric || type === "number";

    if (shouldSanitizeNumeric) {
      value = toEnglishNumber(value).replace(/[^0-9]/g, "");
      if (maxLength) {
        value = value.slice(0, maxLength);
      }
      // Keep native event intact for mobile keyboard backspace/clear
      e.target.value = value;
    } else if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
      e.target.value = value;
    }

    onChange?.(e);
  };

  // Avoid type="number" — it breaks backspace/clear on many mobile keyboards
  const resolvedType = type === "number" ? "text" : type;
  const resolvedInputMode =
    inputMode || (numeric || type === "number" ? "numeric" : undefined);

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-base text-gray-600 font-bold",
            error && "text-error-medium!",
            labelClassName,
          )}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={id}
        type={resolvedType}
        inputMode={resolvedInputMode}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        onChange={handleChange}
        className={cn(
          "outline-none border-2 h-11 lg:h-12 rounded-lg px-2 transition-colors duration-200 touch-manipulation",
          error ? "border-error-medium" : "border-gray-300",
          disabled && "opacity-40",
          className,
        )}
      />

      {error && (
        <p className={`text-xs text-error-medium mt-1 ${errorClassName}`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
