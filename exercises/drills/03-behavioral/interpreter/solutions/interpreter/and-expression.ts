import type { ConstraintExpression } from "./expression.ts";
import type { SkyContext } from "./types.ts";

/** GoF's `NonterminalExpression` for `&&`. Holds any number of clauses -
 *  terminal or, in principle, another combinator - and never inspects
 *  which kind each one is. */
export class AndExpression implements ConstraintExpression {
  constructor(private readonly clauses: ConstraintExpression[]) {}

  evaluate(context: SkyContext): boolean {
    return this.clauses.every((clause) => clause.evaluate(context));
  }
}
