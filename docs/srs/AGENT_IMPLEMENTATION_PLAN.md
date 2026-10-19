# Agent Implementation Plan — MarketLoop AI Video Studio

Execute **one phase per change set**. Do not skip ahead to GPU work. After each phase, meet every acceptance criterion before starting the next.

Canonical architecture: [`AI_VIDEO_GENERATION_SRS.md`](./AI_VIDEO_GENERATION_SRS.md).

**Engineering rules for every phase**

- TypeScript strict; Zod at the HTTP boundary; no `any`.
- SQL migrations are additive; never edit applied migrations.
- Route handlers stay thin; domain logic in `lib/`.
- Python worker: pydantic models matching the TS payload.
- No GPU calls on the Next.js request path.
- Conventional commits (`feat:`, `fix:`, `chore:`, `test:`).
- Do not commit weights, `.env`, or Stripe live keys.

**Existing repo you must extend (do not rewrite)**

- Next.js 16 App Router under `app/`
- Supabase in `lib/supabase/`, migrations in `supabase/migrations/` (next file `0012_...`)
- Auth: `app/login`, `app/auth/callback`, `lib/auth/admin.ts`
- Validation pattern: `lib/validations/*.ts`
- Admin allowlist: `ADMIN_EMAILS` (keep; add `platform_admins` only in a later hardening phase)

---

## Phase 0 — Foundations

**Objective.** Establish folders, env contracts, fake-vs-real flags, and developer scripts so later phases have a place to land.

**Prerequisites.** Current `marketloopai` app builds (`npm run build`).

**Create**

- `docs/srs/` (already exists)
- `lib/generation/README.md` — one-page module map
- `.env.example` entries (append, do not invent production secrets):
  - `WORKER_SHARED_SECRET=`
  - `GENERATION_PROVIDER=fake`
  - `NEXT_PUBLIC_APP_URL=`
  - `STRIPE_SECRET_KEY=` `STRIPE_WEBHOOK_SECRET=` `STRIPE_PRICE_STARTER=` (empty OK)
- `workers/wan/pyproject.toml`, `workers/wan/README.md`, `.python-version` (`3.11`)
- `workers/wan/src/config.py` — reads env
- `docker-compose.worker.yml` — fake worker + optional ffmpeg only (no CUDA)

**Modify**

- `.gitignore` — `workers/wan/.venv`, `models/`, `*.safetensors`, `Wan2.2-*`
- `package.json` — scripts `test`, `test:e2e` placeholders if missing

**Database.** None.

**APIs.** None.

**Frontend.** None.

**Infrastructure.** Document in `workers/wan/README.md`: local fake worker command.

**Tests.** `lib/generation/env.test.ts` (or similar) asserting required env names documented.

**Acceptance**

- Fresh clone instructions work for **app-only** dev without Python.
- No CUDA required.

**Validation**

- `npm run lint` and `npx tsc --noEmit` pass.
- `workers/wan/README.md` states fake vs GPU modes.

---

## Phase 1 — Organizations, memberships, plans, credits schema

**Objective.** Tenant and money tables exist with RLS. No UI yet.

**Prerequisites.** Phase 0.

**Create**

- `supabase/migrations/0012_organizations.sql` — `organizations`, `org_memberships`
- `supabase/migrations/0013_plans_credits.sql` — `plans`, `subscriptions`, `credit_accounts`, `credit_ledger_entries`, `reserve_credits` / `consume_credits` / `refund_credits` functions
- `lib/orgs/types.ts`, `lib/orgs/queries.ts`
- `lib/credits/ledger.ts` — wrappers around RPCs (service or user client as designed)
- `supabase/tests/rls_orgs.sql` or a Node test that uses two users

**Seed**

- Insert plans `free|starter|pro|agency` matching SRS credit grants (document numbers in SQL comments).
- Trigger: on first user, optional later — for this phase, a SQL seed function `ensure_personal_org(user_id)`.

**Database.** As above. Enable RLS. Policies: members select own org; only owner/admin update org; ledger insert via SECURITY DEFINER functions only.

**APIs.** None required (can wait for Phase 2). Optional internal script.

**Frontend.** None.

**Tests**

- Two-user IDOR: user B cannot `select` user A org.
- `reserve_credits` fails when insufficient.
- Reserve then refund restores `available` and zeros `reserved`.
- Ledger row count matches balance changes.

**Acceptance**

- `supabase db reset` applies 0012–0013 cleanly.
- Credit invariants hold under concurrent reserve (run two parallel RPC calls in a test).

