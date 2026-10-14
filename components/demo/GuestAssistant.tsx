"use client";

import { useRef, useState } from "react";
import { scriptedAnswer } from "@/lib/guest-assistant/scripted";
import { useDemoStore } from "@/stores/demo-store";
import { Button } from "@/components/demo/ui/Button";
import { TextInput } from "@/components/demo/ui/Field";

const QUICK = [
  "Can I get a late checkout?",
  "Book an airport pickup",
  "What veg dinner options do you have?",
  "Do you have a Deluxe room this weekend?",
  "I need a GST invoice",
];

export function GuestAssistant() {
  const hotel = useDemoStore((s) => s.hotel);
  const bookings = useDemoStore((s) => s.bookings);
  const eventOn = useDemoStore((s) => s.eventOn);
  const messages = useDemoStore((s) => s.chatMessages);
  const addChat = useDemoStore((s) => s.addChat);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"live" | "preview">("preview");
  const logRef = useRef<HTMLDivElement>(null);

  const scroll = () => {
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  };

  const fallbackReply = (q: string) => scriptedAnswer(q, hotel, bookings, eventOn);

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text) return;
    addChat("me", text);
    setInput("");
    scroll();

    try {
      const res = await fetch("/api/guest-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          hotelSlug: hotel.slug,
          bookings,
          eventOn,
        }),
      });
      if (res.ok && res.body) {
        setMode("live");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let bot = "";
        addChat("bot", "");
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bot += decoder.decode(value, { stream: true });
          useDemoStore.setState({
            chatMessages: [
              ...useDemoStore.getState().chatMessages.slice(0, -1),
              { role: "bot", text: bot },
            ],
          });
          scroll();
        }
        return;
      }
    } catch {
      /* fallback */
    }
    setMode("preview");
    const a = fallbackReply(text);
    window.setTimeout(() => {
      addChat("bot", a);
      scroll();
    }, 400);
  };

  const display =
    messages.length > 0
      ? messages
      : [
          {
            role: "bot" as const,
            text: `Namaste. I'm the assistant for ${hotel.displayName}. Ask me about rooms, late checkout, airport pickups, dinner or your invoice.`,
          },
        ];

  return (
    <div className="max-w-[640px]">
      <p className="mb-4 max-w-[62ch] text-muted">
        {mode === "live"
          ? "Live assistant grounded in this demo's rates and availability."
          : "Preview mode uses scripted replies when the live assistant is unavailable."}
      </p>
      <div
        ref={logRef}
        tabIndex={0}
        aria-label="Conversation"
        className="flex h-[290px] flex-col gap-2.5 overflow-auto p-1"
      >
        {display.map((m, i) => (
          <div
            key={i}
            className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[0.95rem] ${
              m.role === "bot"
                ? "self-start rounded-bl-sm bg-ink/10"
                : "self-end rounded-br-sm bg-brand text-brand-on"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="my-3 flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-[0.85rem] hover:border-ink"
            onClick={() => ask(q)}
          >
            {q === "What veg dinner options do you have?" ? "Veg dinner options" : q}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          aria-label="Message"
          onKeyDown={(e) => {
            if (e.key === "Enter") void ask(input);
          }}
        />
        <Button onClick={() => void ask(input)}>Send</Button>
      </div>
    </div>
  );
}
