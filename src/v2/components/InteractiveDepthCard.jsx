import { useEffect, useRef } from "react";
import { depthCardsConfig } from "../config/setenv";

export default function InteractiveDepthCard({ as: Tag = "article", className = "", enabled = depthCardsConfig.enabled, freezeOnSelector, children, ...rest }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !enabled) return undefined;

    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const magnets = Array.from(card.querySelectorAll("[data-depth-magnet]"));
    const state = { rx: 0, ry: 0, lift: 0, x: 0, y: 0 };
    const target = { rx: 0, ry: 0, lift: 0, x: 0, y: 0 };
    let frame = 0;
    let active = false;

    card.style.setProperty("--v2-depth-glow-alpha", String(depthCardsConfig.spotlight));
    card.style.setProperty("--v2-depth-glow-radius", depthCardsConfig.radius + "px");

    const draw = () => {
      frame = 0;
      let moving = false;
      for (const key of ["rx", "ry", "lift", "x", "y"]) {
        const delta = target[key] - state[key];
        if (Math.abs(delta) > 0.04) moving = true;
        state[key] += delta * 0.17;
      }
      card.style.transform =
        "perspective(1100px) rotateX(" + state.rx.toFixed(3) + "deg) " +
        "rotateY(" + state.ry.toFixed(3) + "deg) translate3d(0," + (-state.lift).toFixed(2) + "px,0)";
      card.style.setProperty("--v2-depth-pointer-x", state.x.toFixed(2) + "px");
      card.style.setProperty("--v2-depth-pointer-y", state.y.toFixed(2) + "px");
      if (moving) frame = window.requestAnimationFrame(draw);
      else if (!active) card.style.transform = "";
    };

    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const reset = () => {
      active = false;
      card.dataset.depthActive = "false";
      target.rx = 0;
      target.ry = 0;
      target.lift = 0;
      for (const magnet of magnets) {
        magnet.style.setProperty("--v2-magnet-x", "0px");
        magnet.style.setProperty("--v2-magnet-y", "0px");
      }
      requestDraw();
    };

    const onPointerMove = (event) => {
      if (!media.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      if (freezeOnSelector && event.target instanceof Element && event.target.closest(freezeOnSelector)) {
        reset();
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        card.style.transform = "";
        return;
      }
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
      target.x = x;
      target.y = y;
      target.rx = (0.5 - y / rect.height) * depthCardsConfig.tilt * 2;
      target.ry = (x / rect.width - 0.5) * depthCardsConfig.tilt * 2;
      target.lift = depthCardsConfig.lift;
      active = true;
      card.dataset.depthActive = "true";

      for (const magnet of magnets) {
        const box = magnet.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy);
        const falloff = Math.max(0, 1 - distance / depthCardsConfig.magnetRadius) ** 2;
        const magnitude = depthCardsConfig.magnet * falloff;
        magnet.style.setProperty("--v2-magnet-x", (distance ? dx / distance * magnitude : 0).toFixed(2) + "px");
        magnet.style.setProperty("--v2-magnet-y", (distance ? dy / distance * magnitude : 0).toFixed(2) + "px");
      }
      requestDraw();
    };

    const onMediaChange = () => {
      if (!media.matches) reset();
    };

    card.addEventListener("pointerenter", onPointerMove, { passive: true });
    card.addEventListener("pointermove", onPointerMove, { passive: true });
    card.addEventListener("pointerleave", reset, { passive: true });
    card.addEventListener("pointercancel", reset, { passive: true });
    media.addEventListener("change", onMediaChange);
    return () => {
      card.removeEventListener("pointerenter", onPointerMove);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", reset);
      card.removeEventListener("pointercancel", reset);
      media.removeEventListener("change", onMediaChange);
      if (frame) window.cancelAnimationFrame(frame);
      card.style.transform = "";
      card.dataset.depthActive = "false";
    };
  }, [enabled, freezeOnSelector]);

  const cardClass = enabled ? "v2-depth-card " + className : className;
  return <Tag ref={cardRef} className={cardClass.trim()} {...rest}>{children}</Tag>;
}
