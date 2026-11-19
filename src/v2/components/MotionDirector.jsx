import { useEffect } from "react";

/**
 * Reversible section entrances. Elements animate while they enter and return
 * to a resting state when they leave; travelling back up replays the same
 * sequence. Content is never hidden while JavaScript initializes.
 */
export default function MotionDirector() {
  useEffect(() => {
    const root = document.querySelector(".v2-root");
    if (!root || !("IntersectionObserver" in window)) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return undefined;

    const targets = Array.from(root.querySelectorAll(
      ".v2-overview-heading, .v2-overview-fact, .v2-section-heading, .v2-role, " +
      ".v2-project-list-row, .v2-project-card, .v2-skills-group, " +
      ".v2-about-aside, .v2-about-main, .v2-method-copy, .v2-method-visual, " +
      ".v2-footer-top, .v2-footer h2, .v2-contact-link"
    ));
    if (!targets.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("v2-in-view", entry.isIntersecting);
      }
    }, {
      root: null,
      rootMargin: "0px 0px -6% 0px",
      threshold: 0.08,
    });
    targets.forEach((node, index) => {
      node.classList.add("v2-reveal-target");
      node.style.setProperty("--v2-reveal-order", String(index % 3));
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
      targets.forEach((node) => {
        node.classList.remove("v2-reveal-target", "v2-in-view");
        node.style.removeProperty("--v2-reveal-order");
      });
    };
  }, []);
  return null;
}
