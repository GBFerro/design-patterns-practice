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

describe("a recalled item", () => {
  it("is refunded in full, to the original payment method", () => {
    const outcome = processReturn(request({ reason: "recalled", itemPriceCents: 4000 }));
    assert.equal(outcome.refundCents, 4000);
    assert.equal(outcome.refundMethod, "original-payment");
  });

  it("is refunded in full regardless of its condition", () => {
    for (const condition of ["sealed", "opened-good", "opened-damaged"] as const) {
      const outcome = processReturn(
        request({ reason: "recalled", itemPriceCents: 2500, condition }),
      );
      assert.equal(outcome.refundCents, 2500);
    }
  });

  it("caps the refund at 50000 cents for an item priced above that", () => {
    const outcome = processReturn(request({ reason: "recalled", itemPriceCents: 89900 }));
    assert.equal(outcome.refundCents, 50000);
  });

  it("does not cap a recalled item priced at or below 50000 cents", () => {
    const outcome = processReturn(request({ reason: "recalled", itemPriceCents: 50000 }));
    assert.equal(outcome.refundCents, 50000);
  });

  it("still uses the ordinary condition-based restock disposition", () => {
    const outcome = processReturn(
      request({ reason: "recalled", condition: "opened-damaged", itemPriceCents: 3000 }),
    );
    assert.equal(outcome.restockDisposition, "scrap");
  });

  it("still notifies by sms, since the refund method is the original payment method", () => {
    const outcome = processReturn(request({ reason: "recalled", itemPriceCents: 3000 }));
    assert.equal(outcome.notificationChannel, "sms");
  });

  it("applies the same rule inside a bulk batch", () => {
    const [outcome] = processBulkReturns([
      request({ reason: "recalled", itemPriceCents: 120000, condition: "opened-good" }),
    ]);
    assert.equal(outcome?.refundCents, 50000);
    assert.equal(outcome?.refundMethod, "original-payment");
    assert.equal(outcome?.restockDisposition, "restock-open-box");
  });
});
