import type { Shipment } from "./types.ts";

export function buildLabel(shipment: Shipment): string {
  const lines: string[] = [];
  lines.push(`RG-${shipment.orderId}`);
  lines.push(shipment.address);
  lines.push(`${shipment.weightKg} kg`);
  if (shipment.fragile) {
    lines.push("HANDLE WITH CARE - FRAGILE");
  }
  if (shipment.hazmat) {
    lines.push("HAZARDOUS MATERIALS - SEE MSDS");
  }
  if (shipment.destinationCountry !== "US") {
    lines.push("CUSTOMS: contents declared, origin US");
  }
  return lines.join("\n");
}

/** The same content, one line per shipment, for the warehouse floor's printed manifest. */
export function buildManifestEntry(shipment: Shipment): string {
  const parts: string[] = [];
  parts.push(`RG-${shipment.orderId}`);
  parts.push(shipment.address);
  parts.push(`${shipment.weightKg} kg`);
  if (shipment.fragile) {
    parts.push("HANDLE WITH CARE - FRAGILE");
  }
  if (shipment.hazmat) {
    parts.push("HAZARDOUS MATERIALS - SEE MSDS");
  }
  if (shipment.destinationCountry !== "US") {
    parts.push("CUSTOMS: contents declared, origin US");
  }
  return parts.join(" | ");
}
