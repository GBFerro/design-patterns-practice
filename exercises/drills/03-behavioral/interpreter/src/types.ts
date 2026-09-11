/** Everything an observation constraint can be checked against, at the
 *  moment a scheduler is deciding whether to run a request right now. */
export interface SkyContext {
  altitudeDegrees: number;
  moonPhase: number;
  seeingArcsec: number;
  civilTwilightOver: boolean;
  domeOpen: boolean;
  clear: boolean;
}
