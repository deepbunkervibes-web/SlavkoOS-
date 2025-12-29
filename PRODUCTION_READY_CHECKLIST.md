# 🚀 Production Readiness Checklist (MVP Simulation Studio)

Ova lista služi za finalnu verifikaciju sustava prije isporuke. Sve točke moraju biti potvrđene (tickirane).

## 1. 🏗️ Build & Sanity (PowerShell / Windows)

- [ ] **Clean Install**: `rmdir /s /q node_modules; npm install` prolazi bez grešaka.
- [ ] **Type Check**: `npx tsc --noEmit` vraća Exit Code 0. ✅ (Potvrđeno od strane AI)
- [ ] **Production Build**: `npm run build` generira `/dist` mapu bez kritičnih Rollup grešaka. ✅ (Potvrđeno od strane AI)
- [ ] **Linting**: `npm run lint` nema "error" kategorije (samo dopušteni warnings). ✅ (Potvrđeno od strane AI)

## 2. 🌐 Local Runtime (Vite Dev)

- [ ] **Dev Server**: `npm run dev` se pokreće na `http://localhost:5173` (ili 3000).
- [ ] **Initial Load**: Landing stranica se renderira bez "White Screen of Death".
- [ ] **Console Hygiene**: Nema crvenih errora u Browser Console-u pri učitavanju.
- [ ] **Navigation**: Klik na "Launch Studio" vodi na `/studio` rutu bez 404.

## 3. 🧠 Kernel & Simulation (Smoke Tests)

- [ ] **Council Initialization**: Unos ideje pokreće simulaciju (check Network tab za `/api/analyze` ili slično).
- [ ] **Agent Trace**: Vidljivi su outputi od Skeptic, Analyst i Simulator persona.
- [ ] **Verdict Generation**: Sustav isporučuje finalni verdict (PROCEED/REVISE/REJECT).
- [ ] **Artifact Generation**: Pitch Deck i Architecture dijagrami su vidljivi u UI.
- [ ] **Determinisitc Hash**: Dva identična run-a s istim seed-om daju isti SHA-256 hash u auditu.

## 4. 🔒 Security & Policy

- [ ] **Auth Flow**: Investor login preusmjerava na dashboard nakon validacije emaila.
- [ ] **Session Persistence**: Refresh stranice ne izbacuje korisnika (provjera HttpOnly cookie-a).
- [ ] **Input Sanitization**: Unos `<script>alert(1)</script>` u ideju ne uzrokuje XSS u UI.
- [ ] **Env Protection**: `.env` datoteka se ne nalazi u `/dist` (provjeri vite config).

## 5. 📈 Integration & Telemetry

- [ ] **PostHog Events**: Poziv `posthog.capture('simulation_started')` je vidljiv u networku.
- [ ] **Sentry Error Handling**: Simulirani error u UI je uhvaćen od strane `Sentry.captureException`.
- [ ] **API Proxy**: Pozivi prema `/api/*` se ispravno proksiraju na backend (obično port 3001).

---
*Status: Spremno za smoke testiranje.*
