# Portfolio

My software engineering portfolio, focused on backend engineering, fintech and distributed systems. The active application lives in `src/v2/`. The college-era source is retained only as historical reference.

## Running locally

Node.js 22.12+ and npm are recommended.

```sh
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:5173. Environment values are read by Vite at startup/build time; restart the dev server after editing them.

## Features

- November 2026 career overview, experience, six achievements, four featured case studies and three supporting projects.
- Résumé shortcuts, project list/gallery filters, case-study dialogs and accessible full-screen navigation.
- Procedural Three.js artwork with lazy loading and offscreen/reduced-motion fallbacks.
- Four opening animations, hero Gravity Dots, contextual cursor and precise heading scramble.
- Magnetic spotlight and 3D card tilt, four cycling background patterns, cinematic section scrolling and shared menu interactions.
- Five configurable SVG browser-tab identities; Circuit Trace is the default.

## Configuration

Defaults and validation live in [setenv.js](src/v2/config/setenv.js). See [.env.example](.env.example) for all overrides. Local .env files are not committed; a production configuration change requires rebuilding.

| Group | Environment prefix | Default |
| --- | --- | --- |
| Hero Gravity Dots | VITE_GRAVITY_DOTS_ | energy 100, radius 400px |
| Intro loader | VITE_PORTFOLIO_LOADER_ | cycle, session, 3650ms |
| Card depth | VITE_DEPTH_CARDS_ | tilt 5.5°, lift 5px, magnet 8px |
| Cursor backgrounds | VITE_CURSOR_BACKGROUND_ | cycle, intensity 72, radius 265px |
| Cinematic scroll | VITE_CINEMATIC_SCROLL_ | enabled, strength 100, travel 104px |
| Menu | VITE_MENU_EFFECTS_ | all enabled |
| Browser tab | VITE_BROWSER_TAB_ | circuit, matching title |

The intro styles are `system`, `type`, `ignition`, and `commit`; choose `cycle`, `random`, `sequence`, or `off` as well. Use replay `always` to show it on every reload. The intro can be skipped with Escape.

Cursor backgrounds cycle in the order `grid` → `constellation` → `ribbon` → `pixel`. Pin a style or use `off`. The menu inherits the current page's pattern. Card settings also apply to menu rows.

Set `VITE_BROWSER_TAB_STYLE` to `signature`, `monogram`, `terminal`, `orbit`, or `circuit`. Set `VITE_BROWSER_TAB_TITLE` only to override the paired title.

## Social previews

Set `VITE_PORTFOLIO_SITE_URL` to the final HTTPS URL before building for production. The build then includes a canonical URL, Open Graph image and Twitter card with the 1200×630 PNG in `public/social-card.png`. If the URL is unset, the build does not invent canonical or image URLs. The selected favicon and title are also written into the HTML before React runs.

## Structure

- `src/main.jsx`: application entry and browser tab setup
- `src/v2/PortfolioApp.jsx`: page composition and dialogs
- `src/v2/portfolioData.js`: approved portfolio content and links
- `src/v2/RecruiterContent.jsx`, `ProjectExplorer.jsx`, `QuickNav.jsx`: content and navigation
- `src/v2/components/`: interaction effects, loader, résumé and footer
- `src/v2/config/setenv.js`: configuration
- `public/favicons/`: five SVG icons
- `tests/`, `e2e/`: unit and browser tests
- `docs/portfolio-content-map-2026.md`: content map

Historical components and audit notes are not the active source of truth. Workplace projects do not expose confidential source code. No backend or EmailJS service is required.

## Quality checks

```sh
npm run lint
npm test
npm run build
npm audit
npm outdated
```

For browser checks:

```sh
npm install --no-save --no-package-lock @playwright/test@1.65.1 @axe-core/playwright@4.14.0
npx playwright install chromium
npm run build
npx playwright test
```

GitHub Actions runs the checks on main and relevant pull requests. Review dependency audit output and dependency PRs before release; a green build does not imply zero vulnerabilities.

The release workflow also produces a Lighthouse report for the built local preview. These are lab measurements, not deployed-site or real-device performance metrics.

## Release checklist

- Confirm passing unit, build, desktop/mobile browser and accessibility checks.
- Check the live deployment and public résumé link in a signed-out session.
- Measure real-device performance and Lighthouse on the deployed URL.
- Verify Safari and Firefox as well as Chromium, and verify social previews on the public URL.

The site is static and can be deployed from `dist/`. The owner must confirm the canonical production URL and résumé sharing settings. Avoid putting credentials in Vite variables, since those are public in the built site.
