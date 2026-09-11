import { ControlRoomLog } from "./consumers/control-room-log.ts";
import { DomeGuard } from "./consumers/dome-guard.ts";
import { NightReport } from "./consumers/night-report.ts";
import { OperatorPager } from "./consumers/operator-pager.ts";
import type { Alert, AlertCenter, AlertObserver } from "./types.ts";

class ConcreteAlertCenter implements AlertCenter {
  private readonly log = new ControlRoomLog();
  private readonly pager = new OperatorPager();
  private readonly dome = new DomeGuard();
  private readonly report = new NightReport();
  private readonly observers: AlertObserver[] = [this.log, this.pager, this.dome, this.report];

  publish(alert: Alert): void {
    for (const observer of this.observers) observer.onAlert(alert);
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
