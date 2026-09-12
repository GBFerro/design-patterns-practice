import { getSettings } from "./settings.ts";

export function describePressRoom(): string {
  const settings = getSettings();
  const maintenanceNote = settings.maintenanceMode ? " (in maintenance)" : "";
  return `rush surcharge ${settings.rushSurchargePercent}%, up to ${settings.maxDailyRushJobs} rush jobs/day${maintenanceNote}`;
}
