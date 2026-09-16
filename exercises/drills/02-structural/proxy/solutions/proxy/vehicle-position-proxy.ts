import type { VehiclePosition, VehiclePositionService } from "./types.ts";

/** A virtual proxy: caches each vehicle's position the first time it's asked for, so a
 *  batch that asks for the same vehicle twice only pays the real lookup once. Every
 *  caller shares this one instance instead of talking to the real service directly. */
export class VehiclePositionProxy implements VehiclePositionService {
  private readonly cache = new Map<string, VehiclePosition>();

  constructor(private readonly realService: VehiclePositionService) {}

  currentPosition(vehicleId: string): VehiclePosition {
    const cached = this.cache.get(vehicleId);
    if (cached) return cached;

    const position = this.realService.currentPosition(vehicleId);
    this.cache.set(vehicleId, position);
    return position;
  }
}
