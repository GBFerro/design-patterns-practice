import type { ReturnOutcome, ReturnRequest } from "./types.ts";

/**
 * What happens to the physical item — the one thing this route decided was
 * worth pulling out of `processReturn` and `processBulkReturns` both: it is
 * the decision the warehouse floor cares most about getting consistent.
 */
function dispositionFor(
  condition: ReturnRequest["condition"],
): ReturnOutcome["restockDisposition"] {
  if (condition === "sealed") return "restock-new";
  if (condition === "opened-good") return "restock-open-box";
  return "scrap";
}

/**
 * A single return, processed at the counter or through the customer's own
 * self-service flow. Three things have to be decided, none of them simple:
 * how much comes back and by what method, what happens to the physical item,
 * and how the customer hears about it.
 */
export function processReturn(request: ReturnRequest): ReturnOutcome {
  let refundCents: number;
  let refundMethod: ReturnOutcome["refundMethod"];

  if (request.reason === "defective") {
    refundCents = request.itemPriceCents;
    refundMethod = "original-payment";
  } else if (request.reason === "wrong-item") {
    refundCents = request.itemPriceCents;
    refundMethod = "original-payment";
  } else {
    refundCents = Math.round(request.itemPriceCents * 0.85);
    refundMethod = "store-credit";
  }

  const restockDisposition = dispositionFor(request.condition);

  const notificationChannel: ReturnOutcome["notificationChannel"] =
    refundMethod === "store-credit" ? "email" : "sms";

  return {
    returnId: request.returnId,
    refundCents,
    refundMethod,
    restockDisposition,
    notificationChannel,
  };
}

/**
 * The nightly batch: every return the warehouse scanned in during the day,
 * processed in one pass so the finance export can run once instead of once
 * per return. Same three decisions, same rules — this just has more than
 * one request to make them for.
 */
export function processBulkReturns(
  requests: readonly ReturnRequest[],
): readonly ReturnOutcome[] {
  const outcomes: ReturnOutcome[] = [];

  for (const request of requests) {
    let refundCents: number;
    let refundMethod: ReturnOutcome["refundMethod"];

    if (request.reason === "defective") {
      refundCents = request.itemPriceCents;
      refundMethod = "original-payment";
    } else if (request.reason === "wrong-item") {
      refundCents = request.itemPriceCents;
      refundMethod = "original-payment";
    } else {
      refundCents = Math.round(request.itemPriceCents * 0.85);
      refundMethod = "store-credit";
    }

    const restockDisposition = dispositionFor(request.condition);

    const notificationChannel: ReturnOutcome["notificationChannel"] =
      refundMethod === "store-credit" ? "email" : "sms";

    outcomes.push({
      returnId: request.returnId,
      refundCents,
      refundMethod,
      restockDisposition,
      notificationChannel,
    });
  }

  return outcomes;
}
