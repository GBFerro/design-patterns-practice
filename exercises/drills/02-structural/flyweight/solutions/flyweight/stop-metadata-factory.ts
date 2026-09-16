import { recordStopMetadataAllocation } from "./allocation-tracker.ts";
import { STOP_DIRECTORY } from "./stop-directory.ts";
import type { StopMetadata } from "./types.ts";

/** The flyweight factory: one StopMetadata per stop id, shared by every StopTime that
 *  needs it. A stop id this factory has already built never allocates again. */
export class StopMetadataFactory {
  private readonly cache = new Map<string, StopMetadata>();

  get(stopId: string): StopMetadata {
    const cached = this.cache.get(stopId);
    if (cached) return cached;

    const entry = STOP_DIRECTORY[stopId];
    if (!entry) throw new Error(`unknown stop: ${stopId}`);
    recordStopMetadataAllocation();
    const metadata: StopMetadata = {
      stopId,
      name: entry.name,
      zone: entry.zone,
      wheelchairAccessible: entry.wheelchairAccessible,
    };
    this.cache.set(stopId, metadata);
    return metadata;
  }
}
