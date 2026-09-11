import type { PanelMediator } from "../panel-mediator.ts";

export class FocusDial {
  locked = false;

  constructor(private readonly mediator: PanelMediator) {}

  setLocked(locked: boolean): void {
    this.locked = locked;
    this.mediator.focusLockedChanged(locked);
  }
}
