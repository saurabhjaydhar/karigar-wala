# Deployment

This hasn't been deployed anywhere yet — no hosting accounts were available to actually do it.
This is a guide for when you're ready, matching the plan's recommended stack (§3).

## Recommended hosting

| Piece | Where | Why |
|---|---|---|
| `apps/web`, `apps/admin` | Vercel | Native Next.js support, zero-config for App Router, edge caching, image optimization |
| `apps/api` | Render / Railway (or any Docker host) | `apps/api/Dockerfile` builds a working production image — verified locally (see below) |
| MongoDB | MongoDB Atlas | Managed, free tier available |
| Redis | Upstash | Managed, free tier available, works over TLS which `ioredis`/`bullmq` support natively |

## Before deploying — build order matters

`packages/shared`'s `package.json` `"main"` points at **compiled** JS (`dist/index.js`), not the
raw TypeScript source, because plain Node (unlike Next.js's bundler or `tsx`) can't `require()` a
`.ts` file. That means:

- `packages/shared` **must** be built before `apps/api` in any production build — the root
  `npm run build` script and CI both already do this in the right order. If you're scripting a
  custom deploy, replicate it: `npm run build -w packages/shared` first, then everything else.
- `types` still points at the raw `.ts` source, so typechecking across the monorepo works
  instantly without a build step — only the Node **runtime** path needs the compiled output.
- This was a real, previously-undiscovered bug in this scaffold — every live test earlier in this
  build ran the API via `tsx` (which transpiles TypeScript on the fly, including workspace
  packages), which masked it. It's fixed and verified now (see below), but worth understanding if
  you ever see `ERR_MODULE_NOT_FOUND` pointing into `packages/shared/src`.

## apps/api — Docker

```bash
# from the repo root
docker build -f apps/api/Dockerfile -t karigar-wala-api .
docker run -p 4000:4000 --env-file apps/api/.env karigar-wala-api
```

Verified locally: built the image, ran it against real MongoDB + Redis containers on a shared
Docker network, and confirmed `/health`, Mongo connectivity, and the OTP send flow (including
Redis-backed storage and rate limiting) all work correctly from the compiled production build —
not just `tsx` dev mode.

Required env vars (see `apps/api/.env.example`): `MONGODB_URI`, `REDIS_URL`, `JWT_ACCESS_SECRET`,
`JWT_REFRESH_SECRET`, `ADMIN_JWT_SECRET`, `TWILIO_*`, `CORS_ORIGIN` (must list the deployed web +
admin origins).

## apps/web, apps/admin — Vercel

Standard Next.js deploy — connect the repo, set the **root directory** to `apps/web` (and a
second Vercel project with root directory `apps/admin`). Required env vars:

- `apps/web`: `NEXT_PUBLIC_API_BASE_URL` (the deployed API's `/api/v1` URL), `NEXT_PUBLIC_SITE_URL`,
  optionally `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- `apps/admin`: `NEXT_PUBLIC_API_BASE_URL`.

Both already build cleanly with `next build` (verified repeatedly throughout this build) and
include the PWA service worker (`@serwist/turbopack`) and i18n routing — no extra Vercel config
needed for either.

## Local dev infra

`docker-compose.dev.yml` at the repo root starts just MongoDB + Redis (run the three apps
themselves via `npm run dev:api` / `dev:web` / `dev:admin` in separate terminals):

```bash
docker compose -f docker-compose.dev.yml up -d
```

If port `27017` or `6379` is already taken by something else on your machine, override them:

```bash
MONGO_PORT=27018 REDIS_PORT=6380 docker compose -f docker-compose.dev.yml up -d
```

(and update `MONGODB_URI`/`REDIS_URL` in `apps/api/.env` to match).

## Not done

- No CD pipeline (CI only lints/typechecks/tests/builds/Lighthouse-checks — nothing auto-deploys)
- No secrets management beyond `.env` files — set real secrets directly in Vercel/Render's env var
  UI, not in the repo
- No database backup strategy configured (Atlas offers this natively — just needs enabling)
