# Software Requirements Specification and Engineering Blueprint

**Product:** MarketLoop AI Video Studio  
**Document version:** 1.0.0  
**Status:** Approved for incremental implementation  
**Date:** 2026-08-27  
**Primary engine:** Self-hosted Wan 2.2 (Apache 2.0)  
**Existing codebase:** `marketloopai` — Next.js 16.2.10, React 19, Supabase, Resend, Zod 4

Evidence tags: **Verified** (official Wan 2.2 / Hugging Face / Diffusers / this repo), **Community** (third-party), **Recommendation** (this architecture), **Must benchmark** (measure before treating as SLA).

---

## Table of contents

1. Executive Summary  
2. Product Vision and Goals  
3. Target Users and Personas  
4. User Stories and Use Cases  
5. Functional Requirements  
6. Non-Functional Requirements  
7. System Architecture  
8. Technology Stack and Justification  
9. Wan 2.2 Inference Architecture  
10. Model Abstraction and Future Model Support  
11. Database Design  
12. API Specification  
13. Frontend Architecture and UX  
14. Job Queue and GPU Worker Architecture  
15. Storage and Asset Pipeline  
16. Authentication and Authorization  
17. Billing, Credits, and Usage Architecture  
18. Security Architecture  
19. Testing Strategy  
20. Local Development Setup  
21. CI/CD Pipeline  
22. DevOps and Infrastructure  
23. Monitoring and Observability  
24. Performance and Optimization Strategy  
25. Scalability Strategy  
26. Backup and Disaster Recovery  
27. Cost and Infrastructure Planning  
28. Deployment Strategy  
29. MVP Implementation Phases  
30. Detailed Development Task Breakdown  
31. Production Readiness Checklist  
32. Risks, Limitations, and Future Improvements  

---

## 1. Executive Summary

MarketLoop AI will offer a production SaaS for generating short marketing videos from text and images. The control plane (web app, API, billing, auth, storage metadata) stays in the existing Next.js + Supabase application. The data plane (GPU inference) is a separate long-lived Python worker that never shares a process or request budget with the API.

**Verified Wan 2.2 facts that drive every other decision:**

- Wan 2.2 is Apache 2.0. Official code: [Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2). Weights: Hugging Face `Wan-AI/*`. Released 2025-07-28. Paper: arXiv:2503.20314.
- Family (**Verified** README): `T2V-A14B` (text-to-video, 480P/720P), `I2V-A14B` (image-to-video, 480P/720P), `TI2V-5B` (unified T2V+I2V, 720P @ 24 fps), `S2V-14B` (speech-to-video), `Animate-14B` (character animation/replacement).
- A14B models are Mixture-of-Experts: ~27B total parameters, ~14B active per step, high-noise expert then low-noise expert (**Verified** README / model cards).
- Official single-GPU VRAM: A14B and S2V-14B **at least 80 GB**; TI2V-5B **at least 24 GB** (example: RTX 4090) with `--offload_model True --convert_model_dtype --t5_cpu` (**Verified** README).
- Official latency claim: TI2V-5B can generate a **5-second 720P** video in **under 9 minutes** on a single consumer GPU, without extra optimization (**Verified** README). A14B official GPU timing table exists only as an image; numeric cells were not recoverable from text. **Must benchmark** on target hardware.
- Native clip length is ~5 seconds, not minutes. Diffusers A14B examples use `num_frames=81`, `fps=16` (~5.06 s). TI2V-5B Diffusers example uses `num_frames=121`, `fps=24` (~5.04 s), size `1280×704` (**Verified** HF Diffusers cards).
- Inference stack: PyTorch ≥ 2.4.0, `flash_attn`, Diffusers, Transformers, UMT5 text encoder, 3D VAE (**Verified** `requirements.txt` and README).
- Official OOM knobs: `--offload_model True`, `--convert_model_dtype`, `--t5_cpu`. Multi-GPU: PyTorch FSDP + DeepSpeed Ulysses (`--dit_fsdp --t5_fsdp --ulysses_size 8`) (**Verified** README).
- Prompt extension is optional via Dashscope (`qwen-plus` / `qwen-vl-max`) or local Qwen (**Verified** README). Not required for MVP.
- Authors claim no rights over generated content; users remain accountable for lawful use (**Verified** LICENSE agreement on README).

**Product-critical gap vs current marketing copy.** The site currently says MarketLoop can produce a video ad “up to three minutes long.” Wan 2.2 does not natively generate 3-minute videos. **Recommendation:** MVP ships 5-second clips. Multi-shot stitching, storyboard-to-multi-clip, and longer-form products are post-MVP. Do not implement a fake “3-minute” path by looping or stretching a 5-second clip.

**MVP in one sentence.** Authenticated users in an organization spend credits to submit T2V or I2V jobs; a GPU worker running **Wan 2.2 TI2V-5B** (Diffusers) produces a 5-second MP4; the app shows live progress, stores the asset, and lets the user preview and download.

**Why TI2V-5B first, not A14B.** A14B’s official single-GPU path wants 80 GB VRAM (H100-class). That is 5–10× the hourly cost of a 4090/L40S and is operationally heavier (two 14B experts, ~57 GB float32 each on disk for the original high/low-noise shards — **Verified** HF file listing for T2V-A14B `high_noise_model`). TI2V-5B is the only official variant that is realistic for a small team’s first paying customers. The provider interface is designed so A14B becomes a second worker pool, not a rewrite.

**What this is not.** Not a research notebook, not a ComfyUI wrapper, not a synchronous “click and wait on the HTTP request” demo, and not a Kubernetes-first GPU cluster. Those are either later optimizations or explicit non-goals for MVP.

---

## 2. Product Vision and Goals

### 2.1 Vision

Give marketers and small teams a reliable way to turn a product idea, still image, or prompt into a short, downloadable video without operating GPUs themselves — while MarketLoop retains the option to swap or add models without rebuilding the product.

### 2.2 Business goals

1. Convert waitlist demand into a paid generation product that matches existing pricing language (video quotas per plan) without bankrupting the company on GPU hours.
2. Keep GPU cost attributable per generation so pricing can be adjusted from measured cost, not guesses.
3. Use Wan 2.2 as the default engine because Apache 2.0 allows commercial self-hosting without per-video vendor fees.
4. Preserve a path to commercial APIs (fal, Replicate, Alibaba Model Studio) as overflow or premium quality, behind the same interface.

### 2.3 Product goals

- Time-to-first-successful-video for a new user: under 15 minutes including signup (queue time excluded).
- User always knows job state; the UI never looks frozen during multi-minute inference.
- Failed jobs refund credits automatically.
- One GPU worker can be taken down without taking down the website, auth, billing, or dashboards.

### 2.4 Non-goals (MVP)

- Native videos longer than one Wan clip (~5 s).
- Speech-to-video, lip-sync, and Wan-Animate.
- A14B / H100 as the default path.
- Public developer API with customer-issued API keys (schema reserved; not in MVP UI).
- In-browser editing, timeline NLE, brand-kit enforcement, or multi-clip cinematic editors.
- Training, LoRA fine-tuning, or customer-uploaded checkpoints.
- Real-time / streaming video generation.

### 2.5 Success metrics (product)

| Metric | MVP target | How measured |
| --- | --- | --- |
| Generation success rate | ≥ 95% of jobs that start inference finish with a valid MP4 | `generations.status` + output probe |
| Credit leakage | Reserved − consumed − refunded ≈ 0 after nightly reconcile | credit ledger |
| p95 API latency (non-GPU) | < 400 ms for reads, < 800 ms for submit | APM |
| User-visible “stuck” jobs | 0 jobs in `running` longer than timeout + 2 min without terminal state | watchdog |
| Support burden | < 10% of generations generate a support ticket | Zendesk/email tag |

Latency of the video itself is **Must benchmark**, not a marketing SLA, until hardware is chosen.

---

## 3. Target Users and Personas

### 3.1 Primary — Solo creator / founder (matches Starter plan)

Runs a small brand. Wants 5–20 short clips a month for TikTok, Reels, ads. Low tolerance for GPU jargon. Needs: prompt → progress → download. Will abandon if a 8-minute job looks hung.

### 3.2 Secondary — Marketing team member (Pro plan)

Shares an organization. Needs project folders, history, consistent aspect ratios, and a manager who pays the bill. Needs role separation (members generate; billing owner manages seats and credits).

### 3.3 Secondary — Agency producer (Agency plan)

Multiple client workspaces. Needs tenant isolation so Client A never sees Client B assets. Higher volume; more sensitive to queue wait and cost per clip.

