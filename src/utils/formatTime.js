export default function FormatTime({ date }) {
  if (!date) return null;

  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatted;
}
