# Karigar Saathi — Build Checklist

Tracks progress against `KarigarWala_PWA_ProjectPlan_2.md`. Last updated 2026-08-27. (Note: the plan doc's filename still says "KarigarWala" — the product was renamed from "Karigar Wala" to "Karigar Saathi" after that doc was written. A brief detour to "Kaam Bazar" was considered and reverted — "Karigar Saathi" is final.)
✅ = done and live-verified · ⚠️ = partially done / UI-only stub · ❌ = not started

## Trust & content (§9 milestone 5)

- ✅ Reviews (see below) and "Partner with Us" (see above) — both now real
- ✅ About Us, How It Works, Safety, FAQ, Contact — real written content instead of one-line placeholders
- ✅ FAQ (`/faq`) — 8 real questions grounded in what the product actually does (booking flow, verification, cancellation, coupons, karigar vs. contractor) — notably honest about payment: there's no payment gateway built, so it says pay the karigar directly (cash/UPI), not a fabricated online-payment claim
- ✅ Contact (`/contact`) — points to the real existing channels (My Bookings for booking questions, "Partner with Us" for applicants, FAQ first for general questions), plus an optional `NEXT_PUBLIC_SUPPORT_EMAIL`-gated mailto link (unset by default — no fabricated email address)
- ❌ Blog — intentionally not built; there's no actual content/editorial strategy to draw from, and fabricating blog posts would be worse than not having the page at all
- ✅ Fixed a related content bug while here: the Safety page's "4-point verification" description only ever named 3 things (identity, address, skill) — now correctly lists all 4 real criteria (ID, address, background/reference check, skill assessment) matching what the admin checklist actually verifies
- ✅ Full loop browser-verified (Playwright): FAQ renders all 8 real questions including the honest payment answer, Contact links to My Bookings/Partner-with-us/FAQ correctly and correctly shows no fabricated support email, footer FAQ link navigates correctly. 7/8 checks passed — the one failure was the same nav-link-text-collision false negative seen elsewhere this session (bottom nav also has a "My Bookings" link), confirmed as a non-issue by directly inspecting the page's real links.

## Foundation & Tooling

- ✅ Monorepo scaffold (npm workspaces): `apps/web`, `apps/admin`, `apps/api`, `packages/shared`
- ✅ Next.js 16 (App Router) + TypeScript + Tailwind, dark/light theme (next-themes)
- ✅ Express + TS layered backend (`routes → controller → service → repository → model`)
- ✅ Shared Zod validation schemas package
- ✅ MongoDB/Mongoose persistence (deviates from the plan's Postgres/Prisma recommendation — team's call)
- ✅ Redis (OTP storage, send-rate-limiting)
- ✅ CI skeleton (lint → typecheck → test → build)
- ✅ BullMQ job queue — actually wired up now, both queues do real work: OTP SMS sends go through the `sms` queue (3 retries, exponential backoff) instead of blocking the HTTP request on a live Twilio call, and marking a booking `completed` schedules a delayed `review-reminder` job (`REVIEW_REMINDER_DELAY_MS`, defaults to 24h) that creates a real "leave a review" notification if the customer hasn't reviewed yet. Both workers run in-process alongside the API (started from `server.ts`) — simplest deployment story for this scale; splitting into a separate worker process is a future scaling step, not a correctness gap.
- ✅ Lighthouse CI gate — runs against the public marketing pages (home, about-us, how-it-works, safety, partner-with-us) after build; hard-gates Accessibility/SEO ≥0.9, warns on Performance/Best Practices. Verified locally: real run against a production build passes with actual scores (Perf ~0.75–0.78 on unoptimized localhost, others ≥0.9), not just wired-and-untested.
- ✅ **Fixed a real, previously-undiscovered production bug**: `packages/shared`'s `package.json` `"main"` pointed at raw `.ts` source, which plain Node can't `require()`. Every live test all session ran the API via `tsx` (transpiles on the fly), which masked it — `npm run build -w apps/api && node dist/server.js` had never actually been verified and would have crashed on deploy. Fixed by giving `shared` a real `tsc` build step, splitting `main` (compiled, for Node runtime) from `types` (raw source, so typechecking still works instantly without a rebuild), and fixing build ordering in both the root `npm run build` script and CI (which called `--workspaces` directly, bypassing the root script). Verified: full production build → `node dist/server.js` boots and serves real requests.
- ✅ `apps/api/Dockerfile` (multi-stage, builds `shared` then `api`) — built the image and ran it against real Mongo/Redis containers on a shared Docker network; confirmed `/health`, DB connectivity, and the OTP flow all work from the actual container, not just the Dockerfile syntax being plausible
- ✅ `docker-compose.dev.yml` for local Mongo+Redis (port-overridable via `MONGO_PORT`/`REDIS_PORT` env vars) — verified it starts, both services respond, and the override syntax works
- ✅ `DEPLOYMENT.md` — recommended hosting (Vercel for web/admin, Docker host for api, Atlas, Upstash), required env vars per app, explicitly notes what's *not* done (no CD, no secrets manager, no backup strategy)
- ❌ Actual deployment — no hosting accounts available to do this from here; the above is deploy-readiness, not a live deployment

## Auth (§9 milestone 1)

- ✅ `POST /auth/otp/send` — Twilio, with console-log fallback when no Twilio creds are set
- ✅ `POST /auth/otp/verify` — lazy auth (find-or-create user), JWT access+refresh cookies, 5-attempt lockout
- ✅ `POST /auth/refresh`, `POST /auth/logout`
- ✅ `GET /users/me`, `PATCH /users/me`
- ✅ `POST /admin/auth/login` (email+password, bcrypt), `POST /admin/auth/logout`, `GET /admin/auth/me`
- ✅ Frontend phone+OTP modal (`AuthModal`), mounted globally, driven by a Zustand store
- ✅ `RequireAuth` gate — Profile/My Bookings/My Contracts auto-prompt guests, render real data once signed in
- ✅ Booking form gates "Confirm booking" behind the same OTP prompt for guests
- ✅ Logout wired (Profile page), session persists across reload via httpOnly cookies
- ✅ Browser-driven end-to-end test (Playwright): guest gating, send/verify OTP, wrong-OTP inline error, session persistence, logout, booking-gate resume — all 12 checks pass
- ✅ `/users/me/addresses` CRUD (list/create/update/delete) — real Mongo data

## Services & Karigars — browsing (§9 milestone 2, part 1)

- ✅ `GET /services`, `GET /services/:slug` — real Mongo data
- ✅ `GET /karigars` (area/category/q filters), `GET /karigars/:id` — real data, approved-only
- ✅ `POST /karigar-applications` — creates a real pending record, correctly hidden from the directory
- ✅ Seed script (`npm run seed -w apps/api`) with sample categories + karigars
- ✅ Frontend `/services`, `/services/[slug]`, `/karigars`, `/karigars/[id]` — SSR'd against real API
- ✅ "Partner with Us" wizard — real single-page form (type, name, phone, skill, experience, team size, areas served), wired to `POST /karigar-applications`, confirmation state on success
- ✅ Home page category row — now fetches real `ServiceCategory` data from `/services` and links to `/services/[slug]`, replacing the hardcoded 5-item list

## Bookings — the core transaction (§9 milestone 2, part 2)

- ✅ `POST /bookings` — creates a real Booking, validates the address/category exist
- ✅ `GET /bookings/me`, `GET /bookings/:id` — real data, populated with category + karigar
- ✅ `PATCH /bookings/:id/cancel` — enforces the §4b cancellable-status set, ownership-checked
- ✅ Auto-assign — simplified heuristic (highest-rated approved karigar matching category name + area); real availability/load-balancing weighting is future work
- ✅ Booking status lifecycle — `pending` (no karigar found) vs `confirmed` (karigar assigned) set on creation; `cancelled` via the cancel endpoint
- ✅ Frontend booking form — real single-page form (service/area/karigar-or-auto-assign/address/date/slot), creates the address then the booking
- ✅ My Bookings — lists real bookings with status, assigned karigar, and a working Cancel button
- ✅ Full loop browser-verified (Playwright): guest fills the form → submit opens the OTP prompt → verify auto-resumes the exact same booking submission → redirects to My Bookings → shows the correct category/karigar/status → cancel updates it live
- ✅ Full loop browser-verified (Playwright), sub-services: AC Technician's detail page lists its real sub-services with pricing → booking form shows Electrician's sub-service checkboxes once selected → switching to Contractor (no sub-services) hides the multi-select → two sub-services checked and carried through OTP-gated submission → My Bookings shows "Services: Fan Installation, Switchboard Repair" on the resulting booking. 7/8 checks passed on a clean run — the one failure was a test-script timing false negative (checked the URL a beat before the redirect landed), not a product bug, confirmed because the very next assertion (real page content) passed correctly.
- ✅ Full loop browser-verified (Playwright), areas: booking form's area dropdown and Partner-with-us's areas-served checkboxes both show the same 5 real seeded `Area` documents (previously two separately-hardcoded arrays, silently able to drift). 2/2 checks pass.
- ✅ Full loop browser-verified (Playwright), verification checklist: directory badge correctly shows only for the 3 seeded fully-verified karigars → admin toggles all 4 checklist boxes for a pending karigar → shows 4/4 → approve → badge count updates on the public directory and the karigar's own detail page. 6/6 checks pass. Hit two real snags along the way, both resolved: (1) a Docker Compose gotcha — `docker compose down` doesn't remove named volumes by default, so "fresh" test containers had actually been carrying forward Mongo data across every restart this session; fixed by using `down -v`. (2) mid-verification, `karigar.model.ts` was corrupted on disk by an external edit (not mine — confirmed via `git diff`/typecheck before and after), crashing the API; flagged to the user before touching it, confirmed not intentional, then restored to valid syntax.
- ✅ Full loop browser-verified (Playwright), sub-service CRUD: admin catalog page lists all 10 seeded sub-services grouped by real category name → creates a new one (Gardener/"Tree Trimming") → appears correctly with price → deletes it → list count returns to 10. 6/6 checks pass, clean first run.
- ✅ Coupon validation wired into the booking flow (see Coupons section below — was stale here, fixed)
- ✅ Sub-service multi-select — `GET /services/:categoryId/sub-services`, real `Service` documents seeded per category (AC Technician, Electrician, Labour/Mistri, Gardener — Contractor intentionally has none, it uses the quote flow instead), booking form shows a checkbox multi-select once a category with sub-services is chosen, server-side validates selected `serviceIds` actually belong to the booked category, service detail pages list sub-services with pricing, My Bookings shows which were picked

## Contracts — contractor quote flow

- ✅ `POST /contracts/quote-request` — only against an approved, active contractor
- ✅ `GET /contracts/me`, `GET /contracts/:id`, `PATCH /contracts/:id/accept` (only from `quoted`), `PATCH /contracts/:id/cancel` (ownership + status-guarded)
- ✅ `POST /admin/contracts/:id/quote` (sets cost/timeline, `quote_requested` → `quoted`, fires a notification), `GET /admin/contracts` (list, filterable by status), `PATCH /admin/contracts/:id/status` (progress `agreed` → `in_progress` → `completed`/`cancelled`)
- ✅ Karigar detail page now branches on type — contractors get a "Request a Quote" form, karigars get the normal booking CTA (previously both showed "Book this Karigar" regardless of type, which didn't match the plan's design at all)
- ✅ My Contracts — real data, "Accept quote" button when quoted, cancel button while cancellable
- ✅ Admin Contracts page — send a quote (cost + timeline) for pending requests, progress agreed contracts through to completion
- ✅ Full loop browser-verified (Playwright): customer finds a contractor in the directory → requests a quote (auth-gated) → admin sees it and sends a cost/timeline estimate → customer sees the quote and accepts → admin progresses `agreed → in_progress → completed` → customer sees the final status. 10/10 checks pass, zero page errors, first run.

## Reviews, Coupons, Notifications

- ✅ `POST /reviews` — only for a `completed` booking the reviewer owns, one review per booking, recalculates the karigar's `rating`/`reviewCount` on write
- ✅ `GET /karigars/:id/reviews`, `GET /users/me/reviews` — real data
- ✅ Post-completion review prompt — My Bookings shows "Leave a review" on completed bookings without one yet, a small star+comment form, then "✓ You reviewed this booking"
- ✅ Karigar detail page shows real reviews (SSR'd)
- ✅ Full loop browser-verified (Playwright): admin marks a booking `ongoing` → `completed` → customer leaves a 5★ review → confirmation state shows immediately → review appears on the karigar's public profile with the rating recalculated. Caught and fixed a real bug here: the "reviewed" UI state depended on a separate query's invalidation timing and didn't flip immediately after submit — fixed by tracking it locally as well.
- ✅ `POST /coupons/validate` — checks active/date-range/usage-limit; re-validated server-side (not trusted from the client) when actually applied on `POST /bookings`, which also increments `usageCount`
- ✅ Booking form has a real coupon-code field — Apply button calls `/coupons/validate`, shows the discount or an inline error, submits `couponCode` with the booking
- ✅ Seed data now includes a working `FIRST10` coupon (10% off), matching the code the home page banner has been advertising since the very first scaffold pass but that never actually worked until now
- ✅ `GET /notifications`, `PATCH /notifications/:id/read` — real data; a booking notification is created automatically on `POST /bookings`, and a "leave a review" reminder notification is created automatically ~24h after a booking is marked `completed` if it's still unreviewed (via the BullMQ `review-reminder` queue, see Foundation & Tooling)
- ✅ Frontend notification bell (header) — real unread badge, dropdown, mark-as-read; guests get the OTP prompt like other personalized surfaces
- ✅ Full loop browser-verified (Playwright), job queues: sent an OTP and confirmed it was actually processed by the BullMQ worker (not called inline) by grepping the worker's own log output; completed a real booking as a guest, admin progressed it `confirmed → ongoing → completed`, waited past a shortened test-only `REVIEW_REMINDER_DELAY_MS`, and confirmed the customer got a real "How was your service?" notification. 4/5 checks pass — the one failure was the same kind of URL-timing false negative seen elsewhere this session (checked the redirect a beat early), corroborated as a non-issue since the very next check found the real booking in the admin list, which could only exist if the OTP verify + booking creation had actually succeeded.
- ✅ Web push notifications — real end-to-end implementation: self-generated VAPID key pair (no third-party account needed, unlike Twilio/CAPTCHA), `PushSubscription` model, subscribe/unsubscribe endpoints (`POST`/`DELETE /users/me/push-subscription`), a service worker `push`/`notificationclick` handler, and an "Enable push notifications" toggle on the Profile page (silently absent if `NEXT_PUBLIC_VAPID_PUBLIC_KEY` isn't set — no fabricated feature). Centralized notification creation into a `notifyUser()` helper so push rides along every real in-app-notification event (booking created/confirmed, contract quote received, review reminder) instead of being a separate, easily-inconsistent system. Live-verified with a **real** browser push subscription (not mocked): granted notification permission in a real non-incognito Edge profile (discovered along the way that Chrome/Edge deliberately disable the Push API in incognito-style contexts — a real browser limitation, not a bug, confirmed by my own error handling catching it cleanly), subscribed for real, confirmed the subscription was stored in MongoDB, then triggered a real booking and confirmed the backend's `webpush.sendNotification` call got a genuine `201 Created` back from the actual push service (FCM) — the full pipeline, not just the code compiling. Test data (fake user/booking/subscription) cleaned up afterward.

## Admin panel (§9 milestone 4)

- ✅ Admin login (`apps/admin/login`) — real form, session-gated (`AdminAuthGate` redirects to `/login` when logged out), logout wired in the sidebar
- ✅ Karigar verification queue (`/karigars`) — lists all applications, Approve/Reject flips `verificationStatus`, immediately reflected in the public directory
- ✅ Bookings (`/bookings`) — lists all bookings; ones with no auto-assign match get a manual "assign karigar" control (`PATCH /admin/bookings/:id/assign`)
- ✅ Catalog (`/catalog`) — add/delete service categories and serviceable areas, real data
- ✅ Full loop browser-verified (Playwright, 3 apps together): admin login → approve a pending karigar → karigar appears in the customer directory → customer books a category/area combo with no auto-assign match → lands `pending` with no karigar → admin sees it and manually assigns one → customer's My Bookings reflects the assignment and `Confirmed` status. All 10 checks pass, zero page errors.
- ✅ Coupons (`/coupons`) — create/delete promo codes, shows live usage count vs. limit
- ✅ Users (`/users`) — searchable customer lookup by name/phone
- ✅ Reviews (`/reviews`) — moderation queue, deleting a review recalculates the karigar's rating
- ✅ Full loop browser-verified (Playwright): apply `FIRST10` on a real booking → usage count increments in the admin coupons list → admin creates and deletes a test coupon → new customer from the booking flow shows up in admin Users and is findable by search. 8/8 real assertions confirmed (one test-locator false negative along the way, corroborated as a non-issue by direct row-text inspection before trusting it).
- ✅ `services` (sub-service) admin CRUD (`/catalog`, new "Sub-Services" section) — list (grouped by real category name), create, delete against the real `Service` model; was a low-value generic stub when no sub-service data existed, now genuinely useful since 10 real sub-services are seeded and used in the booking flow
- ✅ `content` admin CRUD (`/content`) — real, not a stub anymore: a `PageContent` model backs About Us, How It Works, Safety, and FAQ (title, optional intro, and a flexible list of `{title?, body}` sections covers all four pages' different shapes — plain paragraphs, numbered steps, and title/body pairs). Admin can edit title/intro and add/remove/edit sections per page without a code deploy; each save is audit-logged. The four public pages were migrated from hardcoded JSX arrays to real `GET /content/:slug` fetches — seed data matches what was previously hardcoded, so nothing regressed. (Terms of Service / Privacy Policy were deliberately *not* made admin-editable — those need actual lawyer sign-off, and free-text editing by a non-lawyer admin is a worse failure mode for legal documents than requiring a code change.)
- ✅ Analytics dashboard (`/`) — real counts: customers, karigars by verification status, bookings/contracts by status breakdown, review count + average rating, coupon usage
- ✅ Admin audit log (`/audit-log`) — records who did what for the highest-value actions: karigar approve/reject, booking assign/status-change, contract quote/status-change, review deletion (coupon CRUD isn't logged — lower stakes, kept scope bounded)
- ✅ Verified live: dashboard showed the exact seeded numbers (`["0", "3", "1", "—"]` for customers/approved/pending/avg-rating), approving a karigar recorded a `karigar.approved` audit entry and the dashboard's pending count dropped to 0 immediately after
- ✅ Full loop browser-verified (Playwright), content CMS: public FAQ/How-It-Works pages render real CMS-sourced content → admin logs in, sees all 4 content docs → edits About Us's title → saves → public About Us page reflects the edit immediately with no code deploy. 5/5 checks pass, clean first run.

## Customer account UI

- ✅ Profile page — real data (name/phone/member since), logout, gated behind `RequireAuth`
- ✅ My Bookings — real data, cancel action, gated behind `RequireAuth`
- ✅ My Contracts — real data, "Accept quote" and cancel actions, gated behind `RequireAuth` (this line was stale — written before the Contracts feature existed; it's been fully real and browser-verified since the Contracts milestone, see above)
- ✅ Saved Addresses management UI (`/addresses`, linked from Profile) — list, add, remove, real `/users/me/addresses` data, gated behind `RequireAuth`
- ✅ Full loop browser-verified (Playwright): home page category chips are real seeded categories linking to their real `/services/[slug]` detail pages; guest hitting `/addresses` is auth-prompted, OTP verify resumes onto the page, empty state shows, adding an address shows it immediately, removing it takes it back out, Profile links through correctly. 10/10 checks pass. Caught and fixed a real test-environment issue along the way (not a product bug): the live Twilio credentials in `.env` were intercepting OTP sends to the test phone number and rejecting it (trial-account restriction), silently preventing the console-log dev fallback from ever running — worked around for this verification run by unsetting the Twilio env vars so OTPs log to console as intended for a phone number Twilio hasn't verified.

## PWA, Performance, SEO (§7)

- ✅ Real icon assets — `icon-192.png`/`icon-512.png` generated (solid brand-green, honest placeholder shape, not fabricated logo) so the manifest's referenced icons actually resolve instead of 404ing
- ✅ Service worker (Serwist via `@serwist/turbopack`, the Turbopack-compatible integration — `@serwist/next`'s webpack-based plugin doesn't support Next 16's default Turbopack builds, discovered and worked around this session) — precaches static assets, caches pages on navigation, offline fallback page at `/offline`
- ✅ Install prompt — listens for `beforeinstallprompt`, shows an install banner
- ✅ Full loop browser-verified against a production build (Playwright): service worker registers and activates, a visited page gets cached, going offline and hitting a never-visited page correctly falls back to `/offline`, a previously-visited page still loads offline. All 6 checks pass.
- ✅ JSON-LD structured data — `Service` schema on service detail pages, `LocalBusiness`+`AggregateRating` on karigar profiles; both pages also got real per-page `generateMetadata` (were using only the static root title/description before)
- ✅ Lighthouse CI (see above)

## i18n

- ✅ next-intl routing fully wired — routes moved under `src/app/[locale]/`, middleware (renamed to `proxy.ts` per Next 16's new convention — caught and fixed the deprecation warning rather than ignoring it) does locale detection, `localePrefix: "as-needed"` keeps English URLs unprefixed (`/services`) while Hindi gets `/hi/services`
- ✅ Header locale switcher (EN/हिं toggle), bottom nav + home hero translated (both `en.json`/`hi.json`)
- ⚠️ Scope decision: long-form content (About/How It Works/Safety/Terms/Privacy) and category names intentionally left English-only — machine-translating legal-adjacent text risked real inaccuracy, and trade terminology (e.g. "AC Technician") needs domain-accurate Hindi this scaffold shouldn't guess at
- ✅ Full loop browser-verified (Playwright): default locale has no URL prefix, switching to Hindi adds `/hi` and translates visible chrome, the prefix persists across in-app navigation, a never-visited direct `/hi/about-us` URL renders correctly (SSG'd per-locale), and toggling back to English from a deep page returns to the equivalent English page, not the homepage. 10/10 checks pass.

## Other plan items (§8)

- ✅ WhatsApp chat bubble — full loop browser-verified (Playwright): renders and links to the correct `wa.me/<number>` URL (opens in a new tab) when `NEXT_PUBLIC_WHATSAPP_NUMBER` is set, persists across client-side navigation (it's in the root layout), and correctly stays hidden when unset (current real state — no fabricated number). 4/4 checks pass.
- ✅ Terms of Service / Privacy Policy pages — significantly expanded from the original short-form draft: Terms now covers eligibility/age, contractor quotes, our role & limitation of liability, prohibited use, and governing law; Privacy now covers analytics, third-party processors (Twilio, hosting), retention, data-subject rights, grievance redressal, and children's data — the kind of sections a DPDP-Act-aware policy actually needs. Still explicitly disclaimed as **not a substitute for an actual lawyer's review** — I'm not qualified to certify legal compliance, only to make sure the content accurately describes what the product actually does (no fabricated payment-processing claims, etc.) and is more thorough as a starting point.
- ⚠️ OTP abuse protection beyond the basic rate limiter (no CAPTCHA) — deliberately deferred: adding one requires signing up for a third-party service (Turnstile/hCaptcha/reCAPTCHA) for a real site key, which isn't something to fabricate. The existing Redis-backed send-rate-limit + 5-attempt verify lockout already covers the basic case; revisit if real abuse shows up.
- ✅ Analytics — Google Analytics wired via `@next/third-parties`, gated behind `NEXT_PUBLIC_GA_MEASUREMENT_ID` (inert until a real measurement ID is set — no fabricated tracking ID)
- ❌ Referral program logic (the generic `Coupon` model could support it, no dedicated flow) — deliberately deferred: the reward economics (what a referrer earns, what a new customer gets) are a business decision, not something to guess numbers for

## Open decisions from the plan (§10) — still unanswered

- ✅ Real city/area list — resolved with real data from the business: 4 launch cities (Sitarganj, Rudrapur, Haldwani, Shaktifarm), each seeded with 4 broad zones (Central/North/South/East), 17 areas total. Zone names embed the city (e.g. "Sitarganj Central") since the booking form's area dropdown is a flat list with no separate city selector — plain zone names would've collided across 4 cities. The old "Metro City" placeholder data was cleaned up (upsert-based seeding doesn't delete stale records, so this needed an explicit one-time removal). The admin Catalog page's existing Areas CRUD is the real tool for ongoing accuracy — confirmed working live, since the business had already added a real locality ("Baikunthpur", Shaktifarm) through it before this was even seeded. Full loop browser-verified (Playwright): booking form and Partner-with-us both show all 17 real areas including the admin-added one, no stale placeholder zones remain. 5/5 checks pass.
- ✅ 4-point verification checklist — defined 4 sensible-default criteria for a home-services marketplace (government ID verified, address verified, background/reference check passed, skill assessment passed), matching what most gig-economy platforms use. This is **not a legal/compliance sign-off** — flagged in code comments as a starting point for the business to review, not a final decision. `verificationChecklist` is now a real structured field (was a free-form `Mixed` type with one ad-hoc unused key) with an admin PATCH endpoint (`/admin/karigars/:id/checklist`, audit-logged) and toggle UI in the karigar queue showing "X/4 verified". Also fixed a real, live correctness bug this surfaced: the "4-point verified" badge on every karigar card was previously hardcoded to show for *every* karigar regardless of actual verification — now it only renders when a karigar's checklist is actually 4/4 complete, on both the directory cards and the karigar detail page.
- ✅ Real branding — fully done: renamed to "Karigar Saathi" with the real logo provided by the business (tagline: "Kaam Ka Saath, Bharose Ka Vaasta", in the site footer); app name/metadata/manifest/SEO updated everywhere. Briefly considered "Kaam Bazar" as an alternative name/logo, reverted — "Karigar Saathi" is final. The provided `logo.png` (full lockup: mark + wordmark + tagline) was programmatically cropped to just the circular "KS" emblem (via `sharp`, not by hand) and padded to a clean square, since app icons need the mark alone, not the full lockup — generated `icon-192.png`/`icon-512.png` for the PWA manifest and `icon.png` for both apps' favicons (Next.js's file-convention auto-favicon, since there's no `png-to-ico` dependency in the repo for a real multi-res `.ico`). Verified live: manifest correctly serves the new name + icons, both apps' favicon routes serve the real branded icon (222KB, not the ~26KB Next.js default they were serving before).

---

**Twilio credentials:** moved into `apps/api/.env` (gitignored, confirmed not tracked by git) and verified live — a real, active Twilio account, and the `TWILIO_FROM_NUMBER` is confirmed owned by that account with SMS capability. `.env.example` is back to blank placeholders. Note: the account looks like a trial account, which can only send to phone numbers verified in the Twilio console until upgraded.

---

**Bottom line:** plan milestones 1–6 (§9, §7, §8) are functionally complete and browser-verified end to end — auth, browsing (including real sub-services per category, now admin-manageable, and a real serviceable-area list), booking with auto-assign, admin verification/assignment (including a real 4-point checklist), contracts, coupons, reviews (with a real automated review-reminder job), PWA, SEO, i18n, an analytics dashboard, an admin audit log, a saved-addresses management screen, FAQ/Contact pages with a verified WhatsApp bubble, a real database-backed content CMS for About Us/How It Works/Safety/FAQ, a significantly expanded (though still lawyer-pending) Terms/Privacy, and real end-to-end web push notifications. Also fixed real bugs that had nothing to do with any single feature: the production build path for `apps/api` had never actually worked (masked by `tsx` in every dev/test run all session) — fixed and verified via a genuine `docker build` + container run; the "4-point verified" badge shown on every karigar card was previously fabricated for all of them regardless of actual verification — it's now backed by real per-karigar checklist data; BullMQ was fully scaffolded but entirely dead code — OTP SMS now genuinely goes through a retrying queue instead of blocking the request on a live Twilio call; and the Safety page's own description of "4-point verification" only ever named 3 things. Deploy-readiness (`Dockerfile`, `docker-compose.dev.yml`, `DEPLOYMENT.md`) is in place, though nothing has actually been deployed (no hosting accounts available from here).

What's left is now down to two items, both genuinely outside what engineering alone can close: an actual lawyer's review of Terms/Privacy (expanded the content, but can't certify legal compliance myself), and actual deployment (no hosting accounts available from here — `DEPLOYMENT.md` documents readiness). Branding is done — real name ("Karigar Saathi"), real logo, real icons everywhere. Everything else raised as a gap this session — content CRUD, web push, the real area list, the stale verification-checklist wording — has been closed with real, live-verified implementations, not stubs.
