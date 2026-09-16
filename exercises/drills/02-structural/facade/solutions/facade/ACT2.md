# Act 2 — the measured part

Every number here comes from `./dp trade facade`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Caldermoor's new Green Line, to a new stop, Riverside. Three changes,
all inside the five subsystems `TripPlanner` already coordinates:
`ScheduleLookup` needs a `riversideTimezone` to buffer Green Line
departures, `FareCalculator` needs a `SurchargeService` to add a flat
surcharge on Green Line trips, and `AlertService` is retired in favor of
`RealTimeAlertService`, which already knows about a Green Line alert
the static table never did. Every existing Red Line and Blue Line trip
must come back with the numbers it always has.

## What it cost on this route

`patches/solution-act2.patch`

```
+2 new files   ·   5 existing files modified   ·   28 lines touched   ·   5 hunks
```

The two new files are `surcharge-service.ts` and
`real-time-alert-service.ts` - each a small class, same shape as the
subsystem it sits beside. Four of the five existing edits
(`stop-resolver.ts`, `route-finder.ts`, `schedule-lookup.ts`,
`fare-calculator.ts`) are the Riverside data and the two constructors
growing a parameter - work every route pays, pattern or not. **The
fifth is `trip-planner.ts`, and it is the only file that changes because
of who calls the subsystems, not what the subsystems do.** `planTrip`
and `printTripSummary` do not appear in this patch at all.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+2 new files   ·   6 existing files modified   ·   37 lines touched   ·   6 hunks
```

The same four subsystem files pay the same tax the pattern route pays.
The difference is the other two: `trip-planning-api.ts` and
`trip-summary-cli.ts` each need the identical edit `trip-planner.ts`
needed once - swap two constructor calls, replace a third. One route
paid that once; the other paid it twice, because nothing stopped the
two callers from drifting the moment either one's coordination logic
needed to change.

## What this route made worse

- **A caller with a genuine reason to skip a subsystem has nowhere to
  go.** `TripPlanner.plan` always runs all five, in the same order,
  because that was the entire premise of centralizing it. A future
  caller that only needs a fare estimate - no alerts, no schedule call -
  either pays for all five anyway or has to route around `TripPlanner`
  entirely, which is exactly the duplication act 1 removed.
- **`TripPlanner` is now the one file every one of the five subsystems'
  callers depends on.** A bug in how `TripPlanner` sequences its calls
  breaks every caller identically - which is also its whole advantage:
  act 1's version let the two callers' sequencing silently drift apart,
  and this route makes that impossible by construction.
