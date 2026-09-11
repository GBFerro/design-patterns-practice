import type { ObservationRequest, Telescope } from "./types.ts";

export function validateRequest(request: ObservationRequest, telescope: Telescope): string | null {
  if (request.altitudeDegrees < 20) {
    return "target is below the minimum altitude";
  }
  if (request.moonSeparationDegrees < 15) {
    return "target is too close to the moon";
  }
  if (!telescope.availableInstruments.includes(request.instrumentName)) {
    return `${request.instrumentName} is not available on ${telescope.name}`;
  }
  if (request.exposureSeconds > telescope.nightlyExposureBudgetSeconds) {
    return "exposure exceeds the nightly budget";
  }
  if (telescope.hasMovableDome && request.altitudeDegrees > 85) {
    return "near-zenith pointing risks dome slit clearance";
  }
  if (request.cloudCoverPercent > 50) {
    return "cloud cover is too high";
  }
  return null;
}
