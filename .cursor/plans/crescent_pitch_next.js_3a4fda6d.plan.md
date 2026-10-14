---
name: Crescent pitch Next.js
overview: "Greenfield Next.js migration of crescent-hotel-demo-1.html: pitch at `/`, demo at `/demo?hotel=…`, tested `/lib`, Zustand (no localStorage). After parity, ship contact + share/reset first; then chart/AI; banquet, dashboard and tour later."
todos:
  - id: scaffold
    content: Next.js + TS strict + Tailwind tokens + ESLint/Prettier + README skeleton
    status: completed
  - id: data-lib-tests
    content: data/hotels registry + port business logic to /lib with Vitest
    status: completed
  - id: zustand-parity
    content: demo-store + /demo with chart, side panel, modules, property dropdown → ?hotel=
    status: completed
  - id: marketing-home
    content: "/ pitch page: hero, services, ROI, contact UI + shared layout"
    status: completed
  - id: contact-reset-sell
    content: Resend contact (Zod, honeypot, rate limit, privacy line) + reset demo + share link
    status: completed
  - id: chart-enhancements
    content: Drag select/move, keyboard nav, conflict warnings, undo toast + mobile chart UX
    status: completed
  - id: guest-assistant-api
    content: Streaming API (Haiku/ANTHROPIC_MODEL, max_tokens, Upstash IP limit prod-required, origin speed bump + preview allowlist) + fallback
    status: completed
  - id: tour-banquet-dashboard
    content: Guided tour + BanquetEvents + OwnerDashboard (Recharts, code-split) — after sell path
    status: completed
  - id: seo-analytics-e2e
    content: Metadata, OG, sitemap, JSON-LD, Plausible, Playwright flow, Lighthouse pass
    status: completed
isProject: false
---

# Crescent Code pitch site — implementation plan

**Source of truth:** [crescent-hotel-demo-1.html](crescent-hotel-demo-1.html) (~840 lines: CSS tokens, marketing sections, inline JS for bookings, HK, POS, rates, scripted AI, ROI, contact stub).

**Routing (confirmed):** Marketing pitch at **`/`**; full interactive console + module tabs at **`/demo?hotel=Trivana`** (and other slugs from config). Share link = `/demo?hotel=<slug>`.

**Canonical URL:** `NEXT_PUBLIC_SITE_URL` on Vercel for metadata, OG, sitemap, JSON-LD.

**Hotel skins:** Aurelia (default), Trivana, Regal Regency, O BR Greens — all **fictional demo data** only (no real property details), each in [`data/hotels/*.ts`](data/hotels/).

**Unchanged constraints:** `/` vs `/demo` split; business logic in `/lib` with Vitest; **no localStorage** for core flows; code-split Recharts and guided tour for Lighthouse.

---

## 1) Target file structure

