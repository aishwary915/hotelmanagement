# Crescent Code pitch site

Next.js pitch site and interactive hotel demo for Crescent Code (Indore).

## Routes

- `/` — marketing pitch, ROI calculator, contact form
- `/demo?hotel=aurelia` — live demo (also `trivana`, `regency`, `ob-greens`)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

If you see `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'`, stop the dev server, run `npm run clean`, then `npm run dev` again. That happens when a production `build` and dev server share a stale `.next` folder.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run clean` | Remove `.next` build cache |
| `npm run dev` | Local dev (recommended) |
| `npm run dev:turbo` | Local dev with Turbopack (optional) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright (starts dev server) |

## Environment variables

See [`.env.example`](.env.example). **Vercel:** changing env vars requires a **redeploy** for new values to apply.

### Go-live checklist

**Resend**

1. Add domain `crescentcode.edsolutionhub.com` in Resend.
2. Add DNS records to the `edsolutionhub.com` zone.
3. Wait for verification before using `CONTACT_FROM_EMAIL`.

**Anthropic**

1. Set API key and a **monthly spend limit** in the Anthropic console.
2. Set `ANTHROPIC_MODEL` (default `claude-haiku-5-5`), `ANTHROPIC_MAX_TOKENS`, redeploy.

**Upstash (required in production)**

Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for contact and guest-assistant rate limits. Without Upstash in production, those routes refuse to send email / call Anthropic.

## Add a hotel skin

1. Create `data/hotels/your-slug.ts` (or use `makeDemoSkin` in `skin-variant.ts`).
2. Register in `data/hotels/index.ts`.
3. Share `/demo?hotel=your-slug`.

## Deploy (Vercel)

1. Import repo, set env vars from `.env.example`.
2. Set `NEXT_PUBLIC_SITE_URL` to your production URL.
3. Deploy; run `npm run build` locally first if you want to verify.

Legacy single-file demo: [`crescent-hotel-demo-1.html`](crescent-hotel-demo-1.html).
# hotelmanagement
