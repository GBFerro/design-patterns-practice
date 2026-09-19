import { SURCHARGE_RULES } from "./surcharges.ts";
import type { Shipment, SurchargeBreakdown } from "./types.ts";

function applyRules(shipment: Shipment): Record<string, number> {
  const soFar: Record<string, number> = {};
  for (const rule of SURCHARGE_RULES) {
    soFar[rule.id] = rule.amount(shipment, soFar);
  }
  return soFar;
}

export function quoteSurcharges(shipment: Shipment): SurchargeBreakdown {
  const amounts = applyRules(shipment);
  const totalCents = Object.values(amounts).reduce((total, amount) => total + amount, 0);
  return {
    fuelCents: amounts.fuel ?? 0,
    remoteAreaCents: amounts.remoteArea ?? 0,
    oversizeCents: amounts.oversize ?? 0,
    totalCents,
  };
}

export function totalSurchargeCents(shipment: Shipment): number {
  const amounts = applyRules(shipment);
  return Object.values(amounts).reduce((total, amount) => total + amount, 0);
}
