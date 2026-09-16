# The route — one TripPlanner facade, two thin call sites

## When to choose this

When two or more callers need to coordinate the same set of subsystems,
in the same order, and neither caller has anything else useful to say
about *how* that coordination happens. A single caller with a genuinely
unique sequencing need - one that skips a subsystem another caller
always uses - is a sign this route is flattening a real difference, not
removing an accidental one.

## What it costs

Both call sites lose the ability to skip a subsystem or reorder the
five calls on their own. `planTrip` and `printTripSummary` no longer
know `StopResolver` or `ScheduleLookup` exist by name - reading "what
order do the five subsystems run in" means opening `trip-planner.ts`
instead of either caller.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `TripPlanner` | Fields for all five subsystems, built once. No `plan` method yet. | `refactor: introduce TripPlanner` |
| 2 | Move the coordination into `plan` | Cut the five-subsystem sequence out of `planTrip`, paste it into `TripPlanner.plan`, unchanged. | `refactor: move trip coordination into TripPlanner.plan` |
| 3 | Reduce `planTrip` to one line | `return tripPlanner.plan(originName, destinationName);` - no subsystem imports left. | `refactor: route planTrip through TripPlanner` |
| 4 | Reduce `printTripSummary` to one line | Same one line, same shared `tripPlanner` instance. | `refactor: route printTripSummary through TripPlanner` |

Steps 3 and 4 are checked against the act-1 suite before the next step
starts - by the time step 4 rewrites `printTripSummary`, the pattern of
"delegate to `tripPlanner.plan`" has already been proven once by
`planTrip`, so there is nothing left to invent.

## Then

```bash
./dp act2 facade
```

What two changed subsystems and one replaced subsystem cost on this
route, and what they would have cost without the pattern, is in
[ACT2.md](./ACT2.md). The full reasoning, with the diagram mapping this
onto the GoF roles, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
