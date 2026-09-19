import type { Shipment } from "./types.ts";

const OVERSIZE_THRESHOLD_CM = 150;

function isOversize(shipment: Shipment): boolean {
  return (
    shipment.lengthCm > OVERSIZE_THRESHOLD_CM ||
    shipment.widthCm > OVERSIZE_THRESHOLD_CM ||
    shipment.heightCm > OVERSIZE_THRESHOLD_CM
  );
}

/** One entry per surcharge - a pure function from the shipment alone to its amount. */
export const SURCHARGE_TABLE: Record<
  "fuel" | "remoteArea" | "oversize",
  (shipment: Shipment) => number
> = {
  fuel: (shipment) => Math.round(shipment.baseRateCents * 0.12),
  remoteArea: (shipment) => (shipment.destination === "remote" ? 1500 : 0),
  oversize: (shipment) => (isOversize(shipment) ? 2000 : 0),
};
