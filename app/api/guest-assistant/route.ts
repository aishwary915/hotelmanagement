import Anthropic from "@anthropic-ai/sdk";
import { getHotelConfig } from "@/data/hotels";
import type { Booking } from "@/data/types";
import { buildAssistantContext } from "@/lib/guest-assistant/context";
import { scriptedAnswer } from "@/lib/guest-assistant/scripted";
import { getAnthropicMaxTokens, getAnthropicModel } from "@/lib/security/anthropic-config";
import { isSameOriginRequest } from "@/lib/security/same-origin";
import { checkIpRateLimit, getClientIp } from "@/lib/rate-limit/ip";

export const runtime = "nodejs";

interface Body {
  message: string;
  hotelSlug: string;
  bookings: Booking[];
  eventOn: boolean;
}

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return new Response("Forbidden", { status: 403 });
  }

  const ip = getClientIp(req);
  const limit = await checkIpRateLimit("ai", ip);
  if (!limit.ok) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("Assistant unavailable", { status: 503 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const hotel = getHotelConfig(body.hotelSlug);
  const context = buildAssistantContext(hotel, body.bookings ?? [], body.eventOn ?? true);
  const userMessage = String(body.message ?? "").slice(0, 500);
  if (!userMessage) return new Response("Empty message", { status: 400 });

  try {
    const client = new Anthropic({ apiKey });
    const stream = await client.messages.stream({
      model: getAnthropicModel(),
      max_tokens: getAnthropicMaxTokens(),
      system: context,
      messages: [{ role: "user", content: userMessage }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch {
          const fallback = scriptedAnswer(userMessage, hotel, body.bookings ?? [], body.eventOn ?? true);
          controller.enqueue(encoder.encode(fallback));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response(
      scriptedAnswer(userMessage, hotel, body.bookings ?? [], body.eventOn ?? true),
      { status: 200, headers: { "Content-Type": "text/plain" } },
    );
  }
}
