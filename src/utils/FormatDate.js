export default function formatDate(
  date,
  locales = "en-IN",
  options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
) {
  if (!date) return null;

  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleDateString(locales, options);

  return formatted;
}
