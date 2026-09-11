import type { PanelMediator } from "../panel-mediator.ts";

export class ExposureTimer {
  seconds = 0;

  constructor(private readonly mediator: PanelMediator) {}

  setSeconds(seconds: number): void {
    this.seconds = seconds;
    this.mediator.exposureChanged(seconds);
  }
}
