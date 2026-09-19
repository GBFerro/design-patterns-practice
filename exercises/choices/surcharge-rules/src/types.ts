export type Destination = "metro" | "remote";

export interface Shipment {
  readonly baseRateCents: number;
  readonly destination: Destination;
  readonly lengthCm: number;
  readonly widthCm: number;
  readonly heightCm: number;
}

export interface SurchargeBreakdown {
  readonly fuelCents: number;
  readonly remoteAreaCents: number;
  readonly oversizeCents: number;
  readonly totalCents: number;
}
