import type { CarrierId } from "./types.ts";

const counts = new Map<CarrierId, number>();

/** Called by every native carrier client, so any route's call volume is measurable. */
export function recordCarrierCall(carrierId: CarrierId): void {
  counts.set(carrierId, (counts.get(carrierId) ?? 0) + 1);
}

export function carrierCallCount(carrierId: CarrierId): number {
  return counts.get(carrierId) ?? 0;
}

export function resetCarrierCalls(): void {
  counts.clear();
}
