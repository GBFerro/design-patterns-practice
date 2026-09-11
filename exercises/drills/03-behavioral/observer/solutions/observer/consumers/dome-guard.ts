import type { Alert, AlertObserver } from "../types.ts";

export class DomeGuard implements AlertObserver {
  private readonly _entries: string[] = [];

  onAlert(alert: Alert): void {
    if (alert.kind !== "weather") return;
    this._entries.push(`closed: ${alert.condition}`);
  }

  get entries(): readonly string[] {
    return this._entries;
  }
}
