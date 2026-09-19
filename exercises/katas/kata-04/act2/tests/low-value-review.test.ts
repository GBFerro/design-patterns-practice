import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { finalizeInvoice, finalizeInvoiceBatch } from "#exercise";
import type { Order, OrderLine } from "#exercise";

function line(overrides: Partial<OrderLine> = {}): OrderLine {
  return { kind: "standard", sku: "SKU-1", quantity: 1, unitPriceCents: 1000, ...overrides };
}

function order(overrides: Partial<Order> = {}): Order {
  return { orderId: "O-1", lines: [line()], isRemoteArea: false, isOversized: false, ...overrides };
}

describe("low-value invoices need a review flag", () => {
  it("notifies low-value-review for an invoice under 500 cents", () => {
    const invoice = finalizeInvoice(order({ lines: [line({ unitPriceCents: 499 })] }));
    assert.ok(invoice.notifiedChannels.includes("low-value-review"));
  });

  it("does not notify low-value-review at exactly 500 cents", () => {
    const invoice = finalizeInvoice(order({ lines: [line({ unitPriceCents: 500 })] }));
    assert.ok(!invoice.notifiedChannels.includes("low-value-review"));
  });

  it("still notifies accounting-ledger on a low-value invoice", () => {
    const invoice = finalizeInvoice(order({ lines: [line({ unitPriceCents: 100 })] }));
    assert.ok(invoice.notifiedChannels.includes("accounting-ledger"));
  });

  it("does not notify low-value-review on a large order", () => {
    const invoice = finalizeInvoice(order({ lines: [line({ unitPriceCents: 200_000 })] }));
    assert.ok(!invoice.notifiedChannels.includes("low-value-review"));
    assert.ok(invoice.notifiedChannels.includes("large-order-desk"));
  });

  it("leaves line construction and surcharges unaffected", () => {
    const invoice = finalizeInvoice(
      order({ lines: [line({ kind: "bundle", quantity: 2, unitPriceCents: 100 })], isRemoteArea: true }),
    );
    assert.equal(invoice.lines[0]?.totalCents, 180);
    assert.equal(invoice.surchargeCents, 500);
  });

  it("applies inside a batch too", () => {
    const [invoice] = finalizeInvoiceBatch([order({ lines: [line({ unitPriceCents: 200 })] })]);
    assert.ok(invoice?.notifiedChannels.includes("low-value-review"));
  });
});
