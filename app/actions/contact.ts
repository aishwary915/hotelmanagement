"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/contact/schema";
import { checkIpRateLimit } from "@/lib/rate-limit/ip";
import { headers } from "next/headers";

export type ContactActionResult =
  | { ok: true; whatsappUrl: string }
  | { ok: false; error: string };

export async function submitContact(
  _prev: ContactActionResult | null,
  formData: FormData,
): Promise<ContactActionResult> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";
  const limit = await checkIpRateLimit("contact", ip);
  if (!limit.ok) {
    return { ok: false, error: "Too many requests. Try again in an hour or message us on WhatsApp." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    hotel: formData.get("hotel"),
    phone: formData.get("phone"),
    website: formData.get("website") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form fields." };
  }
  if (parsed.data.website?.trim()) {
    return { ok: true, whatsappUrl: buildWhatsApp("", "", "") };
  }

  const { name, hotel, phone } = parsed.data;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (resendKey && from && to) {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from,
      to,
      subject: `Demo request: ${hotel}`,
      text: `Name: ${name}\nProperty: ${hotel}\nWhatsApp: ${phone}`,
    });
  }

  return { ok: true, whatsappUrl: buildWhatsApp(name, hotel, phone) };
}

function buildWhatsApp(name: string, hotel: string, _phone: string): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const msg = encodeURIComponent(`Hi, I'm ${name} from ${hotel}. I'd like a demo of the hotel system.`);
  return `https://wa.me/${num}?text=${msg}`;
}