```text
d:\Hotel_Management_Sytem_Demo\
├── README.md
├── package.json
├── next.config.ts
├── tailwind.config.ts          # design tokens from :root CSS
├── postcss.config.mjs
├── tsconfig.json               # strict
├── .env.example
├── eslint.config.mjs
├── prettier.config.mjs
├── vitest.config.ts
├── playwright.config.ts
├── public/
│   ├── og.png
│   └── robots.txt              # or app/robots.ts
├── app/
│   ├── layout.tsx              # fonts, Plausible, theme
│   ├── page.tsx                # pitch: hero, services, ROI, contact
│   ├── demo/
│   │   ├── layout.tsx          # demo chrome
│   │   └── page.tsx            # console + module tabs
│   ├── api/
│   │   └── guest-assistant/
│   │       └── route.ts        # streaming; guarded (see task 15)
│   ├── actions/
│   │   └── contact.ts          # Resend + validation + rate limit
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   └── Wrap.tsx
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── ServicesAccordion.tsx
│   │   └── MoonMark.tsx
│   ├── demo/
│   │   ├── DemoConsole.tsx     # stats, property dropdown, chart, legend
│   │   ├── PropertySelect.tsx  # dropdown → router.push ?hotel=
│   │   ├── BookingChart.tsx
│   │   ├── SidePanel.tsx
│   │   ├── ModuleTabs.tsx
│   │   ├── FrontDesk.tsx
│   │   ├── Housekeeping.tsx
│   │   ├── RestaurantPOS.tsx
│   │   ├── RateEngine.tsx
│   │   ├── GuestAssistant.tsx
│   │   ├── BanquetEvents.tsx   # later
│   │   ├── OwnerDashboard.tsx  # later; dynamic import Recharts
│   │   ├── SavingsCalculator.tsx
│   │   ├── ContactForm.tsx     # shared on / (+ optional /demo); privacy line
│   │   ├── GuidedTour.tsx      # later; dynamic import
│   │   ├── DemoToolbar.tsx     # reset + copy share link
│   │   ├── Toast.tsx
│   │   └── ui/
│   └── motion/
│       └── Entrance.tsx
├── data/
│   ├── hotels/
│   │   ├── index.ts            # registry + list for dropdown
│   │   ├── aurelia.ts
│   │   ├── trivana.ts
│   │   ├── regency.ts
│   │   └── ob-greens.ts
│   └── types.ts
├── lib/
│   ├── dates.ts
│   ├── booking/
│   ├── rates/
│   ├── pos/
│   ├── housekeeping/
│   ├── roi/
│   ├── guest-assistant/
│   │   ├── scripted.ts
│   │   └── context.ts
│   ├── banquet/                # later
│   ├── analytics/
│   │   └── events.ts
│   ├── contact/
│   │   └── schema.ts           # Zod
│   ├── security/
│   │   ├── same-origin.ts      # speed bump: prod URL + preview allowlist (see §5)
│   │   └── anthropic-config.ts # model + max_tokens from env
│   ├── rate-limit/
│   │   └── ip.ts               # shared by contact action + guest-assistant route
│   └── format/
│       └── inr.ts
├── stores/
│   └── demo-store.ts
├── hooks/
│   ├── useReducedMotion.ts
│   ├── useDemoHotel.ts
│   └── useBookingChartKeyboard.ts
└── tests/
    ├── unit/
    └── e2e/
        └── demo-flow.spec.ts
```

**Property dropdown (pitch-critical):** Keep the HTML-style **Property** `<select>` in the demo console header ([`PropertySelect.tsx`](components/demo/PropertySelect.tsx)). Options = all registered hotel skins. On change → `router.push('/demo?hotel=<slug>')`, re-init Zustand from that config (same as loading the page fresh). Lets you flip prospects live on a sales call.

**Data flow:** unchanged — `searchParams.hotel` → `getHotelConfig` → store → UI; dropdown is another way to set `hotel`.

---

## 2) Task list (priority order)

Each bullet = **small commit** + `lint`, `typecheck`, `vitest` (E2E when noted).

### Phase A — Foundation (parity)

1. **Scaffold Next.js App Router** — TypeScript strict, Tailwind tokens/fonts from HTML, ESLint, Prettier.
2. **Types + hotel registry** — Demo configs for Aurelia, Trivana, Regal Regency, O BR Greens (fictional names/rates/menus/seeds); `getHotelConfig(slug)` + `listHotels()` for dropdown.
3. **Pure lib + Vitest** — availability, rates, GST/folio, ROI, stats, mutations; injectable “today” in [`lib/dates.ts`](lib/dates.ts).
4. **Zustand store** — In-memory only; init/reset from hotel config.
5. **Shared UI + layout** — Button, Field, Chip, Toast, header/footer, fonts.
6. **Marketing page `/`** — Hero, services, ROI, **ContactForm UI** (wired to server action in task 11); entrance animation with reduced-motion respect.
7. **Demo page `/demo`** — `?hotel=` parsing; **`PropertySelect`** in console header (updates URL); **`DemoToolbar`** placeholder for reset/share (implemented task 12).
8. **BookingChart + SidePanel + DemoConsole** — Click range, bars, check-in/out, cancel, channel colors, intro animation.
9. **ModuleTabs + FrontDesk, Housekeeping, RestaurantPOS, RateEngine** — ARIA tablist; folio/HK cross-updates.
10. **GuestAssistant (offline first)** — Scripted [`lib/guest-assistant/scripted.ts`](lib/guest-assistant/scripted.ts) + quick replies; streaming hooked in task 15.

