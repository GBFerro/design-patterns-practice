# Act 2 — the measured part, and the honest non-verdict

This exercise's `act2.axis` is `orthogonal`: act 2 has two genuinely different
requirements bundled together, one along the axis this pattern protects and
one along the axis it doesn't. `./dp trade visitor` prints one combined
number for each route and does not score either as a win - that is
deliberate. The breakdown below, file by file, is what makes the two halves
visible inside that one number.

## What act 2 asked for

**Part one** (cheap, if the pattern was worth it): a fourth report,
`operatorNote`, returning a note for whoever is on shift or `null`.
**Part two** (expensive, on purpose): a fourth record kind, `DomeRecord`,
that every one of the four reports - including the brand-new one - has to
answer for.

## What it cost on this route

`patches/solution-act2.patch`, combined:

```
+2 new files   ·   6 existing files modified   ·   26 lines touched   ·   11 hunks
```

Split by which half of act 2 caused it:

| | files touched | lines | hunks |
| --- | --- | --- | --- |
| **Part one** (`operatorNote`) | `reports.ts` (+1 new file) | 6 | 2 |
| **Part two** (`DomeRecord`) | `visitor.ts`, `reports/anomaly.ts`, `reports/cost.ts`, `reports/to-line.ts` (+1 new file) | 17 | 8 |
| shared | `index.ts` (exports both) | 3 | 1 |

Part one is exactly what the walkthrough promised: one new file
(`reports/operator-note.ts`), and the only *existing* file it touches is
`reports.ts`, to wire the new free function through `accept`. Not one
record class, not the visitor interface, not any of the other three
reports.

Part two is the bill. `LogRecordVisitor<R>` gains `visitDome`, and every
class that implements it - `ToLineVisitor`, `CostVisitor`, `AnomalyVisitor`,
and the `OperatorNoteVisitor` this same act 2 just added - gains a method
too. Four files, for one new record kind that itself needed exactly one
new file to define.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same two requirements, on the act-1
`src/`:

```
+1 new file   ·   6 existing files modified   ·   21 lines touched   ·   6 hunks
```

Split the same way:

| | files touched | lines | hunks |
| --- | --- | --- | --- |
| **Part one** (`operatorNote`) | `record.ts`, `records/seeing.ts`, `records/weather.ts`, `records/exposure.ts`, `reports.ts` | 18 | 5 |
| **Part two** (`DomeRecord`) | *(none - only the new file)* | 0 | 0 |
| shared | `index.ts` | 3 | 1 |

This is the mirror image of the pattern route, almost exactly. Adding a
fourth *operation* without Visitor means adding an abstract method to
`LogRecord` and implementing it on all three existing record classes -
four files, before `reports.ts`'s wrapper is even counted. Adding a fourth
*record kind* costs nothing beyond writing the one file that kind needs -
`DomeRecord` implements all four methods itself, and touches nothing else,
because there was never a shared interface for it to extend.

**Neither route is cheaper overall - 26 lines against 21, 11 hunks against
6, and the totals depend entirely on how the two halves happen to balance
this time.** Halve the reports asked for and this act 2 favors the
pattern; halve the record kinds asked for instead and it favors the
baseline just as clearly. That balance point, not either total, is the
actual lesson.

## What this route made worse

- **`OperatorNoteVisitor` had to implement `visitDome` on the same commit
  that introduced both of them**, which is a coincidence of this act 2's
  ordering, not a rule - a genuinely new report added *after* `DomeRecord`
  already existed would need `visitDome` from the start, with no
  transition period where it's missing.
- **Nothing catches a report visitor at compile time if `LogRecordVisitor<R>`
  ever became easier to satisfy partially** (an optional method, a default
  implementation) - the whole safety property act 2's part two exercises
  (the compiler refuses to build until every visitor handles `DomeRecord`)
  depends on every method staying mandatory.
