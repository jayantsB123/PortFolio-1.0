import { useEffect } from "react";
import { cinematicScrollConfig } from "../config/setenv";
import "./cinematicScroll.css";

const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => value * value * (3 - 2 * value);

export default function CinematicScroll() {
  useEffect(() => {
    if (!cinematicScrollConfig.enabled) return undefined;

    const root = document.querySelector(".v2-root");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root) return undefined;

    const sections = Array.from(root.querySelectorAll(
      "main > section, footer.v2-footer"
    )).map((section) => ({
      section,
      content: section.matches(".v2-hero")
        ? section.querySelector(".v2-hero-body")
        : section.matches(".v2-method")
          ? section.querySelector(".v2-method-sticky > .v2-container")
          : section.querySelector(":scope > .v2-container"),
    })).filter(({ content }) => content);

    let frame = 0;
    let active = false;

    const render = () => {
      frame = 0;
      if (!active || document.hidden) return;
      const height = window.innerHeight;
      if (!height) return;

      for (const { section, content } of sections) {
        const { top, bottom } = section.getBoundingClientRect();
        const entry = smooth(clamp((height - top) / (height * 0.70)));
        const exit = smooth(clamp(bottom / (height * 0.61)));
        const visible = Math.min(entry, exit);
        const drift = (1 - entry) - (1 - exit);
        const lost = 1 - visible;
        const strength = cinematicScrollConfig.strength / 100;

        const lift = drift * cinematicScrollConfig.travel * strength;
        const tilt = -drift * cinematicScrollConfig.rotate * strength;
        const scale = 1 - lost * cinematicScrollConfig.scale * strength;
        const blur = lost * cinematicScrollConfig.blur * strength;
        const opacity = 1 - lost * (1 - cinematicScrollConfig.minOpacity) * strength;
        const settled = lost < 0.003 && Math.abs(drift) < 0.003;

        content.style.setProperty("--v2-cinema-y", lift.toFixed(2) + "px");
        content.style.setProperty("--v2-cinema-tilt", tilt.toFixed(3) + "deg");
        content.style.setProperty("--v2-cinema-scale", scale.toFixed(5));
        content.style.setProperty("--v2-cinema-blur", blur.toFixed(2) + "px");
        content.style.setProperty("--v2-cinema-opacity", opacity.toFixed(4));
        content.dataset.cinematicResting = String(settled);
        content.classList.toggle(
          "v2-cinematic-moving",
          !settled && bottom > -height * 0.15 && top < height * 1.15
        );
      }
    };

    const request = () => {
      if (active && !frame) frame = window.requestAnimationFrame(render);
    };

    const sync = () => {
      const enabled = !reducedMotion.matches;
      if (enabled === active) return;
      active = enabled;
      if (enabled) {
        sections.forEach(({ section, content }) => {
          section.classList.add("v2-cinematic-section");
          content.classList.add("v2-cinematic-content");
        });
        request();
      } else {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        sections.forEach(({ section, content }) => {
          section.classList.remove("v2-cinematic-section");
          content.classList.remove("v2-cinematic-content", "v2-cinematic-moving");
          content.removeAttribute("data-cinematic-resting");
          for (const key of ["y", "tilt", "scale", "blur", "opacity"]) {
            content.style.removeProperty("--v2-cinema-" + key);
          }
        });
      }
    };

    const onVisibility = () => {
      if (!document.hidden) request();
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    window.addEventListener("pageshow", request);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", sync);
    sync();

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.removeEventListener("pageshow", request);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", sync);
      if (frame) window.cancelAnimationFrame(frame);
      active = true;
      reducedMotion.matches || sync();
      sections.forEach(({ section, content }) => {
        section.classList.remove("v2-cinematic-section");
        content.classList.remove("v2-cinematic-content", "v2-cinematic-moving");
        content.removeAttribute("data-cinematic-resting");
        for (const key of ["y", "tilt", "scale", "blur", "opacity"]) {
          content.style.removeProperty("--v2-cinema-" + key);
        }
      });
    };
  }, []);

  return null;
}
