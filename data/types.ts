export type ChannelId = "direct" | "mmt" | "bkg" | "walk";

export type BookingStatus = "expected" | "inhouse" | "out";

export type HkStatus = "ready" | "dirty" | "cleaning";

export type RoomTypeName = string;

export interface Room {
  no: number;
  type: RoomTypeName;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  veg: boolean;
}

export interface SeedBooking {
  room: number;
  start: number;
  nights: number;
  guest: string;
  ch: ChannelId;
  status: BookingStatus;
}

export interface BanquetHall {
  id: string;
  name: string;
  capacity: number;
  ratePerHour: number;
}

export interface HotelConfig {
  slug: string;
  displayName: string;
  roomTypes: Record<RoomTypeName, number>;
  rooms: Room[];
  menu: MenuItem[];
  seedBookings: SeedBooking[];
  hkInitial: Record<number, HkStatus>;
  banquetHalls: BanquetHall[];
}

export interface Booking {
  id: number;
  room: number;
  start: number;
  nights: number;
  guest: string;
  ch: ChannelId;
  status: BookingStatus;
  total: number;
}

export interface KotItem {
  n: string;
  q: number;
}

export interface Kot {
  id: number;
  dest: string;
  items: KotItem[];
  status: "new" | "cooking" | "ready";
}

export const CHANNEL_LABELS: Record<ChannelId, string> = {
  direct: "Direct",
  mmt: "MakeMyTrip",
  bkg: "Booking.com",
  walk: "Walk-in",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  expected: "Arriving",
  inhouse: "In house",
  out: "Checked out",
};
