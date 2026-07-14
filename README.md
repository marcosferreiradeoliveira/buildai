# BuildAI Marketing & Lead Generation Site

BuildAI is a high-conversion marketing website and lead generation system for selling AI automation, MicroSaaS, and custom software services. The site combines a polished public landing page, segment-specific pages, personalized lead landing pages, outreach email tooling, GA4 tracking, and a dedicated cold-email campaign page for booking automation ROI diagnostics.

Production domain: `https://buildai.dev.br`

## What This Project Includes

- Public BuildAI landing page with brand system, portfolio, services, course card, and contact CTA.
- `/diagnostico` campaign landing page focused on cold-mail traffic and Calendly bookings.
- Personalized `/lp/:leadSlug` lead landing pages generated from company website extraction.
- Admin lead generator for extracting company metadata, solution ideas, landing pages, and outreach emails.
- Supabase persistence for saved lead pages.
- Gmail OAuth integration for creating and sending outreach drafts.
- HubSpot lead fetch integration.
- GA4 pageview tracking and conversion events.
- Calendly inline widget and scheduling conversion tracking.

## Tech Stack

This repository is currently a Vite + React application, even though some campaign copy references Next.js as a delivery target.

- React 18
- Vite 5
- TypeScript
- React Router
- Tailwind CSS
- shadcn/ui + Radix UI primitives
- Lucide React
- TanStack Query
- Supabase
- GA4 / gtag.js
- Calendly inline widget
- Vercel serverless functions under `api/`

## Key Routes

| Route | Purpose |
| --- | --- |
| `/` | Main BuildAI marketing site. |
| `/diagnostico` | Cold-email landing page for booking a free Automation & ROI Diagnostic. |
| `/lp/:leadSlug` | Personalized lead landing page generated from extracted company data. |
| `/:segmentSlug` | Segment landing page, for example education-specific content. |
| `/admin` and `/admin/gerar` | Internal lead generation/admin workflow. |

## `/diagnostico` Campaign Landing Page

The diagnostic landing page is designed for cold-mail clicks and has one primary goal: get the visitor to book a Calendly diagnostic call.

Main sections:

- Simplified header with logo and a single high-contrast booking CTA.
- Hero focused on a 15-minute Automation & ROI Diagnostic.
- Interactive ROI calculator using React state and Tailwind-styled sliders.
- Three-step explanation of how the diagnostic works.
- Calendly inline widget for booking.
- Portfolio proof grid with BuildAI case images.
- Tech stack section.
- FAQ for objection handling.
- Final high-contrast CTA.

### ROI Calculator

The hero contains a reactive ROI calculator with these inputs:

- Team size: 1 to 30 people, default 5.
- Weekly hours lost per person: 2h to 40h, default 8h.
- Average hourly cost: R$20 to R$150, default R$40.

Calculations:

- Monthly wasted hours: `people * weeklyHours * 4.33`, rounded to an integer.
- Monthly exposed cost: `monthlyWastedHours * hourlyCost`, formatted as BRL.
- Estimated payback:
  - Under R$3,000/month: `45 days`
  - R$3,000 to R$10,000/month: `30 days`
  - Above R$10,000/month: `15 days`

The calculator CTA scrolls smoothly to the Calendly section and emits GA4 events.

## Portfolio Cases

The public site and diagnostic landing use BuildAI portfolio proof, including:

- PSD Art Generator
- NewsGen AI
- Green Sky
- GrowthOS
- Conexao Ativa
- 99Freelas Sniper
- Cultura Fluxo Finance
- Grio AI
- Espelho Literario / Fabulador
- IG-Scout AI
- App Amanha (IoT)
- Content Factory AI

Case imagery is stored under `src/assets/` and imported directly into React components.

## Lead Extraction & Personalized Landing Pages

The lead generation flow extracts company metadata from websites, enriches it with AI, generates implementation ideas, and saves personalized landing pages.

Important files:

