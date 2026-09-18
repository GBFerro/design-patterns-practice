import assert from "node:assert/strict";
import { test } from "node:test";

import { checkoutRate, compareRates } from "#exercise";

test("maps Northbridge's shape to the common rate", () => {
  const rate = checkoutRate("northbridge", "10001", "10001", 5);
  assert.deepEqual(rate, { cents: 790, etaDays: 3 });
});

test("maps Aerolane's shape to the common rate", () => {
  const rate = checkoutRate("aerolane", "10001", "10001", 5);
  assert.deepEqual(rate, { cents: 880, etaDays: 2 });
});

test("maps Coastal's pipe-delimited shape to the common rate", () => {
  const rate = checkoutRate("coastal", "10001", "10001", 5);
  assert.deepEqual(rate, { cents: 745, etaDays: 3 });
});

test("distance affects the rate, not just weight", () => {
  const rate = checkoutRate("northbridge", "10001", "10050", 5);
  assert.deepEqual(rate, { cents: 802, etaDays: 3 });
});

test("a heavy shipment crosses Northbridge's transit-day threshold", () => {
  const rate = checkoutRate("northbridge", "10001", "10001", 25);
  assert.deepEqual(rate, { cents: 2030, etaDays: 5 });
});

test("compareRates and checkoutRate agree, carrier by carrier", () => {
  const carriers = ["northbridge", "aerolane", "coastal"] as const;
  const compared = compareRates(carriers, "10001", "10038", 12);
  for (const [index, carrierId] of carriers.entries()) {
    assert.deepEqual(compared[index], checkoutRate(carrierId, "10001", "10038", 12));
  }
});

test("compareRates preserves the order it was asked for", () => {
  const rates = compareRates(["coastal", "northbridge"], "10001", "10001", 5);
  assert.equal(rates.length, 2);
  assert.deepEqual(rates[0], { cents: 745, etaDays: 3 });
  assert.deepEqual(rates[1], { cents: 790, etaDays: 3 });
});
