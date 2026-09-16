import type { PaymentMedium } from "./payment-medium.ts";
import type { FareResult } from "./types.ts";

const FLAT_BASE_CENTS = 275;
const DISTANCE_RATE_CENTS_PER_KM = 35;
const DISTANCE_MIN_CENTS = 150;

/** Abstraction: how a base fare is computed, bridged to whichever
 *  PaymentMedium it was built with. A policy never names a medium by
 *  type - it only ever calls `chargeFor`. */
export abstract class FarePolicy {
  constructor(protected readonly medium: PaymentMedium) {}

  abstract baseFareCents(measure: number): number;

  calculate(measure: number): FareResult {
    return { chargedCents: this.medium.chargeFor(this.baseFareCents(measure)) };
  }
}

export class FlatFarePolicy extends FarePolicy {
  baseFareCents(): number {
    return FLAT_BASE_CENTS;
  }
}

export class DistanceFarePolicy extends FarePolicy {
  baseFareCents(measure: number): number {
    return Math.max(DISTANCE_MIN_CENTS, Math.round(measure * DISTANCE_RATE_CENTS_PER_KM));
  }
}
