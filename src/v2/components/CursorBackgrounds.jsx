import { useEffect } from "react";
import { cursorBackgroundConfig, CURSOR_BACKGROUND_STYLES, nextCursorBackgroundStyle } from "../config/setenv";
import "./cursorBackground.css";

const STORAGE_KEY = "portfolio-cursor-background-v1";
const PATCH_WIDTH = 840;
const PATCH_HEIGHT = 620;
const MIN_MOVE = 4;
let pageStyle;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const hash = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

function chooseStyle() {
  if (cursorBackgroundConfig.mode !== "cycle") return cursorBackgroundConfig.mode;
  if (pageStyle) return pageStyle;
  try {
    const previous = window.localStorage.getItem(STORAGE_KEY);
    pageStyle = nextCursorBackgroundStyle(previous);
    window.localStorage.setItem(STORAGE_KEY, pageStyle);
  } catch {
    pageStyle = CURSOR_BACKGROUND_STYLES[0];
  }
  return pageStyle;
}

function paintGrid(ctx, point, origin, tone, config) {
  if (!point) return;
  const gap = config.gridGap;
  const reach = config.radius;
  const ink = (alpha) => tone === "light" ? "rgba(45,88,43," + alpha + ")" : "rgba(198,243,103," + alpha + ")";
  const xMin = Math.floor((point.x - reach) / gap) * gap;
  const yMin = Math.floor((point.y - reach) / gap) * gap;

  for (let x = xMin; x <= point.x + reach; x += gap) {
    const factor = Math.max(0, 1 - Math.abs(x - point.x) / reach);
    if (!factor) continue;
    ctx.strokeStyle = ink(config.intensity * 0.25 * factor * factor);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - origin.x, point.y - reach - origin.y);
    ctx.lineTo(x - origin.x, point.y + reach - origin.y);
    ctx.stroke();
  }
  for (let y = yMin; y <= point.y + reach; y += gap) {
    const factor = Math.max(0, 1 - Math.abs(y - point.y) / reach);
    if (!factor) continue;
    ctx.strokeStyle = ink(config.intensity * 0.25 * factor * factor);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(point.x - reach - origin.x, y - origin.y);
    ctx.lineTo(point.x + reach - origin.x, y - origin.y);
    ctx.stroke();
  }
  for (let x = xMin; x <= point.x + reach; x += gap) {
    for (let y = yMin; y <= point.y + reach; y += gap) {
      const factor = Math.max(0, 1 - Math.hypot(x - point.x, y - point.y) / reach);
      if (!factor) continue;
      ctx.fillStyle = ink(config.intensity * 0.8 * factor * factor);
      ctx.fillRect(x - origin.x - 1.5, y - origin.y - 1.5, 3, 3);
    }
  }
  ctx.strokeStyle = ink(config.intensity * 0.42);
  ctx.lineWidth = 0.85;
  ctx.beginPath();
  ctx.arc(point.x - origin.x, point.y - origin.y, reach * 0.23, 0, Math.PI * 2);
  ctx.stroke();
}

