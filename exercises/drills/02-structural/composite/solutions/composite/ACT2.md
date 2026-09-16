# Act 2 — the measured part

Every number here comes from `./dp trade composite`, which applies the
two patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A new node kind, `WalkingTransfer` - a leaf whose only contribution is
its own walking time - usable anywhere inside a `Journey`, alongside
`Line`s and `Segment`s, at any depth.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   1 existing file modified   ·   1 line touched   ·   1 hunk
```

The new file is `walking-transfer.ts` - a leaf implementing `RouteNode`,
nothing more. The one existing file is `index.ts`, and the one line is
its export. **`route-node.ts`, `composite-node.ts`, `line.ts`,
`journey.ts` and `total-minutes.ts` do not appear in this patch at
all.**

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+1 new file   ·   3 existing files modified   ·   7 lines touched   ·   5 hunks
```

Every number is worse, not just one of them. `types.ts` has to import
the new class and widen `RouteNode`'s union. `total-minutes.ts` has to
grow a fifth `instanceof` branch - and that branch has to land *before*
the `Line`/`Journey` checks, or a `WalkingTransfer` would silently fall
through the reduce logic those two share. `index.ts` needs the same
one-line export the pattern route also needed - the only place the two
routes' costs actually overlap.

This is the cleanest act 2 in the structural module so far: the pattern
route pays exactly the tax every route pays (one export line) and
nothing else, because a `RouteNode` implementation only has to be
*true*, never *registered* anywhere. The baseline route pays that same
tax, plus two more files that had to be told a fifth kind now exists.

## What this route made worse

- **No single file lists every node kind that exists.** The baseline's
  `RouteNode` union in `types.ts` was a complete, greppable list; the
  pattern route has no equivalent - the only way to find every
  `RouteNode` implementation is to search for `implements RouteNode`
  and trust nothing was missed.
- **A leaf that gets `totalMinutes()` wrong fails silently at the type
  level.** Forgetting to implement it is a compile error, but
  implementing it with the wrong formula (say, returning a constant
  instead of `this.walkMinutes`) compiles cleanly and only shows up as a
  wrong number, exactly like the baseline's `instanceof` branches would.
  The pattern removes the *missing-branch* class of bug, not the
  *wrong-body* class.
