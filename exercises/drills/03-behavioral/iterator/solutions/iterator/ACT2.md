# Act 2 — the measured part

Every number here comes from `./dp trade iterator`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Two new reports - `recentMessages` (most recent first) and `firstMatches`
(stop at `limit` matches) - plus one existing report, `lastEntries`,
retrofitted to stop paying for the whole log when it only needs the tail.
A third new report, `mostRecentMatch`, is `findFirst`'s mirror image,
searching from the end. Three of these four touch points need a traversal
that runs back-to-front; `firstMatches` needs the forward one act 1
already built.

## What it cost on this route

`patches/solution-act2.patch`

```
0 new files   ·   3 existing files modified   ·   74 lines touched   ·   4 hunks
```

One new generator, `ObservationLog.reversed()`, and four small callers.
`lastEntries`, `mostRecentMatch` and `recentMessages` each just walk
`log.reversed()` instead of `[...log]` or a hand-built loop; `firstMatches`
walks `log` itself, unchanged from how act 1 left it. Nobody outside
`log.ts` writes a page-index loop, forward or backward, at any point in
this diff.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
0 new files   ·   2 existing files modified   ·   79 lines touched   ·   3 hunks
```

Fewer files, fewer hunks — and this is worth sitting with rather than
explaining away. `reports.ts` was already the one file every report lived
in, pattern or not, so adding four functions to it was never going to cost
a second file the way, say, Chain of Responsibility's new rule class did.
The number that actually separates the two routes is lines: 79 against 74,
a real but modest gap, not the 2x-3x margins elsewhere in this module.

Here is why it is modest and not larger. Act 1 already banked this
pattern's biggest win - `allMessages` and `findFirst` do not appear in
*either* patch, because neither route touches them; they were already
insulated from paging arithmetic before act 2 existed. What act 2 adds is
a *second* traversal direction, and reverse walking a small fixed-size
array is not an intrinsically expensive thing to write by hand - the
"hard part" this route centralizes is eight lines
(`reversed()`), and each of the three places that would otherwise
re-derive it by hand only saves what that hand-rolled loop costs, roughly
eight lines minus the two or three it takes to call `log.reversed()`
instead. Three sites times a five-or-six-line saving, minus one eight-line
definition, is a real number, just not a dramatic one at this scale.

## What this route made worse

- **The gap would have been larger, or nonexistent, with a different
  number of reuse sites.** With one caller needing reverse order, defining
  `reversed()` costs *more* than inlining the loop once - this route only
  wins because three separate places needed the same back-to-front walk.
  A reader auditing this exercise by lines alone, without reading `git
  log`, would not see that the margin depends on reuse count in a way none
  of this module's other drills make so visible.
- **`ObservationLog` now has two traversal methods that look almost
  identical** (`[Symbol.iterator]` and `reversed()`) and nothing in the
  type system stops a third, fourth, or fifth from accumulating the same
  way if more orders are ever needed. A `direction` parameter on one
  method is the alternative worth considering the moment a third order
  shows up; two was not enough to justify it here.
