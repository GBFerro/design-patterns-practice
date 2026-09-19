import type { TransitionLog } from "./types.ts";

type Status = "parked" | "slewing" | "tracking";

export class TelescopeController {
  private currentStatus: Status = "parked";
  private slewTarget: string | undefined;
  private readonly log: TransitionLog[] = [];

  get status(): string {
    return this.currentStatus;
  }

  get history(): readonly TransitionLog[] {
    return this.log;
  }

  park(): void {
    if (this.currentStatus === "parked") return;
    this.record("park");
    this.currentStatus = "parked";
    this.slewTarget = undefined;
  }

  slewTo(target: string): void {
    if (this.currentStatus === "slewing") {
      throw new Error(
        `Cannot slew to "${target}": a slew to "${this.slewTarget}" is already in progress.`,
      );
    }
    this.record(`slewTo(${target})`);
    this.currentStatus = "slewing";
    this.slewTarget = target;
  }

  arrive(): void {
    if (this.currentStatus !== "slewing") {
      throw new Error(
        `Cannot arrive: the telescope is "${this.currentStatus}", not slewing.`,
      );
    }
    this.record("arrive");
    this.currentStatus = "tracking";
  }

  nudge(deltaArcsec: number): void {
    if (this.currentStatus !== "tracking") {
      throw new Error(
        `Cannot nudge: the telescope is "${this.currentStatus}", not tracking.`,
      );
    }
    this.record(`nudge(${deltaArcsec})`);
  }

  private record(action: string): void {
    this.log.push({ from: this.currentStatus, action });
  }
}
