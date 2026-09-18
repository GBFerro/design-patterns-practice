import {
  BaseLabelRenderer,
  CustomsDeclarationDecorator,
  FragileWarningDecorator,
  HazmatWarningDecorator,
} from "./renderer.ts";
import type { Shipment } from "./types.ts";

function sections(shipment: Shipment): string[] {
  const renderer = new CustomsDeclarationDecorator(
    new HazmatWarningDecorator(new FragileWarningDecorator(new BaseLabelRenderer())),
  );
  return renderer.render(shipment);
}

export function buildLabel(shipment: Shipment): string {
  return sections(shipment).join("\n");
}

export function buildManifestEntry(shipment: Shipment): string {
  return sections(shipment).join(" | ");
}
