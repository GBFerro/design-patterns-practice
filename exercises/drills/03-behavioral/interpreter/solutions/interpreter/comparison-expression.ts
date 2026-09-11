import type { ConstraintExpression } from "./expression.ts";
import type { SkyContext } from "./types.ts";

/** The one place an operator symbol becomes a comparison. `parse.ts` picks
 *  which entry to use; this class never sees the source string. */
export const OPERATORS: Record<string, (value: number, threshold: number) => boolean> = {
  ">": (value, threshold) => value > threshold,
  "<": (value, threshold) => value < threshold,
};

/** GoF's `TerminalExpression` for a numeric fact about the sky right now,
 *  such as `altitude > 30`. Parameterized by field and operator, not
 *  subclassed per field - one class covers every numeric comparison. */
export class ComparisonExpression implements ConstraintExpression {
  constructor(
    private readonly getValue: (context: SkyContext) => number,
    private readonly operator: string,
    private readonly threshold: number,
  ) {}

  evaluate(context: SkyContext): boolean {
    const compare = OPERATORS[this.operator];
    if (compare === undefined) throw new Error(`unknown operator: ${this.operator}`);
    return compare(this.getValue(context), this.threshold);
  }
}
