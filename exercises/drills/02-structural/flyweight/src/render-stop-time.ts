import type { StopTime } from "./types.ts";

function formatMinutes(minutes: number): string {
  const hh = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mm = (minutes % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function renderStopTime(stopTime: StopTime): string {
  const accessible = stopTime.stop.wheelchairAccessible ? " ♿" : "";
  return `${formatMinutes(stopTime.arrivalMinutes)} · ${stopTime.stop.name} (Zone ${stopTime.stop.zone})${accessible}`;
}
