import type { SkyContext } from "./types.ts";

/** GoF's `AbstractExpression`. Every node in a parsed constraint - terminal
 *  or combinator - is one of these, and evaluation never asks which. */
export interface ConstraintExpression {
  evaluate(context: SkyContext): boolean;
}
