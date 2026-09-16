import { RealVehiclePositionService } from "./real-vehicle-position-service.ts";
import type { VehiclePosition } from "./types.ts";

const realService = new RealVehiclePositionService();

/** Renders a dashboard row for each requested vehicle id, in order - the same vehicle
 *  can appear more than once, if more than one widget needs to show it. */
export function currentPositions(vehicleIds: readonly string[]): VehiclePosition[] {
  return vehicleIds.map((vehicleId) => realService.currentPosition(vehicleId));
}