**Validation.** Integration test against local Supabase.

---

## Phase 2 — Auth bootstrap, org API, roles

**Objective.** Signed-in user always has a personal org. Members can be invited (email invite token in DB is enough; Resend template can be stubbed).

**Prerequisites.** Phase 1.

**Create**

- `supabase/migrations/0014_invites.sql` — `org_invites`
- `app/api/v1/me/route.ts`
- `app/api/v1/organizations/route.ts`, `[orgId]/route.ts`, `[orgId]/invites/route.ts`
- `lib/auth/session.ts` — get user + memberships
- `lib/auth/require-org-role.ts`
- `app/auth/complete/route.ts` or hook after login: `ensure_personal_org`
- `lib/validations/org.ts`

**Modify**

- Login success redirect from marketing `/account` toward `/app` when cookie present (keep `/account` working).

**Frontend (minimal)**

- `app/app/layout.tsx` — require session, else redirect `/login`
- `app/app/page.tsx` — shows org name + role (placeholder dashboard)

**Tests**

- Unauthenticated `/api/v1/me` → 401
- Member cannot PATCH billing fields
- Invite accept adds membership

**Acceptance**

- New Google/email user lands in `/app` with one org and Free plan credit account (0 or welcome grant — pick one and test it).

**Validation.** Playwright: login stub or Supabase test user.

---

## Phase 3 — Stripe test mode + credit grants

**Objective.** Checkout and webhooks grant credits idempotently. Local can skip Stripe by using SQL grant for the owner.

**Prerequisites.** Phase 2.

**Create**

- `lib/billing/stripe.ts` — stripe SDK
- `lib/billing/webhook.ts`
- `app/api/v1/billing/checkout/route.ts`
- `app/api/stripe/webhook/route.ts` (raw body)
- `supabase/migrations/0015_stripe_events.sql` — `stripe_events(id primary key)`
- `lib/validations/billing.ts`

**Modify**

- `app/app/settings/billing/page.tsx` — “Upgrade” button (test mode)

**Infrastructure.** Stripe CLI documented in `workers/wan/README.md` or `docs/srs` snippet: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

**Tests**

- Duplicate webhook delivery does not double-grant.
- Unknown signature → 400.

**Acceptance**

- Test-mode Checkout completes → `subscriptions.status=active` + ledger `grant`.
- MVP-acceptable: skip live Stripe in CI using fixtures.

**Validation.** Manual Stripe test card once; automated fixture test in CI.

---

## Phase 4 — Projects, generations, jobs, lease API, fake completer

**Objective.** Full async job lifecycle **without** GPU. A fake worker (Python or TS) produces a tiny MP4 path or marks success with a fixture file.

**Prerequisites.** Phase 3 (credits). Welcome/grant enough credits in seed.

**Create**

- `supabase/migrations/0016_generation.sql` — `models`, `projects`, `generations`, `jobs`, `generation_assets`, `notifications`
- Seed model `wan2.2-ti2v-5b` enabled, `fake-mp4` provider key `fake`
- `lib/generation/types.ts`
- `lib/generation/providers/registry.ts`
- `lib/generation/submit.ts` — transaction: moderate stub, reserve, insert, enqueue
- `lib/generation/lease.ts` — SKIP LOCKED
- `lib/generation/progress.ts`
- `lib/validations/generation.ts`
- Routes:
  - `POST/GET app/api/v1/projects/...`
  - `POST app/api/v1/projects/[id]/generations/route.ts` → 202
  - `GET app/api/v1/generations/route.ts`
  - `GET app/api/v1/generations/[id]/route.ts`
  - `POST app/api/v1/generations/[id]/cancel/route.ts`
  - `GET app/api/v1/generations/[id]/events/route.ts` — SSE or 501 + poll documented
  - `POST app/api/v1/internal/workers/lease/route.ts`
  - `POST app/api/v1/internal/workers/jobs/[id]/progress/route.ts`
  - `POST app/api/v1/internal/workers/jobs/[id]/complete/route.ts`
  - `POST app/api/v1/internal/workers/jobs/[id]/fail/route.ts`
- `workers/wan/src/fake.py` + `main.py --provider fake`
- Watchdog: `lib/generation/watchdog.ts` + `app/api/cron/jobs-watchdog/route.ts` (Vercel cron later)

**Idempotency.** Unique `(org_id, idempotency_key)` on jobs/generations.

**Tests**