- `src/lib/leadWebsiteExtract.ts` - website extraction, sanitization, fallback heuristics.
- `src/lib/leadWebsiteExtractAi.ts` - AI metadata normalization.
- `server/lib/extractLeadPipeline.ts` - server-side extraction pipeline.
- `server/lib/leadMetadataServer.ts` - metadata enrichment prompt and server logic.
- `src/lib/leadSegmentSolutions.ts` - implementation idea resolution and fallbacks.
- `src/lib/leadIdeaFormatting.ts` - copy cleanup and display formatting.
- `src/lib/leadPages.ts` - lead page persistence and landing content generation.
- `src/pages/AdminLeadGeneratorPage.tsx` - internal admin UI.

Existing saved leads may contain old generated copy. Re-extracting a website in the admin refreshes metadata and implementation ideas through the current pipeline.

## Outreach Email Tooling

The outreach email system creates short diagnostic emails with plain text and HTML bodies.

Important files:

- `src/lib/leadOutreachEmail.ts`
- `src/components/LeadOutreachEmailModule.tsx`
- `server/lib/gmailServer.ts`
- `api/gmail-draft.ts`
- `api/gmail-send.ts`
- `api/gmail-oauth-start.ts`
- `api/gmail-oauth-callback.ts`
- `api/gmail-status.ts`

Calendly URL used in outreach:

```text
https://calendly.com/buildaidev/30min
```

## Analytics & Conversion Tracking

GA4 is installed in `index.html` with measurement ID:

```text
G-1MHT8QP7FC
```

SPA pageviews are handled by:

- `src/components/AnalyticsPageView.tsx`
- `src/lib/analytics.ts`

Admin routes are excluded from pageview tracking.

The `/diagnostico` page emits funnel and conversion events:

- `diagnostico_cta_click`
- `roi_calculator_cta_click`
- `diagnostico_portfolio_click`
- `calendly_widget_loaded`
- `calendly_profile_viewed`
- `calendly_event_type_viewed`
- `calendly_date_selected`
- `calendly_event_scheduled`
- `generate_lead`

Recommended GA4 setup: mark `generate_lead` as a Key Event.

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

```bash
cp .env.example .env.local
```

### Client-side variables

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key for client reads/writes. |
| `VITE_GA_MEASUREMENT_ID` | Optional GA4 override. The default ID is already in `index.html`. |
| `VITE_WHATSAPP_PHONE` | Optional WhatsApp number override. |

### Server-side variables

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase URL for server functions. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for privileged admin actions. |
| `OPENAI_API_KEY` | OpenAI key for lead extraction and idea generation. |
| `OPENAI_MODEL` | Model name, default example is `gpt-4o-mini`. |
| `HUBSPOT_ACCESS_TOKEN` | HubSpot private app token. |
| `GOOGLE_CLIENT_ID` | Gmail OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Gmail OAuth client secret. |
| `GOOGLE_REDIRECT_URI` | Gmail OAuth redirect URI. |

Never commit `.env.local` or secrets.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run tests:

```bash
npm test
```

Run lint:

```bash
npm run lint
```

Note: the current lint command may report pre-existing issues in shared UI/config files that are unrelated to recent landing page work.

## Deployment

The site is deployed on Vercel from the `buildai/main` remote branch. Pushing to `main` triggers a production deployment.

The Vercel configuration is in `vercel.json` and includes:

- API function duration settings.
- Serverless include file patterns for shared `src/lib/**` and `server/lib/**`.
- SPA fallback rewrite to `index.html`.

## Project Structure

```text
api/                         Vercel serverless functions
server/lib/                  Server-only helpers
src/assets/                  Brand and case images
src/components/              Shared UI and section components
src/content/                 Static landing content
src/i18n/                    Language context and localized content
src/lib/                     Lead generation, analytics, formatting, Supabase helpers
src/pages/                   React Router pages
src/test/                    Vitest tests
public/                      Static public assets, favicon, robots.txt
```

## Branding

The BuildAI brand uses a dark AI-product aesthetic:

- Deep navy / black background.
- Neon purple, electric cyan, and success green accents.
- Inter for primary typography.
- JetBrains Mono for technical labels and metric styling.

Favicon:

```html
<link rel="icon" href="/favicon.png" type="image/png" />
```

The favicon is a custom BuildAI icon stored at `public/favicon.png`.
