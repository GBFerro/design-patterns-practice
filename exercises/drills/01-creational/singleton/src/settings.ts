import type { PressRoomSettings } from "./types.ts";

let instance: PressRoomSettings | undefined;

function loadDefaultSettings(): PressRoomSettings {
  return { rushSurchargePercent: 20, maxDailyRushJobs: 5, maintenanceMode: false };
}

/** The one press-room configuration this module hands out - built once, on
 *  first use, and shared by every module that asks after that. */
export function getSettings(): PressRoomSettings {
  if (instance === undefined) {
    instance = loadDefaultSettings();
  }
  return instance;
}