### Phase B — Sell (immediately after Phase A)

11. **ContactForm production** — Zod + RHF; server action → Resend; honeypot; **per-IP rate limit** via shared [`lib/rate-limit/ip.ts`](lib/rate-limit/ip.ts) — **Upstash required in production** (same rule as AI route); WhatsApp click-to-chat on success; Plausible `form_submitted`. **One-line privacy note** under the form (e.g. we use your number only to reply about a demo; we do not sell or share it). On `/`; optional compact variant on `/demo` if useful.
12. **Reset demo + share link** — `DemoToolbar`: reset store from current hotel config; copy `{NEXT_PUBLIC_SITE_URL}/demo?hotel={slug}`; toast confirmation. Share link preserves selected property from dropdown/`?hotel=`.

### Phase C — Demo depth (before nice-to-haves)

13. **Booking chart interactions** — Drag across nights; drag bar to move; conflict warnings; keyboard grid nav; undo toast.
14. **Mobile chart UX** — Horizontal scroll, touch targets, 360px verification.
15. **GuestAssistant streaming** — [`app/api/guest-assistant/route.ts`](app/api/guest-assistant/route.ts):
    - **Same-origin check** ([`lib/security/same-origin.ts`](lib/security/same-origin.ts)) — **speed bump only** (non-browser clients can spoof `Origin`/`Referer`). Allow:
      - `NEXT_PUBLIC_SITE_URL` host (production).
      - **`localhost`** in development.
      - **Non-production:** also allow `https://${VERCEL_URL}` and preview hosts on **`*.vercel.app`** for this project (so preview deployments don’t 403 while testing).
    - **Bill protection (required in production):** **per-IP rate limit** via Upstash ([`lib/rate-limit/ip.ts`](lib/rate-limit/ip.ts), prefix e.g. `ai:`) + **`ANTHROPIC_MAX_TOKENS`**. If Upstash env vars are missing in production, **fail the AI route** (or refuse to call Anthropic) rather than silently falling back to in-memory limits — in-memory resets per serverless instance and is nearly useless on Vercel.
    - **Model:** `ANTHROPIC_MODEL` default **`claude-haiku-5-5`**. Switch models by changing env **without a code change**, but on Vercel **env updates only apply after a redeploy** (new deployment).
    - Stream to client; grounded context from [`lib/guest-assistant/context.ts`](lib/guest-assistant/context.ts); missing key / 429 / origin fail / errors → scripted fallback + clear “preview mode” copy.

### Phase D — Nice to have (after sell + core demo polish)

16. **Guided tour** — ~60s flow; `data-tour` anchors; dynamic import; Plausible `demo_started`; optional `?tour=1` on share URL.
17. **BanquetEvents tab** — Hall calendar + quote builder; in-memory quotes.
18. **OwnerDashboard tab** — Recharts (dynamic import on tab select): revenue, occupancy, channel mix, F&B from store + seeds.

### Phase E — Quality, SEO, deploy

19. **Metadata & SEO** — OG, sitemap, robots, JSON-LD.
20. **Accessibility pass** — WCAG 2.2 AA targets for tabs, chart, forms.
21. **Plausible** — `demo_started`, `booking_made`, `form_submitted`.
22. **Playwright E2E** — book → check-in → POS → check-out on `/demo`.
23. **README + `.env.example`** — deploy, add hotel skin, **§5 go-live checklist** (Resend DNS, Upstash, Anthropic spend cap), note that **Vercel env changes need redeploy**.
24. **Lighthouse tuning** — code-split tour/dashboard/Recharts; target 95+ mobile on `/` and best effort on `/demo`.

