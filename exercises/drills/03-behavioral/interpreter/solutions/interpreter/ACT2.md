# Act 2 — the measured part

Every number here comes from `./dp trade interpreter`, which applies the
two patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A new operator, `>=`, meaning what it means everywhere else - and a new
named term, `moon_below_horizon`, reading a new `moonBelowHorizon` field
off `SkyContext` the same way `dome_open` reads `domeOpen`.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   3 existing files modified   ·   3 lines touched   ·   3 hunks
```

One line each, in three already-existing files: `>=` is a fourth entry
in `OPERATORS` (`comparison-expression.ts`); `moon_below_horizon` is a
fourth entry in `FLAG_GETTERS` (`parse.ts`); `moonBelowHorizon` is a
fifth field on `SkyContext` (`types.ts`). Not one existing class -
`ComparisonExpression`, `FlagExpression`, `AndExpression`, `parseConstraint`
itself - has a line changed. The operator table's length-sort (written in
step 5, before act 2 existed) is what makes the `>=`-contains-`>` hazard
a non-event here: it was already sorting by length to be correct for
any future entry, not patched to handle this one.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   16 lines touched   ·   2 hunks
```

Read file count and hunk count alone and the baseline looks cheaper -
one fewer file, one fewer hunk than the pattern route. Lines touched is
where the comparison actually resolves, and not narrowly: 16 against 3,
more than five times as much. The reason the file and hunk counts are so
low is the same reason the line count is so high: `evaluate.ts` had
nowhere to put a fourth special case and a new operator except *inside*
the one function that already had three of each, so both landed as two
insertions into that one file - one four-line block for the new flag,
one fifteen-line block for the new operator, the second being a near-total
copy of the existing `>` block with the symbol and the comparison changed.
`types.ts` picked up the same one-line field addition the pattern route's
`types.ts` did - the one place the two routes tied exactly.

This is the same shape of honest complication Chain of Responsibility's
act 2 hit, in reverse: there, the baseline won on hunks while losing
badly on lines; here it wins narrowly on hunks *and* files while losing
badly on lines. Whichever single dimension a reader reaches for first,
it will not always be lines - which is exactly why `./dp trade` prints
all three instead of picking a winner.

## What this route made worse

- **The duplicated block is not a bug, and that is worth sitting with.**
  `src/evaluate.ts`'s `>=` block differs from its `>` block by exactly one
  symbol and one comparison operator - a reviewer skimming the diff sees
  fifteen lines that look like *new logic*, when the actual new logic is
  one character. The pattern route's equivalent diff is one table entry,
  and a reviewer sees exactly that much because that is exactly how much
  changed.
- **The pattern route's operator table is invisible from the parser's
  call site.** Reading `parseComparison` alone does not tell you which
  operators exist - that answer lives in `comparison-expression.ts`,
  one file away. The baseline's `if (clause.includes(">="))` is at least
  local to the one function a reader already has open.
