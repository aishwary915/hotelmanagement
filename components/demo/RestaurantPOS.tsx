"use client";

import { cartBill } from "@/lib/pos/cart";
import { inr } from "@/lib/format/inr";
import { useDemoStore } from "@/stores/demo-store";
import { Button } from "@/components/demo/ui/Button";
import { Field, SelectInput } from "@/components/demo/ui/Field";

export function RestaurantPOS() {
  const hotel = useDemoStore((s) => s.hotel);
  const bookings = useDemoStore((s) => s.bookings);
  const cart = useDemoStore((s) => s.cart);
  const dest = useDemoStore((s) => s.dest);
  const kots = useDemoStore((s) => s.kots);
  const setDest = useDemoStore((s) => s.setDest);
  const addToCart = useDemoStore((s) => s.addToCart);
  const decCart = useDemoStore((s) => s.decCart);
  const sendKitchen = useDemoStore((s) => s.sendKitchen);
  const advanceKot = useDemoStore((s) => s.advanceKot);

  const inh = hotel.rooms.filter((_, i) => bookings.some((b) => b.room === i && b.status === "inhouse"));
  const opts = [
    ...[1, 2, 3, 4, 5, 6].map((n) => ({ v: `T${n}`, l: `Table ${n}` })),
    ...inh.map((r) => ({ v: `R${r.no}`, l: `Room ${r.no} (charge to room)` })),
  ];
  const lines = Object.entries(cart).filter(([, q]) => q > 0);
  const bill = cartBill(cart, hotel.menu);

  return (
    <>
      <p className="mb-4 max-w-[62ch] text-muted">
        Tap dishes to build an order, pick a table or an in-house room, and send it to the kitchen.
        Room orders land on the guest&apos;s bill.
      </p>
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr_1fr]">
        <div>
          <h3 className="font-display text-xl">Menu</h3>
          <div className="mt-2.5 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2">
            {hotel.menu.map((m) => (
              <button
                key={m.id}
                type="button"
                className="rounded-[10px] border border-line bg-surface p-2.5 text-left hover:border-brand"
                onClick={() => addToCart(m.id)}
              >
                <b className="block text-[0.88rem] leading-snug">
                  <span
                    className={`mr-1.5 inline-block h-2.5 w-2.5 rounded-sm border ${m.veg ? "border-ok" : "border-danger"}`}
                  />
                  {m.name}
                </b>
                <span className="text-[0.85rem] text-muted">{inr(m.price)}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl">Order</h3>
          <Field label="Serve to">
            <SelectInput value={dest} onChange={(e) => setDest(e.target.value)}>
              {opts.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </SelectInput>
          </Field>
          <div className="mt-2">
            {lines.length ? (
              lines.map(([id, q]) => {
                const m = hotel.menu.find((x) => x.id === id)!;
                return (
                  <div key={id} className="flex items-center justify-between gap-3 border-b border-line py-3">
                    <div>
                      {m.name}
                      <small className="block text-muted">{inr(m.price * q)}</small>
                    </div>
                    <div className="flex items-center gap-2 tabular-nums">
                      <button type="button" className="h-8 w-8 rounded-lg border border-line" onClick={() => decCart(id)} aria-label={`Remove one ${m.name}`}>-</button>
                      <span>{q}</span>
                      <button type="button" className="h-8 w-8 rounded-lg border border-line" onClick={() => addToCart(id)} aria-label={`Add one ${m.name}`}>+</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-3 text-muted">No dishes yet. Tap a dish to add it.</p>
            )}
          </div>
          <div className="mt-3 tabular-nums text-[0.92rem] text-muted">
            <div className="flex justify-between py-0.5">
              <span>Subtotal</span>
              <span>{inr(bill.subtotal)}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>GST at 5%</span>
              <span>{inr(bill.gst)}</span>
            </div>
            <div className="mt-1.5 flex justify-between border-t border-line pt-2 text-lg font-extrabold text-ink">
              <span>Total</span>
              <span>{inr(bill.total)}</span>
            </div>
          </div>
          <Button variant="accent" className="mt-3 w-full" disabled={!lines.length} onClick={sendKitchen}>
            Send to kitchen
          </Button>
        </div>
        <div>
          <h3 className="font-display text-xl">Kitchen</h3>
          <div className="mt-2.5 space-y-2.5">
            {kots.length ? (
              kots.map((k) => (
                <div key={k.id} className="rounded-xl border border-line p-3 text-[0.92rem]">
                  <header className="mb-1.5 flex items-center justify-between gap-2">
                    <b>
                      {k.dest.startsWith("R") ? `Room ${k.dest.slice(1)}` : `Table ${k.dest.slice(1)}`}, order {k.id}
                    </b>
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold">
                      {k.status === "new" ? "New" : k.status === "cooking" ? "Cooking" : "Ready"}
                    </span>
                  </header>
                  <ul className="mb-2 list-disc pl-5 text-muted">
                    {k.items.map((i, idx) => (
                      <li key={idx}>{i.q} x {i.n}</li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="!px-3 !py-1.5 !text-sm" onClick={() => advanceKot(k.id)}>
                    {k.status === "new" ? "Start cooking" : k.status === "cooking" ? "Mark ready" : "Mark served"}
                  </Button>
                </div>
              ))
            ) : (
              <p className="py-3 text-muted">Orders sent from the till show up here.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
