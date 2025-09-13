export function formatPhoneNumber(input) {
  // Remove all non-digits
  let digits = input.replace(/\D/g, "");

  // Ensure it starts with +91
  if (digits.startsWith("91")) {
    digits = "+" + digits;
  } else if (digits.startsWith("0")) {
    digits = "+91" + digits.slice(1);
  } else if (!digits.startsWith("+91")) {
    digits = "+91" + digits;
  }

  // Extract parts
  const countryCode = digits.slice(0, 3); // +91
  const number = digits.slice(3); // rest 10 digits

  // Format like +91 XXXXX XXXXX
  if (number.length === 10) {
    return `${countryCode} ${number.slice(0, 5)} ${number.slice(5)}`;
  }

  return digits; // fallback if not 10 digits
}
