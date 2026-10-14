import type { MenuItem } from "@/data/types";
import { gstAmount, totalWithGst } from "@/lib/pos/gst";

export function cartSubtotal(cart: Record<string, number>, menu: MenuItem[]): number {
  return Object.entries(cart).reduce((s, [id, q]) => {
    if (q <= 0) return s;
    const m = menu.find((x) => x.id === id);
    return s + (m?.price ?? 0) * q;
  }, 0);
}

export function cartBill(cart: Record<string, number>, menu: MenuItem[]) {
  const subtotal = cartSubtotal(cart, menu);
  return { subtotal, gst: gstAmount(subtotal), total: totalWithGst(subtotal) };
}
