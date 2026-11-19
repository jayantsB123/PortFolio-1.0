import { useEffect, useRef } from "react";
import "./interactiveCursor.css";

/**
 * A lightweight dot + following ring with context-specific labels.
 * Native cursor is restored automatically for touch, reduced motion,
 * text selection and editable controls. No overlay intercepts pointer events.
 */
export default function InteractiveCursor() {
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const root = document.querySelector(".v2-root");
    const dot = dotRef.current;
    const halo = haloRef.current;
    const label = labelRef.current;
    if (!root || !dot || !halo || !label) return undefined;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const position = { x: -100, y: -100 };
    const follow = { x: -100, y: -100 };
    let frame = 0;
    let enabled = false;
    let initialized = false;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const hide = () => {
      dot.style.opacity = "0";
      halo.style.opacity = "0";
      halo.dataset.mode = "default";
      halo.dataset.theme = "dark";
      label.textContent = "";
      halo.classList.remove("is-pressed");
      root.classList.remove("v2-cursor-on-text");
      initialized = false;
      stop();
    };

    const animate = () => {
      frame = 0;
      const dx = position.x - follow.x;
      const dy = position.y - follow.y;
      follow.x += dx * 0.22;
      follow.y += dy * 0.22;
      halo.style.transform = "translate3d(" + follow.x + "px," + follow.y + "px,0) translate(-50%,-50%)";
      if (Math.abs(dx) > 0.22 || Math.abs(dy) > 0.22) {
        frame = requestAnimationFrame(animate);
      }
    };

    const move = (event) => {
      if (!enabled || (event.pointerType && event.pointerType !== "mouse")) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], [data-cursor-label]");
      const heading = !interactive && target.closest("h1, h2, h3, h4, [data-heading-effect]");
      const lightSection = target.closest(".v2-overview, .v2-experience, .v2-work, .v2-about, .v2-footer");
      halo.dataset.theme = lightSection ? "light" : "dark";
      dot.dataset.theme = lightSection ? "light" : "dark";
      const text = !interactive && target.closest(
        "input, textarea, select, [contenteditable='true'], p, li"
      );
      root.classList.toggle("v2-cursor-on-text", Boolean(text));
      if (text) {
        dot.style.opacity = "0";
        halo.style.opacity = "0";
        return;
      }

      const explicitLabel = interactive?.closest("[data-cursor-label]")?.getAttribute("data-cursor-label");
      const actionLabel = explicitLabel && /^[A-Z ]{2,10}$/.test(explicitLabel) ? explicitLabel : null;
      halo.dataset.mode = actionLabel ? "label" : interactive ? "action" : heading ? "heading" : "default";
      label.textContent = actionLabel || (heading ? "✳" : "");

      position.x = event.clientX;
      position.y = event.clientY;
      if (!initialized) {
        follow.x = position.x;
        follow.y = position.y;
        initialized = true;
        halo.style.transform = "translate3d(" + follow.x + "px," + follow.y + "px,0) translate(-50%,-50%)";
      }
      dot.style.transform = "translate3d(" + position.x + "px," + position.y + "px,0) translate(-50%,-50%)";
      dot.style.opacity = "1";
      halo.style.opacity = "1";
      if (!frame) frame = requestAnimationFrame(animate);
    };

    const press = () => halo.classList.add("is-pressed");
    const release = () => halo.classList.remove("is-pressed");
    const visibility = () => { if (document.hidden) hide(); };

    const listen = () => {
      root.addEventListener("pointermove", move, { passive: true });
      root.addEventListener("pointerleave", hide);
      root.addEventListener("pointerdown", press);
      root.addEventListener("pointerup", release);
      root.addEventListener("pointercancel", release);
      window.addEventListener("blur", hide);
      document.addEventListener("visibilitychange", visibility);
    };
    const unlisten = () => {
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", hide);
      root.removeEventListener("pointerdown", press);
      root.removeEventListener("pointerup", release);
      root.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", visibility);
    };

    const sync = () => {
      const shouldEnable = finePointer.matches && !reducedMotion.matches;
      if (shouldEnable === enabled) return;
      enabled = shouldEnable;
      root.classList.toggle("v2-cursor-enabled", shouldEnable);
      if (shouldEnable) listen();
      else { unlisten(); hide(); }
    };

    sync();
    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
      if (enabled) unlisten();
      root.classList.remove("v2-cursor-enabled", "v2-cursor-on-text");
      hide();
    };
  }, []);

  return <div className="v2-custom-cursor" aria-hidden="true">
    <div className="v2-cursor-dot" ref={dotRef}/>
    <div className="v2-cursor-halo" ref={haloRef} data-mode="default">
      <span ref={labelRef}/>
    </div>
  </div>;
}
