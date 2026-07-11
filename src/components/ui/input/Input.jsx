"use client";

import { cn } from "@/lib/client/utils";

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
  ...props
}) {
  const handleChange = (e) => {
    let value = e.target.value;

    if (numeric) {
      value = value.replace(/[^0-9]/g, "");
    }

    if (maxLength) {
      value = value.slice(0, maxLength);
    }

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value,
        },
      });
    }
  };

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
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        onChange={handleChange}
        className={cn(
          "outline-none border-2 h-11 lg:h-12 rounded-md px-2 transition-colors duration-200",
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
