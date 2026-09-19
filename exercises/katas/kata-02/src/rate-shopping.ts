import type { CarrierQuote, RateDecision, ShipmentRequest, SpeedTier } from "./types.ts";

function speedRank(tier: SpeedTier): number {
  if (tier === "standard") return 0;
  if (tier === "expedited") return 1;
  return 2;
}

/**
 * Every carrier that quoted a shipment, narrowed down to the one Ravensgate
 * actually books: eligible by zone, eligible by weight, fast enough, and
 * cheapest after each carrier's own negotiated discount. Ties go to whichever
 * eligible quote came first in `quotes`.
 */
export function pickCheapestCarrier(
  request: ShipmentRequest,
  quotes: readonly CarrierQuote[],
): RateDecision {
  let bestCarrierId: RateDecision["winningCarrierId"] | undefined;
  let bestTotalCents = 0;

  for (const quote of quotes) {
    let zoneOk: boolean;
    if (quote.carrierId === "ravenex") {
      zoneOk = request.destinationZone !== "international";
    } else if (quote.carrierId === "skyfreight") {
      zoneOk = true;
    } else {
      zoneOk =
        request.destinationZone === "local" || request.destinationZone === "regional";
    }
    if (!zoneOk) continue;

    let maxWeightKg: number;
    if (quote.carrierId === "ravenex") {
      maxWeightKg = 40;
    } else if (quote.carrierId === "skyfreight") {
      maxWeightKg = 100;
    } else {
      maxWeightKg = 25;
    }
    if (request.weightKg > maxWeightKg) continue;

    if (speedRank(quote.speedTier) < speedRank(request.requiredSpeedTier)) continue;

    let discountRate: number;
    if (quote.carrierId === "ravenex") {
      discountRate = 0.1;
    } else if (quote.carrierId === "skyfreight") {
      discountRate = 0.05;
    } else {
      discountRate = 0;
    }
    const totalCents = Math.round(quote.baseCents * (1 - discountRate));

    if (bestCarrierId === undefined || totalCents < bestTotalCents) {
      bestCarrierId = quote.carrierId;
      bestTotalCents = totalCents;
    }
  }

  if (bestCarrierId === undefined) {
    throw new Error(`no eligible carrier for shipment ${request.shipmentId}`);
  }

  return {
    shipmentId: request.shipmentId,
    winningCarrierId: bestCarrierId,
    totalCents: bestTotalCents,
  };
}

/**
 * The overnight rate shop: every shipment queued since the last run, matched
 * against the quotes fetched for it, decided in one pass. Same rules,
 * shipment by shipment, as `pickCheapestCarrier`.
 */
export function pickCheapestForBatch(
  requests: readonly ShipmentRequest[],
  quotesByShipment: ReadonlyMap<string, readonly CarrierQuote[]>,
): readonly RateDecision[] {
  const decisions: RateDecision[] = [];

  for (const request of requests) {
    const quotes = quotesByShipment.get(request.shipmentId) ?? [];
    let bestCarrierId: RateDecision["winningCarrierId"] | undefined;
    let bestTotalCents = 0;

    for (const quote of quotes) {
      let zoneOk: boolean;
      if (quote.carrierId === "ravenex") {
        zoneOk = request.destinationZone !== "international";
      } else if (quote.carrierId === "skyfreight") {
        zoneOk = true;
      } else {
        zoneOk =
          request.destinationZone === "local" || request.destinationZone === "regional";
      }
      if (!zoneOk) continue;

      let maxWeightKg: number;
      if (quote.carrierId === "ravenex") {
        maxWeightKg = 40;
      } else if (quote.carrierId === "skyfreight") {
        maxWeightKg = 100;
      } else {
        maxWeightKg = 25;
      }
      if (request.weightKg > maxWeightKg) continue;

      if (speedRank(quote.speedTier) < speedRank(request.requiredSpeedTier)) continue;

      let discountRate: number;
      if (quote.carrierId === "ravenex") {
        discountRate = 0.1;
      } else if (quote.carrierId === "skyfreight") {
        discountRate = 0.05;
      } else {
        discountRate = 0;
      }
      const totalCents = Math.round(quote.baseCents * (1 - discountRate));

      if (bestCarrierId === undefined || totalCents < bestTotalCents) {
        bestCarrierId = quote.carrierId;
        bestTotalCents = totalCents;
      }
    }

    if (bestCarrierId === undefined) {
      throw new Error(`no eligible carrier for shipment ${request.shipmentId}`);
    }

    decisions.push({
      shipmentId: request.shipmentId,
      winningCarrierId: bestCarrierId,
      totalCents: bestTotalCents,
    });
  }

  return decisions;
}