### 3.4 Internal — Platform admin

Uses existing `/admin` allowlist (`ADMIN_EMAILS`). Needs: queue depth, GPU health, kill a stuck job, refund credits, disable a tenant, inspect moderation hits. Not a second product — an extension of the current admin app.

### 3.5 Explicitly not a persona for MVP

ML researchers who want custom samplers, ComfyUI graphs, or weight dumps. Power users can come later via an advanced settings panel with guarded defaults.

---

## 4. User Stories and Use Cases

### 4.1 Core stories (MVP)

| ID | As a… | I want to… | So that… |
| --- | --- | --- | --- |
| US-01 | visitor | sign up and land in an org | I can generate without a sales call |
| US-02 | member | create a project | I can group clips by campaign |
| US-03 | member | enter a prompt, pick T2V, 480P or 720P, and submit | I get a video without ops knowledge |
| US-04 | member | upload a product still and generate I2V | I can animate existing creative |
| US-05 | member | watch step/percent/ETA while waiting | I know the app is working |
| US-06 | member | preview, download, and copy a share-safe link | I can use the file in ads |
| US-07 | member | see history, retry, and duplicate settings | I can iterate |
| US-08 | member | cancel a queued job | I do not waste credits on a bad prompt |
| US-09 | owner | see credit balance, plan, and invoices | I can control spend |
| US-10 | owner | invite members | the team can generate under one bill |
| US-11 | member | get email when a long job finishes | I can leave the tab |
| US-12 | admin | pause a tenant or a model | I can stop abuse or a bad deploy |

### 4.2 Use case: happy-path T2V

1. User opens `/app/projects/{id}/generate`.  
2. Selects model “Wan 2.2 Fast” (TI2V-5B), mode Text-to-video.  
3. Enters prompt; optional negative prompt (default safety negative prompt pre-filled, editable).  
4. Chooses aspect (16:9 → 1280×704 for 5B **Verified**; 9:16 → 704×1280), duration locked to 5 s.  
5. UI shows credit cost before submit.  
6. Submit: API validates, reserves credits, inserts `generations` + `jobs`, enqueues.  
7. UI subscribes to job events (SSE). States: queued → running (step n/N) → processing → ready.  
8. Player loads via short-lived signed URL. Download uses a separate signed URL.

### 4.3 Use case: failure and refund

If the worker OOMs, crashes, or writes a zero-byte file: job → `failed`, credits refunded, user sees a non-technical message plus a “Retry” that creates a new idempotent-safe job.

### 4.4 Use case: cancel

- `queued` / `leased`: cancel is immediate; full refund.  
- `running`: worker checks cancel flag between denoising callbacks; if aborted before a valid MP4, refund.  
- `succeeded`: cancel is a no-op.

### 4.5 Out of scope stories (tracked, not built)

S2V talking-head from audio; Animate replacement; 3-minute ad assembly; customer API keys; webhook to Zapier; automatic posting to TikTok.

---

## 5. Functional Requirements

Requirements are MoSCoW. IDs are stable.

### 5.1 Identity, orgs, access

| ID | Priority | Requirement |
| --- | --- | --- |
| FR-A1 | Must | Email/password + OAuth (Google) via existing Supabase Auth |
| FR-A2 | Must | Every user belongs to at least one organization; signup creates a personal org |
| FR-A3 | Must | Roles: `owner`, `admin`, `member`, `viewer` |
| FR-A4 | Must | RLS isolates all generation/asset rows by `org_id` |
| FR-A5 | Should | Invite by email; pending invitations expire in 7 days |
| FR-A6 | Could | SSO/SAML (replace before enterprise sales; not MVP) |

### 5.2 Projects, prompts, generations

| ID | Priority | Requirement |
| --- | --- | --- |
| FR-P1 | Must | Projects: name, optional description, org-scoped |
| FR-P2 | Must | Generation belongs to a project and stores prompt, negative prompt, seed, model, settings JSON |
| FR-P3 | Must | Modes MVP: `t2v`, `i2v` |
| FR-P4 | Must | I2V accepts one image: JPEG/PNG/WebP, max 20 MB, max dimension 4096, re-encoded server-side |
| FR-P5 | Must | User-visible history with filters: status, mode, date |
| FR-P6 | Should | Duplicate generation (clone settings + prompt into a new draft) |
| FR-P7 | Should | Prompt templates (starter pack of marketing prompts) |
| FR-P8 | Won’t (MVP) | Multi-image, video-to-video, first/last frame control |

### 5.3 Jobs, progress, outputs

| ID | Priority | Requirement |
| --- | --- | --- |
| FR-J1 | Must | Submit is asynchronous; HTTP returns `202` + `generation_id` |
| FR-J2 | Must | Job states in §14 |
| FR-J3 | Must | Progress: stage, percent, current step, total steps, optional ETA |
| FR-J4 | Must | Cancellation as in §4.4 |
| FR-J5 | Must | Timeout → `timed_out`, refund, worker kill attempted |
| FR-J6 | Must | Output MP4 + poster JPEG + optional last-frame PNG |
| FR-J7 | Must | Downloads via time-limited signed URLs (no public buckets) |
| FR-J8 | Should | In-app notification + email on terminal state |
| FR-J9 | Could | Browser push notifications |

### 5.4 Billing and quotas

| ID | Priority | Requirement |
| --- | --- | --- |
| FR-B1 | Must | Credit ledger (append-only) |
| FR-B2 | Must | Reserve on submit, consume on success, refund on eligible failure/cancel |
| FR-B3 | Must | Hard block when available credits < cost |
| FR-B4 | Must | Per-org concurrent job cap (plan-based) |
| FR-B5 | Must | Stripe Checkout + Customer Portal for paid plans |
| FR-B6 | Should | Monthly plan grant + optional top-up packs |
| FR-B7 | Should | Usage dashboard (credits, jobs, GPU-seconds) |
| FR-B8 | Won’t (MVP) | Reseller / invoice net-30 (manual ops OK) |

Align plan numbers with current marketing (`pricing-content.tsx`): Free 1 video/month, Starter 5, Pro 20, Agency 80 — implemented as **credits**, not opaque “video counts”, because 720P must cost more than 480P.

### 5.5 Safety and admin

| ID | Priority | Requirement |
| --- | --- | --- |
| FR-S1 | Must | Prompt blocklist + optional classifier before enqueue |
| FR-S2 | Must | Store moderation decision on the generation |
| FR-S3 | Must | Admin can disable org, model, or provider |
| FR-S4 | Must | Audit log for admin and billing actions |
| FR-S5 | Should | Output scan (NSFW) before making asset visible |
| FR-S6 | Could | Human review queue |

### 5.6 Models

| ID | Priority | Requirement |
| --- | --- | --- |
| FR-M1 | Must | Catalog table: provider, model key, display name, enabled, cost, capabilities |
| FR-M2 | Must | MVP enabled model: `wan2.2-ti2v-5b` |
| FR-M3 | Must | Disabled-but-schema-ready: `wan2.2-t2v-a14b`, `wan2.2-i2v-a14b` |
| FR-M4 | Should | Feature-flag overflow provider (e.g. fal) without UI redesign |

---

## 6. Non-Functional Requirements

| ID | Category | Requirement |
| --- | --- | --- |
| NFR-1 | Reliability | Control plane available independent of GPU workers. Degraded mode: site up, generate returns `503` with queue-closed message |
| NFR-2 | Reliability | Jobs survive API restart. Workers survive by leasing with heartbeat; expired leases requeue |
| NFR-3 | Scalability | GPU work never on the web request path. Horizontal scale = more workers consuming the same queue |
| NFR-4 | Security | Tenant isolation via RLS + application `org_id` checks. Signed URLs. Secrets in a manager, not git |
| NFR-5 | Performance | Interactive API p95 < 400 ms (excludes generation). Generation SLO set only after benchmarks |
| NFR-6 | Observability | Structured JSON logs, request `trace_id`, job `generation_id` on every GPU log line, metrics in §23 |
| NFR-7 | Maintainability | Provider interface; files kept focused; no god-objects; Python worker typed (pydantic) |
| NFR-8 | UX | Every running job shows progress within 2 s of worker heartbeat |
| NFR-9 | Cost | Per-generation GPU-ms recorded; alerts if margin negative for 24 h |
| NFR-10 | Privacy | Assets private by default; retention policy in §18; GDPR export/delete for org-owned media |
| NFR-11 | I18n | UI English MVP; prompts any language the model accepts (UMT5 is multilingual — **Verified** README credits umt5-xxl). Do not assume English-only |
| NFR-12 | Compatibility | Chrome/Firefox/Safari latest-1; mobile usable for progress + download, generation form usable on desktop first |
| NFR-13 | Compliance | Apache-2.0 notice in product/legal; user ToS maps Wan usage restrictions (illegal/harmful content) |
| NFR-14 | Durability | Object storage 11 nines class (S3/R2); Postgres PITR |

