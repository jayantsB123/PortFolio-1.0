# V2.2 Interaction reference and quality pass

## What I observed in the senior's 112-second screencast

This comparison is based on the user-supplied recording, not copied source code.

- **00:00–00:40 — Hero and section transitions:** monochrome, high-contrast visual system, large expressive typography, deliberate scroll pacing, subtle background lighting and ambient line effects.
- **00:40–01:03 — Skills and experience:** large headings and sequentially revealed content. Distinct visual identities support the sections, but some decorative text effects reduce quick readability.
- **01:04–01:18 — Project list:** compact project rows, technology labels, directional link affordances and an image preview that emerges on hover. Especially useful as an alternate to oversized project thumbnails.
- **01:28–01:39 — Navigation:** a confident full-screen section index with numbered links and a prominent close control, giving the site a more product-like feel.
- **01:39–01:51 — Footer:** a minimal bold contact close with generous whitespace.

## Adapted ideas

1. **Project explorer:** list mode is now the default for scanability; users can switch to gallery mode. Both options preserve filters, technology labels, concise project overviews and source links. Hover/focus previews are decorative only, and disappear on touch screens.
2. **Explore overlay:** a numbered, full-screen navigation overlay inspired by the recording but using the portfolio's existing charcoal/chartreuse design. It supports Escape, keyboard focus trapping, click-outside dismissal, scroll locking and focus restoration.
3. **Persistent navigation:** the existing site header now stays available while scrolling, with a restrained translucent background when moving down the page.
4. **Motion restraint:** no new particle engine or permanent cursor tracking, and the Three.js scene renders only while near the viewport.

## Ideas deliberately not adopted

- The reference's typefaces, exact layouts, palette and letter substitutions: copying would reduce originality, and excessive character decoration would hurt recruiter readability.
- Always-active mouse-following lighting or multiple WebGL canvases: not worth added CPU/GPU and battery cost for the current site.
- Hover-only project information or scroll hijacking: both make the site harder to navigate with keyboard or touch.

## Technical improvements

- Removed unused runtime packages from the dependency graph and pruned the lockfile. Legacy source remains in the repository, but its unused packages are no longer installed.
- Refactored the oversized portfolio module into separate project explorer, menu, career content, about/footer and 3D components.
- Added pure project-filtering helper functions and Node built-in tests.
- Reduced procedural 3D geometry segments and capped the renderer to 1.25 DPR. Removed Drei (used for one floating animation), replacing it with a simple sine offset in the existing render loop.
- Suspended WebGL animation while the scene is offscreen or the tab is hidden.
- Added lint/build/unit/browser checks to GitHub Actions; browser tests cover desktop and mobile navigation, filters, two project layouts, dialogs, reduced-motion mode and horizontal overflow.
- Rewrote the README to describe the real V2 architecture instead of an outdated starter skeleton.

## Review checklist

- [ ] GitHub Actions lint, tests, production build and Chromium smoke tests pass.
- [ ] Check visual spacing and hover previews on desktop at 1440px, and touch interaction at 390px.
- [ ] Confirm high contrast in the explore overlay and check color contrast in a browser accessibility audit.
- [ ] Measure Lighthouse and real-device WebGL performance before deployment.
- [ ] After content approval, integrate current experience, résumé, demos and verified outcomes.

## Development choices

This PR is a standalone quality and interaction improvement. It intentionally does not invent recent experience or projects, which will arrive from a current résumé later. The production site and main branch should remain unchanged until review.

- Imported only the four featured project images directly, avoiding the full college-era image catalog. List hover previews mount only on hover/focus.
