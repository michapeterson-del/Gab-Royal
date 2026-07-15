export const SLOT_STEP_MIN = 15;

type BusinessHours = { open: number; close: number } | null;

/**
 * Öffnungszeiten pro Wochentag (0 = Sonntag ... 6 = Samstag).
 * Montag ist Ruhetag, Samstag verkürzt geöffnet.
 */
function getBusinessHours(date: Date): BusinessHours {
  const day = date.getDay();
  switch (day) {
    case 1: // Montag
      return null;
    case 6: // Samstag
      return { open: 9 * 60, close: 14 * 60 };
    case 0: // Sonntag
      return null;
    default: // Di - Fr
      return { open: 9 * 60, close: 18 * 60 };
  }
}

export function isSalonOpen(dateStr: string): boolean {
  return getBusinessHours(parseDateStr(dateStr)) !== null;
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export type ExistingBooking = { startTime: string; endTime: string };

/**
 * Berechnet alle freien Startzeiten für einen Tag, sodass die Behandlung
 * (durationMin) vollständig innerhalb der Öffnungszeiten liegt und sich mit
 * keiner bestehenden Buchung überschneidet.
 */
export function getAvailableSlots(
  dateStr: string,
  durationMin: number,
  existingBookings: ExistingBooking[],
  now: Date = new Date()
): string[] {
  const date = parseDateStr(dateStr);
  const hours = getBusinessHours(date);
  if (!hours) return [];

  const isToday = date.toDateString() === now.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const busy = existingBookings.map((b) => ({
    start: timeToMinutes(b.startTime),
    end: timeToMinutes(b.endTime),
  }));

  const slots: string[] = [];
  for (
    let start = hours.open;
    start + durationMin <= hours.close;
    start += SLOT_STEP_MIN
  ) {
    if (isToday && start <= nowMinutes) continue;

    const end = start + durationMin;
    const overlapsExisting = busy.some((b) => rangesOverlap(start, end, b.start, b.end));
    if (!overlapsExisting) {
      slots.push(minutesToTime(start));
    }
  }
  return slots;
}