**Explicit non-NFRs for MVP:** 99.99% GPU availability, multi-region active-active inference, SOC2 (start evidence collection, do not block MVP).

---

## 7. System Architecture

### 7.1 Decision: split control plane and data plane

**Recommendation.** Two deployables, one git repository.

```
[Browser]
    | HTTPS
[Next.js 16 on Vercel]  ---- control plane ----
    | Supabase Auth
    | Route Handlers /api/v1/*
    | Postgres (Supabase)
    | Supabase Storage or R2 (metadata in Postgres)
    | Stripe
    | Resend
    | Redis (prod) / Postgres SKIP LOCKED (MVP queue)
        |
        | worker pull (HTTPS poll or Redis)
[Python GPU worker]  ---- data plane ----
    | NVIDIA GPU
    | Wan 2.2 TI2V-5B (Diffusers), weights on local NVMe
    | ffmpeg post-process
    | PUT to signed upload URL
```

**Why not run inference in Next.js or a serverless GPU function for MVP.** Generation is minutes, not seconds (**Verified** “under 9 minutes”). Vercel/serverless timeouts and cold starts are incompatible. Model load of multi-GB weights must be amortized in a long-lived process.

**Why not Kubernetes GPU nodes for MVP.** NVIDIA device plugin, taints, drivers, and cluster cost dominate a solo/small team. A single dedicated GPU pod (RunPod Secure Cloud or Lambda) is enough until queue wait is the bottleneck. The worker contract (lease job → report progress → upload → complete) does not change when the host becomes a k8s Job later.

**Why the API never blocks on GPU.** Submit writes DB + enqueue and returns. Progress is SSE/polling. Workers are pull-based so a dead GPU does not pin API threads.

### 7.2 Logical components

| Component | Responsibility | MVP hosting |
| --- | --- | --- |
| Web app | UX, auth session, SSE consumer | Vercel |
| API | Validation, authz, credits, job create | Next.js Route Handlers |
| Postgres | Source of truth | Supabase |
| Queue | Dispatch | Postgres `SKIP LOCKED` (MVP) → Redis Streams (scale) |
| Worker manager | Heartbeat, cancel, concurrency=1 per GPU | Python process |
| Inference runtime | Diffusers `WanPipeline` | Same process, model kept warm |
| Object storage | Inputs, outputs, posters | Supabase Storage MVP → R2 |
| Billing | Stripe webhooks → ledger | Next.js + webhook |
| Observability | Logs, metrics, traces | Axiom or Grafana Cloud + Sentry |
| Moderation | Prompt + optional image | API before enqueue |

### 7.3 Trust boundaries

- Browser talks only to the Next.js origin.  
- GPU worker authenticates with a **worker service token** (hashed at rest, rotated). Worker is not on the public internet except egress to API + storage.  
- Storage writes use **short-lived signed uploads** issued by the API for that job only.  
- Stripe/Resend webhooks verified by signature.

### 7.4 Failure isolation

| Failure | User impact | System behavior |
| --- | --- | --- |
| GPU OOM/crash | That job fails, refund | Watchdog requeues or fails; worker process restarts; model reloads |
| Worker host down | Queue grows | Control plane healthy; banner “generation delayed” |
| Postgres down | Full outage | Fail closed |
| Redis down (if used) | Degrade to DB poll | Feature-flag |
| Stripe down | Paid upgrades fail; existing credits still work | Cached entitlements in `subscriptions` |

---

## 8. Technology Stack and Justification

Selections are one choice each, with rejected alternatives.

| Layer | Choice | Why | Rejected |
| --- | --- | --- | --- |
| Frontend | **Next.js 16 App Router + React 19** (existing) | Already the product; SSR for marketing + app; Route Handlers | Remix (migration cost), SPA Vite (duplicate auth/hosting) |
| UI | **Tailwind 4 + existing shadcn/Base UI** | Consistency with marketing site | New design system |
| Validation | **Zod 4** (existing) | Shared by API and forms | Yup |
| Backend (control) | **Next.js Route Handlers** | One TS codebase; no second Node service for MVP | NestJS, Django (extra ops) |
| Backend (data plane) | **Python 3.11 + PyTorch + Diffusers** | Wan official path; Diffusers progress callbacks | Wrapping `generate.py` as subprocess only (harder progress/cancel); ComfyUI (graph drift, weak multi-tenant) |
| DB | **PostgreSQL via Supabase** (existing) | Auth+DB+RLS already in repo; migrations exist | PlanetScale (no RLS), Mongo |
| ORM / access | **Supabase client + typed SQL migrations**; Drizzle later if queries explode | Avoid Prisma+Supabase dual schema for MVP | Prisma now (second source of truth vs SQL files already used) |
| Auth | **Supabase Auth** | Already implemented (`lib/supabase`, `/login`, `/auth/callback`) | Clerk (rewrite), NextAuth |
| Queue MVP | **Postgres `FOR UPDATE SKIP LOCKED`** | Zero new infra; transactional with credit reserve | Redis-only jobs (two truths) |
| Queue prod | **Redis Streams** (Upstash or ElastiCache) | Language-agnostic; Python `redis` consumer | BullMQ (Node-only; Python GPU would need a Node sidecar), SQS (fine later, more AWS lock-in), Celery (Python-centric, control plane is Node) |
| GPU host MVP | **1× dedicated RunPod Secure Cloud (or Lambda) GPU** | Data isolation better than community random hosts; hourly, no cluster | AWS g5/p4 (higher price/complexity), k8s first, always-on 8×H100 |
| GPU SKU MVP | **RTX 4090 24 GB or L40S 48 GB** for TI2V-5B | Official 24 GB path; L40S has headroom so we can drop CPU offload | H100 as default (cost), 8 GB cards (**Community** ComfyUI claims; not our production contract) |
| GPU SKU later | **H100 80 GB** for A14B without offload | Matches official 80 GB single-GPU note | Multi-GPU FSDP for first A14B (ops cost; use only if latency/quality requires) |
| Storage MVP | **Supabase Storage** | Same vendor as DB; RLS-friendly | S3 immediately (extra IAM) |
| Storage prod | **Cloudflare R2 + CDN** | Egress cost for video downloads | Stay on Supabase if volume low |
| Payments | **Stripe Billing** | Standard SaaS; Customer Portal | Paddle (OK alternative if tax-only need; pick Stripe) |
| Email | **Resend** (existing) | Already sends waitlist/blog mail | Postmark |
| Containers | **Docker** for worker; Vercel for app | Worker needs CUDA image | Unikernels |
| IaC | **Docker Compose (dev)**; **Terraform later** for R2/Redis | Don’t Terraform a single GPU pod on day 1 | Pulumi (no team skill assumed) |
| Secrets | **Vercel env + GPU host secret file / Doppler** | MVP: platform env; prod: Doppler or Infisical | Secrets in git, `.env` on disk unencrypted |
| Monitoring | **Sentry + Axiom (or Grafana Cloud) + GPU nvidia-smi exporter** | Error + logs + GPU metrics | Datadog first (cost) |
| CI | **GitHub Actions** | Universal | CircleCI |
| Tests | **Vitest + Playwright + pytest** | TS unit/e2e + Python worker tests | Jest (heavier with Vite/Next 16) |

**Diffusers vs official `generate.py`.** **Recommendation:** production worker uses **Hugging Face Diffusers** `WanPipeline` / `WanImageToVideoPipeline` with a pinned git SHA until Wan 2.2 is in a stable Diffusers release (HF cards still say install from source — **Verified**). Reasons: `callback_on_step_end` for progress, Python-native cancel, no CLI parsing. Keep official `generate.py` as a **staging oracle** to A/B a prompt for quality regressions.

**ComfyUI.** Allowed as an engineer’s debug tool. Not the SaaS runtime: workflows are not a stable API, isolation is weak, and multi-tenant prompt injection into a shared UI is a support nightmare.

---

## 9. Wan 2.2 Inference Architecture

### 9.1 Verified model matrix

