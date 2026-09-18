export type CarrierId = "northbridge" | "aerolane" | "coastal";

export interface CarrierRate {
  readonly cents: number;
  readonly etaDays: number;
}

export interface CarrierGateway {
  rate(originZip: string, destZip: string, weightKg: number): CarrierRate;
}
