# Portfolio

A personal portfolio built with React, Vite, Three.js and Framer Motion.

The current site focuses on making my work easy to scan without losing its interactive visual identity. The active application lives in [src/v2/](src/v2/); the college-era components remain in src/components/ for reference during migration.

## Features

- Career overview, professional experience, selected projects, skills and contact sections.
- Project explorer with list/gallery modes, filters, keyboard-accessible controls and verified source links.
- Contextual screenshots on hover/focus; all important project details remain visible without them.
- Full-screen navigation with Escape key, keyboard focus management and focus restoration.
- Case studies describing challenges, approaches, implementation and technology.
- Lazy-loaded procedural React Three Fiber scene, paused when offscreen.
- Reduced-motion and no-WebGL fallbacks.

## Tech stack

React 18 · Vite 5 · Three.js · React Three Fiber/Drei · Framer Motion · CSS

No backend is required. The retired EmailJS form is no longer part of the running application.

## Local setup

Node.js 22+ recommended.

    npm ci
    npm run dev

Open http://localhost:5173.

## Quality checks

    npm run lint
    npm test
    npm run build
    npm run preview

For browser tests (Playwright is kept out of the production dependency graph):

    npm install --no-save --no-package-lock @playwright/test@1.65.1
    npx playwright install chromium
    npm run build
    npx playwright test

The GitHub Actions workflow runs linting, unit tests, the production build, and Chromium smoke tests on pull requests. Successful runs retain the build artifact.

## Project structure

- src/main.jsx — application entry point
- src/v2/PortfolioApp.jsx — page composition, WebGL fallback and case-study modal
- src/v2/ProjectExplorer.jsx — list/gallery project explorer
- src/v2/projectView.js — pure project filtering logic
- src/v2/QuickNav.jsx — keyboard-accessible full-screen menu
- src/v2/RecruiterContent.jsx — hero, career overview, experience and skills
- src/v2/ArchitectureInterlude.jsx — scroll-linked narrative
- src/v2/PortfolioScene.jsx — procedural 3D engine
- src/v2/components/AboutFooter.jsx — about and contact sections
- src/v2/portfolioData.js — projects and experiences adapted from original data
- src/v2/portfolio.css — responsive design system
- src/data/constants.js — historical portfolio data and image references
- tests/project-view.test.mjs — filtering unit tests
- e2e/portfolio.spec.js — browser interaction tests

## Performance and accessibility

The Three.js scene only loads when the user is near it, pauses animation when it leaves the viewport, caps DPR and respects reduced motion. Content remains readable if WebGL is unavailable.

Interactive elements use semantic buttons/links; filter state is announced, modal dialogs are keyboard accessible, and a skip link leads to the career overview. Build success alone does not prove Lighthouse or real-device performance; those are measured separately.

## Content accuracy

Career and project descriptions come from the original portfolio. I will add current work, a verified résumé and recent projects separately. The outdated TypeSpeed source URL remains unlinked rather than pointing to a broken GitHub page.

## Deployment

Review feature branches before merging and deploying.