function paintConstellation(ctx, point, origin, tone, config) {
  if (!point) return;
  const gap = config.nodeGap;
  const reach = config.radius;
  const ink = (alpha) => tone === "light" ? "rgba(35,80,39," + alpha + ")" : "rgba(198,243,103," + alpha + ")";
  const nodes = [];
  const minX = Math.floor((point.x - reach) / gap);
  const maxX = Math.ceil((point.x + reach) / gap);
  const minY = Math.floor((point.y - reach) / gap);
  const maxY = Math.ceil((point.y + reach) / gap);
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const p = {
        x: x * gap + (hash(x, y) - 0.5) * gap * 0.65,
        y: y * gap + (hash(y, x + 17) - 0.5) * gap * 0.65,
      };
      const falloff = Math.max(0, 1 - distance(p, point) / reach);
      if (falloff > 0) nodes.push({ ...p, falloff });
    }
  }
  ctx.lineWidth = 0.85;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (distance(a, b) > gap * 1.58) continue;
      ctx.strokeStyle = ink(config.intensity * 0.42 * Math.min(a.falloff, b.falloff));
      ctx.beginPath();
      ctx.moveTo(a.x - origin.x, a.y - origin.y);
      ctx.lineTo(b.x - origin.x, b.y - origin.y);
      ctx.stroke();
    }
    ctx.fillStyle = ink(config.intensity * (0.23 + 0.67 * a.falloff));
    ctx.beginPath();
    ctx.arc(a.x - origin.x, a.y - origin.y, 1.2 + a.falloff * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintRibbon(ctx, points, origin, tone, config, now) {
  const ink = (alpha) => tone === "light" ? "rgba(37,92,44," + alpha + ")" : "rgba(198,243,103," + alpha + ")";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const life = clamp(1 - (now - b.time) / config.trailMs, 0, 1);
    if (!life) continue;
    const thickness = 9 * config.intensity * life * (i / points.length);
    ctx.beginPath();
    ctx.moveTo(a.x - origin.x, a.y - origin.y);
    ctx.quadraticCurveTo(
      (a.x + b.x) / 2 - origin.x,
      (a.y + b.y) / 2 - origin.y,
      b.x - origin.x,
      b.y - origin.y
    );
    ctx.strokeStyle = ink(0.10 * config.intensity * life);
    ctx.lineWidth = thickness + 14;
    ctx.stroke();
    ctx.strokeStyle = ink(0.76 * config.intensity * life);
    ctx.lineWidth = Math.max(0.7, thickness * 0.46);
    ctx.stroke();
  }
}

function paintPixels(ctx, pixels, origin, tone, config, now) {
  const ink = (alpha) => tone === "light" ? "rgba(42,88,41," + alpha + ")" : "rgba(198,243,103," + alpha + ")";
  const size = config.pixelSize;
  for (const [key, pixel] of pixels) {
    const life = 1 - (now - pixel.time) / config.trailMs;
    if (life <= 0) {
      pixels.delete(key);
      continue;
    }
    const edge = size * (0.2 + 0.65 * life);
    ctx.fillStyle = ink(config.intensity * 0.62 * life * life);
    ctx.fillRect(pixel.x - origin.x + (size - edge) / 2, pixel.y - origin.y + (size - edge) / 2, edge, edge);
  }
}

