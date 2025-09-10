export default function generateSlots(
  intervalMinutes = 30,
  initialDelayHours = 0
) {
  const startHour = 8;
  const startMinute = 0;
  const endHour = 18;
  const endMinute = 0;

  const slots = [];
  const now = new Date();

  let dayOffset = 0;

  while (slots.length < 3) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    const times = [];

    // Start of the working day
    let current = new Date(date);
    current.setHours(startHour, startMinute, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);

    if (dayOffset === 0 && now > end) {
      // Today is already over, skip to tomorrow
      dayOffset++;
      continue;
    }

    if (dayOffset === 0 && now > current) {
      // add initial delay buffer
      let start = new Date(now.getTime() + initialDelayHours * 60 * 60 * 1000);

      // round up to the next interval
      const ms = 1000 * 60 * intervalMinutes;
      start.setMilliseconds(0);
      start.setSeconds(0);
      start.setTime(Math.ceil(start.getTime() / ms) * ms);

      current = start;
    }

    while (current <= end) {
      times.push(current.toISOString());
      current = new Date(current.getTime() + intervalMinutes * 60 * 1000);
    }

    if (times.length > 0) {
      slots.push({
        id: slots.length + 1,
        date,
        times,
      });
    }

    dayOffset++;
  }

  return slots;
}
