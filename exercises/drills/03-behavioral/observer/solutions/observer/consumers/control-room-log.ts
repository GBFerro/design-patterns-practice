import type { Alert, AlertObserver } from "../types.ts";
import { describeAlert } from "../types.ts";

export class ControlRoomLog implements AlertObserver {
  private readonly _entries: string[] = [];

  onAlert(alert: Alert): void {
    this._entries.push(describeAlert(alert));
  }

  get entries(): readonly string[] {
    return this._entries;
  }
}
