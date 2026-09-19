import { gateways } from "./registry.ts";
import type { CarrierId, CarrierRate } from "./types.ts";

export function checkoutRate(
  carrierId: CarrierId,
  originZip: string,
  destZip: string,
  weightKg: number,
): CarrierRate {
  return gateways[carrierId].rate(originZip, destZip, weightKg);
}
