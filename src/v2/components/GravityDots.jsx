import { useEffect, useRef } from "react";
import { gravityDotsConfig } from "../config/setenv";
import "./GravityDots.css";

const MAX_DPR = 1.5;
const MAX_DOTS = 1100;
const ACTIVE_FRAMES_AFTER_MOVE = 22;
const SPRING = 0.17;
const FRICTION = 0.75;
const WAVE_LIFETIME = 1250;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function createDotGrid(width, height) {
  const spacing = clamp(Math.sqrt((width * height) / 820), 29, 49);
  const dots = [];
  for (let y = spacing * 0.5; y < height; y += spacing) {
    for (let x = spacing * 0.5; x < width; x += spacing) {
      dots.push({ x, y, px: x, py: y, vx: 0, vy: 0 });
      if (dots.length >= MAX_DOTS) return dots;
    }
  }
  return dots;
}

// Content stays visually dominant. Particles are still interactive underneath,
// but their opacity drops around the readable copy and the existing 3D object.
function contentFade(x, y, width, height) {
  const left = ((x / width - 0.22) / 0.32) ** 2 +
    ((y / height - 0.50) / 0.39) ** 2;
  const right = ((x / width - 0.80) / 0.25) ** 2 +
    ((y / height - 0.53) / 0.40) ** 2;

  const textMask = Math.exp(-left * 1.7) * 0.78;
  const modelMask = Math.exp(-right * 1.7) * 0.64;
  return clamp(1 - Math.max(textMask, modelMask), 0.20, 1);
}

function drawDot(context, x, y, radius, alpha) {
  if (alpha < 0.009) return;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = "rgba(197,245,112," + Math.min(alpha, 0.92) + ")";
  context.fill();
}

function drawWave(context, wave, now, energy, width, height) {
  const elapsed = now - wave.time;
  if (elapsed < 0 || elapsed > WAVE_LIFETIME) return;
  const life = 1 - elapsed / WAVE_LIFETIME;
  context.beginPath();
  context.arc(wave.x, wave.y, 20 + elapsed * 0.31, 0, Math.PI * 2);
  context.strokeStyle = "rgba(202,248,150," +
    (0.27 * life * life * energy * contentFade(wave.x, wave.y, width, height)) + ")";
  context.lineWidth = 1.2;
  context.stroke();
}

/**
 * Gravity Dots — a Canvas 2D decorative layer behind the hero.
 * No external asset, animation package, WebGL context, or clickable overlay.
 *
 * Config lives in src/v2/config/setenv.js and .env.example.
 * Updates only while there is pointer movement or spring motion to settle.
 */
