export function inr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