**Suggested commit order:** scaffold → data/lib → demo parity → **contact + reset/share** → chart enhancements → **AI route (guarded)** → tour/banquet/dashboard → seo/e2e.

---

## 3) Risks and open questions

### Risks

| Risk | Mitigation |
|------|------------|
| **Public `/api/guest-assistant` cost** | **Upstash IP limits + `ANTHROPIC_MAX_TOKENS` + Haiku**; Anthropic **monthly spend limit** in console as backstop; same-origin is auxiliary only. |
| **Rate limiting on Vercel** | **Configure Upstash before production**; in-memory only for local dev — never rely on it in prod. |
| **Preview 403 on AI route** | Allow `VERCEL_URL` / `*.vercel.app` when `VERCEL_ENV !== 'production'`. |
| **Drag-and-drop on mobile** | Tap-to-select fallback; test early in task 13–14. |
| **Lighthouse on `/demo`** | Defer Recharts, tour, banquet until tabs opened / Phase D. |
| **Contact email fails until DNS done** | Resend domain verification for `crescentcode.edsolutionhub.com` (see §5). |

### Questions (non-blocking)

- **WhatsApp:** `NEXT_PUBLIC_WHATSAPP_NUMBER` for wa.me — document E.164 in README.
- **Banquet halls:** Fictional defaults in hotel configs; editable per skin file.
- **Archive HTML:** Keep [crescent-hotel-demo-1.html](crescent-hotel-demo-1.html) in repo root or `/docs` during scaffold.

### Verify after Phase A

- `/demo` + dropdown switches skins via `?hotel=`; full module parity; scripted assistant; `/` ROI math matches monolith.

### Verify after Phase B (sell)

- Contact delivers via Resend; honeypot/rate limit block abuse; privacy line visible; reset + share link work on calls.

### Verify after Phase C

- Chart drag/undo; AI streams when configured; blocked cross-origin / over-limit requests; fallback works without key.

---

## 4) Key env vars (`.env.example`)

```bash
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX

# Guest assistant (server only)
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-haiku-5-5
ANTHROPIC_MAX_TOKENS=512

# Contact (Resend — FROM must be on a domain you verified in Resend)
RESEND_API_KEY=
CONTACT_FROM_EMAIL=demo@crescentcode.edsolutionhub.com
CONTACT_TO_EMAIL=you@edsolutionhub.com

# Shared rate limits (contact + AI routes)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

`CONTACT_FROM_EMAIL` must use a mailbox on a domain **after** Resend verification (see §5). Example subdomain: `crescentcode.edsolutionhub.com`.

**Vercel note:** Changing any env var (including `ANTHROPIC_MODEL`) does not affect a running deployment — **trigger a redeploy** for new values to apply. No app code change required to switch models.

---

## 5) Go-live checklist (manual, before pitching on production)

**Resend (contact form)**

1. In [Resend](https://resend.com), add domain **`crescentcode.edsolutionhub.com`** (or your chosen subdomain).
2. Add the DNS records Resend provides to the **edsolutionhub.com** DNS zone (SPF/DKIM etc.).
3. Wait until Resend shows the domain as **verified**. Until then, sends from `CONTACT_FROM_EMAIL` **will fail**.
4. Set `CONTACT_FROM_EMAIL` to an address on that verified domain (e.g. `demo@crescentcode.edsolutionhub.com`).

**Anthropic (guest assistant)**

1. Create/limit API key; set a **monthly spend limit** in the Anthropic console as a backstop beyond app-level caps.
2. Set `ANTHROPIC_MODEL`, `ANTHROPIC_MAX_TOKENS`, `ANTHROPIC_API_KEY` in Vercel; **redeploy**.
3. Configure **Upstash** (`UPSTASH_REDIS_REST_URL` / `TOKEN`) in production; redeploy. Without Upstash, production should not call Anthropic from the public route.

**Same-origin**

- Treat as reducing casual browser abuse only. **Rate limit + token cap + spend limit** protect the bill.

---

Ready for **Build** when you are.
