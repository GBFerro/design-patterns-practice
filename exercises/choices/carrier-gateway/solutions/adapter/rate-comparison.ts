import { gateways } from "./registry.ts";
import type { CarrierId, CarrierRate } from "./types.ts";

export function compareRates(
  carrierIds: readonly CarrierId[],
  originZip: string,
  destZip: string,
  weightKg: number,
): CarrierRate[] {
  return carrierIds.map((carrierId) =>
    gateways[carrierId].rate(originZip, destZip, weightKg),
  );
}
