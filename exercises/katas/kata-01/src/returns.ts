import type { ReturnOutcome, ReturnRequest } from "./types.ts";

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

  let restockDisposition: ReturnOutcome["restockDisposition"];
  if (request.condition === "sealed") {
    restockDisposition = "restock-new";
  } else if (request.condition === "opened-good") {
    restockDisposition = "restock-open-box";
  } else {
    restockDisposition = "scrap";
  }

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

    let restockDisposition: ReturnOutcome["restockDisposition"];
    if (request.condition === "sealed") {
      restockDisposition = "restock-new";
    } else if (request.condition === "opened-good") {
      restockDisposition = "restock-open-box";
    } else {
      restockDisposition = "scrap";
    }

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
