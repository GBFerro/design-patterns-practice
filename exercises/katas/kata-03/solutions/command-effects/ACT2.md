# Act 2 — the measured part

Every number here comes from `./dp trade kata-03`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Compliance restricts picking up a `"contraband"`-flagged item to the inspection zone
(`x >= 8 && y >= 8`); every other item id, and every other rule, is unaffected.

## What it cost on this route

`patches/command-effects-act2.patch` (not the one that ships as `patches/solution-act2.patch` -
see below):

```
+0 new files   ·   1 existing file modified   ·   6 lines touched   ·   2 hunks
```

`robot.ts` gains the new legality clause **twice** - once inside `runCommand`'s validation, once
inside `replayBatch`'s forward pass - because this route's `applyEffect` extraction never
touched legality branching at all; it is exactly as duplicated here as it is in `src/`.

## What it would have cost without any restructuring

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   6 lines touched   ·   2 hunks
```

Identical. This route's own restructuring, real and defensible as it is, simply never touches
the axis this act 2 needed touched.

## What the winning route cost

[`solutions/command-rules/ACT2.md`](../command-rules/ACT2.md) - 3 lines, 1 hunk, because that
route bet on the legality axis instead.

## What this route made worse

Nothing worse than doing nothing - which is itself the finding. This route's restructuring
wasn't wasted (it still insulates all four apply sites, including the two nobody thinks about
until a batch fails or an operator hits undo, from the next change to how a command's effect is
computed), it just wasn't insurance against *this* change.
