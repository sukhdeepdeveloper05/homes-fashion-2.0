export default function formatTime(
  date,
  locales = "en-US",
  options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
) {
  if (!date) return null;

  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleTimeString(locales, options);

  return formatted;
}
