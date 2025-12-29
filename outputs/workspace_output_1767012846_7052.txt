# Deployment Guide: MVP Simulation Studio (SlavkoKernel v7)

This document outlines the deployment process for the MVP Simulation Studio, ensuring high availability, security, and performance.

## 🚀 Environment Prerequisites

Ensure the following environment variables are configured in your production environment (e.g., Vercel, Netlify):

### **AI Provider Credentials**

* `GEMINI_API_KEY`: Google Gemini API Key (Required for core AI features).
* `VITE_GEMINI_API_KEY`: Same as above, prefixed for Vite client access.

### **Monitoring & Analytics**

* `VITE_SENTRY_DSN`: Sentry DSN for error tracking.
* `VITE_POSTHOG_KEY`: PostHog API Key for product analytics.
* `VITE_POSTHOG_HOST`: PostHog host (Defaults to `https://app.posthog.com`).

### **Security**

* `TRUSTED_INVESTOR_HASH`: Salt/secret for investor authentication bypass (if applicable).
* `ADMIN_SECRET`: Secret for internal administrative routes.

---

## 📦 Deployment Strategy

### **Frontend (Vercel / Netlify)**

1. **Framework**: Vite + React.
2. **Build Command**: `npm run build`.
3. **Output Directory**: `dist`.
4. **Node Version**: 18.x or higher.

### **Backend Functions (Vercel Functions)**

The project uses Vercel Edge Functions for AI orchestration to minimize latency. Ensure `vercel.json` is correctly configured to route `/api/*` to the `api/` directory.

---

## 🛠 CI/CD Pipeline

We recommend using GitHub Actions for automated verification:

1. **Linting**: `npm run lint` ensures code quality.
2. **Unit Tests**: `npm run test:unit` validates logic.
3. **E2E Tests**: `npm run test:e2e` verifies core workflows (Playwright).
4. **Build**: Ensures the production bundle initializes correctly.

---

## 🔒 Security Best Practices

1. **Input Sanitization**: Client-side and server-side validation is enabled by default via `src/utils/inputSanitizer.ts`.
2. **Prompt Injection Prevention**: User inputs are wrapped in `<user_idea>` tags during AI calls.
3. **Content Security Policy (CSP)**: Ensure your hosting provider is configured with restrictive CSP headers.
4. **Secrets Management**: Never commit `.env` files. Use the provider's secret management vault.

---

## 📈 Monitoring & Health

* **Sentry**: Monitor the "Issues" dashboard for runtime exceptions.
* **PostHog**: View "Events" to track user flows and AI performance metrics.
* **Health Check**: Access `/api/health` to verify system uptime.

---

For technical support or infrastructure inquiries, contact the SlavkoKernel Core Team.
