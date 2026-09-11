import type { Alert, AlertCenter } from "./types.ts";
import { describeAlert } from "./types.ts";

class ControlRoomLog {
  private readonly _entries: string[] = [];

  record(alert: Alert): void {
    this._entries.push(describeAlert(alert));
  }

  get entries(): readonly string[] {
    return this._entries;
  }
}

class OperatorPager {
  private readonly _entries: string[] = [];

  page(alert: Alert): void {
    this._entries.push(describeAlert(alert));
  }

  get entries(): readonly string[] {
    return this._entries;
  }
}

class DomeGuard {
  private readonly _entries: string[] = [];

  respond(alert: Alert): void {
    if (alert.kind !== "weather") return;
    this._entries.push(`closed: ${alert.condition}`);
  }

  get entries(): readonly string[] {
    return this._entries;
  }
}

class NightReport {
  private readonly _entries: string[] = [];

  append(alert: Alert): void {
    this._entries.push(describeAlert(alert));
  }

  get entries(): readonly string[] {
    return this._entries;
  }
}

class ConcreteAlertCenter implements AlertCenter {
  private readonly log = new ControlRoomLog();
  private readonly pager = new OperatorPager();
  private readonly dome = new DomeGuard();
  private readonly report = new NightReport();

  publish(alert: Alert): void {
    this.log.record(alert);
    this.pager.page(alert);
    this.dome.respond(alert);
    this.report.append(alert);
  }

  get logEntries(): readonly string[] {
    return this.log.entries;
  }

  get pagerEntries(): readonly string[] {
    return this.pager.entries;
  }

  get domeEntries(): readonly string[] {
    return this.dome.entries;
  }

  get reportEntries(): readonly string[] {
    return this.report.entries;
  }
}

export function createAlertCenter(): AlertCenter {
  return new ConcreteAlertCenter();
}
