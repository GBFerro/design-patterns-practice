import type { ConstraintExpression } from "./expression.ts";
import type { SkyContext } from "./types.ts";

/** GoF's `TerminalExpression` for a named boolean fact about the sky right
 *  now, such as `dome_open`. Parameterized by which flag to read, not
 *  subclassed per flag - one class covers every named term. */
export class FlagExpression implements ConstraintExpression {
  constructor(private readonly getFlag: (context: SkyContext) => boolean) {}

  evaluate(context: SkyContext): boolean {
    return this.getFlag(context);
  }
}
