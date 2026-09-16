import type { FarePolicyKind, FareResult, PaymentMediumKind } from "./types.ts";

const FLAT_BASE_CENTS = 275;
const DISTANCE_RATE_CENTS_PER_KM = 35;
const DISTANCE_MIN_CENTS = 150;

/** Cash machines only accept quarters - round up to the nearest 25 cents. */
function roundUpToQuarter(cents: number): number {
  return Math.ceil(cents / 25) * 25;
}

class FlatCashFare {
  calculate(): FareResult {
    return { chargedCents: roundUpToQuarter(FLAT_BASE_CENTS) };
  }
}

class FlatCardFare {
  calculate(): FareResult {
    return { chargedCents: FLAT_BASE_CENTS + 10 };
  }
}

class DistanceCashFare {
  calculate(measure: number): FareResult {
    const base = Math.max(DISTANCE_MIN_CENTS, Math.round(measure * DISTANCE_RATE_CENTS_PER_KM));
    return { chargedCents: roundUpToQuarter(base) };
  }
}

class DistanceCardFare {
  calculate(measure: number): FareResult {
    const base = Math.max(DISTANCE_MIN_CENTS, Math.round(measure * DISTANCE_RATE_CENTS_PER_KM));
    return { chargedCents: base + 10 };
  }
}

/** One fare policy, one payment medium: four combinations today, each its
 *  own class, because nothing in this file lets a policy and a medium mix
 *  and match on their own. */
export function calculateFare(
  policyKind: FarePolicyKind,
  mediumKind: PaymentMediumKind,
  measure: number,
): FareResult {
  if (policyKind === "flat" && mediumKind === "cash") return new FlatCashFare().calculate();
  if (policyKind === "flat" && mediumKind === "card") return new FlatCardFare().calculate();
  if (policyKind === "distance" && mediumKind === "cash") return new DistanceCashFare().calculate(measure);
  if (policyKind === "distance" && mediumKind === "card") return new DistanceCardFare().calculate(measure);
  throw new Error(`no fare rule for ${policyKind}/${mediumKind}`);
}
