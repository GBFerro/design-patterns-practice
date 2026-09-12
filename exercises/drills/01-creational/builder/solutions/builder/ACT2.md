# Act 2 — the measured part, and the honest non-verdict

This exercise's `act2.axis` is `orthogonal`: the numbers below do not make
the usual case for the pattern. `./dp trade builder` prints these same
figures and does not score them as a win or a loss - that is deliberate,
and the reason is more interesting than a tie usually is.

## What act 2 asked for

A fifth stage, `applyPackaging(packaging: "standard" | "gift-wrap")`, and a
rule spanning it and an existing one: **gift-wrap packaging is not
available for rush jobs.** The rule has to hold regardless of which stage
runs first - `applyRush` then `applyPackaging`, or the other way around.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   2 existing files modified   ·   17 lines touched   ·   8 hunks
```

`types.ts` gains the `Packaging` type, one interface method, and one
`Quote` field. `quote-builder.ts` gains the new `applyPackaging` stage (a
plain mutation, no check) and one new line in `build()` - the only place
the rush/packaging rule is written down.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the closure-based
draft in `src/`:

```
+0 new files   ·   2 existing files modified   ·   17 lines touched   ·   8 hunks
```

**The two patches are the same size, hunk for hunk, line for line.**
That is not a bug in the exercise - it is the finding. `types.ts` costs
the same on both routes, because the frozen interface shape is identical
either way. What's left is the stage itself: baseline's `applyPackaging`
has to carry its own check (`if (packaging === "gift-wrap" && rushFee >
0)`), and baseline's *existing* `applyRush` needs a second, mirrored copy
of that same check (`if (rushFee > 0 && packaging === "gift-wrap")`) so
that neither order of calls slips through. Two small checks, in two
different stages, land at almost exactly the line and hunk cost of: one
small check in `build()`, plus one trivial mutation-only stage that costs
about as many lines as baseline's validating one did. The centralization
Builder buys did not come for free here - it moved cost out of *two*
places and into *one*, but the one place ended up costing what the two
places used to cost combined, roughly.

## Why this axis is orthogonal, not aligned

The other creational drills this session (Factory Method, Abstract
Factory) got real leverage from *multiplying* a change across several
call sites or several files - a table replacing a duplicated switch, one
factory class replacing three scattered ones. Builder has no such
multiplication to offer here: there is exactly one place a quote gets
assembled, on both routes, so there is no second or third call site for
the pattern to spare a caller from touching. What Builder actually
changes is *how many places a validation rule has to be written down to
stay order-independent* - one, instead of one per field it touches - and
that difference is real, but it is a difference in *reasoning burden*,
not in the size of the diff a fifth field happens to produce. A rule
spanning three fields instead of two would start to separate the two
routes on line count (baseline needs three mirrored checks; the pattern
route still needs exactly one) - this exercise's act 2 asks for the
minimum spanning case, which is exactly where the two routes tie.

## What this route made worse

- **A caller holding an in-progress draft can now be surprised by another
  caller holding the same reference** - `applyRush` mutates the shared
  state object and returns `this`, so two variables pointing at "the same
  draft" are not two independent drafts the way two closures from the
  baseline route always were. Nothing in this exercise exploits that, but
  nothing rules it out either; see WALKTHROUGH.md's "What it cost."
- **The state object accepts a partially-inconsistent shape at every
  point except the very end.** Between `startQuote` and `build()`, a
  `QuoteBuilder` can legally be holding a rush fee AND gift-wrap
  packaging at the same time - the baseline route's eagerly-checked
  stages never allow that combination to exist even transiently.