| Model | Task | Resolution (official) | FPS notes | VRAM official single-GPU | MVP |
| --- | --- | --- | --- | --- | --- |
| TI2V-5B | T2V and I2V in one checkpoint | 720P as **1280×704 or 704×1280** | 24 fps (**Verified**) | ≥ 24 GB with offload flags | **Default** |
| T2V-A14B | T2V | 480P and 720P (`1280×720` in README examples) | Diffusers examples 16 fps / 81 frames | ≥ 80 GB | Phase 2 quality tier |
| I2V-A14B | I2V | 480P and 720P; `size` is **area**, aspect follows input image | Same as T2V examples | ≥ 80 GB | Phase 2 |
| S2V-14B | Image + audio (+ optional pose) | e.g. `1024×704` in README | Audio length can drive duration (`--num_clip`) | ≥ 80 GB | Post-MVP |
| Animate-14B | Animation or replacement | Preprocess pipeline required | Separate preprocess + infer | Not stated as 24 GB | Post-MVP |

### 9.2 Inference pipeline (TI2V-5B via Diffusers)

1. **Load once at worker boot:** VAE `float32`, transformer + text encoder `bfloat16` (matches official Diffusers snippet).  
2. **Per job:** resolve prompt, optional image download from signed GET, compute height/width divisible by VAE spatial factor.  
3. **Encode text** with UMT5.  
4. **Denoise** `num_inference_steps` (HF 5B example: 50; A14B examples: 40). Report progress each step.  
5. **Decode VAE** → frames.  
6. **export_to_video** then **ffmpeg** re-encode H.264 `+faststart`, generate poster.  
7. **Validate:** file size > threshold, `ffprobe` has video stream, duration within tolerance.  
8. **Upload** via signed PUT; PATCH job complete.

**Warm vs cold start.** Cold start includes multi-GB weight load from NVMe (or worse, Hugging Face download). **Recommendation:** workers are long-lived; models stay in GPU/CPU memory. Autoscale-to-zero is a **later** cost optimization and will add minutes to the first job — the UI must label that separately (“Starting GPU…”).

### 9.3 Settings we expose vs lock

| Parameter | User-facing MVP | Notes |
| --- | --- | --- |
| Prompt | Yes, max 2000 chars | UMT5; DeepLearning.ai reports 512-token class inputs — **Must benchmark** truncation |
| Negative prompt | Yes, with default | Official examples often use a Chinese quality negative; ship a bilingual default and **Must benchmark** English-only negatives |
| Seed | Optional; random if empty | Stored for reproducibility |
| Size | 16:9 / 9:16 / 1:1 if we confirm 1:1 | 5B 720P must use 704 not 720 on the short side (**Verified**) |
| Steps | Hidden default 50 (5B) | Advanced later; more steps = slower + more VRAM time |
| Guidance | Hidden default 5.0 (5B example) | A14B uses `guidance_scale` + `guidance_scale_2` |
| Frames / duration | Locked ~5 s | Do not offer 3 minutes |
| Offload flags | Operator config, not user | 24 GB: on; 80 GB: off for speed (**Verified**) |

### 9.4 Bottlenecks (expected, then measure)

| Bottleneck | Evidence | Mitigation |
| --- | --- | --- |
| Denoising steps on GPU | Inherent to diffusion | Keep model warm; don’t batch unrelated videos on 24 GB |
| CPU offload / T5 on CPU | Official OOM workaround | Use 48–80 GB GPU in prod if latency dominates cost |
| VAE decode + ffmpeg | After sampling | Run on CPU; don’t hold GPU idle if we can release — **Must benchmark** whether we should `torch.cuda.empty_cache` between jobs |
| Weight load | Multi-GB | Cache on worker NVMe; never download per job |
| HF / ModelScope download | First provision | Bake weights into AMI/pod volume or init container |
| Network upload of MP4 | 5 s 720P is small (typically tens of MB) | Usually not the bottleneck vs 9 min infer |
| Concurrent jobs on one GPU | Diffusion video rarely batches well | **Concurrency = 1 per GPU**. Quality and OOM risk if you force 2 |

**Do not ship as default:** aggressive GGUF/NVFP4 quantization, MagCache, distilled step-reduction. **Community** (LightX2V, cache-dit, ac4k NVFP4) may help later. Any quality drop must be A/B’d against official Diffusers BF16 on a fixed prompt set. FP8 (NVIDIA Model Optimizer card exists) is a **measured** production candidate for A14B, not a silent default.

### 9.5 Licensing for SaaS

Apache 2.0 **Verified** allows commercial use, modification, distribution with notice. Wan’s README adds acceptable-use style language (no illegal/harmful/misinfo targeting). **Recommendation:** (1) include Apache notices in `/legal` or OSS attributions page; (2) ToS: user owns outputs subject to law; (3) we still moderate because **we** host GPUs and storage; (4) do not scrape customer prompts into training without opt-in (not in MVP anyway).

### 9.6 What we will benchmark before pricing goes live

On the **exact** worker image and GPU SKU:

1. Cold start seconds (process up → first `pipe()` ready).  
2. Warm T2V 704×1280, default steps, n=20.  
3. Warm I2V same.  
4. Peak VRAM (`nvidia-smi`).  
5. Failure rate (OOM, NaN, empty file).  
6. Mean MP4 bytes.  
7. Cost = GPU-seconds × hourly rate + storage.

Until then, marketing must not quote “videos in 30 seconds.”

---

## 10. Model Abstraction and Future Model Support

### 10.1 Principle

The application core knows **GenerationRequest / GenerationResult / ProgressEvent**. It does not import Diffusers, fal, or Wan class names.

### 10.2 TypeScript contract (control plane)

```ts
type GenerationMode = "t2v" | "i2v" | "s2v" | "animate";

interface ProviderCapabilities {
  modes: GenerationMode[];
  maxDurationSec: number;
  sizes: { width: number; height: number; label: string }[];
  supportsSeed: boolean;
  supportsNegativePrompt: boolean;
  supportsImageInput: boolean;
  supportsAudioInput: boolean;
}

interface ProviderEstimate {
  creditCost: number;
  timeoutSec: number;
  estimatedDurationSec: number | null; // null until benchmarked
}

interface WorkerJobPayload {
  jobId: string;
  generationId: string;
  providerKey: string;      // "wan2.2"
  modelKey: string;         // "ti2v-5b"
  mode: GenerationMode;
  prompt: string;
  negativePrompt: string;
  seed: number | null;
  width: number;
  height: number;
  numFrames: number;
  fps: number;
  numInferenceSteps: number;
  guidanceScale: number;
  guidanceScale2?: number;
  inputAssetKeys: { image?: string; audio?: string };
  outputUpload: { putUrl: string; posterPutUrl: string; headers: Record<string, string> };
  cancelCheckUrl: string;
  progressUrl: string;
  completeUrl: string;
}
```

Python worker implements the same payload (pydantic). Adding `fal-wan-t2v` is a new `providerKey` + worker or HTTP adapter, not a new job table.

### 10.3 Control-plane modules

- `lib/generation/provider-registry.ts` — maps `modelKey` → capabilities, cost, worker queue name.  
- `lib/generation/providers/types.ts` — interfaces only.  
- Workers: `workers/wan/` (self-hosted), later `workers/http-adapter/` for commercial APIs.

### 10.4 Adding a model (runbook)

1. Insert `models` row (`enabled=false`).  
2. Implement worker or HTTP adapter.  
3. Benchmark cost/latency/quality gate.  
4. Set credit cost with margin.  
5. Enable for internal org, then percentage rollout.

### 10.5 Overflow / hybrid (post-MVP, architecture now)

If self-hosted queue > N minutes, route **new** jobs with `routing_policy=overflow` to a commercial API **only if** the model is flagged `allow_overflow` and the user has not opted out of third-party processing. Default MVP: **no overflow** (simpler privacy story).

---

## 11. Database Design

PostgreSQL via Supabase. UUID PKs. `org_id` on every tenant table. RLS enabled. Migrations continue the existing `supabase/migrations/00xx_*.sql` sequence (next number after `0011`).

### 11.1 Entity relationship (logical)

```
auth.users 1──* org_memberships *──1 organizations 1──1 credit_accounts
organizations 1──* projects 1──* generations 1──* generation_assets
generations 1──1 jobs
organizations 1──* subscriptions *──1 plans
credit_accounts 1──* credit_ledger_entries
generations *──1 models
organizations 1──* api_keys          -- reserved, unused in MVP UI
organizations 1──* audit_events
users 1──* notifications
```

### 11.2 Core tables

**organizations**  
`id`, `name`, `slug` unique, `status` (`active|suspended|deleted`), `created_by`, timestamps.

