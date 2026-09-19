import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { processBulkReturns, processReturn } from "#exercise";
import type { ReturnRequest } from "#exercise";

function request(overrides: Partial<ReturnRequest> = {}): ReturnRequest {
  return {
    returnId: "R-1",
    orderId: "O-1",
    itemSku: "SKU-1",
    itemPriceCents: 4000,
    reason: "defective",
    condition: "sealed",
    ...overrides,
  };
}

describe("processReturn", () => {
  it("refunds a defective item in full, to the original payment method", () => {
    const outcome = processReturn(request({ reason: "defective", itemPriceCents: 4000 }));
    assert.equal(outcome.refundCents, 4000);
    assert.equal(outcome.refundMethod, "original-payment");
  });

  it("refunds a wrong-item return in full, to the original payment method", () => {
    const outcome = processReturn(
      request({ reason: "wrong-item", itemPriceCents: 6000 }),
    );
    assert.equal(outcome.refundCents, 6000);
    assert.equal(outcome.refundMethod, "original-payment");
  });

  it("refunds a changed-mind return as store credit, minus a 15% restocking fee", () => {
    const outcome = processReturn(
      request({ reason: "changed-mind", itemPriceCents: 4000 }),
    );
    assert.equal(outcome.refundCents, 3400);
    assert.equal(outcome.refundMethod, "store-credit");
  });

  it("restocks a sealed item as new", () => {
    const outcome = processReturn(request({ condition: "sealed" }));
    assert.equal(outcome.restockDisposition, "restock-new");
  });

  it("restocks an opened-but-good item as open-box", () => {
    const outcome = processReturn(request({ condition: "opened-good" }));
    assert.equal(outcome.restockDisposition, "restock-open-box");
  });

  it("scraps a damaged item", () => {
    const outcome = processReturn(request({ condition: "opened-damaged" }));
    assert.equal(outcome.restockDisposition, "scrap");
  });

  it("notifies by email when the refund is store credit", () => {
    const outcome = processReturn(request({ reason: "changed-mind" }));
    assert.equal(outcome.notificationChannel, "email");
  });

  it("notifies by sms when the refund goes to the original payment method", () => {
    const outcome = processReturn(request({ reason: "defective" }));
    assert.equal(outcome.notificationChannel, "sms");
  });

  it("carries the returnId through untouched", () => {
    const outcome = processReturn(request({ returnId: "R-42" }));
    assert.equal(outcome.returnId, "R-42");
  });
});

describe("processBulkReturns", () => {
  it("processes every request in the batch, in order", () => {
    const outcomes = processBulkReturns([
      request({ returnId: "R-1", reason: "defective", itemPriceCents: 1000 }),
      request({
        returnId: "R-2",
        reason: "changed-mind",
        itemPriceCents: 1000,
        condition: "opened-good",
      }),
    ]);
    assert.equal(outcomes.length, 2);
    assert.equal(outcomes[0]?.returnId, "R-1");
    assert.equal(outcomes[0]?.refundCents, 1000);
    assert.equal(outcomes[1]?.returnId, "R-2");
    assert.equal(outcomes[1]?.refundCents, 850);
    assert.equal(outcomes[1]?.restockDisposition, "restock-open-box");
  });

  it("agrees with processReturn on every field, for the same request", () => {
    const single = processReturn(
      request({ reason: "changed-mind", condition: "opened-damaged" }),
    );
    const [bulk] = processBulkReturns([
      request({ reason: "changed-mind", condition: "opened-damaged" }),
    ]);
    assert.deepEqual(bulk, single);
  });

  it("returns an empty array for an empty batch", () => {
    assert.deepEqual(processBulkReturns([]), []);
  });
});
