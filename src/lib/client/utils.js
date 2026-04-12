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
