import type { TelescopeState } from "../state.ts";
import { parkedState } from "./parked.ts";
import { trackingState } from "./tracking.ts";

/** Moving toward a target. The one state that carries its own data: which
 *  target it is moving toward, so a second slew command can be refused by
 *  name instead of by a bare "busy". */
export class SlewingState implements TelescopeState {
  readonly name = "slewing";

  constructor(private readonly target: string) {}

  park(): TelescopeState {
    return parkedState;
  }

  slewTo(target: string): TelescopeState {
    throw new Error(
      `Cannot slew to "${target}": a slew to "${this.target}" is already in progress.`,
    );
  }

  arrive(): TelescopeState {
    return trackingState;
  }

  nudge(): TelescopeState {
    throw new Error('Cannot nudge: the telescope is "slewing", not tracking.');
  }
}
