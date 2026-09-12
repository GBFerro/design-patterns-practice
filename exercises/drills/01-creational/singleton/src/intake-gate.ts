import { getSettings } from "./settings.ts";

export function canAcceptNewJob(): boolean {
  return !getSettings().maintenanceMode;
}
