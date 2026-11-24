# Portfolio V2 — source-backed audit and migration

> Historical snapshot from 18 November 2026. The November content refresh and subsequent interaction PRs supersede the status and open-work statements below. See the current README and content map.

Checked 18 November 2026 against the actual GitHub repository and the supplied video.

## Legacy code audit
- Main application: React 18, Vite 5, styled-components, Tailwind and several overlapping UI libraries.
- Component tree: App → Navbar / HeroSection / Skills / Experience / Projects / Education / Contact / Footer, with StarsCanvas as a second full-page scene.
- Hero globe: HeroSection → IntUI/gglobe.tsx → IntUI/globe.tsx; builds a three-globe scene with countries, arcs, point/ring propagation, and OrbitControls.
- Original globe forcibly matches window.devicePixelRatio, increasing GPU demands on high-density screens. The star scene also renders its own canvas. V2 uses one lazy, DPR-limited scene.
- Original navigation has an anchor missing a hash and inconsistent mobile/desktop fragment capitalization.
- Existing project modal displays extremely long descriptions. V2 replaces these with readable challenge/approach/engineering case studies.
- Original contact form uses EmailJS credentials in client code. V2 does not migrate that integration; outreach uses an external profile link.
- Original source and assets are preserved on the feature branch. Only the root entrypoint is switched to V2.

## Content and sources
- V2 reads the existing source of truth at src/data/constants.js, uses the original images, and keeps legacy work/education facts, avoiding invented credentials.
- Selected examples: TypeSpeed, Dynamic Sorting Visualizer, AI Image Generator, GITRepoHUB.
- Three source repositories were checked and found: Dynamic-Sorting-Visualizer, AI-Image-Generator and Web-Dev-Assignment.
- The original TypeSpeed source URL returns GitHub 404; V2 labels its source unavailable instead of offering a broken link.
- The original resume URL may be outdated; it is not promoted in the V2 header.
- Work experience after 2024 is unknown and has not been invented. Percent improvement metrics in the old copy are omitted pending evidence.

## Creative and technical choices
- Direction: Complexity, clarified. Graphite, light paper, chartreuse, editorial typography and original spatial form.
- Signature interactive geometry is a procedural deconstructible knot with orbital elements, not an off-the-shelf animated globe.
- Scroll-linked architecture chapter uses Framer Motion rather than installing redundant animation libraries.
- Existing React/Three/R3F/Motion majors retained for compatibility with the committed package-lock.
- Native buttons and navigation, reduced-motion styling, CSS fallback, project filtering and accessible case-study panel.
- No Java backend yet: unnecessary operational burden for a static portfolio without a persistence requirement.

## Open work before release
- Verify the new branch GitHub Actions build.
- Run Lighthouse and automated accessibility tests on the *actual* React build.
- Check mobile WebGL/GPU/battery performance and browser support.
- Replace old internship-era work with verified current engineering work and project metrics.
- Add actual up-to-date resume, project demos and details.
- Prune unused V1 dependencies and split long V2 components after migration review.
- Keep main and production deployment unchanged until review and approval.
