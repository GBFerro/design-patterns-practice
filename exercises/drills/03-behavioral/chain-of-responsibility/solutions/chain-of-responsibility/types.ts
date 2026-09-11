export interface ObservationRequest {
  readonly altitudeDegrees: number;
  readonly moonSeparationDegrees: number;
  readonly instrumentName: string;
  readonly exposureSeconds: number;
  readonly cloudCoverPercent: number;
}

export interface Telescope {
  readonly name: string;
  readonly hasMovableDome: boolean;
  readonly availableInstruments: readonly string[];
  readonly nightlyExposureBudgetSeconds: number;
}
