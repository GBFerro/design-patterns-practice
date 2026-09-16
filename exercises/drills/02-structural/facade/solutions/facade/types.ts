export interface Stop {
  readonly id: string;
  readonly name: string;
}

export interface RouteLeg {
  readonly lineId: string;
  readonly fromStopId: string;
  readonly toStopId: string;
  readonly minutes: number;
}

export interface Route {
  readonly origin: Stop;
  readonly destination: Stop;
  readonly legs: readonly RouteLeg[];
}

export interface TripPlan {
  readonly route: Route;
  readonly departureMinutesFromNow: number;
  readonly fareCents: number;
  readonly alerts: readonly string[];
}
