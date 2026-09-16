import assert from "node:assert/strict";
import { test } from "node:test";

import { calculateFare } from "#exercise";

test("a senior fare is the base fare minus a flat 50 cents", () => {
  const result = calculateFare({
    isStudent: false,
    isOffPeak: false,
    isGroupCapped: false,
    isSenior: true,
  });
  assert.equal(result, 225);
});

test("a senior student fare applies the flat discount before the percentage", () => {
  const result = calculateFare({
    isStudent: true,
    isOffPeak: false,
    isGroupCapped: false,
    isSenior: true,
  });
  assert.equal(result, 113);
});

test("all four modifiers stack, senior before student", () => {
  const result = calculateFare({
    isStudent: true,
    isOffPeak: true,
    isGroupCapped: true,
    isSenior: true,
  });
  assert.equal(result, 90);
});
