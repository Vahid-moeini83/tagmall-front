export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price) {
  return Number(price).toLocaleString("fa-IR");
}
