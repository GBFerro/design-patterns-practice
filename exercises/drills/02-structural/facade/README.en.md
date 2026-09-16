[🌐 English](./README.en.md)

# Facade

`Structural` · `Facade` · `●●○` · ~30 min

## Context

Planning a Caldermoor trip means asking five separate subsystems, in a
specific order: resolve the two stop names, find a route between them,
look up the next departure, calculate the fare, and check for active
service alerts.

## The pressure

Two callers need a trip plan - the HTTP handler behind `GET /trips/plan`
and the `dp-cli trip-summary` command - and each one constructs all five
subsystems itself and calls them in the same order, because nothing else
does it for them. `planTrip` and `printTripSummary` are, today, the same
eleven lines typed twice. Nothing is wrong yet - both functions work,
and both are easy to read on their own - but a caller has to know all
five subsystems exist, by name, in the right order, just to plan a trip.

## The target

**Facade.** One `TripPlanner` class holds all five subsystems and knows
the order they run in. `planTrip` and `printTripSummary` each become one
line: build (or reuse) a `TripPlanner` and call `.plan(origin,
destination)`. Neither caller imports a subsystem by name anymore.

## Done when (act 1)

- `./dp test facade` is green throughout.
- `TripPlanner` exists, holds all five subsystems, and is the only place
  that imports `StopResolver`, `RouteFinder`, `ScheduleLookup`,
  `FareCalculator` and `AlertService` together.
- `planTrip` and `printTripSummary` each call `TripPlanner.plan` and do
  nothing else - no subsystem is instantiated inside either one.
- Your `git log --oneline` shows small steps, each leaving the suite
  green.

## Then run `./dp act2 facade`

## Hints

<details>
<summary>What does `TripPlanner` need to hold?</summary>

All five subsystems, as fields - built once, not per call. `plan` reads
them; it doesn't construct them.

</details>

<details>
<summary>Should `planTrip` and `printTripSummary` share one `TripPlanner` instance, or each build their own?</summary>

Either compiles and passes act 1. The subsystems here hold no per-call
state, so a `TripPlanner` built once, at module load, and reused by both
callers is the leaner choice - one object, not two doing the same work.

</details>

<details>
<summary>Does the order the five subsystems run in belong in `TripPlanner`, or in each caller?</summary>

`TripPlanner`, and only there. That's the entire point of extracting it
- one function knows the order once, instead of two functions agreeing
to keep re-typing it the same way.

</details>

## Reading

- GoF, *Facade* - the *Intent* section: "provide a unified interface to
  a set of interfaces in a subsystem... defines a higher-level interface
  that makes the subsystem easier to use."
- [Facade on refactoring.guru](https://refactoring.guru/design-patterns/facade)
