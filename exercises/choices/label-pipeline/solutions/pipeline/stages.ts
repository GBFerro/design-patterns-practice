import type { Shipment } from "./types.ts";

/** One section of the label. `null` means "this shipment doesn't need this line." */
export type Stage = (shipment: Shipment) => string | null;

export const header: Stage = (shipment) => `RG-${shipment.orderId}`;

export const address: Stage = (shipment) => shipment.address;

export const weight: Stage = (shipment) => `${shipment.weightKg} kg`;

export const fragileWarning: Stage = (shipment) => (shipment.fragile ? "HANDLE WITH CARE - FRAGILE" : null);

export const hazmatWarning: Stage = (shipment) =>
  shipment.hazmat ? "HAZARDOUS MATERIALS - SEE MSDS" : null;

export const customsDeclaration: Stage = (shipment) =>
  shipment.destinationCountry !== "US" ? "CUSTOMS: contents declared, origin US" : null;
