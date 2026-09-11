import type { Command } from "../command.ts";
import type { PanelState } from "../types.ts";

export class RotateWheelCommand implements Command {
  readonly description: string;
  /** Captured at execute() time, not construction time: a command may sit in
   *  a macro for a while before it actually runs. */
  private fromSlot = 0;

  constructor(
    private readonly state: PanelState,
    private readonly toSlot: number,
  ) {
    this.description = `rotate-wheel(${toSlot})`;
  }

  execute(): void {
    this.fromSlot = this.state.filterSlot;
    this.state.filterSlot = this.toSlot;
  }

  undo(): void {
    this.state.filterSlot = this.fromSlot;
  }
}
