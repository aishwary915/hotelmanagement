export const GST_RATE = 0.05;

export function gstAmount(subtotal: number): number {
  return subtotal * GST_RATE;
}

export function totalWithGst(subtotal: number): number {
  return Math.round(subtotal * (1 + GST_RATE));
}
