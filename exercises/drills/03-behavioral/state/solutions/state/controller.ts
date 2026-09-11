import type { TelescopeState } from "./state.ts";
import { parkedState } from "./states/parked.ts";
import type { TransitionLog } from "./types.ts";

export class TelescopeController {
  private current: TelescopeState = parkedState;
  private readonly log: TransitionLog[] = [];

  get status(): string {
    return this.current.name;
  }

  get history(): readonly TransitionLog[] {
    return this.log;
  }

  park(): void {
    this.apply(this.current.park(), "park");
  }

  slewTo(target: string): void {
    this.apply(this.current.slewTo(target), `slewTo(${target})`);
  }

  arrive(): void {
    this.apply(this.current.arrive(), "arrive");
  }

  nudge(deltaArcsec: number): void {
    this.apply(this.current.nudge(deltaArcsec), `nudge(${deltaArcsec})`);
  }

  /** The one place a transition is recorded, whatever state it came from. An
   *  illegal call never reaches here: the state throws before returning. */
  private apply(next: TelescopeState, action: string): void {
    this.log.push({ from: this.current.name, action });
    this.current = next;
  }
}
