# Act 2 — the measured part

Every number here comes from `./dp trade kata-03`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Compliance restricts picking up a `"contraband"`-flagged item to the inspection zone
(`x >= 8 && y >= 8`); every other item id, and every other rule, is unaffected.

## What it cost on this route

`patches/command-rules-act2.patch`, which is what ships as `patches/solution-act2.patch`:

```
+0 new files   ·   1 existing file modified   ·   3 lines touched   ·   1 hunk
```

`validateCommand` gains one new clause inside its pick-up branch - the only place a command's
legality needs to exist, because both `runCommand` and `replayBatch` already call through it.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   6 lines touched   ·   2 hunks
```

Twice the lines and one more hunk: `src/` has no shared `validateCommand`, so the new clause is
written twice, once inside `runCommand`, once inside `replayBatch`'s forward pass.

## What the other route cost

[`solutions/command-effects/ACT2.md`](../command-effects/ACT2.md) - the same 6 lines, 2 hunks
as the baseline, because that route never touched the legality branching at all.

## What this route made worse

Nothing measurable. The bet this route made - that legality was the axis worth relieving
first - is exactly the axis the inspection-zone rule landed on.
