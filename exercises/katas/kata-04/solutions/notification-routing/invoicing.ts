import type { Invoice, InvoiceLine, Order } from "./types.ts";

const LARGE_ORDER_THRESHOLD_CENTS = 100_000;

/**
 * Which channels need to hear about an invoice of this total - pulled out
 * of both `finalizeInvoice` and `finalizeInvoiceBatch`: it's the rule most
 * likely to gain a new threshold or a new channel next.
 */
function notifiedChannelsFor(totalCents: number): string[] {
  const notifiedChannels: string[] = ["accounting-ledger"];
  if (totalCents > LARGE_ORDER_THRESHOLD_CENTS) {
    notifiedChannels.push("large-order-desk");
  }
  return notifiedChannels;
}

/**
 * Turn a completed order into its invoice: build each line, add the
 * surcharges that apply, and notify whichever channels this total requires.
 */
export function finalizeInvoice(order: Order): Invoice {
  // creation
  const lines: InvoiceLine[] = order.lines.map((line) => {
    if (line.kind === "standard") {
      return { sku: line.sku, totalCents: line.quantity * line.unitPriceCents };
    }
    if (line.kind === "bundle") {
      return { sku: line.sku, totalCents: Math.round(line.quantity * line.unitPriceCents * 0.9) };
    }
    return { sku: line.sku, totalCents: line.unitPriceCents };
  });
  const subtotalCents = lines.reduce((sum, l) => sum + l.totalCents, 0);

  // variation
  let surchargeCents = 0;
  if (order.isRemoteArea) {
    surchargeCents += 500;
  }
  if (order.isOversized) {
    surchargeCents += Math.round(subtotalCents * 0.03);
  }

  const totalCents = subtotalCents + surchargeCents;

  return { orderId: order.orderId, lines, subtotalCents, surchargeCents, totalCents, notifiedChannels: notifiedChannelsFor(totalCents) };
}

/**
 * The nightly reconciliation pass: every order finalized since the last
 * run, invoiced in one sweep. Same rules, order by order, as
 * `finalizeInvoice`.
 */
export function finalizeInvoiceBatch(orders: readonly Order[]): readonly Invoice[] {
  const invoices: Invoice[] = [];

  for (const order of orders) {
    // creation
    const lines: InvoiceLine[] = order.lines.map((line) => {
      if (line.kind === "standard") {
        return { sku: line.sku, totalCents: line.quantity * line.unitPriceCents };
      }
      if (line.kind === "bundle") {
        return { sku: line.sku, totalCents: Math.round(line.quantity * line.unitPriceCents * 0.9) };
      }
      return { sku: line.sku, totalCents: line.unitPriceCents };
    });
    const subtotalCents = lines.reduce((sum, l) => sum + l.totalCents, 0);

    // variation
    let surchargeCents = 0;
    if (order.isRemoteArea) {
      surchargeCents += 500;
    }
    if (order.isOversized) {
      surchargeCents += Math.round(subtotalCents * 0.03);
    }

    const totalCents = subtotalCents + surchargeCents;

    invoices.push({
      orderId: order.orderId,
      lines,
      subtotalCents,
      surchargeCents,
      totalCents,
      notifiedChannels: notifiedChannelsFor(totalCents),
    });
  }

  return invoices;
}
