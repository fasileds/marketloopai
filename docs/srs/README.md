# MarketLoop AI Video Generation — Engineering Blueprint

This directory is the source of truth for building a production SaaS video-generation product on top of the existing MarketLoop AI Next.js application.

| Document | Purpose |
| --- | --- |
| [AI_VIDEO_GENERATION_SRS.md](./AI_VIDEO_GENERATION_SRS.md) | Full Software Requirements Specification and architecture (32 sections) |
| [AGENT_IMPLEMENTATION_PLAN.md](./AGENT_IMPLEMENTATION_PLAN.md) | Sequential, file-level implementation plan for an AI coding agent |

**Product context.** MarketLoop AI already exists as a marketing site and CMS (`Next.js 16`, `Supabase`, `Resend`). This blueprint extends that codebase into a client-facing generation product. It does not propose a greenfield rewrite.

**Primary engine.** Self-hosted [Wan 2.2](https://github.com/Wan-Video/Wan2.2) (Apache 2.0), with a provider interface so additional models and commercial APIs can be added later.

**How to use these documents.** Read the SRS before writing code. Execute the implementation plan one phase at a time. Do not implement the entire system in a single change set.

Evidence tags used throughout:

- **Verified** — confirmed against official Wan 2.2 README, Hugging Face model cards, `requirements.txt`, or Hugging Face Diffusers pipeline docs (as of 2026-08-27).
- **Community** — third-party reports, ComfyUI, quantization forks. Not an official production contract.
- **Recommendation** — architectural decision for this product.
- **Must benchmark** — cannot be treated as a SLA until measured on our GPU and settings.
