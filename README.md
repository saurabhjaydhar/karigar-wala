# Karigar Saathi

Hyperlocal home-services marketplace. Monorepo (npm workspaces) containing:

- **apps/web** — customer-facing PWA (Next.js App Router). Public browsing, phone-OTP booking flow, "Partner with Us" karigar/contractor application wizard.
- **apps/admin** — admin dashboard (Next.js). Karigar verification, booking assignment, content/catalog management.
- **apps/api** — Express + TypeScript API, layered (`routes → controller → service → repository → model`), Mongoose/MongoDB.
- **packages/shared** — Zod schemas and TypeScript types shared between frontend and backend.

See [KarigarWala_PWA_ProjectPlan_2.md](../KarigarWala_PWA_ProjectPlan_2.md) for the full product/architecture plan and [CHECKLIST.md](CHECKLIST.md) for current build status.

## Getting started

```bash
npm install

# infra: MongoDB + Redis
docker compose -f docker-compose.dev.yml up -d

# run each app in its own terminal
npm run dev:api
npm run dev:web
npm run dev:admin

# optional: sample data
npm run seed -w apps/api
```

Copy `apps/api/.env.example` to `apps/api/.env` and fill in DB/Redis/SMS credentials before running the API.

## Status

Feature-complete against the plan's milestones 1–6 — auth, browsing, bookings, contracts, coupons, reviews, admin panel, PWA, SEO, i18n, notifications (in-app + web push), and a content CMS for the marketing pages. See [CHECKLIST.md](CHECKLIST.md) for the full breakdown, including what's genuinely still open (legal review of Terms/Privacy, actual deployment, branding follow-ups).
