import type { TelescopeState } from "../state.ts";
import { SlewingState } from "./slewing.ts";

/** On the mount, not pointed at anything worth tracking. The resting state. */
export const parkedState: TelescopeState = {
  name: "parked",
  park() {
    return parkedState;
  },
  slewTo(target) {
    return new SlewingState(target);
  },
  arrive() {
    throw new Error('Cannot arrive: the telescope is "parked", not slewing.');
  },
  nudge() {
    throw new Error('Cannot nudge: the telescope is "parked", not tracking.');
  },
};
