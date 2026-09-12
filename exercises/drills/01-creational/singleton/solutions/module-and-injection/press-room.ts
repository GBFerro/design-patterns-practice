import type { PressRoomSettings } from "./types.ts";

/** Everything the app can do with one press room's configuration - every
 *  method closes over the settings this room was built from, never a
 *  shared global. */
interface PressRoom {
  rushQuoteTotal(baseCost: number): number;
  canAcceptAnotherRushJob(rushJobsToday: number): boolean;
  canAcceptNewJob(): boolean;
  describePressRoom(): string;
  setMaintenanceMode(maintenanceMode: boolean): void;
}

/** Builds one independent press room from an explicit configuration.
 *  Calling this twice, with two different settings, gives two press rooms
 *  that cannot see or change each other's state. */
export function createPressRoom(settings: PressRoomSettings): PressRoom {
  return {
    rushQuoteTotal(baseCost) {
      return baseCost * (1 + settings.rushSurchargePercent / 100);
    },
    canAcceptAnotherRushJob(rushJobsToday) {
      return rushJobsToday < settings.maxDailyRushJobs;
    },
    canAcceptNewJob() {
      return !settings.maintenanceMode;
    },
    describePressRoom() {
      const maintenanceNote = settings.maintenanceMode ? " (in maintenance)" : "";
      return `rush surcharge ${settings.rushSurchargePercent}%, up to ${settings.maxDailyRushJobs} rush jobs/day${maintenanceNote}`;
    },
    setMaintenanceMode(maintenanceMode) {
      settings.maintenanceMode = maintenanceMode;
    },
  };
}

function loadDefaultSettings(): PressRoomSettings {
  return { rushSurchargePercent: 20, maxDailyRushJobs: 5, maintenanceMode: false };
}

/** The press room the rest of the app uses by default - built once, here,
 *  the same way any other press room would be. */
export const mainFloor = createPressRoom(loadDefaultSettings());
