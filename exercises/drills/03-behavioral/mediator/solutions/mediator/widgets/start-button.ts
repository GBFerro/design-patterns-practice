/** A dumb display: it shows what the mediator tells it to show, and computes
 *  nothing on its own. */
export class StartButton {
  private _enabled = false;

  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
  }

  get enabled(): boolean {
    return this._enabled;
  }
}
