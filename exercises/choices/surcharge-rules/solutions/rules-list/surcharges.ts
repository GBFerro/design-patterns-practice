import type { Shipment } from "./types.ts";

const OVERSIZE_THRESHOLD_CM = 150;

function isOversize(shipment: Shipment): boolean {
  return (
    shipment.lengthCm > OVERSIZE_THRESHOLD_CM ||
    shipment.widthCm > OVERSIZE_THRESHOLD_CM ||
    shipment.heightCm > OVERSIZE_THRESHOLD_CM
  );
}

/**
 * One surcharge, in the order it's applied. `amount` receives every surcharge already
 * computed earlier in the list, keyed by id - so a rule can depend on the rules before it.
 */
export interface SurchargeRule {
  readonly id: "fuel" | "remoteArea" | "oversize";
  amount(shipment: Shipment, soFar: Readonly<Record<string, number>>): number;
}

export const SURCHARGE_RULES: readonly SurchargeRule[] = [
  { id: "fuel", amount: (shipment) => Math.round(shipment.baseRateCents * 0.12) },
  {
    id: "remoteArea",
    amount: (shipment) => (shipment.destination === "remote" ? 1500 : 0),
  },
  { id: "oversize", amount: (shipment) => (isOversize(shipment) ? 2000 : 0) },
];
