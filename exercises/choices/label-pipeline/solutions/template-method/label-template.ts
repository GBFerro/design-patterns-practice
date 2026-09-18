import type { Shipment } from "./types.ts";

export abstract class LabelTemplate {
  sections(shipment: Shipment): string[] {
    return [this.header(shipment), this.address(shipment), this.weight(shipment), ...this.extras(shipment)];
  }

  private header(shipment: Shipment): string {
    return `RG-${shipment.orderId}`;
  }

  private address(shipment: Shipment): string {
    return shipment.address;
  }

  private weight(shipment: Shipment): string {
    return `${shipment.weightKg} kg`;
  }

  protected extras(shipment: Shipment): string[] {
    const extras: string[] = [];
    if (shipment.fragile) extras.push("HANDLE WITH CARE - FRAGILE");
    if (shipment.hazmat) extras.push("HAZARDOUS MATERIALS - SEE MSDS");
    return extras;
  }
}

export class DomesticLabel extends LabelTemplate {}

export class InternationalLabel extends LabelTemplate {
  protected override extras(shipment: Shipment): string[] {
    return [...super.extras(shipment), "CUSTOMS: contents declared, origin US"];
  }
}
