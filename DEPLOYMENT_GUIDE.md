# Complete Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the MVP Simulation Studio to production environments.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
4. [Vercel Deployment](#vercel-deployment)
5. [Database Setup](#database-setup)
6. [Environment Variables](#environment-variables)
7. [Domain Configuration](#domain-configuration)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18.x or higher installed
- [ ] Git installed and configured
- [ ] Cloudflare account (for primary deployment)
- [ ] Vercel account (for backup deployment)
- [ ] PostgreSQL database (Supabase, Neon, or self-hosted)
- [ ] Redis instance (for caching and rate limiting)
- [ ] Google Gemini API key
- [ ] Sentry account (for error tracking)
- [ ] PostHog account (for analytics)

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gamerkreten-beep/mvp-simulation.git
cd mvp-simulation
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (see [Environment Variables](#environment-variables) section).

### 4. Run Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Seed Database (Optional)

```bash
npx prisma db seed
```

### 6. Build the Application

```bash
npm run build
```

### 7. Test Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to verify the build.

---

## Cloudflare Pages Deployment

### Option A: Direct Upload

1. **Build the Application**

```bash
npm run build
```

2. **Create Cloudflare Pages Project**

- Log in to Cloudflare Dashboard
- Go to Pages > Create a project
- Choose "Upload assets"
- Upload the contents of the `dist/` directory
- Click "Deploy site"

3. **Configure Custom Domain**

- In Pages dashboard, go to Custom domains
- Add your domain (e.g., `app.mvpsimulation.com`)
- Follow DNS instructions

4. **Set Environment Variables**

- Go to Settings > Environment variables
- Add all required variables (see [Environment Variables](#environment-variables))

5. **Upload Configuration Files**

- Upload `_headers` file to root
- Upload `_redirects` file to root

### Option B: Git Integration

1. **Connect Repository**

- In Cloudflare Pages, click "Create a project"
- Choose "Connect to Git"
- Select your GitHub repository
- Configure build settings:
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Root directory: `/`

2. **Configure Environment Variables**

- Go to Settings > Environment variables
- Add production environment variables

3. **Deploy**

- Push to main branch or create a deployment
- Cloudflare will automatically build and deploy

### Option C: Cloudflare Workers (Backend)

For deploying backend functions to Cloudflare Workers:

1. **Install Wrangler CLI**

```bash
npm install -g wrangler
```

2. **Login to Cloudflare**

```bash
wrangler login
```

3. **Configure Secrets**

```bash
wrangler secret put GEMINI_API_KEY
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put SENTRY_DSN
```

4. **Deploy**

```bash
wrangler publish backend/dist/index.js
```

---

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy to Vercel

```bash
vercel --prod
```

Follow the prompts to configure your project.

### 4. Configure Environment Variables

In Vercel dashboard:

- Go to Settings > Environment Variables
- Add all required variables
- Select appropriate environments (Production, Preview, Development)

### 5. Configure Custom Domain

- Go to Settings > Domains
- Add your custom domain
- Follow DNS configuration instructions

### 6. Deploy via Git (Recommended)

1. **Connect Repository in Vercel**

- Import your GitHub repository
- Configure build settings:
  - Framework Preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`

2. **Automatic Deployments**

- Push to main branch → Production
- Push to other branches → Preview deployments

---

## Database Setup

### Option A: Supabase (Recommended)

1. **Create Project**

- Sign up at https://supabase.com
- Create a new project
- Wait for database to be ready

2. **Get Connection String**

- Go to Settings > Database
- Copy the connection string
- Format: `postgresql://postgres:[password]@[host]:5432/postgres`

3. **Run Migrations**

```bash
DATABASE_URL="your_connection_string" npx prisma migrate deploy
```

### Option B: Neon

1. **Create Project**

- Sign up at https://neon.tech
- Create a new project
- Copy the connection string

2. **Run Migrations**

```bash
DATABASE_URL="your_connection_string" npx prisma migrate deploy
```

### Option C: Self-Hosted PostgreSQL

1. **Install PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
```

2. **Create Database**

```bash
sudo -u postgres psql
CREATE DATABASE mvp_simulation;
CREATE USER mvp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mvp_simulation TO mvp_user;
```

3. **Configure Connection**

Update `DATABASE_URL` in your environment variables.

---

## Environment Variables

### Required Variables

```bash
# Application
NODE_ENV=production
API_URL=https://api.mvpsimulation.com
APP_URL=https://mvpsimulation.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRY=7d

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Monitoring
SENTRY_DSN=https://your_sentry_dsn
SENTRY_ENVIRONMENT=production

# Analytics
POSTHOG_KEY=your_posthog_key
POSTHOG_HOST=https://app.posthog.com

# Redis (for caching)
REDIS_URL=redis://user:password@host:6379

# CORS
CORS_ORIGIN=https://mvpsimulation.com,https://app.mvpsimulation.com

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_smtp_password

# Security
ADMIN_SECRET=your_admin_secret_key
TRUSTED_INVESTOR_HASH=your_trusted_investor_hash
```

### Optional Variables

```bash
# Feature Flags
ENABLE_AI_EVALUATION=true
ENABLE_USER_REGISTRATION=true
ENABLE_INVESTOR_MODE=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
AI_RATE_LIMIT_MAX_REQUESTS=10

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/mvp-simulation

# Performance
CACHE_TTL=3600
QUERY_TIMEOUT=30000
```

---

## Domain Configuration

### Cloudflare Pages

1. **Add Custom Domain**

- Go to Pages > Your Project > Custom domains
- Click "Set up a custom domain"
- Enter your domain (e.g., `app.mvpsimulation.com`)
- Click "Activate domain"

2. **Configure DNS**

- Cloudflare will show you DNS records to add
- Add CNAME record:
  - Type: CNAME
  - Name: app
  - Target: your-pages-project.pages.dev
  - TTL: Auto

3. **SSL/TLS**

- SSL certificate is automatically provisioned
- Set SSL/TLS mode to "Full" in Cloudflare dashboard

### Vercel

1. **Add Custom Domain**

- Go to Settings > Domains
- Click "Add Domain"
- Enter your domain

2. **Configure DNS**

- Vercel will show DNS configuration
- Add CNAME or A records as directed

3. **Verify Domain**

- Wait for DNS propagation
- Click "Verify" in Vercel dashboard

---

## Post-Deployment Verification

### 1. Health Check

```bash
curl https://api.mvpsimulation.com/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Database Connection

Verify database is accessible:
```bash
curl https://api.mvpsimulation.com/api/health
```

### 3. Authentication Test

Test user registration and login:
```bash
# Register
curl -X POST https://api.mvpsimulation.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST https://api.mvpsimulation.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 4. Performance Check

Run Lighthouse audit:
```bash
npx lighthouse https://mvpsimulation.com --view
```

Target scores:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

### 5. Security Check

Run security scan:
```bash
npx trivy fs .
```

### 6. Monitoring Setup

Verify monitoring services:
- Sentry errors are being captured
- PostHog events are being tracked
- Logs are being collected

### 7. Functional Testing

Test core workflows:
- [ ] User registration
- [ ] User login/logout
- [ ] Project creation
- [ ] AI evaluation submission
- [ ] Dashboard loading
- [ ] Settings page

---

## Troubleshooting

### Build Failures

**Issue:** Build fails with TypeScript errors

**Solution:**
```bash
npm run type-check
# Fix type errors
npm run build
```

**Issue:** Build fails with dependency issues

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm ci
npm run build
```

### Deployment Failures

**Issue:** Deployment fails on Cloudflare

**Solution:**
1. Check build logs in Cloudflare dashboard
2. Verify environment variables are set correctly
3. Ensure build command is `npm run build`
4. Check output directory is `dist`

**Issue:** Deployment fails on Vercel

**Solution:**
1. Check Vercel deployment logs
2. Verify Node.js version in project settings (18.x)
3. Check environment variables
4. Ensure build command is correct

### Runtime Errors

**Issue:** Database connection failed

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Check database is accessible
3. Verify SSL/TLS settings
4. Check firewall rules

**Issue:** API returns 401 Unauthorized

**Solution:**
1. Verify `JWT_SECRET` is set
2. Check token is not expired
3. Verify token format in Authorization header

**Issue:** AI evaluation fails

**Solution:**
1. Verify `GEMINI_API_KEY` is valid
2. Check API quota limits
3. Verify network connectivity to Gemini API

### Performance Issues

**Issue:** Slow page load times

**Solution:**
1. Enable CDN caching
2. Optimize images
3. Implement code splitting
4. Enable gzip/brotli compression

**Issue:** API response times are slow

**Solution:**
1. Enable Redis caching
2. Add database indexes
3. Optimize queries
4. Implement rate limiting

### SSL/Certificate Issues

**Issue:** SSL certificate not working

**Solution:**
1. Wait for DNS propagation (up to 48 hours)
2. Verify DNS records are correct
3. Check SSL/TLS mode in Cloudflare
4. Contact certificate authority if needed

---

## Monitoring and Maintenance

### Regular Tasks

**Daily:**
- Check error rates in Sentry
- Review system health

**Weekly:**
- Review analytics in PostHog
- Check database performance
- Review logs for unusual activity

**Monthly:**
- Update dependencies
- Review and rotate secrets
- Check security vulnerabilities
- Review and optimize database queries

### Backup Strategy

**Database Backups:**
- Automated daily backups (configure in your hosting)
- Weekly full backups
- Keep backups for 30 days

**Code Backups:**
- Git repository (GitHub)
- Regular commits and tags
- Use semantic versioning

### Rollback Procedure

If deployment fails:

1. **Cloudflare Pages:**
   - Go to Deployment history
   - Click "Rollback" on previous successful deployment

2. **Vercel:**
   - Go to Deployments
   - Click "Promote to Production" on previous deployment

3. **Database:**
   - Restore from backup if needed
   - Run rollback migration:
   ```bash
   npx prisma migrate resolve --applied "migration_name"
   ```

---

## Support

For deployment issues:

- Documentation: https://docs.mvpsimulation.com
- GitHub Issues: https://github.com/gamerkreten-beep/mvp-simulation/issues
- Email: support@mvpsimulation.com

---

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)