import { toCommand } from "./commands/factory.ts";
import { CommandQueue } from "./queue.ts";
import type { ActionRecord, InstrumentPanel, PanelState } from "./types.ts";

class ConcretePanel implements InstrumentPanel {
  private readonly state: PanelState = { focuserPosition: 0, filterSlot: 1 };
  private readonly queue = new CommandQueue();

  get focuserPosition(): number {
    return this.state.focuserPosition;
  }

  get filterSlot(): number {
    return this.state.filterSlot;
  }

  get history(): readonly string[] {
    return this.queue.history;
  }

  run(action: ActionRecord): void {
    this.queue.run(toCommand(this.state, action));
  }
}

export function createPanel(): InstrumentPanel {
  return new ConcretePanel();
}
