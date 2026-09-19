import type { Shipment } from "./types.ts";

const OVERSIZE_THRESHOLD_CM = 150;

function isOversize(shipment: Shipment): boolean {
  return (
    shipment.lengthCm > OVERSIZE_THRESHOLD_CM ||
    shipment.widthCm > OVERSIZE_THRESHOLD_CM ||
    shipment.heightCm > OVERSIZE_THRESHOLD_CM
  );
}

/** One surcharge, computed from the shipment alone - no visibility into any other surcharge. */
export interface Surcharge {
  readonly id: "fuel" | "remoteArea" | "oversize";
  compute(shipment: Shipment): number;
}

export class FuelSurcharge implements Surcharge {
  readonly id = "fuel";
  private static readonly RATE = 0.12;

  compute(shipment: Shipment): number {
    return Math.round(shipment.baseRateCents * FuelSurcharge.RATE);
  }
}

export class RemoteAreaSurcharge implements Surcharge {
  readonly id = "remoteArea";
  private static readonly CENTS = 1500;

  compute(shipment: Shipment): number {
    return shipment.destination === "remote" ? RemoteAreaSurcharge.CENTS : 0;
  }
}

export class OversizeSurcharge implements Surcharge {
  readonly id = "oversize";
  private static readonly CENTS = 2000;

  compute(shipment: Shipment): number {
    return isOversize(shipment) ? OversizeSurcharge.CENTS : 0;
  }
}

export const SURCHARGES: readonly Surcharge[] = [
  new FuelSurcharge(),
  new RemoteAreaSurcharge(),
  new OversizeSurcharge(),
];
