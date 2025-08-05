import { format, isToday, parseISO } from "date-fns";

export function getCurrentDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDisplayDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "EEEE, MMMM d, yyyy");
}

export function getTodayDay(): number {
  return new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
}

export function getDayName(dayNumber: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayNumber];
}

export function getDayShort(dayNumber: number): string {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return days[dayNumber];
}

export function isSameDate(date1: string, date2: string): boolean {
  return date1 === date2;
}

export function isDateToday(dateString: string): boolean {
  return isSameDate(dateString, getCurrentDateString());
}
