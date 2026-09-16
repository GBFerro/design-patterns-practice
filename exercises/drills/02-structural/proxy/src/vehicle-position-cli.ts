import { RealVehiclePositionService } from "./real-vehicle-position-service.ts";
import type { VehiclePosition } from "./types.ts";

const realService = new RealVehiclePositionService();

/** Called by `dp-cli fleet-positions <vehicleId...>` - the ops tool a dispatcher runs
 *  by hand while investigating a specific vehicle. */
export function printFleetPositions(vehicleIds: readonly string[]): VehiclePosition[] {
  return vehicleIds.map((vehicleId) => realService.currentPosition(vehicleId));
}
