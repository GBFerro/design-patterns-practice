export type CarrierId = "ravenex" | "skyfreight" | "tanager";

export type DestinationZone = "local" | "regional" | "national" | "international";

export type SpeedTier = "standard" | "expedited" | "overnight";

export interface CarrierQuote {
  readonly carrierId: CarrierId;
  readonly baseCents: number;
  readonly speedTier: SpeedTier;
}

export interface ShipmentRequest {
  readonly shipmentId: string;
  readonly destinationZone: DestinationZone;
  readonly weightKg: number;
  readonly requiredSpeedTier: SpeedTier;
}

export interface RateDecision {
  readonly shipmentId: string;
  readonly winningCarrierId: CarrierId;
  readonly totalCents: number;
}
