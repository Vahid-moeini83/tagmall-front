export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function toEnglishNumber(number) {
  return number.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

export function formatPrice(price) {
  if (price === "" || price === null || price === undefined) return "";

  // Convert to calculations
  const toEnglishNumber = (str) => {
    return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  };

  const englishPrice = toEnglishNumber(price.toString());

  if (Number(englishPrice) === 0) return "0";

  return Number(englishPrice).toLocaleString("fa-IR");
}

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export const formatPhoneNumber = (phone) => {
  if (!phone || typeof phone !== "string") return phone;

  if (phone.startsWith("09") && phone.length === 11) {
    return phone.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1 $2 $3");
  }

  return phone;
};

export const formatSheba = (value) => {
  let input = toEnglishNumber(value).toUpperCase();

  // حذف همه کاراکترهای غیرمجاز — فقط IR و اعداد
  input = input.replace(/[^0-9IR]/g, "");

  // جلوگیری از اینکه کاربر حرفی بعد از IR بزند
  if (input.startsWith("IR")) {
    const rest = input.slice(2).replace(/[^0-9]/g, ""); // فقط عدد
    input = "IR" + rest;
  }

  // حداکثر طول شبا ایران
  input = input.slice(0, 26);

  // فرمت چهار چهار
  return input.match(/.{1,4}/g)?.join(" ") || input;
};

export const formatPersianDate = (dateString) => {
  if (!dateString) return "";

  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // تبدیل اعداد انگلیسی به فارسی
  const toPersianNumber = (num) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  };

  // ابتدا اعداد فارسی را به انگلیسی تبدیل می‌کنیم
  const englishDateString = toEnglishNumber(dateString);

  // پارس کردن تاریخ YYYY/MM/DD
  const parts = englishDateString.split("/");
  if (parts.length !== 3) return dateString;

  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (month < 1 || month > 12 || isNaN(month) || isNaN(day)) return dateString;

  const monthName = persianMonths[month - 1];
  const persianDay = toPersianNumber(day);
  const persianYear = toPersianNumber(year);

  return `${persianDay} ${monthName} ${persianYear}`;
};

export const formatPersianDateTime = (isoDateString) => {
  if (!isoDateString) return "";

  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // تبدیل اعداد انگلیسی به فارسی
  const toPersianNumber = (num) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  };

  try {
    // تبدیل ISO string به Date object
    const date = new Date(isoDateString);

    // استفاده از Intl.DateTimeFormat برای تبدیل به تاریخ شمسی
    const persianDate = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    // پارس کردن خروجی که به فرمت "۱۴۰۵/۰۱/۱۰، ۱۲:۲۳" است
    const parts = persianDate.split("،");
    if (parts.length !== 2) return isoDateString;

    const datePart = parts[0].trim(); // "۱۴۰۵/۰۱/۱۰"
    const timePart = parts[1].trim(); // "۱۲:۲۳"

    // تبدیل اعداد فارسی به انگلیسی برای پردازش
    const englishDatePart = toEnglishNumber(datePart);
    const dateComponents = englishDatePart.split("/");

    if (dateComponents.length !== 3) return isoDateString;

    const year = dateComponents[0];
    const month = parseInt(dateComponents[1], 10);
    const day = parseInt(dateComponents[2], 10);

    if (month < 1 || month > 12 || isNaN(month) || isNaN(day))
      return isoDateString;

    const monthName = persianMonths[month - 1];
    const persianDay = toPersianNumber(day);
    const persianYear = toPersianNumber(year);

    return `${persianDay} ${monthName} ${persianYear} ساعت ${timePart}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDateString;
  }
};

// تبدیل تاریخ ISO به تاریخ شمسی فارسی (بدون ساعت)
export const formatISOToPersianDate = (isoDateString) => {
  if (!isoDateString) return "";

  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const toPersianNumber = (num) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  };

  try {
    const date = new Date(isoDateString);

    // تبدیل به تاریخ شمسی
    const persianDate = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

    // پارس کردن خروجی که به فرمت "۱۴۰۵/۰۱/۱۰" است
    const englishDatePart = toEnglishNumber(persianDate);
    const dateComponents = englishDatePart.split("/");

    if (dateComponents.length !== 3) return isoDateString;

    const year = dateComponents[0];
    const month = parseInt(dateComponents[1], 10);
    const day = parseInt(dateComponents[2], 10);

    if (month < 1 || month > 12 || isNaN(month) || isNaN(day))
      return isoDateString;

    const monthName = persianMonths[month - 1];
    const persianDay = toPersianNumber(day);
    const persianYear = toPersianNumber(year);

    return `${persianDay} ${monthName} ${persianYear}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDateString;
  }
};

// تبدیل تاریخ ISO به ساعت فارسی
export const formatISOToPersianTime = (isoDateString) => {
  if (!isoDateString) return "";

  const toPersianNumber = (num) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  };

  try {
    const date = new Date(isoDateString);

    // تبدیل به ساعت
    const persianTime = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    return persianTime;
  } catch (error) {
    console.error("Error formatting time:", error);
    return isoDateString;
  }
};

// در بالای کامپوننت، بیرون از تابع اصلی
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) {
    return "لحظاتی پیش";
  } else if (diffMins < 60) {
    return `${diffMins} دقیقه پیش`;
  } else if (diffHours < 24) {
    return `${diffHours} ساعت پیش`;
  } else if (diffDays < 30) {
    return `${diffDays} روز پیش`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ماه پیش`;
  } else {
    return `${diffYears} سال پیش`;
  }
};

// Format time as HH:MM:SS
export const formatSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export function formatPartnershipRelativeTime(dateInput) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${Math.max(1, diffMins)} دقیقه پیش`;
  } else if (diffHours < 24) {
    return `${diffHours} ساعت پیش`;
  } else if (diffDays <= 3) {
    return `${diffDays} روز پیش`;
  }
  return date.toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const formatDateLabel = (dateString) => {
  const today = new Date();
  const messageDate = new Date(dateString);

  const diffTime =
    today.setHours(0, 0, 0, 0) - new Date(messageDate).setHours(0, 0, 0, 0);
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return "امروز";
  if (diffDays === 1) return "دیروز";

  return messageDate.toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
  });
};
