# Act 2 — the measured part

Every number here comes from `./dp trade chain-of-responsibility`, which
applies the two patches in `../../patches/` to an isolated copy and counts
the diff.

## What act 2 asked for

A new check, `InstrumentWarmupRule`, inserted between moon separation and
instrument availability - not appended at the end - for every telescope.
And, for Ridgeline specifically, the entire order reversed to check weather
first, while every other telescope keeps checking altitude first.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   2 existing files modified   ·   12 lines touched   ·   3 hunks
```

One new file (`rules/instrument-warmup.ts`, forty-odd characters longer than
its own `check()` method) and two small edits: `types.ts` gains the optional
field (+1), `chain.ts` gains one import and a short early-return branch for
Ridgeline plus one more link in the standard chain (+10/-1). None of the
five existing rule classes changed - not `AltitudeRule`, not `WeatherRule`,
not even `DomeClearanceRule`, whose "only for movable domes" decision still
lives entirely in `chain.ts` and never had to learn that Ridgeline now runs
a different order too.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   30 lines touched   ·   2 hunks
```

Read file count and hunk count alone and the baseline looks competitive -
same two files, even one fewer hunk than the pattern route. Lines touched is
where the comparison actually resolves: 30 against 12, more than double.
The reason the hunk count is so low is not that the change was small - it is
that `validateRequest` had nowhere to put a second order except *next to*
the first one. Making Ridgeline's order genuinely different, without a
chain to rebuild per telescope, meant duplicating all six checks into a
second `if (telescope.name === "Ridgeline")` branch at the top of the
function - one giant insertion, landing as a single hunk, that happens to
contain a second copy of five checks that did not change at all. The pattern
route never duplicates a check: `AltitudeRule`, `MoonSeparationRule`,
`InstrumentAvailableRule`, `ExposureBudgetRule` and `WeatherRule` each exist
once and get *relinked*, not rewritten, into Ridgeline's order.

This is a genuine, worth-naming case where hunk count actively misleads:
counting "how many separate places changed" makes a single 29-line
duplicated block look cheaper than three small, surgical edits, when the
duplicated block is exactly the kind of change a reviewer should be most
suspicious of.

## What this route made worse

- **`chain.ts` now contains two visibly different shapes of logic** - a
  short early-return special case for Ridgeline, and a longer default path
  for everyone else - which is a smaller version of the same asymmetry the
  no-pattern baseline has in full. A third telescope needing its own order
  would be the test of whether this scales past two.
- **`telescope.name === "Ridgeline"` is a string comparison deciding
  something structural about how requests are validated.** It works, and it
  is what act 2 asked for, but a `Telescope` value with a typo'd name would
  silently get the standard order instead of an error. A `checkOrder` field
  on `Telescope` itself would make this the type checker's problem instead
  of a string-matching bet - worth doing the moment a third telescope needs
  its own order, not obviously worth it for one.