export default function GravityDots() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest(".v2-hero");
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !hero || !context) return undefined;

    sectionRef.current = hero;
    const { energy: energyPercent, radius } = gravityDotsConfig;
    const energy = energyPercent / 100;
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let dots = [];
    let frame = 0;
    let drawnAt = 0;
    let stillFrames = 0;
    let inView = true;
    let pointer = null;
    let shockwaves = [];
    let disposed = false;

    const schedule = () => {
      if (!frame && !disposed && inView && !document.hidden) {
        frame = requestAnimationFrame(render);
      }
    };

    const shouldRespond = () => !coarse.matches && !reduced.matches && energy > 0;

    const render = (now) => {
      frame = 0;
      if (disposed || !inView || document.hidden) return;
      context.clearRect(0, 0, width, height);
      shockwaves = shockwaves.filter((wave) => now - wave.time < WAVE_LIFETIME);

      const enabled = shouldRespond();
      const mouse = enabled ? pointer : null;
      let moving = false;

      // Keep the grid stable and quiet until the pointer approaches.
      for (const dot of dots) {
        const dx = mouse ? dot.x - mouse.x : 0;
        const dy = mouse ? dot.y - mouse.y : 0;
        const distance = mouse ? Math.hypot(dx, dy) : Infinity;
        const reach = mouse ? Math.max(0, 1 - distance / radius) : 0;
        const influence = reach ** 1.65;
        const force = 52 * energy * influence;
        const inverse = distance > 0.5 ? 1 / distance : 0;
        let targetX = dot.x + dx * inverse * force;
        let targetY = dot.y + dy * inverse * force;

        // Mouse click releases a wave of displaced dots that rebound.
        for (const wave of shockwaves) {
          const age = now - wave.time;
          const travel = age * 0.31;
          const waveDist = Math.hypot(dot.x - wave.x, dot.y - wave.y);
          const band = Math.exp(-((waveDist - travel) / 38) ** 2);
          const strength = band * (1 - age / WAVE_LIFETIME) * 37 * energy;
          const inv = waveDist > 0.5 ? 1 / waveDist : 0;
          targetX += (dot.x - wave.x) * inv * strength;
          targetY += (dot.y - wave.y) * inv * strength;
        }

        dot.vx = (dot.vx + (targetX - dot.px) * SPRING) * FRICTION;
        dot.vy = (dot.vy + (targetY - dot.py) * SPRING) * FRICTION;
        dot.px += dot.vx;
        dot.py += dot.vy;

        const displacement = Math.hypot(dot.px - dot.x, dot.py - dot.y);
        const speed = Math.hypot(dot.vx, dot.vy);
        if (displacement > 0.13 || speed > 0.12) moving = true;

        const fade = contentFade(dot.px, dot.py, width, height);
        const baseOpacity = 0.075 * energy;
        const opacity = fade * (baseOpacity + influence * 0.68 * energy);
        drawDot(context, dot.px, dot.py, 1.1 + Math.min(displacement * 0.085, 2.6), opacity);

        if (influence > 0.34 && displacement > 4) {
          context.beginPath();
          context.moveTo(dot.x, dot.y);
          context.lineTo(dot.px, dot.py);
          context.strokeStyle = "rgba(191,239,138," +
            (fade * influence * energy * 0.17) + ")";
          context.lineWidth = 0.65;
          context.stroke();
        }
      }

      if (mouse) {
        const glow = context.createRadialGradient(mouse.x, mouse.y, 0,
          mouse.x, mouse.y, radius * 0.82);
        const fade = contentFade(mouse.x, mouse.y, width, height);
        glow.addColorStop(0, "rgba(177,235,105," + (0.065 * fade * energy) + ")");
        glow.addColorStop(1, "rgba(177,235,105,0)");
        context.fillStyle = glow;
        context.fillRect(mouse.x - radius, mouse.y - radius, radius * 2, radius * 2);
      }

      for (const wave of shockwaves) drawWave(context, wave, now, energy, width, height);

      // No indefinite animation loop once particles have settled.
      stillFrames = moving || shockwaves.length ? 0 : stillFrames + 1;
      drawnAt = now;
      if (enabled && stillFrames < ACTIVE_FRAMES_AFTER_MOVE) schedule();
    };

    const resize = () => {
      if (disposed) return;
      const bounds = hero.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = createDotGrid(width, height);
      shockwaves = [];
      pointer = null;
      stillFrames = ACTIVE_FRAMES_AFTER_MOVE;
      canvas.dataset.particles = String(dots.length);
      schedule();
    };

    const positionFrom = (event) => {
      const bounds = hero.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };

    const pointerMove = (event) => {
      if (!shouldRespond() || event.pointerType !== "mouse") return;
      pointer = positionFrom(event);
      stillFrames = 0;
      canvas.dataset.interacting = "true";
      schedule();
    };

    const pointerLeave = () => {
      pointer = null;
      stillFrames = 0;
      canvas.dataset.interacting = "false";
      schedule();
    };

    const pointerDown = (event) => {
      if (!shouldRespond() || event.pointerType !== "mouse") return;
      // Links and buttons must behave normally, without decorative explosions.
      if (event.target instanceof Element &&
        event.target.closest("a,button,input,textarea,select,[role='button']")) return;
      const pos = positionFrom(event);
      shockwaves.push({ ...pos, time: performance.now() });
      if (shockwaves.length > 3) shockwaves.shift();
      pointer = pos;
      stillFrames = 0;
      schedule();
    };

    const handleVisibility = () => {
      if (!document.hidden) schedule();
      else if (frame) { cancelAnimationFrame(frame); frame = 0; }
    };

    const handleMedia = () => {
      pointer = null;
      shockwaves = [];
      canvas.dataset.interacting = "false";
      stillFrames = ACTIVE_FRAMES_AFTER_MOVE;
      schedule();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      if (!inView) {
        pointer = null;
        canvas.dataset.interacting = "false";
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
      } else schedule();
    });
    viewObserver.observe(hero);

    canvas.dataset.interacting = "false";
    hero.addEventListener("pointermove", pointerMove, { passive: true });
    hero.addEventListener("pointerleave", pointerLeave);
    hero.addEventListener("pointerdown", pointerDown, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    coarse.addEventListener("change", handleMedia);
    reduced.addEventListener("change", handleMedia);

    resize();
    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      hero.removeEventListener("pointermove", pointerMove);
      hero.removeEventListener("pointerleave", pointerLeave);
      hero.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("visibilitychange", handleVisibility);
      coarse.removeEventListener("change", handleMedia);
      reduced.removeEventListener("change", handleMedia);
    };
  }, []);

  return <canvas
    ref={canvasRef}
    className="v2-gravity-dots"
    aria-hidden="true"
    data-interacting="false"
    data-energy={gravityDotsConfig.energy}
    data-radius={gravityDotsConfig.radius}
  />;
}
