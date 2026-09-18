# Act 2 — the measured part

Every number here comes from `./dp trade picking-policy`, which applies the
two patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A third mode, `surge`, that only triggers from `batch` mode when three or
more orders outside the current batch pile up - and that falls back to
`batch` (never straight to `individual`) once it clears.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   3 existing files modified   ·   12 lines touched   ·   4 hunks
```

The new file is `states/surge-state.ts` - it looks exactly like
`BatchState`, because a surge and a batch are grouped the same way; the
only new idea in it is "resume the suspended batch, or go idle, once this
group is empty." The three edited files: `BatchState.plan` gains a
four-line check ("are three orders waiting outside me? hand off to
surge"), `PolicyState`'s `name` union gains `"surge"`, and
`PickInstruction` gains `urgent?`. **Nothing outside `states/` changed.**
`PickingPolicy` itself - the class every caller actually holds - is
untouched.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   31 lines touched   ·   5 hunks
```

Fewer files, more than double the lines, and more hunks. `src/` has no
seam to hand the third mode off to - `planNextPick` and `recordPicked` both
grow a second layer of `if` on top of the one they already had, and the
whole three-mode machine now lives in two functions instead of four small
classes.

## What the other two candidates cost

Neither of these patches ships in `patches/` under the names `./dp trade`
looks for - only one solution can be `absorbsAct2`. They're measured the
same way, kept as `strategy-act2.patch` and `template-method-act2.patch`
for anyone who wants to reproduce the numbers:

```
strategy          +0 new files · 3 existing files modified · 58 lines touched · 5 hunks
template-method   +0 new files · 2 existing files modified · 39 lines touched · 3 hunks
```

Both are worse than state on lines, and both make the same shape of
mistake: neither `RoutingStrategy` nor `PickingRound` owns a transition,
so `PickingPolicy`'s wrapper - already the one place holding `mode` and
`batchOrderIds` - is also the only place surge can land. See
[`solutions/strategy/ACT2.md`](../strategy/ACT2.md) and
[`solutions/template-method/ACT2.md`](../template-method/ACT2.md) for the
detail.

## What this route made worse

- **The state machine is now spread across four files** (`policy-state.ts`,
  `individual-state.ts`, `batch-state.ts`, `surge-state.ts`) instead of one.
  Seeing the whole picture - all three modes and every transition between
  them - means opening all four, where `src/`'s version, for all its
  duplication, is at least all in one place.
- **`BatchState` now knows `SurgeState` exists**, and `SurgeState` knows
  `BatchState` - a small, deliberate circularity. Each state still only
  reasons about its own transitions, but the states are no longer fully
  independent of each other's names.
