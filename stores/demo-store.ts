"use client";

import { create } from "zustand";
import type {
  Booking,
  ChannelId,
  HkStatus,
  HotelConfig,
  Kot,
  MenuItem,
} from "@/data/types";
import { bookedAt, rangeFree } from "@/lib/booking/availability";
import { createBooking, moveBooking, removeBooking, setBookingStatus } from "@/lib/booking/mutations";
import { pickNight, type NightSelection } from "@/lib/booking/selection";
import { cartBill } from "@/lib/pos/cart";
import { stayTotalAtRates } from "@/lib/rates/engine";
import { getHotelConfig } from "@/data/hotels";

export type DemoTab =
  | "fd"
  | "hk"
  | "pos"
  | "rate"
  | "ai"
  | "banquet"
  | "dashboard";

export interface ChatMessage {
  role: "me" | "bot";
  text: string;
}

export interface DemoSnapshot {
  bookings: Booking[];
  hk: Record<number, HkStatus>;
  folio: Record<number, number>;
  cart: Record<string, number>;
  kots: Kot[];
  nextId: number;
  kotN: number;
  selection: NightSelection | null;
  viewId: number | null;
}

interface DemoState {
  hotel: HotelConfig;
  bookings: Booking[];
  hk: Record<number, HkStatus>;
  folio: Record<number, number>;
  cart: Record<string, number>;
  dest: string;
  kots: Kot[];
  kotN: number;
  nextId: number;
  selection: NightSelection | null;
  viewId: number | null;
  cancelArm: number | null;
  tab: DemoTab;
  eventOn: boolean;
  autoSync: boolean;
  rateType: string;
  chatMessages: ChatMessage[];
  undoStack: DemoSnapshot | null;
  toast: string | null;
  initFromHotel: (slug: string | null | undefined) => void;
  resetDemo: () => void;
  pushUndo: () => void;
  undo: () => void;
  setTab: (tab: DemoTab) => void;
  setToast: (msg: string | null) => void;
  pickCell: (room: number, day: number) => { overlap: boolean };
  openBooking: (id: number) => void;
  clearSelection: () => void;
  closeView: () => void;
  confirmBooking: (guest: string, ch: ChannelId) => { error?: string; ok?: boolean };
  checkIn: (id: number) => void;
  checkOut: (id: number) => void;
  cancelBooking: (id: number) => void;
  armCancel: (id: number) => void;
  moveBookingTo: (id: number, room: number, start: number) => { ok: boolean; reason?: string };
  setEventOn: (v: boolean) => void;
  setAutoSync: (v: boolean) => void;
  setRateType: (t: string) => void;
  hkTap: (roomIndex: number) => void;
  addToCart: (id: string) => void;
  decCart: (id: string) => void;
  setDest: (d: string) => void;
  sendKitchen: () => void;
  advanceKot: (id: number) => void;
  addChat: (role: "me" | "bot", text: string) => void;
  clearChat: () => void;
  selectionTotal: () => number;
  menu: () => MenuItem[];
}

function seedBookings(config: HotelConfig): { bookings: Booking[]; nextId: number } {
  let nextId = 1;
  const bookings: Booking[] = [];
  for (const s of config.seedBookings) {
    const type = config.rooms[s.room]?.type ?? "Deluxe";
    const end = s.start + s.nights - 1;
    const total = stayTotalAtRates(
      type,
      config.roomTypes,
      bookings,
      config.rooms,
      s.start,
      end,
      true,
    );
    bookings.push({
      id: nextId++,
      room: s.room,
      start: s.start,
      nights: s.nights,
      guest: s.guest,
      ch: s.ch,
      status: s.status,
      total,
    });
  }
  return { bookings, nextId };
}

function snapshot(state: DemoState): DemoSnapshot {
  return {
    bookings: state.bookings,
    hk: { ...state.hk },
    folio: { ...state.folio },
    cart: { ...state.cart },
    kots: [...state.kots],
    nextId: state.nextId,
    kotN: state.kotN,
    selection: state.selection,
    viewId: state.viewId,
  };
}

