import test from "node:test";
import assert from "node:assert/strict";
import { gravityDotsConfig, resolveGravityDotsConfig } from "../src/v2/config/setenv.js";

test("gravity dots exposes the two intended defaults", () => {
  assert.deepEqual(resolveGravityDotsConfig(), { energy: 74, radius: 225 });
  assert.equal(typeof gravityDotsConfig.energy, "number");
  assert.equal(typeof gravityDotsConfig.radius, "number");
});

test("valid env overrides configure energy and radius", () => {
  assert.deepEqual(resolveGravityDotsConfig({
    VITE_GRAVITY_DOTS_ENERGY: "92",
    VITE_GRAVITY_DOTS_RADIUS: "330",
  }), { energy: 92, radius: 330 });
});

test("invalid or missing values fall back to safe defaults", () => {
  assert.deepEqual(resolveGravityDotsConfig({
    VITE_GRAVITY_DOTS_ENERGY: "",
    VITE_GRAVITY_DOTS_RADIUS: "not a number",
  }), { energy: 74, radius: 225 });
  assert.deepEqual(resolveGravityDotsConfig({
    VITE_GRAVITY_DOTS_ENERGY: "Infinity",
    VITE_GRAVITY_DOTS_RADIUS: "NaN",
  }), { energy: 74, radius: 225 });
});

test("env overrides are clamped to supported ranges", () => {
  assert.deepEqual(resolveGravityDotsConfig({
    VITE_GRAVITY_DOTS_ENERGY: "-15",
    VITE_GRAVITY_DOTS_RADIUS: "5000",
  }), { energy: 0, radius: 480 });
  assert.deepEqual(resolveGravityDotsConfig({
    VITE_GRAVITY_DOTS_ENERGY: "150",
    VITE_GRAVITY_DOTS_RADIUS: "9",
  }), { energy: 100, radius: 60 });
});
