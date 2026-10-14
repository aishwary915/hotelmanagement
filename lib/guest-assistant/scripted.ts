import type { Booking, HotelConfig } from "@/data/types";
import { DAYS, dayDate, fmtD } from "@/lib/dates";
import { bookedAt } from "@/lib/booking/availability";
import { rateForNight } from "@/lib/rates/engine";
import { inr } from "@/lib/format/inr";

export function scriptedAnswer(
  question: string,
  hotel: HotelConfig,
  bookings: Booking[],
  eventOn: boolean,
): string {
  const s = question.toLowerCase();
  if (/late|checkout|check-out|check out/.test(s)) {
    return "Standard checkout is 11 am. Room 202 has no arrival today, so I can hold it until 3 pm for ₹600. Shall I add that to your bill?";
  }
  if (/airport|pickup|pick up|cab|taxi/.test(s)) {
    return "The airport is about 30 minutes away. A sedan is ₹900 and an SUV is ₹1,400. Send me your flight number and I will book the driver.";
  }
  if (/dinner|food|veg|menu|eat|hungry/.test(s)) {
    return "Tonight's vegetarian picks are paneer tikka, dal makhani and jalebi with rabdi. I can send your order to the kitchen and add it to your room bill.";
  }
  if (/invoice|gst|bill/.test(s)) {
    return "Your GST invoice is ready. Send me the company name and GSTIN and I will reissue it and email the PDF.";
  }
  if (/wifi|wi-fi|internet/.test(s)) {
    return "The WiFi password is printed on your key card sleeve. If it does not connect, tell me your room number and I will alert the front desk.";
  }
  if (/room|book|available|availability|price|rate|weekend|stay/.test(s)) {
    let d = 0;
    for (let i = 0; i < DAYS; i++) {
      if (dayDate(i).getDay() === 6) {
        d = i;
        break;
      }
    }
    const base = hotel.roomTypes.Deluxe ?? 3200;
    const free = hotel.rooms.filter(
      (r, i) => r.type === "Deluxe" && !bookedAt(bookings, i, d),
    ).length;
    const rate = rateForNight(base, bookings, hotel.rooms, d, eventOn);
    return free
      ? `Yes. A Deluxe room on ${fmtD(d)} is ${inr(rate)} a night, and ${free} ${free > 1 ? "are" : "is"} still free. Want me to hold one for 15 minutes?`
      : `Deluxe rooms are full on ${fmtD(d)}. A Superior room is ${inr(rateForNight(hotel.roomTypes.Superior ?? 4200, bookings, hotel.rooms, d, eventOn))} a night. Want me to check it?`;
  }
  return "I have passed this to the front desk. They will reply on WhatsApp within 5 minutes.";
}
