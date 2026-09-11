import { AndExpression } from "./and-expression.ts";
import { ComparisonExpression, OPERATORS } from "./comparison-expression.ts";
import type { ConstraintExpression } from "./expression.ts";
import { FlagExpression } from "./flag-expression.ts";
import type { SkyContext } from "./types.ts";

const FIELD_GETTERS: Record<string, (context: SkyContext) => number> = {
  altitude: (context) => context.altitudeDegrees,
  moon_phase: (context) => context.moonPhase,
  seeing: (context) => context.seeingArcsec,
};

const FLAG_GETTERS: Record<string, (context: SkyContext) => boolean> = {
  civil_twilight_over: (context) => context.civilTwilightOver,
  dome_open: (context) => context.domeOpen,
  clear: (context) => context.clear,
};

/** Longest operator first, so `>=` is found before `>` the moment both are
 *  registered in `OPERATORS` - a clause is only ever split on the operator
 *  that actually appears, never on a shorter one it happens to contain. */
function parseComparison(clause: string): ComparisonExpression {
  const operator = Object.keys(OPERATORS)
    .sort((a, b) => b.length - a.length)
    .find((candidate) => clause.includes(candidate));
  if (operator === undefined) throw new Error(`unparseable clause: ${clause}`);

  const parts = clause.split(operator).map((part) => part.trim());
  const field = parts[0];
  const raw = parts[1];
  if (field === undefined || raw === undefined) throw new Error(`unparseable clause: ${clause}`);
  const getValue = FIELD_GETTERS[field];
  if (getValue === undefined) throw new Error(`unknown field: ${field}`);

  return new ComparisonExpression(getValue, operator, Number(raw));
}

/** Builds the AST once, ahead of evaluation. GoF's `Context` is `SkyContext`,
 *  supplied later to `evaluate` - parsing never touches it. */
export function parseConstraint(expression: string): ConstraintExpression {
  const clauses = expression.split("&&").map((clause) => clause.trim());

  const parsed = clauses.map((clause): ConstraintExpression => {
    const getFlag = FLAG_GETTERS[clause];
    if (getFlag !== undefined) return new FlagExpression(getFlag);
    return parseComparison(clause);
  });

  return new AndExpression(parsed);
}
