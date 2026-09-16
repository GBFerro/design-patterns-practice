import { recordRealLookup } from "./lookup-tracker.ts";
import type { VehiclePosition, VehiclePositionService } from "./types.ts";
import { VEHICLE_DIRECTORY } from "./vehicle-directory.ts";

/** Stands in for a slow call to the fleet's live-position radio network. */
export class RealVehiclePositionService implements VehiclePositionService {
  currentPosition(vehicleId: string): VehiclePosition {
    recordRealLookup();
    const entry = VEHICLE_DIRECTORY[vehicleId];
    if (!entry) throw new Error(`unknown vehicle: ${vehicleId}`);
    return { vehicleId, latitude: entry.latitude, longitude: entry.longitude };
  }
}
