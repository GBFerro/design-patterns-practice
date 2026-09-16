# Act 2 — the measured part, and the honest non-verdict

This exercise's `act2.axis` is `orthogonal`: act 2 arrives along an axis
Decorator does not protect, and the numbers below do not make the usual
case for the pattern. `./dp trade decorator` prints these same figures
and does not score them as a win or a loss - that is deliberate.

## What act 2 asked for

A senior discount - a flat 50-cent reduction, not a percentage - with a
required order: the senior discount must be applied **before** the
student discount, because a flat discount and a percentage discount do
not commute. Applying them in the wrong order produces a real, different
(lower) price, not a rounding quirk.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   3 existing files modified   ·   9 lines touched   ·   3 hunks
```

The new file is `senior-discount.ts` - the flat discount, on its own,
same shape as every other decorator. The three existing edits are
`types.ts` (the new flag), `index.ts` (the new export), and
`calculate-fare.ts` - where the entire ordering requirement is satisfied
by inserting **one line**, `if (options.isSenior) fare = new
SeniorDiscount(fare);`, in the position before the student-discount
line.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   6 lines touched   ·   2 hunks
```

Fewer files, fewer lines, fewer hunks - the no-pattern route is cheaper
by every number `./dp trade` prints. It should be: the entire ordering
requirement was satisfied there too by inserting one line,
`if (options.isSenior) price = price - SENIOR_DISCOUNT_CENTS;`, in the
right position in the same function that already existed.

**Neither route made the ordering requirement itself any easier to get
right, and the pattern route is strictly more expensive here** - it pays
an extra file and an extra export line for a modifier the no-pattern
route folds into the function it already had open. That is the honest
result, and it is the result worth having: Decorator's entire value
proposition is that modifiers compose freely, in whatever order a caller
chooses to wrap them - which is exactly what makes "compose them in
*this specific* order, and only this order" a requirement the pattern
was never going to make easier.

## What this route made worse

- **The order lives in exactly one place, and nothing enforces it.**
  `calculateFare`'s four `if` statements, read top to bottom, are the
  *entire* specification of "senior before student." Any other code that
  constructs `new StudentDiscount(new SeniorDiscount(fare))` directly -
  a second call site, a test double, a future refactor - would compile
  cleanly, run without error, and silently produce the wrong price. The
  no-pattern function has the identical weakness, in the identical
  place, which is the point: Decorator did not add this risk, but it
  also did not remove it.
- **A new decorator class costs an export line the no-pattern route
  never pays**, because every decorator has to be named somewhere a
  caller can reach it. That tax is invisible on modifiers that don't
  interact with anything, and it shows up here only because this act 2
  happened to add a file at the same time it added an ordering
  constraint - two separate costs that are easy to conflate into one
  number.
