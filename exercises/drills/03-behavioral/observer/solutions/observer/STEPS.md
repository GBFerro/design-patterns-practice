# The route — built-in consumers as observers, behind one notify loop

## When to choose this

When a fixed set of listeners might stop being fixed — a new one could show
up that the publisher never heard of, or an existing one might need to leave
without the publisher's code changing. If the set of listeners really is
closed forever and nothing about the domain suggests otherwise, four named
calls are simpler than a list and an interface, and simpler is not a
consolation prize.

## What it costs

Reading "what happens when an alert is published" now means finding the loop,
then separately finding every file that implements `onAlert` to know what
actually happens. The four-line version answered that question by itself, top
to bottom, in one place.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write the `AlertObserver` interface | One method: `onAlert(alert)`. | `refactor: introduce AlertObserver` |
| 2 | Rename `record` → `onAlert` on `ControlRoomLog` | No behavior change - same push, same array. | `refactor: ControlRoomLog speaks onAlert` |
| 3 | Rename `page` → `onAlert` on `OperatorPager` | Same move, second consumer. | `refactor: OperatorPager speaks onAlert` |
| 4 | Rename `respond` → `onAlert` on `DomeGuard` | The early-return on seeing alerts moves over unchanged. | `refactor: DomeGuard speaks onAlert` |
| 5 | Rename `append` → `onAlert` on `NightReport` | Fourth and last consumer. | `refactor: NightReport speaks onAlert` |
| 6 | Replace the four named calls with one loop over `observers` | `publish()` becomes `for (const observer of this.observers) observer.onAlert(alert)`, where `observers` is populated with the four built-ins in the constructor. | `refactor: route publish() through a single observer loop` |

Steps 2–5 are individually almost invisible in a diff — one method name
changes per file — which is exactly why they are four separate commits rather
than one. A reviewer (or you, a week later) can see that each consumer kept
behaving identically through its own rename, instead of having to trust one
big commit that renamed four things and introduced a loop at the same time.

## Then

```bash
./dp act2 observer
```

What the fifth consumer, unsubscribe, and the throwing observer cost, and
what they would have cost without the pattern, is in
[ACT2.md](./ACT2.md). The full reasoning, with the diagram mapping this onto
the GoF roles, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
