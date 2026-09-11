import type { ActionRecord, InstrumentPanel } from "./types.ts";

class ConcretePanel implements InstrumentPanel {
  private _focuserPosition = 0;
  private _filterSlot = 1;
  private readonly _history: string[] = [];

  get focuserPosition(): number {
    return this._focuserPosition;
  }

  get filterSlot(): number {
    return this._filterSlot;
  }

  get history(): readonly string[] {
    return this._history;
  }

  run(action: ActionRecord): void {
    switch (action.type) {
      case "move-focuser":
        this._focuserPosition += action.deltaMicrons;
        this._history.push(`move-focuser(${action.deltaMicrons})`);
        break;
      case "rotate-wheel":
        this._filterSlot = action.toSlot;
        this._history.push(`rotate-wheel(${action.toSlot})`);
        break;
    }
  }
}

export function createPanel(): InstrumentPanel {
  return new ConcretePanel();
}
