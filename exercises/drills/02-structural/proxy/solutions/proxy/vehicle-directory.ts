export interface VehicleDirectoryEntry {
  readonly latitude: number;
  readonly longitude: number;
}

/** The master data: where the fleet's live-position feed actually places each vehicle. */
export const VEHICLE_DIRECTORY: Record<string, VehicleDirectoryEntry> = {
  "bus-14": { latitude: 41.234, longitude: -111.456 },
  "bus-22": { latitude: 41.245, longitude: -111.47 },
  "bus-31": { latitude: 41.251, longitude: -111.48 },
};
