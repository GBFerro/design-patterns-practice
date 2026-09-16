import assert from "node:assert/strict";
import { test } from "node:test";

import { calculateFare } from "#exercise";

test("a flat fare paid in cash is rounded up to the nearest quarter", () => {
  const result = calculateFare("flat", "cash", 0);
  assert.equal(result.chargedCents, 275);
});

test("a flat fare paid by card adds the card fee", () => {
  const result = calculateFare("flat", "card", 0);
  assert.equal(result.chargedCents, 285);
});

test("a distance fare paid in cash is rate times distance, rounded up to the nearest quarter", () => {
  const result = calculateFare("distance", "cash", 6);
  assert.equal(result.chargedCents, 225);
});

test("a distance fare paid by card is rate times distance, plus the card fee", () => {
  const result = calculateFare("distance", "card", 6);
  assert.equal(result.chargedCents, 220);
});

test("a short distance fare paid in cash never drops below the minimum", () => {
  const result = calculateFare("distance", "cash", 1);
  assert.equal(result.chargedCents, 150);
});

test("a short distance fare paid by card never drops below the minimum, plus the card fee", () => {
  const result = calculateFare("distance", "card", 1);
  assert.equal(result.chargedCents, 160);
});
