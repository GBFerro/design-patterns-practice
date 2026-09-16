export interface VehiclePosition {
  readonly vehicleId: string;
  readonly latitude: number;
  readonly longitude: number;
}

export interface VehiclePositionService {
  currentPosition(vehicleId: string): VehiclePosition;
}
