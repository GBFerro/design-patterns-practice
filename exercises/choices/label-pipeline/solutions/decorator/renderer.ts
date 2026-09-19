import type { Shipment } from "./types.ts";

export interface LabelRenderer {
  render(shipment: Shipment): string[];
}

/** The mandatory content every label has: header, address, weight. */
export class BaseLabelRenderer implements LabelRenderer {
  render(shipment: Shipment): string[] {
    return [`RG-${shipment.orderId}`, shipment.address, `${shipment.weightKg} kg`];
  }
}

abstract class LabelDecorator implements LabelRenderer {
  constructor(protected readonly wrapped: LabelRenderer) {}
  abstract render(shipment: Shipment): string[];
}

export class FragileWarningDecorator extends LabelDecorator {
  render(shipment: Shipment): string[] {
    const lines = this.wrapped.render(shipment);
    return shipment.fragile ? [...lines, "HANDLE WITH CARE - FRAGILE"] : lines;
  }
}

export class HazmatWarningDecorator extends LabelDecorator {
  render(shipment: Shipment): string[] {
    const lines = this.wrapped.render(shipment);
    return shipment.hazmat ? [...lines, "HAZARDOUS MATERIALS - SEE MSDS"] : lines;
  }
}

export class CustomsDeclarationDecorator extends LabelDecorator {
  render(shipment: Shipment): string[] {
    const lines = this.wrapped.render(shipment);
    return shipment.destinationCountry !== "US"
      ? [...lines, "CUSTOMS: contents declared, origin US"]
      : lines;
  }
}
