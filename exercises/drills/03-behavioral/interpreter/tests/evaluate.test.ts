import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateConstraint, type SkyContext } from "#exercise";

const baseContext: SkyContext = {
  altitudeDegrees: 45,
  moonPhase: 0.2,
  seeingArcsec: 1.8,
  civilTwilightOver: true,
  domeOpen: true,
  clear: true,
};

test("a single comparison above the threshold passes", () => {
  assert.equal(evaluateConstraint("altitude > 30", baseContext), true);
});

test("a single comparison at or below the threshold fails", () => {
  assert.equal(evaluateConstraint("altitude > 60", baseContext), false);
});

test("a less-than comparison reads the right direction", () => {
  assert.equal(evaluateConstraint("moon_phase < 0.3", baseContext), true);
  assert.equal(evaluateConstraint("moon_phase < 0.1", baseContext), false);
});

test("two comparisons joined by && both have to pass", () => {
  assert.equal(evaluateConstraint("altitude > 30 && moon_phase < 0.3", baseContext), true);
  assert.equal(evaluateConstraint("altitude > 30 && moon_phase < 0.1", baseContext), false);
});

test("three clauses joined by && all have to pass", () => {
  const expression = "altitude > 30 && moon_phase < 0.3 && seeing < 2.5";
  assert.equal(evaluateConstraint(expression, baseContext), true);
  assert.equal(evaluateConstraint(expression, { ...baseContext, seeingArcsec: 3.0 }), false);
});

test("civil_twilight_over reads the matching flag off the context", () => {
  assert.equal(evaluateConstraint("civil_twilight_over", baseContext), true);
  assert.equal(evaluateConstraint("civil_twilight_over", { ...baseContext, civilTwilightOver: false }), false);
});

test("dome_open reads the matching flag off the context", () => {
  assert.equal(evaluateConstraint("dome_open", { ...baseContext, domeOpen: false }), false);
});

test("clear reads the matching flag off the context", () => {
  assert.equal(evaluateConstraint("clear", { ...baseContext, clear: false }), false);
});

test("a flag and a comparison combine with &&", () => {
  const expression = "dome_open && altitude > 30";
  assert.equal(evaluateConstraint(expression, baseContext), true);
  assert.equal(evaluateConstraint(expression, { ...baseContext, domeOpen: false }), false);
});

test("surrounding whitespace around clauses and operators is tolerated", () => {
  assert.equal(evaluateConstraint("  altitude   >   30   &&   clear  ", baseContext), true);
});

test("an unknown field throws rather than silently passing", () => {
  assert.throws(() => evaluateConstraint("humidity > 50", baseContext));
});
