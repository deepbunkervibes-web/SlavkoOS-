# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [7.2.0] - 2025-12-27

### Added

- **Modular Studio Architecture**: Decomposed `MvpStudio.tsx` into specialized components in `src/components/studio/`.
- **Modular LandingPage**: Refactored `LandingPage.tsx` using `React.lazy`, `Suspense`, and `ErrorBoundary` for each section to ensure system-wide resilience.
- **ErrorBoundary**: New global utility component for catching and handling component-level crashes gracefully.
- **PhaseHeader**: New memoized component for tracking simulation progress and OLLAMA status.
- **SimulationWorkspace**: New modular container for council deliberations and artifact previews.
- **OLLAMA Status Badge**: Real-time visual indicator of local AI service connectivity.
- **Skeletal Loaders**: Added `Suspense` fallbacks with pulse animations for better perceived performance.
- **API Health Check**: New `/api/health` endpoint on the development server.

### Changed

- **Code Splitting**: Implemented `React.lazy` for heavy artifacts (ResultActions, MvpPreview, PitchDeck) to optimize initial bundle size.
- **Performance Optimization**: Memoized expensive UI components and callback handlers to reduce layout thrashing.
- **Navigation Polish**: Added passive scroll listeners and improved backdrop saturation for "God-Tier" UI transparency.

### Fixed

- **API Server Failures**: Resolved 500 errors by ensuring the local Express API server runs alongside Vite.
- **Simulation Stalls**: Implemented a 5-second timeout and graceful fallback for OLLAMA requests.
- **UI Overlap**: Fixed navigation header overlapping Studio content.
- **Asset Errors**: Resolved 404 console errors by adding a valid `favicon.svg`.

## [7.1.0] - 2025-12-25

### Added

- Multilingual support (Croatian and English).
- Language Context Provider and translation dictionaries.

## [7.0.0] - 2025-12-23

### Added

- Core SlavkoKernel™ v7 Orchestration engine.
- Multi-agent council deliberation logic.
- Automatic MVP Blueprint and Pitch Deck generation.
- Real-time Terminal log streaming.
- PostHog and Sentry instrumentation.
