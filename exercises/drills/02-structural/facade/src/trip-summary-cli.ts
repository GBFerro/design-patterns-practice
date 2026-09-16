import { AlertService } from "./alert-service.ts";
import { FareCalculator } from "./fare-calculator.ts";
import { RouteFinder } from "./route-finder.ts";
import { ScheduleLookup } from "./schedule-lookup.ts";
import { StopResolver } from "./stop-resolver.ts";
import type { TripPlan } from "./types.ts";

/** Called by `dp-cli trip-summary <origin> <destination>`. */
export function printTripSummary(originName: string, destinationName: string): TripPlan {
  const stopResolver = new StopResolver();
  const routeFinder = new RouteFinder();
  const scheduleLookup = new ScheduleLookup();
  const fareCalculator = new FareCalculator();
  const alertService = new AlertService();

  const origin = stopResolver.resolve(originName);
  const destination = stopResolver.resolve(destinationName);
  const route = routeFinder.find(origin, destination);
  const departureMinutesFromNow = scheduleLookup.nextDepartureMinutes(route);
  const fareCents = fareCalculator.calculate(route);
  const alerts = alertService.activeAlerts(route);

  return { route, departureMinutesFromNow, fareCents, alerts };
}
