# The route — state objects behind a shared transition interface

## When to choose this

When a handful of states each make their **own** decisions about what is legal
and what comes next, and those decisions are genuinely different per state (not
just a label attached to otherwise-identical behaviour — that would be a plain
enum and a `switch`, not State).

## What it costs

Five files instead of one, and the "transition table" that used to be
reconstructable by skimming one class is now one fact per file. In exchange,
every illegal transition becomes a thing the type system and the throw
statements make impossible to express quietly — there is no code path left
where an unhandled status silently does the wrong thing.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Name the transition table | Before touching code, write down the four states × four calls as a table: legal, illegal, or no-op. This is the spec the rest of the route checks itself against. | (no commit — planning) |
| 2 | Introduce the interface | `TelescopeState` with `park`, `slewTo`, `arrive`, `nudge`, each returning `TelescopeState`. | `refactor: introduce TelescopeState` |
| 3 | Extract `ParkedState` | The easiest state: park is a no-op, slewTo starts a slew, arrive and nudge throw. Controller delegates only these two calls to it while `currentStatus === "parked"`; the other two stay on the old path. | `refactor: extract ParkedState` |
| 4 | Extract `TrackingState` | Mirror of step 3 for tracking. | `refactor: extract TrackingState` |
| 5 | Extract `SlewingState`, carrying its target | This is the one state with data: the target it is slewing toward, used in the "already in progress" message. | `refactor: extract SlewingState` |
| 6 | Replace the controller's fields with a single `current: TelescopeState` | Delete `currentStatus` and `slewTarget`. Every method becomes a one-line delegation to `this.current`. | `refactor: replace status/target fields with a single state object` |
| 7 | Centralise the log | Move the four `this.record(...)` calls into one `apply(next, action)` helper that every delegation goes through. | `refactor: record every transition in one place` |

Step 1 is not a commit, and it is the step people skip because it produces no
diff. Do it anyway: the table is what tells you, at step 3, that `ParkedState`
has no business implementing `arrive` as anything but a throw — without the
table that is a guess, and with it, it is a lookup.

## Then

```bash
./dp act2 state
```

What the fault state costs, and what it would have cost without the pattern,
is in [ACT2.md](./ACT2.md). The full reasoning, with the diagram mapping this
onto the GoF roles, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
