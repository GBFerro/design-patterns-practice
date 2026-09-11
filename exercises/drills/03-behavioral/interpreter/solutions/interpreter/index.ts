import { parseConstraint } from "./parse.ts";
import type { SkyContext } from "./types.ts";

/** Frozen public API, same shape as `src/evaluate.ts` - parse, then
 *  evaluate the tree once, against this call's context. */
export function evaluateConstraint(expression: string, context: SkyContext): boolean {
  return parseConstraint(expression).evaluate(context);
}

export type { SkyContext } from "./types.ts";
export type { ConstraintExpression } from "./expression.ts";
export { parseConstraint } from "./parse.ts";
