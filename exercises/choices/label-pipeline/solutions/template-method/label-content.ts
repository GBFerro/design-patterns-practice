import { DomesticLabel, InternationalLabel } from "./label-template.ts";
import type { Shipment } from "./types.ts";

function sections(shipment: Shipment): string[] {
  const template =
    shipment.destinationCountry === "US" ? new DomesticLabel() : new InternationalLabel();
  return template.sections(shipment);
}

export function buildLabel(shipment: Shipment): string {
  return sections(shipment).join("\n");
}

export function buildManifestEntry(shipment: Shipment): string {
  return sections(shipment).join(" | ");
}
