export function formatPrice(amount, currency = "INR", locale = "en-IN") {
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }

  if (isNaN(amount)) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0, // don’t force decimals
    maximumFractionDigits: 2, // show up to 2 decimals
  }).format(amount);
}