**org_memberships**  
`org_id`, `user_id`, `role` (`owner|admin|member|viewer`), unique `(org_id, user_id)`.

**plans**  
`id`, `key` (`free|starter|pro|agency`), `monthly_credit_grant`, `max_concurrent_jobs`, `max_seats`, `stripe_price_id_month`, `stripe_price_id_year`, `features jsonb`.

**subscriptions**  
`org_id` unique, `plan_id`, `stripe_customer_id`, `stripe_subscription_id`, `status`, `current_period_end`.

**credit_accounts**  
`org_id` unique, `available_credits` int, `reserved_credits` int, `lifetime_granted`, `lifetime_consumed`.  
Invariant: `available >= 0`, `reserved >= 0`. Updates only via ledger function.

**credit_ledger_entries** (append-only)  
`id`, `org_id`, `account_id`, `delta_available`, `delta_reserved`, `reason` (`grant|reserve|consume|refund|adjustment|expire`), `generation_id` null, `idempotency_key` unique, `metadata jsonb`, `created_at`.

**projects**  
`org_id`, `name`, `created_by`, `archived_at` null.

**models**  
`key` unique, `provider_key`, `display_name`, `enabled`, `modes text[]`, `credit_cost_default`, `timeout_sec`, `capabilities jsonb`, `worker_queue` (`wan-5b|wan-a14b|http`).

**generations**  
`id`, `org_id`, `project_id`, `user_id`, `model_key`, `mode`, `status` (denormalized from job for listing), `prompt`, `negative_prompt`, `seed`, `settings jsonb`, `moderation jsonb`, `credit_cost`, `error_code`, `error_message_public`, `started_at`, `finished_at`, timestamps.  
Indexes: `(org_id, created_at desc)`, `(org_id, status)`, `(project_id, created_at desc)`.

**jobs**  
`id`, `generation_id` unique, `org_id`, `queue`, `state`, `attempt`, `max_attempts`, `lease_owner`, `lease_until`, `heartbeat_at`, `idempotency_key` unique per org, `payload jsonb`, `progress jsonb`, `last_error`, `cancelled_at`, timestamps.  
Index: partial `(queue, state) where state in ('queued','leased')`.

**generation_assets**  
`id`, `generation_id`, `org_id`, `kind` (`input_image|output_video|poster|last_frame`), `storage_backend`, `bucket`, `object_key`, `content_type`, `bytes`, `sha256`, `width`, `height`, `duration_ms`, `ffprobe jsonb`.

**api_keys**  
`id`, `org_id`, `prefix`, `secret_hash`, `scopes`, `revoked_at`. Reserved.

**audit_events**  
`org_id` null for system, `actor_user_id`, `action`, `resource_type`, `resource_id`, `ip`, `metadata jsonb`.

**notifications**  
`user_id`, `org_id`, `type`, `payload jsonb`, `read_at`.

**system_events**  
Operational: worker register, OOM, queue depth snapshots (optional; metrics store may suffice).

### 11.3 Job state enum

`queued | leased | running | uploading | succeeded | failed | cancelled | timed_out`

### 11.4 RLS pattern

- Enable RLS.  
- Policy: `org_id in (select org_id from org_memberships where user_id = auth.uid())`.  
- Service role used only by: Stripe webhook, worker callback routes, waitlist-style trusted routes. Worker does **not** get the Supabase service role for arbitrary SQL; it calls the API.

### 11.5 Credit reservation (transaction)

Single SQL function `reserve_credits(org, amount, generation_id, idempotency_key)`:

1. Lock `credit_accounts`.  
2. If `available < amount` → raise.  
3. `available -= amount; reserved += amount`.  
4. Insert ledger `reason=reserve`.  
5. Insert generation + job.

Consume: `reserved -= amount; lifetime_consumed += amount`, ledger `consume`.  
Refund: `reserved -= amount; available += amount`, ledger `refund`.

Never update balances without a ledger row.

---

## 12. API Specification

Base: `/api/v1`. JSON. Version in path. Errors:

```json
{
  "error": {
    "code": "credits_insufficient",
    "message": "This generation costs 12 credits; you have 3 available.",
    "request_id": "uuid",
    "details": {}
  }
}
```

Auth: Supabase session cookie for browser; later `Authorization: Bearer ml_...` for API keys.

Idempotency: `Idempotency-Key` required on `POST /generations`. Replay 24 h returns the original generation.

Rate limits (MVP): 30 submits/hour/user, 10 concurrent jobs/org (plan may be lower), 60 GET progress/min/user. Return `429` + `Retry-After`.

Pagination: `cursor` + `limit` (max 50), never offset for history.

### 12.1 Endpoints (MVP)

| Method | Path | Authz | Responsibility |
| --- | --- | --- | --- |
| GET | `/me` | session | user + memberships |
| GET/PATCH | `/organizations/:orgId` | owner/admin | org profile |
| POST | `/organizations/:orgId/invites` | owner/admin | invite |
| GET | `/organizations/:orgId/usage` | member | credits, jobs |
| GET/POST | `/projects` | member | list/create |
| GET/PATCH | `/projects/:id` | member; viewer read | |
| POST | `/projects/:id/generations` | member | create job, 202 |
| GET | `/generations` | member | history |
| GET | `/generations/:id` | member | detail + progress snapshot |
| GET | `/generations/:id/events` | member | SSE progress |
| POST | `/generations/:id/cancel` | member | cancel |
| GET | `/generations/:id/assets/:assetId/url` | member | signed GET, 60–300 s |
| POST | `/billing/checkout` | owner | Stripe |
| POST | `/stripe/webhook` | signature | subscription + grants |
| POST | `/internal/workers/lease` | worker token | lease next job (if API-mediated queue) |
| POST | `/internal/workers/jobs/:id/progress` | worker | heartbeat + percent |
| POST | `/internal/workers/jobs/:id/complete` | worker | success + asset keys |
| POST | `/internal/workers/jobs/:id/fail` | worker | fail + code |

**Recommendation:** GPU worker uses **API-mediated lease** (`SKIP LOCKED` inside the lease endpoint) so the worker never holds a DB password. Payload includes signed upload URLs.

Validation: Zod schemas in `lib/validations/generation.ts`. Prompt length, image MIME, enum model keys, size whitelist.

SSE event types: `snapshot`, `progress`, `heartbeat`, `terminal`. If proxy buffers SSE, fall back to 2 s polling of `GET /generations/:id` (implement both; SSE is enhancement).

---

## 13. Frontend Architecture and UX

### 13.1 App information architecture

Keep marketing routes as they are. Add authenticated app under `/app`:

- `/app` dashboard (credits, recent jobs, CTA generate)  
- `/app/projects`, `/app/projects/[id]`  
- `/app/projects/[id]/generate`  
- `/app/generations/[id]` player + metadata  
- `/app/history`  
- `/app/settings` members, billing  

Reuse `components/ui/*`. New folders: `components/app/generation/*`, `lib/generation/*`.

### 13.2 Generation workflow UX (long jobs)

The job will often take **several minutes** (**Verified** up to ~9 min for 5B 720P). UX rules:

1. **Cost and time honesty** before submit: “Uses 12 credits. Typical wait on current hardware is measured after launch; expect several minutes.” Do not invent 15-second claims.  
2. **Immediate transition** to a job page after 202 — do not keep the user on a spinner overlay that looks crashed.  
3. **Persistent progress card:** queue position (if known), stage (`Queued / Loading model / Sampling 12/50 / Encoding / Uploading`), percent, elapsed time, cancellable while allowed.  
4. **Heartbeat:** if no event for 15 s, show “Still working — GPU jobs do not stream every frame.” If no heartbeat for `timeout`, show failure.  
5. **Leave-tab safety:** email + in-app notification; job continues.  
6. **Failure:** plain language (`GPU ran out of memory` → “This setting failed. Credits were returned. Try again or use a smaller size.”).  
7. **Player:** native `<video>` + poster; download button; copy prompt; retry.  
8. **Empty states:** no projects, no credits (upgrade CTA), worker offline banner from `GET /status`.

### 13.3 Onboarding

After first login: create org name → 30-second “what a 5-second clip is” → optional sample prompt → generate. Grant **welcome credits** equal to Free plan monthly grant, not unlimited.

### 13.4 Accessibility

Focus management to progress region (`aria-live="polite"`). Don’t rely on color alone for status. Keyboard-submittable form.

### 13.5 Mobile

History + player + download first-class. Complex I2V upload tested on desktop; mobile upload should still work.

---

## 14. Job Queue and GPU Worker Architecture

### 14.1 Why pull + lease, not push to GPU