export default function CursorBackgrounds() {
  useEffect(() => {
    const mode = chooseStyle();
    const root = document.querySelector(".v2-root");
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!root || mode === "off") return undefined;

    const sections = Array.from(root.querySelectorAll("main > section:not(.v2-hero), footer.v2-footer"));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx || !sections.length) return undefined;
    canvas.className = "v2-cursor-background";
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.style = mode;

    let activeSection = null;
    let pointer = null;
    let follow = null;
    let origin = { x: 0, y: 0 };
    let points = [];
    const pixels = new Map();
    let frame = 0;
    let listening = false;
    let tone = "dark";
    let width = 0;
    let height = 0;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const hide = () => {
      pointer = null;
      follow = null;
      points = [];
      pixels.clear();
      canvas.style.opacity = "0";
      stop();
      if (activeSection) activeSection = null;
    };

    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(render);
    };

    const render = (now) => {
      frame = 0;
      if (!activeSection || document.hidden) return;
      ctx.clearRect(0, 0, width, height);
      if (pointer) {
        if (!follow) follow = { ...pointer };
        follow.x += (pointer.x - follow.x) * 0.24;
        follow.y += (pointer.y - follow.y) * 0.24;
      }
      const config = cursorBackgroundConfig;
      points = points.filter((p) => now - p.time < config.trailMs);
      if (mode === "grid") paintGrid(ctx, follow, origin, tone, config);
      if (mode === "constellation") paintConstellation(ctx, follow, origin, tone, config);
      if (mode === "ribbon") paintRibbon(ctx, points, origin, tone, config, now);
      if (mode === "pixel") paintPixels(ctx, pixels, origin, tone, config, now);

      const unsettled = pointer && follow && distance(pointer, follow) > 0.5;
      const trailActive = mode === "ribbon" && points.length > 0 || mode === "pixel" && pixels.size > 0;
      if (unsettled || trailActive) schedule();
      else if (!pointer) canvas.style.opacity = "0";
    };

    const activate = (section, rect) => {
      if (activeSection === section) return;
      activeSection = section;
      pointer = null;
      follow = null;
      points = [];
      pixels.clear();
      section.append(canvas);
      tone = section.matches(".v2-overview, .v2-experience, .v2-work, .v2-about, .v2-footer") ? "light" : "dark";
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.min(rect.width, PATCH_WIDTH);
      height = Math.min(rect.height, PATCH_HEIGHT);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const stampPixels = (point, now) => {
      const gap = cursorBackgroundConfig.pixelSize;
      const cx = Math.floor(point.x / gap);
      const cy = Math.floor(point.y / gap);
      for (let y = -3; y <= 3; y++) {
        for (let x = -3; x <= 3; x++) {
          const d = Math.hypot(x, y);
          if (d > 3.2 || hash(cx + x, cy + y) > 0.64) continue;
          const key = (cx + x) + ":" + (cy + y);
          pixels.set(key, { x: (cx + x) * gap, y: (cy + y) * gap, time: now - d * 30 });
        }
      }
      if (pixels.size > 450) pixels.delete(pixels.keys().next().value);
    };

    const onPointerMove = (event) => {
      if (event.pointerType !== "mouse" || !media.matches) return;
      const section = event.currentTarget;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("a, button, input, textarea, select, [role='button'], .v2-depth-card, .v2-project-list-row, .v2-project-card, .v2-overview-fact, .v2-role, .v2-about-art, .v2-method-visual")) {
        canvas.style.opacity = "0";
        pointer = null;
        follow = null;
        points = [];
        pixels.clear();
        stop();
        return;
      }

      const rect = section.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      activate(section, rect);
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      origin = {
        x: clamp(point.x - width / 2, 0, Math.max(0, rect.width - width)),
        y: clamp(point.y - height / 2, 0, Math.max(0, rect.height - height)),
      };
      canvas.style.transform = "translate3d(" + origin.x + "px," + origin.y + "px,0)";
      const now = performance.now();
      if (mode === "ribbon") {
        const last = points[points.length - 1];
        if (!last || distance(last, point) > MIN_MOVE) {
          points.push({ ...point, time: now });
          if (points.length > 90) points.shift();
        }
      }
      if (mode === "pixel") stampPixels(point, now);
      pointer = point;
      canvas.style.opacity = "1";
      schedule();
    };

    const onPointerLeave = (event) => {
      if (event.currentTarget !== activeSection) return;
      pointer = null;
      follow = null;
      if (mode === "grid" || mode === "constellation") canvas.style.opacity = "0";
      else schedule();
    };

    const onVisibility = () => {
      if (document.hidden) hide();
    };

    const sync = () => {
      const enabled = media.matches;
      if (enabled === listening) return;
      listening = enabled;
      sections.forEach((section) => {
        if (enabled) {
          section.classList.add("v2-cursor-field-section");
          section.addEventListener("pointermove", onPointerMove, { passive: true });
          section.addEventListener("pointerleave", onPointerLeave);
        } else {
          section.removeEventListener("pointermove", onPointerMove);
          section.removeEventListener("pointerleave", onPointerLeave);
          section.classList.remove("v2-cursor-field-section");
        }
      });
      if (!enabled) {
        hide();
        canvas.remove();
      }
    };

    const onScroll = () => {
      if (activeSection) hide();
    };

    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", hide);
    sync();

    return () => {
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", hide);
      if (listening) {
        sections.forEach((section) => {
          section.removeEventListener("pointermove", onPointerMove);
          section.removeEventListener("pointerleave", onPointerLeave);
          section.classList.remove("v2-cursor-field-section");
        });
      }
      hide();
      canvas.remove();
    };
  }, []);

  return null;
}
