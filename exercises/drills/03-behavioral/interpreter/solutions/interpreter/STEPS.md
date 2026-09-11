# The route — a small parser, and one class per kind of clause

## When to choose this

When a language of expressions - however small - needs to grow new
operators or new terms over time, and "grow" should mean "add a table
entry," not "extend an `if`-chain in the right place." A constraint
language that will only ever have the operators it has today is not
under-designed as a `split`/`includes` function; this route is a bet
that the language keeps growing.

## What it costs

A one-clause constraint like `"clear"` now allocates three objects at
parse time (a `FlagExpression`, wrapped in an `AndExpression` holding a
list of one) to do what a single string comparison did. Reading "what
does this constraint check" means opening `parse.ts` to see how a string
becomes a tree, not just reading the one function that used to do both
jobs at once.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `ConstraintExpression` | One method, `evaluate(context): boolean`. No implementations yet. | `refactor: introduce ConstraintExpression` |
| 2 | Extract `ComparisonExpression` | Holds a field getter, an operator string, and a threshold; looks the operator up in an `OPERATORS` table at evaluation time. | `refactor: extract ComparisonExpression` |
| 3 | Extract `FlagExpression` | Holds a flag getter; parameterized, not subclassed per flag. | `refactor: extract FlagExpression` |
| 4 | Extract `AndExpression` | Holds a list of clauses, `every`s them. Never asks which kind each one is. | `refactor: extract AndExpression` |
| 5 | Write `parseConstraint(expression)` | Splits on `&&`, then per clause: check the flag table first, otherwise find the longest matching operator and build a `ComparisonExpression`. Wraps the result in `AndExpression`. | `refactor: introduce parseConstraint` |
| 6 | Route `evaluateConstraint` through `parseConstraint(...).evaluate(...)` | Delete the string-matching function. | `refactor: route evaluateConstraint through parseConstraint` |

`ComparisonExpression` (step 2) is extracted before `parseConstraint`
exists to parse anything into it - by the time step 5 needs to build one,
its constructor's shape is already fixed and tested in isolation.

## Then

```bash
./dp act2 interpreter
```

What a new operator and a new named term cost, and what they would have
cost without the pattern, is in [ACT2.md](./ACT2.md). The full reasoning,
with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
