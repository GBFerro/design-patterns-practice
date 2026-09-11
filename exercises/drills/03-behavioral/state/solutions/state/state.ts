/**
 * What the telescope can do, and what it becomes next. Every method either
 * returns the state the controller should move to, or throws - there is no
 * third option, so an illegal call can never be silently accepted.
 */
export interface TelescopeState {
  readonly name: string;
  park(): TelescopeState;
  slewTo(target: string): TelescopeState;
  arrive(): TelescopeState;
  nudge(deltaArcsec: number): TelescopeState;
}
