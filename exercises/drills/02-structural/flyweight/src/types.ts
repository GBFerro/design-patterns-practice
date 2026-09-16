export interface StopMetadata {
  readonly stopId: string;
  readonly name: string;
  readonly zone: string;
  readonly wheelchairAccessible: boolean;
}

export interface StopTime {
  readonly stop: StopMetadata;
  readonly tripId: string;
  readonly arrivalMinutes: number;
  readonly departureMinutes: number;
}

export interface TripStopEntry {
  readonly tripId: string;
  readonly stopId: string;
  readonly arrivalMinutes: number;
  readonly departureMinutes: number;
}
