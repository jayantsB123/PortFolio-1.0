import { useEffect } from "react";

const headingSelector = [
  ".v2-hero h1",
  ".v2-overview-heading h2",
  ".v2-section-heading h2",
  ".v2-about-main h2",
  ".v2-method h2",
  ".v2-footer h2",
  ".v2-modal-content h2",
  ".v2-role-main h3",
  ".v2-skills-group h3",
  ".v2-project-info h3",
  ".v2-project-row-name",
  ".v2-kicker",
  ".v2-overview-kicker",
  ".v2-eyebrow",
  ".v2-about-kicker",
  ".v2-logo-text",
].join(", ");

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%*&+";
const scrambleable = /[a-z0-9]/i;

/**
 * Brief, left-to-right decode animation on hover or keyboard focus.
 * Actual text always settles back to its original value. This deliberately
 * preserves markup (including <em> and <br>) and stable accessible names.
 */
export default function ScrambleHeadings() {
  useEffect(() => {
    const root = document.querySelector(".v2-root");
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = null;
    let frame = 0;

    const restore = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (!active) return;
      for (const { node, value } of active.parts) node.textContent = value;
      if (active.restoreAria) {
        if (active.aria == null) active.element.removeAttribute("aria-label");
        else active.element.setAttribute("aria-label", active.aria);
      }
      active.element.classList.remove("v2-scramble-active");
      active = null;
    };

    const start = (element) => {
      if (reducedMotion.matches || !element || element === active?.element) return;
      restore();

      const parts = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let current;
      while ((current = walker.nextNode())) {
        if (current.parentElement?.closest("[aria-hidden='true']")) continue;
        if (/[a-z0-9]/i.test(current.textContent)) {
          parts.push({ node: current, value: current.textContent });
        }
      }
      const count = parts.reduce((sum, part) =>
        sum + Array.from(part.value).filter((char) => scrambleable.test(char)).length, 0
      );
      if (!count) return;

      const aria = element.getAttribute("aria-label");
      const restoreAria = /^H[1-6]$/.test(element.tagName);
      if (restoreAria && aria == null) {
        // Keep the original title accessible while visual glyphs are decoding.
        element.setAttribute("aria-label", element.innerText.replace(/\s+/g, " ").trim());
      }

      element.classList.add("v2-scramble-active");
      active = { element, parts, aria, restoreAria };
      const duration = Math.min(1050, 480 + count * 22);
      const started = performance.now();
      let lastBucket = -1;

      const tick = (now) => {
        if (active?.element !== element) return;
        const elapsed = now - started;
        const fraction = Math.min(1, elapsed / duration);
        const reveal = Math.floor(fraction * count);
        const bucket = Math.floor(elapsed / 40);

        if (bucket !== lastBucket || fraction === 1) {
          lastBucket = bucket;
          let letter = 0;
          for (const part of parts) {
            part.node.textContent = Array.from(part.value).map((char) => {
              if (!scrambleable.test(char)) return char;
              const index = letter++;
              if (index < reveal || fraction === 1) return char;
              return glyphs[Math.floor(Math.random() * glyphs.length)];
            }).join("");
          }
        }

        if (fraction < 1) frame = requestAnimationFrame(tick);
        else restore();
      };

      frame = requestAnimationFrame(tick);
    };

    const findTarget = (event) => {
      if (!(event.target instanceof Element)) return null;
      return event.target.closest(headingSelector);
    };

    const enter = (event) => {
      const target = findTarget(event);
      if (!target || !root.contains(target)) return;
      if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
      start(target);
    };
    const leave = (event) => {
      if (!active) return;
      if (event.relatedTarget instanceof Node && active.element.contains(event.relatedTarget)) return;
      if (event.target instanceof Node && active.element.contains(event.target)) restore();
    };
    const focus = (event) => {
      const target = findTarget(event);
      if (target && root.contains(target)) start(target);
    };
    const blur = (event) => {
      if (active && event.target instanceof Node && active.element.contains(event.target)) restore();
    };
    const reduce = () => { if (reducedMotion.matches) restore(); };

    root.addEventListener("pointerover", enter);
    root.addEventListener("pointerout", leave);
    root.addEventListener("focusin", focus);
    root.addEventListener("focusout", blur);
    reducedMotion.addEventListener("change", reduce);

    return () => {
      root.removeEventListener("pointerover", enter);
      root.removeEventListener("pointerout", leave);
      root.removeEventListener("focusin", focus);
      root.removeEventListener("focusout", blur);
      reducedMotion.removeEventListener("change", reduce);
      restore();
    };
  }, []);
  return null;
}
