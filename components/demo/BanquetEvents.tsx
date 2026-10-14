"use client";

import { useState } from "react";
import { buildBanquetQuote } from "@/lib/banquet/quote";
import { inr } from "@/lib/format/inr";
import { useDemoStore } from "@/stores/demo-store";
import { Button } from "@/components/demo/ui/Button";
import { Field, SelectInput, TextInput } from "@/components/demo/ui/Field";

export function BanquetEvents() {
  const hotel = useDemoStore((s) => s.hotel);
  const [hallId, setHallId] = useState(hotel.banquetHalls[0]?.id ?? "");
  const [hours, setHours] = useState(4);
  const [guests, setGuests] = useState(80);
  const [perHead, setPerHead] = useState(650);
  const [quotes, setQuotes] = useState<{ label: string; total: number }[]>([]);

  const hall = hotel.banquetHalls.find((h) => h.id === hallId) ?? hotel.banquetHalls[0];

  const saveQuote = () => {
    if (!hall) return;
    const q = buildBanquetQuote({
      hall,
      hours,
      guestCount: guests,
      cateringPerHead: perHead,
      menuItems: hotel.menu,
      cateringItemIds: [],
    });
    setQuotes((prev) => [
      { label: `${hall.name}, ${hours}h, ${guests} guests`, total: q.total },
      ...prev,
    ]);
  };

  return (
    <>
      <p className="mb-4 max-w-[62ch] text-muted">
        Hall calendar and quotes for weddings and corporate events. Demo data only.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-display text-xl">Quote builder</h3>
          <Field label="Hall">
            <SelectInput value={hallId} onChange={(e) => setHallId(e.target.value)}>
              {hotel.banquetHalls.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} (up to {h.capacity})
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Hours">
            <TextInput type="number" min={1} max={12} value={hours} onChange={(e) => setHours(+e.target.value)} />
          </Field>
          <Field label="Expected guests">
            <TextInput type="number" min={10} value={guests} onChange={(e) => setGuests(+e.target.value)} />
          </Field>
          <Field label="Catering per head (INR)">
            <TextInput type="number" min={100} value={perHead} onChange={(e) => setPerHead(+e.target.value)} />
          </Field>
          {hall ? (
            <p className="mt-3 text-sm text-muted">
              Hall hire: {inr(hall.ratePerHour * hours)} + catering estimate. GST included on save.
            </p>
          ) : null}
          <Button className="mt-4" variant="accent" onClick={saveQuote}>
            Save quote
          </Button>
        </div>
        <div>
          <h3 className="font-display text-xl">Saved quotes</h3>
          {quotes.length ? (
            <ul className="mt-2 space-y-2">
              {quotes.map((q, i) => (
                <li key={i} className="flex justify-between border-b border-line py-2 text-sm">
                  <span>{q.label}</span>
                  <b>{inr(q.total)}</b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-3 text-muted">No quotes yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
