/** How the base fare is computed before any payment medium touches it. */
export type FarePolicyKind = "flat" | "distance";

/** How a computed base fare turns into an actual charge. */
export type PaymentMediumKind = "cash" | "card";

export interface FareResult {
  chargedCents: number;
}
