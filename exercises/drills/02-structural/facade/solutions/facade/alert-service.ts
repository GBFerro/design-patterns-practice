import type { Route } from "./types.ts";

const LINE_ALERTS: Record<string, string> = {
  red: "Red Line: minor delays near Mill Ave",
};

/** Subsystem 5: any service alert active on a leg of this route. */
export class AlertService {
  activeAlerts(route: Route): string[] {
    return route.legs
      .map((leg) => LINE_ALERTS[leg.lineId])
      .filter((alert): alert is string => alert !== undefined);
  }
}
