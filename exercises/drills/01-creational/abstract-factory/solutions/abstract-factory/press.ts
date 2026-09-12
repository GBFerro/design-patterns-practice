import { assemblePress } from "./assemble.ts";
import { getPressFactory } from "./factory.ts";
import type { Press, PressFamily } from "./types.ts";

/** All three parts come from the same factory reference - there is no
 *  second family in scope here to mix one in from by mistake. */
export function buildPress(family: PressFamily): Press {
  const factory = getPressFactory(family);
  return assemblePress(factory.createPlate(), factory.createInkSystem(), factory.createFeeder());
}
