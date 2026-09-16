import { AlertService } from "./alert-service.ts";
import { FareCalculator } from "./fare-calculator.ts";
import { RouteFinder } from "./route-finder.ts";
import { ScheduleLookup } from "./schedule-lookup.ts";
import { StopResolver } from "./stop-resolver.ts";
import type { TripPlan } from "./types.ts";

/** The one place that knows all five subsystems, and the order they run in. */
export class TripPlanner {
  private readonly stopResolver = new StopResolver();
  private readonly routeFinder = new RouteFinder();
  private readonly scheduleLookup = new ScheduleLookup();
  private readonly fareCalculator = new FareCalculator();
  private readonly alertService = new AlertService();

  plan(originName: string, destinationName: string): TripPlan {
    const origin = this.stopResolver.resolve(originName);
    const destination = this.stopResolver.resolve(destinationName);
    const route = this.routeFinder.find(origin, destination);
    const departureMinutesFromNow = this.scheduleLookup.nextDepartureMinutes(route);
    const fareCents = this.fareCalculator.calculate(route);
    const alerts = this.alertService.activeAlerts(route);

    return { route, departureMinutesFromNow, fareCents, alerts };
  }
}
