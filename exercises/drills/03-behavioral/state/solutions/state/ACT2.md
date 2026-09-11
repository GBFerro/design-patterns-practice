# Act 2 — the measured part

Every number here comes from `./dp trade state`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A fourth state, `fault`, reachable unconditionally from any state, from which
only `park()` is legal — `slewTo`, `arrive` and `nudge` must all be refused.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   1 existing file modified   ·   7 lines touched   ·   2 hunks
```

One new file (`states/fault.ts`, implementing the unchanged `TelescopeState`
interface) plus seven lines in `controller.ts`: the import, and a new
`raiseFault(reason)` method that installs a `FaultState` directly, bypassing the
current state's consent — the one place in this solution where a transition is
not the current state's decision, because a hardware fault does not ask
permission.

No existing state file changed. `parkedState`, `trackingState` and
`SlewingState` never needed to learn that `fault` exists, because `FaultState`
only needs to know how to get *back* to `parkedState` — it does not need any
other state to know how to get *to* it.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   19 lines touched   ·   3 hunks
```

Same file count, nearly three times the lines, and a third hunk that the
pattern route does not have. The third hunk is the informative one: `slewTo`'s
guard had to be rewritten from "refuse if slewing" to "refuse if slewing or
fault," which needed its error message to branch on *which* reason applies.
`arrive` and `nudge` needed no changes at all — their guards were already
written as "allow only if X," which happened to refuse `fault` for free. That
asymmetry is exactly the fragility named in the README's description of the
smell: two of the four guards were accidentally robust to a new state, and one
was not, and nothing about reading the code would have told you which was
which before this landed.

## What this route made worse

- **`raiseFault` is the one transition that breaks the "states decide, context
  applies" rule this walkthrough set up as a rule.** It is a deliberate
  exception — a fault is not something the current state approves, it is
  something that happens *to* it — but it means the interface's clean story
  ("every state answers every call") now sits next to one controller method
  that does not go through it at all. A reviewer is right to ask whether that
  exception is named clearly enough; see the controller's own comment on
  `raiseFault` for the attempt.
- **`FaultState` duplicates the "cannot X, the telescope is in fault" message
  three times** (for `slewTo`, `arrive`, `nudge`), the same shape of
  duplication the pattern was supposed to remove. At three near-identical
  throws, extracting a helper is not obviously worth it; at five it would be.
