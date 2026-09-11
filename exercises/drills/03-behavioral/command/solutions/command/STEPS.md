# The route — action records turned into Command objects

## When to choose this

When you have a small, closed set of actions dispatched through one place
(a switch, an if-chain, a single apply function), and you can already see a
reason you will need to run one of them *again*, *later*, or *in reverse* —
undo, redo, retry, replay, or queueing for a different thread. If none of
that is on the horizon, a switch that only ever applies an action forward is
not under-designed; it is just finished.

## What it costs

Two files and a factory function now sit between an `ActionRecord` and the
effect it has. For two action kinds, that is arguably more ceremony than the
six-line switch it replaces — this route is a bet that undo/redo is coming,
not a response to pain that already exists in act 1.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write the `Command` interface | `execute()`, `undo()`, `description` for history. | `refactor: introduce Command` |
| 2 | Extract `MoveFocuserCommand` | Wraps the panel's mutable state and a `deltaMicrons`; `undo()` subtracts what `execute()` added. | `refactor: extract MoveFocuserCommand` |
| 3 | Extract `RotateWheelCommand` | Captures `fromSlot` at `execute()` time, not construction — the slot could change between building the command and running it if it ever sits in a queue first. | `refactor: extract RotateWheelCommand` |
| 4 | Write the factory | `toCommand(state, action)` — the one function left that still switches on `action.type`. | `refactor: introduce the Command factory` |
| 5 | Write `CommandQueue` | `run()` executes and remembers; `history` reads off the remembered descriptions. Nothing about undo yet — act 1 never asked for it. | `refactor: introduce CommandQueue` |
| 6 | Wire the panel through the queue | `panel.run(action)` becomes `queue.run(toCommand(state, action))`. Delete the switch and the `_focuserPosition`/`_filterSlot` fields; the mutable state moves into a small `PanelState` object the commands share. | `refactor: route panel.run through Command + CommandQueue` |

Step 3's capture-at-execute-time choice does not pay off until act 2 — in act
1 alone, construction-time and execute-time capture are observably identical,
because every command still runs the instant it is built. Get it right here
anyway; changing it after a macro already depends on the wrong timing is a
worse place to discover the bug.

## Then

```bash
./dp act2 command
```

What undo/redo and the macro cost, and what they would have cost without the
pattern, is in [ACT2.md](./ACT2.md). The full reasoning, with the diagram
mapping this onto the GoF roles, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
