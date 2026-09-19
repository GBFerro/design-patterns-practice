import type { Shipment, SurchargeBreakdown } from "./types.ts";

const FUEL_SURCHARGE_RATE = 0.12;
const REMOTE_AREA_SURCHARGE_CENTS = 1500;
const OVERSIZE_SURCHARGE_CENTS = 2000;
const OVERSIZE_THRESHOLD_CM = 150;

function isOversize(shipment: Shipment): boolean {
  return (
    shipment.lengthCm > OVERSIZE_THRESHOLD_CM ||
    shipment.widthCm > OVERSIZE_THRESHOLD_CM ||
    shipment.heightCm > OVERSIZE_THRESHOLD_CM
  );
}

export function quoteSurcharges(shipment: Shipment): SurchargeBreakdown {
  const fuelCents = Math.round(shipment.baseRateCents * FUEL_SURCHARGE_RATE);
  const remoteAreaCents =
    shipment.destination === "remote" ? REMOTE_AREA_SURCHARGE_CENTS : 0;
  const oversizeCents = isOversize(shipment) ? OVERSIZE_SURCHARGE_CENTS : 0;
  const totalCents = fuelCents + remoteAreaCents + oversizeCents;
  return { fuelCents, remoteAreaCents, oversizeCents, totalCents };
}

export function totalSurchargeCents(shipment: Shipment): number {
  const fuelCents = Math.round(shipment.baseRateCents * FUEL_SURCHARGE_RATE);
  const remoteAreaCents =
    shipment.destination === "remote" ? REMOTE_AREA_SURCHARGE_CENTS : 0;
  const oversizeCents = isOversize(shipment) ? OVERSIZE_SURCHARGE_CENTS : 0;
  return fuelCents + remoteAreaCents + oversizeCents;
}
