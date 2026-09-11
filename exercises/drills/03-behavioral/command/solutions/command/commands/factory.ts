import type { Command } from "../command.ts";
import type { ActionRecord, PanelState } from "../types.ts";
import { MoveFocuserCommand } from "./move-focuser.ts";
import { RotateWheelCommand } from "./rotate-wheel.ts";

/** The one place that knows which ActionRecord becomes which Command. */
export function toCommand(state: PanelState, action: ActionRecord): Command {
  switch (action.type) {
    case "move-focuser":
      return new MoveFocuserCommand(state, action.deltaMicrons);
    case "rotate-wheel":
      return new RotateWheelCommand(state, action.toSlot);
  }
}
