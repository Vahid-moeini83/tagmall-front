"use client";

export const AngleLeftCircleIcon = ({ className, size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M13.5 8L9.5 12L13.5 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BoxIcon = ({ className, size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M2.5 5.5L9 2L15.5 5.5L9 9L2.5 5.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 5.5V12.5L9 16V9M15.5 5.5V12.5L9 16"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoSquareIcon = ({ className, size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect
      x="2"
      y="2"
      width="14"
      height="14"
      rx="4"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M9 8.5V12.5M9 5.5V6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

export const ArrowsRepeatIcon = ({ className, size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M13.5 3.5L16 6M16 6L13.5 8.5M16 6H5C3.34315 6 2 7.34315 2 9"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 14.5L2 12M2 12L4.5 9.5M2 12H13C14.6569 12 16 10.6569 16 9"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReceiptTextIcon = ({ className, size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M3.5 2.5V17.5L5.5 16.5L7.5 17.5L9.5 16.5L11.5 17.5L13.5 16.5L15.5 17.5L16.5 16.5V2.5L15 3.5L13.5 2.5L11.5 3.5L9.5 2.5L7.5 3.5L5.5 2.5L3.5 3.5V2.5Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 6.5H13.5M6.5 9.5H13.5M6.5 12.5H10.5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
);
