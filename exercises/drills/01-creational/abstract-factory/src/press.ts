import { assemblePress } from "./assemble.ts";
import { createFeeder } from "./feeder.ts";
import { createInkSystem } from "./ink-system.ts";
import { createPlate } from "./plate.ts";
import type { Press, PressFamily } from "./types.ts";

/** Everything a shop-floor operator needs: a ready-to-run press for one
 *  named family. */
export function buildPress(family: PressFamily): Press {
  return assemblePress(
    createPlate(family),
    createInkSystem(family),
    createFeeder(family),
  );
}
