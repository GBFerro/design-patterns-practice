import { DistanceFarePolicy, FlatFarePolicy, type FarePolicy } from "./fare-policy.ts";
import { CardPayment, CashPayment, type PaymentMedium } from "./payment-medium.ts";
import type { FarePolicyKind, FareResult, PaymentMediumKind } from "./types.ts";

const MEDIA: Record<PaymentMediumKind, () => PaymentMedium> = {
  cash: () => new CashPayment(),
  card: () => new CardPayment(),
};

const POLICIES: Record<FarePolicyKind, (medium: PaymentMedium) => FarePolicy> = {
  flat: (medium) => new FlatFarePolicy(medium),
  distance: (medium) => new DistanceFarePolicy(medium),
};

/** Any fare policy works with any payment medium - nothing here is
 *  multiplied together, so a new policy or a new medium is one new
 *  entry in one of the two tables above. */
export function calculateFare(
  policyKind: FarePolicyKind,
  mediumKind: PaymentMediumKind,
  measure: number,
): FareResult {
  const medium = MEDIA[mediumKind]();
  const policy = POLICIES[policyKind](medium);
  return policy.calculate(measure);
}
