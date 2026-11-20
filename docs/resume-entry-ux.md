# Résumé entry point — design and implementation

## The decision

A résumé should take **one click** to reach. A decorative modal, iframe,
custom PDF viewer or pretend "Download" button would introduce a step, a
rendering dependency, or a browser-dependent behavior.

The current résumé is hosted in Google Drive. Because the site does not serve
a first-party PDF, these links say **OPEN / VIEW RÉSUMÉ** rather than promising
an automatic PDF download. All links point to the owner's existing
`profile.resume` URL.

## Design / hierarchy

1. **Hero (discoverability):** a compact document shortcut beneath the two
   existing page CTAs. It is visible without hunting through navigation.
2. **At a glance (expression):** a dark-ink, lime-accented document-pass link.
   Its file icon has a layered-paper motion; the border, arrow and local
   cursor-responsive light give feedback without competing with the page text.
3. **Experience and education (context):** a smaller document link where a
   recruiter may be making a decision about experience and qualifications.

These are three views of one link, not three independent settings.

## Accessibility, behavior and tradeoffs

- Uses native `<a>` semantics: this action navigates to a document.
- Opens the Google Drive résumé in a new tab so readers can keep the
  portfolio open. The effect is explicitly indicated in **visible text** and
  its native accessible name, derived from the actual visible link text.
- `target="_blank"` is accompanied by `rel="noopener noreferrer"`.
- Clear hover, focus-visible, and active affordances; no hover-only
  information or hidden required action.
- Entire document card is the target. Icon layers are decorative and marked
  `aria-hidden`.
- Reduced-motion and coarse-pointer visitors get a static/no-glow version.
- CSS-only movement and one optional pointer-position update per mouse move:
  no additional WebGL canvas, dependencies, or layout shifts.
- Responsive stacking for narrow screens; the original hero CTAs stay intact.

## Research references

- Nielsen Norman Group, "Buttons vs. Links": use links for navigation and
  buttons for actions.
  https://www.nngroup.com/videos/buttons-vs-links/
- Nielsen Norman Group, "Opening Links in New Browser Windows and Tabs":
  judge new-tab behavior by the user context, not merely the file format.
  https://www.nngroup.com/articles/new-browser-windows-and-tabs/
- MDN, "HTML: A good basis for accessibility": warn about links to
  non-HTML resources and links opening new tabs.
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML
- W3C WAI G201: advanced warning for new browser windows.
  https://www.w3.org/WAI/WCAG22/Techniques/general/G201

## Remaining verification

The résumé URL was supplied by the owner; external access permissions could
not be verified from the development environment. Confirm that Google Drive
sharing is set to **Anyone with the link — Viewer** in a private/incognito
browser session before publishing. No résumé contents are fetched by the
portfolio itself.

The only editorial source is `src/v2/portfolioData.js` under
"01B RÉSUMÉ". The component and styling are in
`src/v2/components/ResumeLink.jsx` and `ResumeLink.css`.
