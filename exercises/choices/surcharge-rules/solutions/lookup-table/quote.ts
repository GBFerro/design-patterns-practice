import { SURCHARGE_TABLE } from "./surcharges.ts";
import type { Shipment, SurchargeBreakdown } from "./types.ts";

export function quoteSurcharges(shipment: Shipment): SurchargeBreakdown {
  const fuelCents = SURCHARGE_TABLE.fuel(shipment);
  const remoteAreaCents = SURCHARGE_TABLE.remoteArea(shipment);
  const oversizeCents = SURCHARGE_TABLE.oversize(shipment);
  const totalCents = fuelCents + remoteAreaCents + oversizeCents;
  return { fuelCents, remoteAreaCents, oversizeCents, totalCents };
}

export function totalSurchargeCents(shipment: Shipment): number {
  return Object.values(SURCHARGE_TABLE).reduce((total, rule) => total + rule(shipment), 0);
}