Push (API HTTP to worker) fails when workers scale, restart, or sit behind NAT. Pull: worker calls `lease`, holds job until heartbeat expires.

### 14.2 Lease protocol

- `lease_until = now() + 60s`. Heartbeat every 15 s extends lease.  
- Concurrency: worker configured `slots=1`.  
- If `lease_until` expires and state is `leased`/`running`, watchdog sets `queued` and `attempt++`, or `failed` if `attempt >= max_attempts` (default 2).  
- Idempotent complete: completing twice is a no-op.

### 14.3 Retry policy

| Error class | Retry | Refund |
| --- | --- | --- |
| OOM | No (same settings will OOM) | Yes |
| CUDA crash / worker kill | Yes, once on another/same worker | If final fail |
| Invalid prompt moderation | Never queued | No reserve |
| Timeout | No | Yes |
| Storage 5xx on upload | Yes, once | If final fail |
| User cancel | No | If no valid output |

### 14.4 Timeouts

- Queue wait: 30 min then `timed_out` (configurable).  
- Inference: `models.timeout_sec` default **20 min** for 5B (above official <9 min + encode + slack).  
- Upload: 2 min.

### 14.5 Cancellation

`cancelled_at` set. Worker polls `cancelCheckUrl` each step. Cooperative cancel only — cannot preempt CUDA kernel instantly. If cancel during last encode, may still complete; then treat as succeeded or discard per “cancel wins if user cancelled before success ack” — **Recommendation:** if output exists and user cancelled, still mark cancelled, **do not** consume credits, **delete** object.

### 14.6 Dead letter

After `max_attempts`, `failed` + `error_code=dead_letter`. Admin UI lists them. No silent drop.

### 14.7 Worker process

- systemd or Docker `restart=always`.  
- On start: load model, then loop lease.  
- `SIGTERM`: stop leasing, finish or fail current job (prefer fail+refund if not past encode), exit.  
- GPU isolation: one worker process per GPU. Do not share a GPU across Docker containers without MIG (not MVP).

### 14.8 Postgres SKIP LOCKED vs Redis

MVP lease query conceptually:

```sql
update jobs
set state = 'leased', lease_owner = $worker, lease_until = now() + interval '60 seconds'
where id = (
  select id from jobs
  where queue = $q and state = 'queued'
  order by created_at
  for update skip locked
  limit 1
)
returning *;
```

**Replace with Redis Streams** when: lease contention is high, you need delayed jobs/fairness per tenant, or queue latency p99 suffers. Keep **jobs table as source of truth** either way.

### 14.9 Fairness (simple MVP)

FIFO global queue. **Must add before abuse:** per-org concurrent cap already; later token-bucket so one Agency cannot starve Free users — acceptable MVP risk at low volume, **must** fix before public launch if multi-tenant load exists.

---

## 15. Storage and Asset Pipeline

### 15.1 Layout

`orgs/{orgId}/generations/{generationId}/input.jpg`  
`orgs/{orgId}/generations/{generationId}/output.mp4`  
`orgs/{orgId}/generations/{generationId}/poster.jpg`

Never put `orgId` only in metadata; the key prefixes for isolation and lifecycle.

### 15.2 Pipeline

1. Browser uploads input via **signed PUT** to storage (not through Vercel body limits). API creates a pending `generation_assets` row.  
2. API confirms upload with size/MIME/magic-bytes check (server HEAD or worker verifies).  
3. Worker downloads input with signed GET.  
4. Worker writes MP4 locally, ffprobe, poster (first or midpoint frame).  
5. Worker PUT output + poster.  
6. Complete callback stores hashes and duration.  
7. API issues signed GET for playback (`Content-Disposition: inline`) and download (`attachment`).

### 15.3 Security

- Private buckets.  
- Signed URLs 60–300 s.  
- Virus/malware: treat images as untrusted; decode with pillow in worker, re-encode PNG/JPEG (strips payload). Reject insane dimensions.  
- No user-controlled object keys.

### 15.4 CDN

MVP: Supabase Storage URLs. Prod: R2 + optional signed cookies or proxied `/api/v1/.../url` redirect. Cache posters longer than MP4s if URLs are tokenized (usually uncacheable except CDN with token).

### 15.5 Retention

Default: keep outputs while subscription active + 30 days. Free: 14 days. Deleted org: 30-day purge job. Document in privacy policy. **Must** implement a daily reaper before charging cards (storage creep).

---

## 16. Authentication and Authorization

### 16.1 AuthN

Keep Supabase Auth. Session cookies (`@supabase/ssr`) as today. Enforce email verification before generation (not required for waitlist).

**MVP acceptable:** password + Google. **Replace before enterprise:** no MFA in product; add TOTP or rely on Google.

### 16.2 AuthZ matrix

| Action | owner | admin | member | viewer |
| --- | --- | --- | --- | --- |
| Generate | Y | Y | Y | N |
| Cancel own job | Y | Y | Y | N |
| Cancel any org job | Y | Y | N | N |
| Billing | Y | N | N | N |
| Invite | Y | Y | N | N |
| Delete project | Y | Y | N | N |
| View assets | Y | Y | Y | Y |

Platform admin (`ADMIN_EMAILS` today) **Recommendation:** move to `platform_admins` table before launch; env allowlist is **MVP-acceptable** and **must be replaced** (ops risk, no audit).

### 16.3 Worker auth

`Authorization: Bearer` worker token, constant-time compare, IP allowlist optional. Separate tokens per worker environment.

### 16.4 Tenant isolation tests

Mandatory automated test: user A cannot GET user B generation ID (enumeration). Random UUIDs help but are not a control.

---

## 17. Billing, Credits, and Usage Architecture

### 17.1 Why credits, not “1 video = 1 count”

720P 5B uses more GPU-seconds than a future 480P distilled model. A14B will cost a multiple of 5B. Credits let one plan sell a mix.

**Recommendation starting costs (placeholders until benchmark):**

| SKU | Credits | Rationale |
| --- | --- | --- |
| TI2V-5B 5s 720P | 10 | ~1/10 of a Starter 5-video month if Starter grant = 50 credits |
| TI2V-5B 5s 480P (if enabled) | 6 | If we confirm 5B 480P quality path |
| T2V-A14B 720P | 40 | Rough 4× until measured |

Map existing advertised videos/month to credit grants: Free 10, Starter 50, Pro 200, Agency 800 (example). **Must** reconcile with GPU cost in §27 after benchmarks. If 10 credits of 5B cost more than $29/5 Starter videos, **cut grants or raise price** before launch — do not ship negative margin.

### 17.2 State machine for money

```
submit → reserve
success → consume (reserved → spent)
fail/timeout/cancel-without-output → refund
stripe invoice paid → grant
period rollover → grant monthly (reset or stack: Recommendation = expire unused monthly grant, keep top-ups — simpler; document clearly)
```

**Recommendation:** monthly plan credits **expire** at period end; purchased packs last 12 months. Prevents hoarding that spikes GPU bill.

### 17.3 Stripe

- Products = plans.  
- Webhook `invoice.paid` / `customer.subscription.updated` → upsert `subscriptions` + grant.  
- Customer Portal for cancel/payment method.  
- Idempotent webhooks (`stripe_event_id` unique).

### 17.4 Abuse controls

- Concurrent job cap.  
- Daily credit spend cap (soft).  
- New accounts: smaller grant until payment method on file (optional).  
- No generation for `suspended` orgs.

### 17.5 Reconciliation

Nightly job:  
`sum(ledger) == account.available + accounting identity`.  
`reserved` should equal sum of non-terminal jobs’ `credit_cost`. Alert on drift.

---

## 18. Security Architecture

### 18.1 Baseline

- HTTPS only, HSTS at CDN.  
- Security headers already worth auditing on Next 16 (`proxy.ts`).  
- Zod validation on every mutation.  
- CSRF: SameSite cookies + origin check on mutations.  
- Dependency scanning in CI (npm audit / `pip-audit`).  
- No `eval` of prompts.

### 18.2 Prompt abuse

- Length limits.  
- Blocklist (CSAM, violent crime, etc. — legal review).  
- Optional OpenAI/Perspective-style classifier later; MVP blocklist + rate limit is **acceptable**, **must harden** before large public launch.  
- Log matches in `moderation` JSON, not the full abusive prompt in third-party APM if avoidable.

### 18.3 Uploads

- MIME + magic bytes.  
- Re-encode images.  
- Max size 20 MB.  
- No SVG (XSS if ever inlined).  
- Worker runs as non-root; read-only model weights; writable only `/tmp/jobs/{id}`.

