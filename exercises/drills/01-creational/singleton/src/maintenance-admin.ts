import { getSettings } from "./settings.ts";

export function setMaintenanceMode(maintenanceMode: boolean): void {
  getSettings().maintenanceMode = maintenanceMode;
}