const initialHotel = getHotelConfig("aurelia");
const initialSeed = seedBookings(initialHotel);

export const useDemoStore = create<DemoState>((set, get) => ({
  hotel: initialHotel,
  bookings: initialSeed.bookings,
  hk: { ...initialHotel.hkInitial },
  folio: {},
  cart: {},
  dest: "T1",
  kots: [],
  kotN: 1,
  nextId: initialSeed.nextId,
  selection: null,
  viewId: null,
  cancelArm: null,
  tab: "fd",
  eventOn: true,
  autoSync: true,
  rateType: "Deluxe",
  chatMessages: [],
  undoStack: null,
  toast: null,

  initFromHotel: (slug) => {
    const hotel = getHotelConfig(slug);
    const { bookings, nextId } = seedBookings(hotel);
    set({
      hotel,
      bookings,
      hk: { ...hotel.hkInitial },
      folio: {},
      cart: {},
      dest: "T1",
      kots: [],
      kotN: 1,
      nextId,
      selection: null,
      viewId: null,
      cancelArm: null,
      rateType: "Deluxe",
      chatMessages: [],
      undoStack: null,
    });
  },

  resetDemo: () => {
    get().initFromHotel(get().hotel.slug);
    set({ toast: "Demo reset to fresh data." });
  },

  pushUndo: () => set({ undoStack: snapshot(get()) }),

  undo: () => {
    const u = get().undoStack;
    if (!u) return;
    set({
      bookings: u.bookings,
      hk: u.hk,
      folio: u.folio,
      cart: u.cart,
      kots: u.kots,
      nextId: u.nextId,
      kotN: u.kotN,
      selection: u.selection,
      viewId: u.viewId,
      undoStack: null,
      toast: "Undid last change.",
    });
  },

  setTab: (tab) => set({ tab }),
  setToast: (toast) => set({ toast }),

  pickCell: (room, day) => {
    const { bookings, selection } = get();
    const free = (r: number, a: number, b: number) => rangeFree(bookings, r, a, b);
    const { selection: next, overlap } = pickNight(selection, room, day, free);
    set({ selection: next, viewId: null, cancelArm: null });
    return { overlap };
  },

  openBooking: (id) => set({ viewId: id, selection: null, cancelArm: null }),

  clearSelection: () => set({ selection: null }),
  closeView: () => set({ viewId: null, cancelArm: null }),

  confirmBooking: (guest, ch) => {
    const state = get();
    const sel = state.selection;
    if (!sel) return { error: "Select nights on the chart first." };
    if (!guest.trim()) return { error: "Add a guest name to confirm the booking." };
    const nights = sel.b - sel.a + 1;
    if (!rangeFree(state.bookings, sel.room, sel.a, sel.b)) {
      return { error: "Those nights overlap another booking." };
    }
    get().pushUndo();
    const { bookings, booking } = createBooking(state.bookings, state.nextId, {
      room: sel.room,
      start: sel.a,
      nights,
      guest: guest.trim(),
      ch,
      roomTypes: state.hotel.roomTypes,
      rooms: state.hotel.rooms,
      eventOn: state.eventOn,
    });
    set({
      bookings,
      nextId: state.nextId + 1,
      selection: null,
      viewId: booking.id,
      toast: `Booking confirmed: room ${state.hotel.rooms[sel.room]?.no} for ${guest.trim()}`,
    });
    return { ok: true };
  },

  checkIn: (id) => {
    get().pushUndo();
    const b = get().bookings.find((x) => x.id === id);
    set({
      bookings: setBookingStatus(get().bookings, id, "inhouse"),
      toast: b ? `Checked in: ${b.guest}, room ${get().hotel.rooms[b.room]?.no}` : null,
    });
  },

  checkOut: (id) => {
    get().pushUndo();
    const b = get().bookings.find((x) => x.id === id);
    if (!b) return;
    const no = get().hotel.rooms[b.room]?.no;
    set({
      bookings: setBookingStatus(get().bookings, id, "out"),
      hk: { ...get().hk, [no]: "dirty" },
      toast: `Checked out: room ${no} is now with housekeeping`,
    });
  },

  armCancel: (id) => set({ cancelArm: id }),

  cancelBooking: (id) => {
    get().pushUndo();
    set({
      bookings: removeBooking(get().bookings, id),
      viewId: null,
      cancelArm: null,
      toast: "Booking cancelled",
    });
  },

  moveBookingTo: (id, room, start) => {
    const state = get();
    const b = state.bookings.find((x) => x.id === id);
    if (!b) return { ok: false, reason: "missing" };
    const end = start + b.nights - 1;
    if (!rangeFree(state.bookings, room, start, end, id)) {
      return { ok: false, reason: "overlap" };
    }
    get().pushUndo();
    set({
      bookings: moveBooking(state.bookings, id, room, start),
      toast: "Booking moved.",
    });
    return { ok: true };
  },

  setEventOn: (v) => set({ eventOn: v }),
  setAutoSync: (v) => set({ autoSync: v }),
  setRateType: (t) => set({ rateType: t }),

  hkTap: (roomIndex) => {
    const no = get().hotel.rooms[roomIndex]?.no;
    const cur = get().hk[no];
    if (cur === "dirty") {
      set({ hk: { ...get().hk, [no]: "cleaning" }, toast: `Room ${no}: cleaning started` });
    } else if (cur === "cleaning") {
      set({ hk: { ...get().hk, [no]: "ready" }, toast: `Room ${no}: ready to sell` });
    }
  },

  addToCart: (id) => {
    const cart = { ...get().cart };
    cart[id] = (cart[id] ?? 0) + 1;
    set({ cart });
  },

  decCart: (id) => {
    const cart = { ...get().cart };
    cart[id] = Math.max(0, (cart[id] ?? 0) - 1);
    set({ cart });
  },

  setDest: (d) => set({ dest: d }),

  sendKitchen: () => {
    const state = get();
    const lines = Object.entries(state.cart).filter(([, q]) => q > 0);
    if (!lines.length) return;
    const menu = state.hotel.menu;
    const items = lines.map(([id, q]) => ({
      n: menu.find((m) => m.id === id)?.name ?? id,
      q,
    }));
    const { total } = cartBill(state.cart, menu);
    const kot: Kot = {
      id: state.kotN,
      dest: state.dest,
      items,
      status: "new",
    };
    const kots = [kot, ...state.kots];
    let folio = { ...state.folio };
    if (state.dest.startsWith("R")) {
      const no = parseInt(state.dest.slice(1), 10);
      folio[no] = (folio[no] ?? 0) + total;
      set({
        kots,
        kotN: state.kotN + 1,
        cart: {},
        folio,
        toast: `Sent to kitchen: ₹${total} charged to room ${no}`,
      });
    } else {
      set({
        kots,
        kotN: state.kotN + 1,
        cart: {},
        toast: `Sent to kitchen: table ${state.dest.slice(1)}`,
      });
    }
  },

  advanceKot: (id) => {
    const kots = get().kots.map((k) => {
      if (k.id !== id) return k;
      if (k.status === "new") return { ...k, status: "cooking" as const };
      if (k.status === "cooking") return { ...k, status: "ready" as const };
      return k;
    });
    const k = get().kots.find((x) => x.id === id);
    if (k?.status === "ready") {
      set({ kots: kots.filter((x) => x.id !== id), toast: "Order served" });
    } else {
      set({ kots });
    }
  },

  addChat: (role, text) =>
    set({ chatMessages: [...get().chatMessages, { role, text }] }),

  clearChat: () => set({ chatMessages: [] }),

  selectionTotal: () => {
    const { selection, hotel, bookings, eventOn } = get();
    if (!selection) return 0;
    const type = hotel.rooms[selection.room]?.type ?? "Deluxe";
    return stayTotalAtRates(
      type,
      hotel.roomTypes,
      bookings,
      hotel.rooms,
      selection.a,
      selection.b,
      eventOn,
    );
  },

  menu: () => get().hotel.menu,
}));

/** Selectors */
export function useBookedAt(room: number, day: number) {
  return useDemoStore((s) => bookedAt(s.bookings, room, day));
}
