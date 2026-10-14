"use client";

import { useActionState } from "react";
import { submitContact, type ContactActionResult } from "@/app/actions/contact";
import { Button } from "@/components/demo/ui/Button";
import { Field, TextInput } from "@/components/demo/ui/Field";
import { trackEvent } from "@/lib/analytics/events";

const initial: ContactActionResult | null = null;

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  return (
    <form
      action={formAction}
      className="space-y-1"
      onSubmit={() => trackEvent("form_submitted")}
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Field label="Your name">
        <TextInput name="name" required autoComplete="name" />
      </Field>
      <Field label="Hotel or restaurant name">
        <TextInput name="hotel" required autoComplete="organization" />
      </Field>
      <Field label="WhatsApp number">
        <TextInput name="phone" required inputMode="tel" autoComplete="tel" />
      </Field>
      {state && !state.ok ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="font-bold text-ok" role="status">
          Thanks.{" "}
          <a href={state.whatsappUrl} className="underline" target="_blank" rel="noopener noreferrer">
            Open WhatsApp
          </a>{" "}
          to continue the conversation.
        </p>
      ) : null}
      <p className="pt-2 text-[0.8rem] text-muted">
        We use your number only to reply about a demo. We do not sell or share it.
      </p>
      <Button variant="accent" type="submit" disabled={pending} className="mt-3">
        Request a demo
      </Button>
    </form>
  );
}
