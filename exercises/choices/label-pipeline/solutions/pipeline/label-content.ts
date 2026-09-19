import {
  address,
  customsDeclaration,
  fragileWarning,
  hazmatWarning,
  header,
  weight,
  type Stage,
} from "./stages.ts";
import type { Shipment } from "./types.ts";

const stages: readonly Stage[] = [
  header,
  address,
  weight,
  fragileWarning,
  hazmatWarning,
  customsDeclaration,
];

function sections(shipment: Shipment): string[] {
  return stages
    .map((stage) => stage(shipment))
    .filter((line): line is string => line !== null);
}

export function buildLabel(shipment: Shipment): string {
  return sections(shipment).join("\n");
}

export function buildManifestEntry(shipment: Shipment): string {
  return sections(shipment).join(" | ");
}