### 18.4 GPU worker isolation

- Dedicated tenant-unaware worker (processes many orgs) is OK if it **cannot** list storage except signed URLs for the current job.  
- No shared `/outputs` directory served by nginx.  
- Community cloud GPUs (**Recommendation: avoid for customer media**). Secure Cloud or owned box.

### 18.5 Secrets and encryption

- TLS in transit.  
- Storage SSE (vendor default).  
- No encryption-at-application-layer for MVP (complexity); **acceptable**, document.  
- Rotate worker tokens.

### 18.6 Privacy and retention

- Prompts are personal data. Export: JSON of user’s generations. Delete: cascade assets.  
- DPA with Supabase/Stripe/Resend/GPU host.  
- Do not train on customer data.  
- Region: pick one (e.g. EU or US) and state it; GPU host region should match if promised.

### 18.7 Audit

Log: login, invite, role change, generation submit/cancel, credit adjustment, admin disable. 1-year retention.

---

## 19. Testing Strategy

| Layer | Tool | Real vs mock |
| --- | --- | --- |
| Unit TS | Vitest | mock Stripe, storage, queue |
| Unit Python | pytest | mock CUDA; tensor-free payload tests |
| API integration | Vitest + local Supabase | **real Postgres** |
| RLS | SQL tests | **real Postgres** |
| Queue/lease | integration | **real Postgres** |
| Worker | pytest | fake provider that writes a tiny MP4 |
| Frontend | Playwright | mock generation API + SSE fixture |
| E2E staging | Playwright | **real stack except GPU** (fake provider) |
| GPU | nightly staging job | **real TI2V-5B**, 2 golden prompts |
| Load | k6 | API + lease, not full GPU |
| Security | zap/authz tests | staging |
| Failure | chaos: kill worker mid-job | staging GPU |

**Never mock:** credit math, RLS, lease expiry, webhook signature verification.  
**Always mock in CI:** actual Wan weights, CUDA, Stripe network (use Stripe test + fixtures), Resend.  
**Staging:** fake provider by default; GPU suite opt-in `RUN_GPU_TESTS=1`.

Golden outputs: store hash of ffprobe duration/resolution, not pixel hash (diffusion is stochastic unless seed+deterministic algos — **Must benchmark** seed stability).

---

## 20. Local Development Setup

### 20.1 Layout

```
app/                  # existing Next.js
lib/generation/       # new domain
workers/wan/          # Python package
supabase/migrations/  # new SQL
docker-compose.yml    # postgres already via supabase local; add optional redis
```

### 20.2 Developer paths

1. **App only:** `npm run dev` + `supabase start` + `WORKER_MODE=fake` Next.js in-process fake completer (optional) or Python fake worker.  
2. **Queue + fake GPU:** Python worker `--provider fake` writes a 1-second color MP4 via ffmpeg (no CUDA).  
3. **Real GPU (optional):** documented, not required. Linux + NVIDIA Container Toolkit + weights on disk.

### 20.3 Config (twelve-factor)

`APP_ENV`, `SUPABASE_*`, `STRIPE_*`, `WORKER_TOKEN`, `STORAGE_*`, `CREDIT_*`, `WAN_MODEL_DIR`, `WAN_OFFLOAD`, `QUEUE_NAME`, `LOG_LEVEL`. No defaults that point to production.

### 20.4 Seed data

Demo org, plans, 100 credits, sample project, one succeeded generation pointing at a committed tiny MP4 in storage seed.

### 20.5 Migrations

`supabase db reset` locally. Never edit old migrations; add new files.

---

## 21. CI/CD Pipeline

GitHub Actions:

1. **PR:** `eslint`, `tsc`, Vitest, pytest (CPU), Playwright (fake), `pip-audit`/npm audit, migration lint.  
2. **main:** build Next.js, build worker image (`linux/amd64`), scan image (Trivy), push to GHCR.  
3. **Staging deploy:** Vercel preview/staging + `supabase db push` to staging + rollout worker container.  
4. **Prod:** manual approval; migrate; deploy app; drain old worker; start new worker (see §28).

No `--no-verify`. Conventional commits. Semver for worker image tags (`wan-worker:1.4.0`).

---

## 22. DevOps and Infrastructure

### 22.1 Git workflow

`main` protected. `feat/*` PRs. Review required. GPU weight files **never** committed.

### 22.2 Environments

| Env | App | DB | GPU |
| --- | --- | --- | --- |
| local | localhost | supabase local | fake |
| staging | Vercel staging | Supabase staging | 1 small GPU or fake |
| prod | Vercel prod | Supabase prod | dedicated Secure Cloud GPU |

### 22.3 Health

- App: `/api/v1/health` (db ping).  
- Worker: `/healthz` on localhost; GPU host sidecar or worker process reports to API `POST /internal/workers/heartbeat` (vram, gpu_util, model_loaded).  
- K8s later: liveness = process up; readiness = model loaded.

### 22.4 Incident response (summary)

Pager: Sentry + queue depth + GPU heartbeat missing 5 min. Runbook in §32-adjacent ops: OOM, stuck lease, storage, Stripe.

### 22.5 IaC

MVP: documented click-ops for one GPU pod + Vercel + Supabase. **Must replace** with Terraform/Pulumi before a second region or a second engineer cannot reproduce prod.

---

## 23. Monitoring and Observability

### 23.1 Logs

JSON: `ts, level, trace_id, org_id, generation_id, job_id, event`. GPU logs never include full signed URLs (redact query).

### 23.2 Metrics

- API: RPS, latency p50/p95, 4xx/5xx.  
- Queue: depth, wait_seconds p95, lease_expired_total.  
- Generation: success_rate, fail_by_code, duration_seconds, credits_consumed, gpu_seconds.  
- GPU: utilization, VRAM used, temp, power (DCGM or `nvidia-smi` scrape).  
- Cost: `gpu_seconds * $/s` vs `credits * $`.  
- Per-tenant: gpu_seconds, jobs, fail_rate (abuse).

### 23.3 Traces

OpenTelemetry on API. Worker: span per job (not per diffusion step). Useful across API lease → complete.

### 23.4 Alerts

- Success rate < 90% / 15 min.  
- Heartbeat missing.  
- Queue wait > 10 min.  
- Credit ledger drift.  
- Stripe webhook failures.  
- Disk > 80% on GPU box (weights + temp files).

Dashboards: “Generation health”, “GPU”, “Revenue vs GPU cost”.

---

## 24. Performance and Optimization Strategy

### 24.1 Targets (measure, then freeze)

| Metric | How to measure | Initial goal (not SLA) |
| --- | --- | --- |
| API submit p95 | APM | < 800 ms |
| Queue wait empty-system | staging | < 5 s |
| Warm 5B 720P T2V | 20 seeded jobs | **Must benchmark**; official < 540 s consumer GPU |
| GPU util during sampling | DCGM | high; if low, investigate CPU offload |
| Failure rate | 100 job soak | < 5% |

### 24.2 Allowed optimizations (quality-preserving)

- Keep model resident.  
- `flash_attn` as required by official deps.  
- BF16 transformer, FP32 VAE (official Diffusers pattern).  
- Drop CPU offload on 80 GB GPUs (**Verified** README: faster if you have 80 GB).  
- NVMe weights; no per-job HF fetch.  
- ffmpeg `preset=fast` after quality check.  
- Parallel poster + upload.

### 24.3 Optimizations that need an explicit quality gate

- Fewer inference steps.  
- FP8 / NVFP4 / GGUF.  
- Cache-dit / TeaCache / MagCache.  
- Distilled LightX2V checkpoints.  
- Resolution drops.

### 24.4 Batching

**Recommendation:** do not batch multiple customer videos on one 24 GB GPU. Sequence parallelism (Ulysses) is for **one** job across many GPUs, not throughput of many jobs (**Verified** README multi-GPU is for a single `generate.py` invocation).

---

## 25. Scalability Strategy

| Stage | Capacity idea | When |
| --- | --- | --- |
| 0 | 1× 4090/L40S, FIFO, fake+real | MVP |
| 1 | 2–N identical 5B workers | Queue p95 wait > 5 min at peak |
| 2 | Separate A14B H100 pool | Paid quality SKU |
| 3 | Redis Streams + fair scheduler | Multi-tenant starvation |
| 4 | K8s GPU node pool + cluster autoscaler | > ~8 GPUs or multi-region |
| 5 | Overflow API | Burst / DR |

Control plane scales on Vercel independently. DB: indexes in §11; partition `credit_ledger` / `audit_events` only when large.

