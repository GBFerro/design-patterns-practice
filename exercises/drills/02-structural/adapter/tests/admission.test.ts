import assert from "node:assert/strict";
import { test } from "node:test";

import { admitLegacyPassenger, admitPassenger } from "#exercise";
import type { FareRead, FareReader, LegacyCardScanner, LegacyScanResult } from "#exercise";

function modernReader(read: FareRead | null): FareReader {
  return { readFare: () => read };
}

function legacyScanner(result: LegacyScanResult): LegacyCardScanner {
  return { scanCard: () => result };
}

test("a modern reader with enough balance is admitted", () => {
  const result = admitPassenger(modernReader({ cardId: "MOD-1", balanceCents: 1000 }));
  assert.equal(result.admitted, true);
  assert.equal(result.remainingBalanceCents, 725);
});

test("a modern reader with no card presented is refused", () => {
  const result = admitPassenger(modernReader(null));
  assert.equal(result.admitted, false);
  assert.equal(result.reason, "no card presented");
});

test("a modern reader with too little balance is refused", () => {
  const result = admitPassenger(modernReader({ cardId: "MOD-2", balanceCents: 100 }));
  assert.equal(result.admitted, false);
  assert.equal(result.reason, "insufficient balance");
});

test("a legacy scanner with enough balance is admitted, dollars converted to cents", () => {
  const result = admitLegacyPassenger(legacyScanner({ status: "ok", cardNumber: "LEG-1", balanceDollars: 10 }));
  assert.equal(result.admitted, true);
  assert.equal(result.remainingBalanceCents, 725);
});

test("a legacy scanner reporting no card is refused", () => {
  const result = admitLegacyPassenger(legacyScanner({ status: "no-card" }));
  assert.equal(result.admitted, false);
  assert.equal(result.reason, "no card presented");
});

test("a legacy scanner with too little balance is refused", () => {
  const result = admitLegacyPassenger(legacyScanner({ status: "ok", cardNumber: "LEG-2", balanceDollars: 1 }));
  assert.equal(result.admitted, false);
  assert.equal(result.reason, "insufficient balance");
});
