import { getSettings } from "./settings.ts";

export function canAcceptAnotherRushJob(rushJobsToday: number): boolean {
  return rushJobsToday < getSettings().maxDailyRushJobs;
}
