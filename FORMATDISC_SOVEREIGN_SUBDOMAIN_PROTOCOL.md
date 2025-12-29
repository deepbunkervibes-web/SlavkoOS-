# 🔱 FormatDisc Sovereign Subdomain Protocol

## 📊 Overview

This document defines the architectural and operational standards for externalizing specialized services into sovereign subdomains within the FormatDisc ecosystem.

## ⚖️ Jurisdictional Separation

To maintain institutional clarity and operational performance, heavy computational tools or distinct functional units are offloaded from the primary landing jurisdiction (`formatdisc.hr`) to dedicated subdomains.

- **Primary Domain (`formatdisc.hr`):** Presentation, brand identity, and high-level routing.
- **Sovereign Subdomains (e.g., `simulate.formatdisc.hr`):** Specialized applications, computation-heavy simulations, and technical workspaces.

## 🛠 Operational Configuration

### DNS Infrastructure (Cloudflare)

All sovereign subdomains must be configured with a CNAME record pointing to the underlying service provider (e.g., Vercel, Firebase).

- **Record Type:** CNAME
- **Proxy Status:** DNS Only (Grey Cloud) to ensure direct deterministic routing.
- **Target:** `cname.vercel-dns.com` (for Vercel-hosted units)

### Service Provider Mapping (Vercel)

1. Add the custom subdomain in Project Settings > Domains.
2. Verify CNAME propagation.
3. Configure the subdomain as the Primary Domain for the dedicated repository.

## 📜 Integration Rules

### 1. Link Persistence

All links from the primary domain to a sovereign subdomain must use absolute URLs with `target="_blank"` and `rel="noopener noreferrer"`.

### 2. Repo Autonomy

Each sovereign unit must maintain its own repository and deployment pipeline to prevent monolithic dependencies.

### 3. Analytics Harmony

Cross-domain tracking must be unified via specialized headers or unique project keys (e.g., PostHog sub-projects) while maintaining data isolation where protocols dictate.

## 🔱 Institutional Verification

- [ ] DNS propagation verified via global resolver.
- [ ] SSL certificate active and valid.
- [ ] Primary routes on main repo purged of internal references to the sub-jurisdiction.
- [ ] Deterministic boot sequence verified on the sovereign target.

---
**Institutional Status:** ACTIVE
**Protocol Version:** 1.0.0
**Jurisdiction:** Global FormatDisc Network
