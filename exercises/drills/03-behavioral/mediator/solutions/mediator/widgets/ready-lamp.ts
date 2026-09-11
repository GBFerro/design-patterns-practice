/** A dumb display: it shows what the mediator tells it to show, and computes
 *  nothing on its own. */
export class ReadyLamp {
  private _lit = false;

  setLit(lit: boolean): void {
    this._lit = lit;
  }

  get lit(): boolean {
    return this._lit;
  }
}