**Do not** run N workers against one GPU.

---

## 26. Backup and Disaster Recovery

| Asset | RPO / RTO MVP | Method |
| --- | --- | --- |
| Postgres | RPO < 24 h, RTO hours | Supabase PITR (enable **before** paid users) |
| Object storage | RPO < 24 h | Versioning + cross-bucket replication when on R2 |
| Weights | RTO: re-download hours | Not backed up as unique data; pin revision SHA |
| Stripe | n/a | Stripe is source for money; we store IDs |

**DR drill:** restore staging from backup quarterly.  
**GPU loss:** acceptable; jobs fail/refund or requeue. Not a data disaster.  
**Region loss:** MVP single region; **document** this limitation.

---

## 27. Cost and Infrastructure Planning

### 27.1 Cost drivers (order of magnitude, 2026-08 public list prices — **re-quote at purchase**)

| Item | Ballpark | Notes |
| --- | --- | --- |
| RunPod H100 SXM | ~$2.7–$3.3 / GPU-hour Secure/Community listings | A14B class |
| RTX 4090 cloud | often well under $1 / hour | 5B class |
| Vercel + Supabase | existing | watch storage/egress |
| Redis | $0 until added | |
| Sentry/Axiom | tens–hundreds $/mo | |
| Stripe fees | 2.9% + $0.30 | |

**Worked example (illustrative, not a quote):** if warm 5B job takes 8 min on a $0.60/h 4090, GPU cost ≈ $0.08/video + storage/overhead. Starter $29 for 5 videos is only viable if grants match **measured** cost with margin. If jobs take 9 min on a $3/h H100, GPU ≈ $0.45/video — still OK; if you put A14B 720P at 3 min on H100, still maybe OK; if 15 min, margin dies.

### 27.2 Pricing relation

`credit_usd = gpu_usd * (1 + margin) + storage_share + support_share`  
Launch with conservative credits (overcharge slightly) and a usage dashboard. Adjust after 2 weeks of real `gpu_seconds`.

### 27.3 Idle GPU cost

A dedicated 4090 24/7 is the **minimum** prod inference bill even at 0 customers. **Recommendation:** for pre-revenue, stop the pod off-hours **only if** the UI shows “GPU offline” and does not take payment for instant generation. Once paid users exist, keep one warm replica; autoscale extras.

---

## 28. Deployment Strategy

### 28.1 App (control plane)

Vercel rolling deploy. Health check `/api/v1/health`. Instant rollback via Vercel.

### 28.2 Migrations

Run **before** app that requires new columns. Expand/contract. Never destructive without backup.

### 28.3 GPU worker

**Not** blue-green on one GPU. Procedure:

1. Stop leasing (`PAUSE` file or API drain).  
2. Finish or fail current job.  
3. Pull new image.  
4. Health: `model_loaded`.  
5. Resume lease.

If two GPUs: rolling. If one GPU: maintenance window or accept one failed in-flight job with refund.

### 28.4 Feature flags

`enable_i2v`, `enable_a14b`, `enable_stripe`, `gpu_available`. Flags in DB so we can disable generation without redeploy.

---

## 29. MVP Implementation Phases

Execute in order. Each phase is independently demoable. Detailed files live in `AGENT_IMPLEMENTATION_PLAN.md`.

| Phase | Objective | Demo |
| --- | --- | --- |
| 0 | Repo layout, env, docs pointer | `docs/srs` linked from AGENTS.md optional |
| 1 | Schema + RLS | SQL tests pass |
| 2 | Auth, orgs, roles | Invite + membership |
| 3 | Credits + Stripe test mode | Reserve/consume/refund unit + Checkout |
| 4 | Generations API + lease + fake worker | 202 → fake MP4 |
| 5 | Storage signed URLs + asset rows | Upload/download |
| 6 | App UX: generate, progress, history | Full loop fake GPU |
| 7 | Python worker + Diffusers on staging GPU | Real 5B video |
| 8 | Moderation, emails, admin queue | Ops usable |
| 9 | Observability, reaper, hardening | Staging soak |
| 10 | Production checklist + pricing freeze from benchmarks | Paid beta |

Phases 0–6 **do not** require a GPU. Do not block product development on weights download.

---

## 30. Detailed Development Task Breakdown

Summary; the agent plan is the file-level source.

**Domain TS:** `lib/generation/types.ts`, `credits.ts`, `jobs.ts`, `providers/registry.ts`, `moderation.ts`.  
**API:** `app/api/v1/**/route.ts` — keep handlers thin; logic in `lib/`.  
**UI:** `app/app/**/page.tsx` + `components/app/generation/{form,progress,player,history}.tsx`.  
**SQL:** `0012_orgs.sql` … split by phase.  
**Worker:** `workers/wan/src/{main.py,lease.py,infer.py,fake.py,ffmpeg.py}`.  
**Tests:** colocated `*.test.ts`, `workers/wan/tests/`.  
**Compose:** `workers/wan/Dockerfile`, `docker-compose.worker.yml`.

SOLID: registry depends on interfaces; Stripe behind `BillingGateway`; storage behind `StorageGateway`; worker completion through HTTP, not DB.

---

## 31. Production Readiness Checklist

Ship paid traffic only if:

- [ ] RLS tests for cross-tenant IDOR  
- [ ] Credit ledger reconcile job + alert  
- [ ] Signed URLs only; buckets private  
- [ ] Stripe webhooks idempotent; test-mode signed  
- [ ] Worker drain + restart runbook practiced  
- [ ] GPU soak: 50 consecutive 5B jobs, success ≥ 95%  
- [ ] Measured latency published internally; marketing copy does not claim 3-minute native Wan video  
- [ ] Legal: ToS, privacy, Apache attribution, content policy  
- [ ] Backup PITR on  
- [ ] Sentry + heartbeat alerts on-call  
- [ ] Data retention reaper on  
- [ ] `ADMIN_EMAILS` replaced or accepted as known risk with 2FA on those Google accounts  
- [ ] Status page or banner for GPU down  
- [ ] Load test API (not GPU) at 10× expected beta RPS  
- [ ] Secrets rotated; worker token not in logs  

---

## 32. Risks, Limitations, and Future Improvements

### 32.1 Limitations (product must be honest)

- ~5 s clips, not 3-minute ads.  
- Minutes of wait, not realtime.  
- 5B quality < A14B (**official positioning**).  
- Single-region MVP.  
- Cooperative cancel only.  
- Stochastic outputs; seed helps but is **Must benchmark**.  
- Official efficiency table not ingested as numbers (image-only in README) — do not cite fake GPU-second tables.

### 32.2 Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| GPU cost > plan price | High | Benchmark before public paid launch; credits |
| OOM on 24 GB at 720P | High | L40S/A100 40–80 GB; keep official offload flags |
| Diffusers API churn | Medium | Pin commit SHA; oracle vs `generate.py` |
| Abuse of GPU via stolen accounts | High | Rate limits, captcha later, spend caps |
| Legal/content | High | ToS + moderation; no CSAM; report path |
| Hugging Face / weights availability | Low | Mirror on our bucket |
| Vercel timeout if someone sync-calls GPU | High | Architecture forbids it; code review |
| Marketing/engineering mismatch (3 min ads) | High | Change copy or add multi-clip product later |

### 32.3 Future

- A14B quality tier on H100.  
- S2V and Animate.  
- Multi-shot 5 s × N storyboard stitch (path to longer ads **without** pretending Wan is long-form).  
- Redis fairness, k8s GPUs, overflow APIs.  
- Customer API + webhooks.  
- Prompt extend (Qwen) as optional paid pre-step.  
- MFA, SSO, SOC2.  
- Measured FP8 if quality gate passes.

### 32.4 Assumptions vs facts (quick index)

| Statement | Tag |
| --- | --- |
| Apache 2.0, official models, VRAM 24 vs 80 GB, 5 s, 5B <9 min, 1280×704 for 5B, FSDP+Ulysses, torch≥2.4, flash_attn, Diffusers pipelines, 81 frames / 16 fps A14B examples, 121 frames / 24 fps 5B example | Verified |
| ComfyUI 8 GB, NVFP4 5090, LightX2V speedups | Community |
| Postgres queue, RunPod, TI2V-5B first, credits, no k8s MVP | Recommendation |
| Our p95 GPU latency, seed determinism, English negative prompt quality, exact HF download GB on our revision, token limit in production | Must benchmark |

---

*End of SRS v1.0.0. Implementation sequencing: `AGENT_IMPLEMENTATION_PLAN.md`.*