- Submit without credits → 402/`credits_insufficient`
- Double POST same Idempotency-Key → same id
- Lease is exclusive (two workers, one job)
- Fake complete → `succeeded` + `consume`
- Fail → `refund`
- Cancel queued → refund, never leased
- Watchdog expires lease → requeue or fail per SRS

**Acceptance**

- `curl` submit → poll until succeeded with fake provider.
- API p95 not applicable yet; no request waits on sleep > 50 ms.

**Validation.** pytest for worker client + Vitest for submit/lease.

---

## Phase 5 — Storage and signed URLs

**Objective.** Real private objects for inputs/outputs. Fake worker uploads a committed small MP4 using signed PUT.

**Prerequisites.** Phase 4.

**Create**

- `lib/storage/gateway.ts` — `createSignedUploadUrl`, `createSignedReadUrl`
- `supabase/migrations/0017_storage_buckets.sql` — bucket `generation-assets` private
- `POST app/api/v1/uploads/sign/route.ts` — input images
- `GET app/api/v1/generations/[id]/assets/[assetId]/url/route.ts`
- Worker uses `outputUpload.putUrl` from lease payload

**Security**

- Magic-byte check for JPEG/PNG/WebP on confirm
- Max 20 MB
- Keys: `orgs/{orgId}/generations/{generationId}/...`

**Tests**

- Signed URL for org A asset not issueable to org B session
- Complete rejects missing object

**Acceptance**

- Browser (or curl) PUT image → I2V fake job → GET video URL plays locally.

**Validation.** Integration test with `@supabase/storage-js` against local stack.

---

## Phase 6 — Client generation UX

**Objective.** Intuitive app workflow with honest wait UX (SRS §13). Fake GPU still fine.

**Prerequisites.** Phase 5.

**Create**

- `app/app/projects/page.tsx`, `new/page.tsx`, `[id]/page.tsx`, `[id]/generate/page.tsx`
- `app/app/generations/[id]/page.tsx`
- `app/app/history/page.tsx`
- `components/app/generation/generation-form.tsx`
- `components/app/generation/progress-panel.tsx` — `aria-live`, elapsed timer, stages, cancel
- `components/app/generation/video-player.tsx`
- `components/app/generation/credit-cost-hint.tsx`
- `lib/generation/use-generation-events.ts` — SSE with poll fallback 2 s

**Copy (required)**

- Duration locked: “5-second clip (model limit).”
- Do **not** promise 3-minute ads on this screen.
- “Generation usually takes several minutes. You can leave this page.”

**Tests (Playwright)**

- Submit shows job page within 1 s of click (no full-screen freeze)
- Progress updates when API progress JSON changes (mock SSE)
- Failure state shows refund message
- History lists the clip
- Viewer role cannot submit (if seeded)

**Acceptance**

- Desktop flow: onboarding → project → prompt → progress → play → download.
- Mobile: progress + play usable.

**Validation.** Playwright against local fake worker. **Browser verification required** for this phase (form, progress, player, history).

---

## Phase 7 — Real Wan 2.2 TI2V-5B worker

**Objective.** Staging GPU runs official Diffusers path. App unchanged except `GENERATION_PROVIDER=wan`.

**Prerequisites.** Phase 6. Hugging Face access. NVIDIA GPU ≥ 24 GB **Verified** for 5B with offload flags.

**Create**

- `workers/wan/src/infer_wan.py` — `WanPipeline`, pinned `diffusers` git SHA in `requirements.lock`
- `workers/wan/src/ffmpeg_post.py` — H.264 +faststart, poster
- `workers/wan/src/validate_output.py` — ffprobe
- `workers/wan/Dockerfile` — CUDA 12.x base matching torch wheels
- `workers/wan/scripts/download_weights.sh` — `huggingface-cli download Wan-AI/Wan2.2-TI2V-5B-Diffusers`
- Operator env: `WAN_OFFLOAD=true`, `WAN_T5_CPU=true`, `WAN_CONVERT_DTYPE=true` for 24 GB

**Do not** wrap ComfyUI. Optional: script `scripts/oracle_generate.py` calling upstream `generate.py` for quality compare — not used in the hot path.

**Settings lock**

- `height/width` 704×1280 or 1280×704
- `num_frames=121`, `fps=24`, `num_inference_steps=50`, `guidance_scale=5.0` (HF 5B Diffusers example — **Verified**)

**Tests**

- CI: infer module with provider mocked
- Staging: `RUN_GPU_TESTS=1` two prompts (T2V, I2V), assert duration ~5 s, resolution, non-zero size
- OOM path: if CUDA OOM, fail job with `gpu_oom`, refund (inject or document manual)

