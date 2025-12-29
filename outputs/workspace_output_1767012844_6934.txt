# MVP Simulation Studio — MASTER README (Enterprise Canonical)

> **Canonical Source of Truth**  
> Enterprise governance, security, determinism, and CI/CD guarantees are defined **here**.  
> For a simplified product overview, see **README.product.md**.

---

## 1) Purpose & Positioning (Enterprise Truth)

**MVP Simulation Studio**, powered by **SlavkoKernel™ V7**, is a **deterministic, enterprise‑grade AI orchestration system** for early‑stage startup evaluation.

**Non‑negotiables**

- Deterministic outputs: same input + seed ⇒ same verdict & artifacts.
- Audit‑ready: SHA‑256 hashed decisions, append‑only logs, reproducible sessions.
- Zero‑trust security: **server/edge‑only inference**, no client secrets.
- CI‑enforced governance: lint, tests, coverage, signed releases.

This is **not** a demo or motivational tool.

---

## 2) Executive Summary (Ultra‑Condensed)

- Deterministic council: **Skeptic, Analyst, Simulator, Researcher** → consensus.
- Verdicts: **PROCEED / REVISE / REJECT** with structured artifacts.
- Tech: **React 19 + Vite**, TypeScript (strict), Tailwind.
- Ops: CI gates, Sentry, PostHog, performance tracing.
- Security: zero‑trust agents, fail‑fast, explicit state boundaries.
- Ownership: **FORMATDISC** — enterprise discipline.

---

## 3) System Model & Verdicts

### Council (Fixed Roles)

- **Skeptic:** distribution, monetization, defensibility failure modes.
- **Analyst:** product vs. agency, TAM integrity.
- **Simulator:** 30+ persona scenario rollouts.
- **Researcher:** historical parallels and empirical signals.

### Verdicts

| Verdict | Meaning | Artifacts |
|---|---|---|
| **PROCEED** | Structurally coherent | MVP blueprint, 5‑slide pitch, investor summary |
| **REVISE** | Insight valid, execution flawed | Prioritized experiments, corrective plan |
| **REJECT** | Structurally unviable | Reject report, outcome scenarios, alternatives |

All verdicts are deterministic and hash‑recorded.

---

## 4) Determinism & Auditability Guarantees

- Fixed orchestration graph per release.
- Reproducible sessions (seeded).
- Append‑only `decisions.log` with SHA‑256.
- CI‑signed releases; Sentry release mapping.
- Structured reasoning objects (no opaque “AI magic”).

---

## 5) Architecture Overview

### Presentation Plane

- **React 19, Vite, TypeScript (strict)**.
- Presentation‑only — no execution logic, no secrets.

### Execution Plane

- **Server/Edge only** (recommended: **Vercel Edge Functions** or **Cloudflare Workers**).
- Custom orchestrator controls lifecycle and provider adapters.

### Observability

- **PostHog** (event schema enforced).
- **Sentry** (errors, releases, traces).
- CI‑enforced lint/type/coverage gates.

---

## 6) Security & Operational Controls (Non‑Negotiable)

- Zero‑trust between agents; isolated runtimes.
- Fail‑fast with circuit breakers.
- **No client‑side secrets**; provider keys are server‑only.
- Input sanitization & prompt isolation.
- Rate limiting & quotas.
- SAST/DAST for production branches.

---

## 7) Local Development (Canonical)

> **Canonical dev port:** **5173** (Vite default).  
> If overridden, update **all** docs and CI examples accordingly.

```bash
git clone https://github.com/mladengertner/mvp-simulation-tool1
cd mvp-simulation-tool1
npm ci
npm run dev
# http://localhost:5173
```

---

## 8) Environment & Secrets (Production)

**Server/Edge only**

- `GEMINI_API_KEY`
- `SENTRY_DSN`
- `POSTHOG_KEY`
- `ADMIN_SECRET`
- `NODE_ENV=production`

**Policy:** Never inject provider keys into client bundles.

---

## 9) CI/CD Gates (Mandatory)

1. `npm run lint` (`--max-warnings 0` or documented, timeboxed tolerance)
2. `npm run test` (unit + integration)
3. `npm run test:e2e` (Playwright)
4. `npm run build` (no warnings)
5. Coverage ≥ **70%**
6. SAST/DAST clean
7. Signed release + `CHANGELOG.md`
8. Canary deploy + rollback plan

---

## 10) Health & Artifacts

### `/api/health`

```json
{
  "status": "ok",
  "version": "v7.0",
  "lastConsensusHash": "sha256:<hex>",
  "aiProviderReachable": true,
  "timestamp": "ISO-8601"
}
```

### Artifacts

- `session-{id}.decision.json`
- `session-{id}.blueprint.pdf`
- `session-{id}.revise-plan.md`
- `session-{id}.reject-report.md`
- `decisions.log` (append‑only)

---

## 11) Governance & Compliance

- Semantic versioning.
- ADRs required for design changes.
- Append‑only deployment log.
- Incident response and rollback runbooks.

---

## 12) Product Surface (Marketing Pointer)

> **Product overview, features, and quick start for users** live in  
> **README.product.md** (non‑canonical, user‑facing).

---

## 13) Ownership & Signature

**Owner:** FORMATDISC — Mladen Gertner  
**Contact:** <core@formatdisc.hr> | <security@formatdisc.hr>

**Status:** ✔ **CERTIFIED — ENTERPRISE‑GRADE**

---

### Closing Contract

This README is the **canonical enterprise contract**.  
Deploy with discipline—or accept the operational risk.

**FORMATDISC — Enterprise standards. Zero bullshit.**
