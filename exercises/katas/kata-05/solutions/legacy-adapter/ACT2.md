# Act 2 — the measured part

Every number here comes from `./dp trade kata-05`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A new legacy status code, `"P"`, maps to a new `InventoryStatus` value, `"pendingInspection"`.
A record with that status also reports `quantity: 0`, regardless of what the legacy file says.
Bin location and timestamp parsing are unaffected.

## What it cost on this route

`patches/legacy-adapter-act2.patch` (not the one that ships as `patches/solution-act2.patch` -
see below):

```
+0 new files   ·   2 existing files modified   ·   8 lines touched   ·   4 hunks
```

Four separate edits: `SUPPORTED_STATUS_CODES` grows a fourth entry, `read()`'s quantity line
grows a conditional, `mapStatus` grows a case, and `types.ts` grows a union member. Each is one
line or two, and each is its own hunk, because the class's own structure - a capability list
kept apart from the switch that does the actual mapping - put them in different parts of the
file.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   10 lines touched   ·   5 hunks
```

More than this route, on both dimensions - `src/` pays for duplicating the whole translation
across two functions, and this route doesn't. The Adapter isn't the most expensive way to
handle this change; it's the second-cheapest of the three measured routes, comfortably ahead
of doing nothing.

## What the other route cost

[`solutions/translation-function/ACT2.md`](../translation-function/ACT2.md) - 6 lines, 3 hunks.
Cheaper than this route on every dimension the budget checks - the winning route, and the one
that ships as `patches/solution-act2.patch`.

## What this route made worse

Not worse than doing nothing, but worse than the plainer alternative. The interface's own
honesty is why: `supportedStatusCodes` exists so a caller can trust what this adapter claims to
handle, which means every new status code has to be added there **and** in `mapStatus`, or the
two quietly disagree. That promise turned one conceptual change into two edits inside
`adapter.ts`, on top of the `types.ts` edit every route already pays - two more lines and one
more hunk than the plain function needed for the identical requirement.
