import type { Command } from "../command.ts";
import type { PanelState } from "../types.ts";

export class MoveFocuserCommand implements Command {
  readonly description: string;

  constructor(
    private readonly state: PanelState,
    private readonly deltaMicrons: number,
  ) {
    this.description = `move-focuser(${deltaMicrons})`;
  }

  execute(): void {
    this.state.focuserPosition += this.deltaMicrons;
  }

  undo(): void {
    this.state.focuserPosition -= this.deltaMicrons;
  }
}
