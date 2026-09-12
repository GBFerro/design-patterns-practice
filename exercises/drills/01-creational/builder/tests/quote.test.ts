import assert from "node:assert/strict";
import { test } from "node:test";

import { startQuote } from "#exercise";

function baseDraft() {
  return startQuote("Rowan Ito", "business-cards", 250, 0.2, "Priya");
}

test("no optional stage called at all produces a quote with all defaults applied", () => {
  const quote = baseDraft().build();
  assert.equal(quote.rushFee, 0);
  assert.equal(quote.discountPercent, 0);
  assert.equal(quote.proofRequired, false);
  assert.equal(quote.deliveryMethod, "pickup");
  assert.equal(quote.totalCost, 50);
});

test("a discount lowers the total cost", () => {
  const quote = baseDraft().applyDiscount(10).build();
  assert.equal(quote.totalCost, 45);
});

test("a rush fee is added on top of the base cost", () => {
  const quote = baseDraft().applyRush(15).build();
  assert.equal(quote.totalCost, 65);
});

test("a discount after a rush fee is refused", () => {
  assert.throws(
    () => baseDraft().applyRush(15).applyDiscount(10).build(),
    /rush job cannot also receive a discount/,
  );
});

test("a rush fee after a discount is refused too - the rule does not depend on order", () => {
  assert.throws(
    () => baseDraft().applyDiscount(10).applyRush(15).build(),
    /rush job cannot also receive a discount/,
  );
});

test("courier delivery is available for large enough orders", () => {
  const quote = startQuote("Rowan Ito", "business-cards", 100, 0.2, "Priya")
    .setDeliveryMethod("courier")
    .build();
  assert.equal(quote.deliveryMethod, "courier");
});

test("courier delivery is refused for small orders", () => {
  assert.throws(
    () =>
      startQuote("Rowan Ito", "business-cards", 10, 0.2, "Priya").setDeliveryMethod("courier").build(),
    /courier delivery is not available/,
  );
});

test("a proof requirement is recorded as given", () => {
  const quote = baseDraft().setProofRequired(true).build();
  assert.equal(quote.proofRequired, true);
});

test("every required field is carried through unchanged", () => {
  const quote = baseDraft().build();
  assert.equal(quote.customerName, "Rowan Ito");
  assert.equal(quote.jobKind, "business-cards");
  assert.equal(quote.quantity, 250);
  assert.equal(quote.baseUnitCost, 0.2);
  assert.equal(quote.quotedBy, "Priya");
});

test("build can be called straight off the opening draft, with no optional stage at all", () => {
  assert.doesNotThrow(() => baseDraft().build());
});
