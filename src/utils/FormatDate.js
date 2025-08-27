export default function FormatDate({ date }) {
  if (!date) return null;

  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatted;
}

/* usage
<FormatDate date="2025-07-12T21:24:13.147Z" />  // → July 12, 2025
*/
