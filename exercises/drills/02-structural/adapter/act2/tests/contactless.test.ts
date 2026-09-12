import assert from "node:assert/strict";
import { test } from "node:test";

import { admitContactlessPassenger } from "#exercise";
import type { ContactlessReader } from "#exercise";

function contactlessReader(polled: string | undefined): ContactlessReader {
  return { poll: () => polled };
}

test("a contactless reader with enough balance is admitted", () => {
  const result = admitContactlessPassenger(contactlessReader("CARD-777,1000"));
  assert.equal(result.admitted, true);
  assert.equal(result.remainingBalanceCents, 725);
});

test("a contactless reader with nothing polled is refused", () => {
  const result = admitContactlessPassenger(contactlessReader(undefined));
  assert.equal(result.admitted, false);
  assert.equal(result.reason, "no card presented");
});

test("a contactless reader with too little balance is refused", () => {
  const result = admitContactlessPassenger(contactlessReader("CARD-778,100"));
  assert.equal(result.admitted, false);
  assert.equal(result.reason, "insufficient balance");
});
