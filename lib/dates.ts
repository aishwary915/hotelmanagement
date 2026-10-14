export const DAYS = 14;

let anchorToday: Date | null = null;

export function setTodayAnchor(date: Date): void {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  anchorToday = d;
}

export function getToday(): Date {
  if (anchorToday) return new Date(anchorToday);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function dayDate(dayIndex: number): Date {
  const x = getToday();
  x.setDate(x.getDate() + dayIndex);
  return x;
}

export function fmtD(dayIndex: number): string {
  return dayDate(dayIndex).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function isWeekend(dayIndex: number): boolean {
  const w = dayDate(dayIndex).getDay();
  return w === 0 || w === 6;
}

export function isWeekendSurge(dayIndex: number): boolean {
  const w = dayDate(dayIndex).getDay();
  return w === 5 || w === 6 || w === 0;
}
