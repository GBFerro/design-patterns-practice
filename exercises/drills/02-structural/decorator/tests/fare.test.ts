import assert from "node:assert/strict";
import { test } from "node:test";

import { calculateFare } from "#exercise";

test("a fare with no modifiers is the base fare", () => {
  const result = calculateFare({
    isStudent: false,
    isOffPeak: false,
    isGroupCapped: false,
  });
  assert.equal(result, 275);
});

test("a student fare is half the base fare", () => {
  const result = calculateFare({
    isStudent: true,
    isOffPeak: false,
    isGroupCapped: false,
  });
  assert.equal(result, 138);
});

test("an off-peak fare is 80% of the base fare", () => {
  const result = calculateFare({
    isStudent: false,
    isOffPeak: true,
    isGroupCapped: false,
  });
  assert.equal(result, 220);
});

test("a student off-peak fare stacks both discounts", () => {
  const result = calculateFare({
    isStudent: true,
    isOffPeak: true,
    isGroupCapped: false,
  });
  assert.equal(result, 110);
});

test("a group-capped fare never exceeds the group cap", () => {
  const result = calculateFare({
    isStudent: false,
    isOffPeak: false,
    isGroupCapped: true,
  });
  assert.equal(result, 200);
});

test("a group-capped student fare is unaffected when already under the cap", () => {
  const result = calculateFare({
    isStudent: true,
    isOffPeak: false,
    isGroupCapped: true,
  });
  assert.equal(result, 138);
});

test("all three modifiers stack in order", () => {
  const result = calculateFare({ isStudent: true, isOffPeak: true, isGroupCapped: true });
  assert.equal(result, 110);
});
