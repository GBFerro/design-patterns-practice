import type { TelescopeState } from "../state.ts";
import { parkedState } from "./parked.ts";
import { SlewingState } from "./slewing.ts";

/** Locked on target and taking data. */
export const trackingState: TelescopeState = {
  name: "tracking",
  park() {
    return parkedState;
  },
  slewTo(target) {
    return new SlewingState(target);
  },
  arrive() {
    throw new Error('Cannot arrive: the telescope is "tracking", not slewing.');
  },
  nudge() {
    return trackingState;
  },
};
