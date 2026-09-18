import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { carrierCallCount, checkoutRate, compareRates, resetCarrierCalls } from "#exercise";

// resetCarrierCalls only zeroes the call counter, not the cache itself (the
// cache is exactly what act 2 is testing exists) - so each test below uses
// its own zip/weight combination, never reused elsewhere in this file, to
// keep every "this should be a cache miss" assertion honest.
beforeEach(() => {
  resetCarrierCalls();
});

test("an identical repeated request calls the carrier once, not twice", () => {
  const first = checkoutRate("northbridge", "10001", "10001", 5);
  const second = checkoutRate("northbridge", "10001", "10001", 5);
  assert.deepEqual(first, second);
  assert.equal(carrierCallCount("northbridge"), 1);
});

test("a different weight is a cache miss", () => {
  checkoutRate("aerolane", "10001", "10001", 7);
  checkoutRate("aerolane", "10001", "10001", 8);
  assert.equal(carrierCallCount("aerolane"), 2);
});

test("a different destination is a cache miss", () => {
  checkoutRate("coastal", "10001", "10001", 9);
  checkoutRate("coastal", "10001", "10077", 9);
  assert.equal(carrierCallCount("coastal"), 2);
});

test("the same route and weight on two different carriers are two separate calls", () => {
  checkoutRate("northbridge", "10010", "10010", 11);
  checkoutRate("aerolane", "10010", "10010", 11);
  assert.equal(carrierCallCount("northbridge"), 1);
  assert.equal(carrierCallCount("aerolane"), 1);
});

test("compareRates benefits from a cache checkoutRate already warmed", () => {
  checkoutRate("northbridge", "10020", "10020", 13);
  compareRates(["northbridge", "aerolane"], "10020", "10020", 13);
  assert.equal(carrierCallCount("northbridge"), 1);
  assert.equal(carrierCallCount("aerolane"), 1);
});

test("results stay correct after a cache hit", () => {
  checkoutRate("northbridge", "10001", "10001", 5);
  const cached = checkoutRate("northbridge", "10001", "10001", 5);
  assert.deepEqual(cached, { cents: 790, etaDays: 3 });
});
