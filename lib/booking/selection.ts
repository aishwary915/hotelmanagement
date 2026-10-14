export interface NightSelection {
  room: number;
  a: number;
  b: number;
}

export function pickNight(
  current: NightSelection | null,
  room: number,
  day: number,
  rangeFree: (room: number, a: number, b: number) => boolean,
): { selection: NightSelection | null; overlap: boolean } {
  if (current && current.room === room && current.a === current.b && day === current.a) {
    return { selection: null, overlap: false };
  }
  if (current && current.room === room && current.a === current.b && day !== current.a) {
    const a = Math.min(current.a, day);
    const b = Math.max(current.a, day);
    if (rangeFree(room, a, b)) return { selection: { room, a, b }, overlap: false };
    return { selection: { room, a: day, b: day }, overlap: true };
  }
  return { selection: { room, a: day, b: day }, overlap: false };
}
