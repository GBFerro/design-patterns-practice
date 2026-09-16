import assert from "node:assert/strict";
import { test } from "node:test";

import { calculateFare } from "#exercise";

test("a zone fare paid in cash is rate times zones, rounded up to the nearest quarter", () => {
  const result = calculateFare("zone", "cash", 3);
  assert.equal(result.chargedCents, 275);
});

test("a zone fare paid by card is rate times zones, plus the card fee", () => {
  const result = calculateFare("zone", "card", 3);
  assert.equal(result.chargedCents, 280);
});

test("a one-zone fare never drops below the two-zone minimum", () => {
  const result = calculateFare("zone", "cash", 1);
  assert.equal(result.chargedCents, 200);
});

test("a flat fare paid by transit pass gets the pass discount", () => {
  const result = calculateFare("flat", "pass", 0);
  assert.equal(result.chargedCents, 248);
});

test("a distance fare paid by transit pass gets the pass discount", () => {
  const result = calculateFare("distance", "pass", 6);
  assert.equal(result.chargedCents, 189);
});

test("a zone fare paid by transit pass gets the pass discount", () => {
  const result = calculateFare("zone", "pass", 3);
  assert.equal(result.chargedCents, 243);
});
