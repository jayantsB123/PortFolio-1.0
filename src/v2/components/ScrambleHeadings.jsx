import { useEffect } from "react";

// Restrict the effect to primary page titles; eyebrow labels, subheadings,
// project rows, skill labels, and navigation are intentionally excluded.
const HEADING_SELECTOR = [
  ".v2-hero h1",
  ".v2-overview-heading h2",
  ".v2-section-heading h2",
  ".v2-achievements-heading h2",
  ".v2-about-main h2",
  ".v2-method h2",
  ".v2-footer h2",
  '.v2-quicknav[data-scramble="true"] nav strong',
].join(", ");

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%*&+";
const IS_LETTER = /[a-z0-9]/i;
const DURATION = 780;
const SAMPLE_INTERVAL = 36;

// A DOM Range measures a character without wrapping or modifying its text.
// The original heading is never rewritten: it therefore cannot change line
// breaks or the accessible name, even when random glyph widths differ.
function collectGlyphs(heading) {
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const glyphs = [];
  let node;

  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest("[aria-hidden='true']")) continue;
    const value = node.textContent || "";
    const style = window.getComputedStyle(node.parentElement);
    let offset = 0;

    for (const character of value) {
      range.setStart(node, offset);
      offset += character.length;
      range.setEnd(node, offset);

      const rect = range.getBoundingClientRect();
      if (rect.width < 0.3 || rect.height < 0.3) continue;

      glyphs.push({
        character,
        rect,
        style: {
          color: style.color,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontStyle: style.fontStyle,
          fontWeight: style.fontWeight,
          fontStretch: style.fontStretch,
          fontFeatureSettings: style.fontFeatureSettings,
          letterSpacing: style.letterSpacing,
          textTransform: style.textTransform,
          textDecoration: style.textDecoration,
        },
      });
    }
  }

  range.detach?.();
  return glyphs;
}

function makeOverlay(glyphs) {
  const layer = document.createElement("div");
  layer.className = "v2-scramble-layer";
  layer.setAttribute("aria-hidden", "true");

  const spans = [];
  for (const glyph of glyphs) {
    const span = document.createElement("span");
    span.className = "v2-scramble-glyph";
    span.textContent = glyph.character;
    span.style.left = glyph.rect.left + "px";
    span.style.top = glyph.rect.top + "px";
    span.style.width = glyph.rect.width + "px";
    span.style.height = glyph.rect.height + "px";
    Object.assign(span.style, glyph.style);
    layer.append(span);
    spans.push(span);
  }

  document.body.append(layer);
  return { layer, spans };
}

/**
 * The pointer must cross the RIGHT HALF of a rendered glyph to activate.
 * Headings retain their real text and layout; a fixed, aria-hidden overlay
 * displays the decode animation in the exact measured character positions.
 */
export default function ScrambleHeadings() {
  useEffect(() => {
    const root = document.querySelector(".v2-root");
    if (!root) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    let active = null;
    let inspected = null;
    let armedHeading = null;
    let frame = 0;

    const restore = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (!active) return;
      active.heading.classList.remove("v2-scramble-active");
      active.layer.remove();
      active = null;
    };

    const clear = () => {
      restore();
      inspected = null;
      armedHeading = null;
    };

    const start = (heading, glyphs) => {
      restore();
      const { layer, spans } = makeOverlay(glyphs);
      const letters = glyphs.filter(({ character }) => IS_LETTER.test(character)).length;
      if (!letters) {
        layer.remove();
        return;
      }

      // The original DOM remains intact for layout, copy/paste and screen readers.
      // The CSS hides just its painted glyphs while the overlay is present.
      heading.classList.add("v2-scramble-active");
      active = { heading, layer, spans, glyphs };

      const startTime = performance.now();
      let previousBucket = -1;
      const draw = (now) => {
        if (active?.heading !== heading) return;
        if (!heading.isConnected) { restore(); return; }
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / DURATION);
        const revealed = Math.floor(progress * letters);
        const bucket = Math.floor(elapsed / SAMPLE_INTERVAL);

        if (bucket !== previousBucket || progress === 1) {
          previousBucket = bucket;
          let index = 0;
          glyphs.forEach(({ character }, i) => {
            if (!IS_LETTER.test(character)) return;
            const current = index++;
            spans[i].textContent = current < revealed || progress === 1
              ? character
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          });
        }

        if (progress < 1) frame = requestAnimationFrame(draw);
        else restore();
      };
      frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      if (reduced.matches || !hover.matches || event.pointerType && event.pointerType !== "mouse") {
        clear();
        return;
      }
      if (!(event.target instanceof Element)) return;

      const heading = event.target.closest(HEADING_SELECTOR);
      if (!heading || !root.contains(heading)) {
        if (armedHeading || active) clear();
        return;
      }

      if (heading !== armedHeading) {
        restore();
        armedHeading = heading;
        inspected = { heading, glyphs: collectGlyphs(heading) };
      }

      if (active) return;
      if (!inspected || inspected.heading !== heading) return;

      // Ignore the heading element's empty rectangle and the left half of
      // every letter. Only actual painted text geometry can start the effect.
      const hit = inspected.glyphs.some(({ character, rect }) =>
        IS_LETTER.test(character) &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom &&
        event.clientX >= rect.left + rect.width * 0.5 &&
        event.clientX <= rect.right
      );

      if (hit) {
        // Mark it consumed until the pointer leaves, avoiding repeated flicker.
        const glyphs = inspected.glyphs;
        inspected = null;
        start(heading, glyphs);
      }
    };

    const onPointerOut = (event) => {
      if (!armedHeading || !(event.target instanceof Node)) return;
      if (!armedHeading.contains(event.target)) return;
      if (event.relatedTarget instanceof Node && armedHeading.contains(event.relatedTarget)) return;
      clear();
    };
    const onScroll = () => {
      // The positioned overlay is tied to viewport glyph rectangles.
      // Restore immediately if the page moves during the animation.
      clear();
    };
    const onMediaChange = () => clear();

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerout", onPointerOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", onMediaChange);
    hover.addEventListener("change", onMediaChange);

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", onMediaChange);
      hover.removeEventListener("change", onMediaChange);
      clear();
    };
  }, []);

  return null;
}
