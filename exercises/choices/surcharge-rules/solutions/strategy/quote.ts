import { SURCHARGES } from "./surcharges.ts";
import type { Shipment, SurchargeBreakdown } from "./types.ts";

export function quoteSurcharges(shipment: Shipment): SurchargeBreakdown {
  const amounts: Record<string, number> = {};
  let totalCents = 0;
  for (const surcharge of SURCHARGES) {
    const amount = surcharge.compute(shipment);
    amounts[surcharge.id] = amount;
    totalCents += amount;
  }
  return {
    fuelCents: amounts.fuel ?? 0,
    remoteAreaCents: amounts.remoteArea ?? 0,
    oversizeCents: amounts.oversize ?? 0,
    totalCents,
  };
}

export function totalSurchargeCents(shipment: Shipment): number {
  return SURCHARGES.reduce((total, surcharge) => total + surcharge.compute(shipment), 0);
}