**Acceptance**

- One real MP4 from the app UI on staging.
- Worker restart reloads model and leases again.
- Heartbeat updates `progress.percent` during steps.

**Validation.** Staging only. Record `gpu_seconds` and VRAM. **Do not** set public SLA from a single sample.

---

## Phase 8 — Safety, notifications, admin ops

**Objective.** Moderation hook, email on complete, admin visibility.

**Prerequisites.** Phase 6 (can parallelize with 7 after 6).

**Create**

- `lib/moderation/prompt.ts` — blocklist; fail closed on match
- `lib/email/generation-complete.ts` — Resend, reuse `lib/email/layout.ts`
- `app/admin/generations/page.tsx` — list, status, cancel, refund adjustment (platform admin)
- `app/api/v1/status/route.ts` — `{ gpu: "up"|"down" }` from latest worker heartbeat
- Banner component if gpu down

**Modify**

- Submit path calls moderation before reserve
- `require-admin` reused for platform pages

**Tests**

- Blocklisted prompt never inserts a job
- Email function called on terminal success (mock Resend)

**Acceptance**

- Admin can fail/refund a stuck job.
- User gets email (Resend test).

**Validation.** Manual admin login + Playwright member path unchanged.

---

## Phase 9 — Observability, retention, soak

**Objective.** Production-shaped ops on staging.

**Prerequisites.** Phase 7+8.

**Create**

- Structured log helper `lib/log.ts` (`request_id`, `org_id`, `generation_id`)
- Sentry init (app + worker)
- `app/api/cron/reaper/route.ts` — delete expired assets per SRS retention
- `app/api/cron/credit-reconcile/route.ts`
- Grafana/Axiom dashboard JSON **or** documented metric names if no Grafana yet
- k6 script `tests/load/api-submit.js` — submit blocked in load test by using fake + rate limit (do not melt a GPU)

**Tests**

- Reaper dry-run
- Reconcile detects injected drift in a unit test DB

**Acceptance**

- 50 fake jobs soak locally or staging
- 20 real GPU jobs if budget allows; record success rate
- Alerts: worker heartbeat, success rate (can be log-based initially)

**Validation.** Checklist in SRS §31 filled for staging.

---

## Phase 10 — Production beta

**Objective.** Paid beta with measured costs. No architecture surprises.

**Prerequisites.** Phase 9 soak. Legal copy updated (5-second clips; Apache notices).

**Work**

- Enable Supabase PITR
- Private buckets verified
- Worker on **Secure Cloud** GPU, weights on volume
- Stripe live keys in Vercel only
- Feature flag `gpu_available`
- Freeze credit prices from §27 using **measured** GPU-seconds
- Update `app/pricing` if video counts vs credits mismatch
- Incident runbooks in `docs/runbooks/` (`oom.md`, `stuck-job.md`, `storage.md`)

**Must replace or explicitly accept before GA (not necessarily before private beta)**

- `ADMIN_EMAILS` env allowlist
- Postgres queue → Redis if wait/fairness hurts
- Supabase Storage → R2 if egress hurts
- Fair scheduler
- MFA
- Overflow providers

**Acceptance**

- SRS §31 checklist complete
- First paying org generates a video end-to-end
- Rollback: Vercel instant; worker previous image tag documented

**Validation.** Production smoke: signup → pay test → one 5B job → download. Then refund test job.

---

## Post-MVP backlog (do not build in phases 0–10)

1. `wan2.2-t2v-a14b` / `i2v-a14b` worker pool (80 GB GPU).  
2. Multi-shot stitching toward longer ads (honest UX).  
3. S2V-14B, Animate-14B.  
4. Customer API keys + webhooks.  
5. Redis Streams + per-tenant fairness.  
6. Kubernetes GPU pool.  
7. Quality-gated FP8 / LightX2V.  
8. Prompt extend (Qwen / Dashscope) as optional credit sink.

---

## Suggested commit sequence (solo / small team)

`chore: generation workspace layout` → `feat: orgs and credit ledger` → `feat: org api and app shell` → `feat: stripe test grants` → `feat: generation jobs and fake worker` → `feat: signed asset storage` → `feat: generation ui` → `feat: wan ti2v-5b worker` → `feat: moderation admin emails` → `chore: crons observability` → `chore: production beta hardening`

If a phase fails acceptance, fix it in a new commit; do not start the next phase.
