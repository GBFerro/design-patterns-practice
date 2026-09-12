import assert from "node:assert/strict";
import { test } from "node:test";

import { startQuote } from "#exercise";

function baseDraft() {
  return startQuote("Rowan Ito", "business-cards", 250, 0.2, "Priya");
}

test("packaging defaults to standard", () => {
  const quote = baseDraft().build();
  assert.equal(quote.packaging, "standard");
});

test("gift-wrap packaging is accepted on its own, with no rush fee", () => {
  const quote = baseDraft().applyPackaging("gift-wrap").build();
  assert.equal(quote.packaging, "gift-wrap");
});

test("a rush fee is accepted on its own, with no gift-wrap packaging", () => {
  const quote = baseDraft().applyRush(15).build();
  assert.equal(quote.rushFee, 15);
});

test("gift-wrap packaging after a rush fee is refused", () => {
  assert.throws(
    () => baseDraft().applyRush(15).applyPackaging("gift-wrap").build(),
    /gift-wrap packaging is not available for rush jobs/,
  );
});

test("a rush fee after gift-wrap packaging is refused too - the rule does not depend on order", () => {
  assert.throws(
    () => baseDraft().applyPackaging("gift-wrap").applyRush(15).build(),
    /gift-wrap packaging is not available for rush jobs/,
  );
});
