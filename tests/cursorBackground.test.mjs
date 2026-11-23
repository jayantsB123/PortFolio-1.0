import assert from "node:assert/strict";
import test from "node:test";
import {
  CURSOR_BACKGROUND_STYLES,
  nextCursorBackgroundStyle,
  resolveCursorBackgroundConfig,
} from "../src/v2/config/setenv.js";

test("cursor backgrounds cycle in the requested order", () => {
  assert.deepEqual(CURSOR_BACKGROUND_STYLES, ["grid", "constellation", "ribbon", "pixel"]);
  assert.equal(nextCursorBackgroundStyle(null), "grid");
  assert.equal(nextCursorBackgroundStyle("grid"), "constellation");
  assert.equal(nextCursorBackgroundStyle("constellation"), "ribbon");
  assert.equal(nextCursorBackgroundStyle("ribbon"), "pixel");
  assert.equal(nextCursorBackgroundStyle("pixel"), "grid");
  assert.equal(nextCursorBackgroundStyle("invalid"), "grid");
});

test("cursor background settings can be pinned or disabled", () => {
  assert.equal(resolveCursorBackgroundConfig().mode, "cycle");
  assert.equal(resolveCursorBackgroundConfig({ VITE_CURSOR_BACKGROUND_STYLE: "pixel" }).mode, "pixel");
  assert.equal(resolveCursorBackgroundConfig({ VITE_CURSOR_BACKGROUND_STYLE: "off" }).mode, "off");
  assert.equal(resolveCursorBackgroundConfig({ VITE_CURSOR_BACKGROUND_STYLE: "aura" }).mode, "cycle");
});

test("cursor background strengths are bounded", () => {
  const settings = resolveCursorBackgroundConfig({
    VITE_CURSOR_BACKGROUND_INTENSITY: 140,
    VITE_CURSOR_BACKGROUND_RADIUS: 15,
    VITE_CURSOR_BACKGROUND_GRID_GAP: 999,
    VITE_CURSOR_BACKGROUND_NODE_GAP: "nope",
    VITE_CURSOR_BACKGROUND_TRAIL_MS: 0,
    VITE_CURSOR_BACKGROUND_PIXEL_SIZE: 40,
  });
  assert.equal(settings.intensity, 1);
  assert.equal(settings.radius, 120);
  assert.equal(settings.gridGap, 100);
  assert.equal(settings.nodeGap, 84);
  assert.equal(settings.trailMs, 400);
  assert.equal(settings.pixelSize, 32);
});
