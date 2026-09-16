[🌐 English](./README.en.md)

# Proxy

`Structural` · `Proxy` · `●●○` · ~30 min

## Context

Caldermoor's live-position feed is slow - it stands in for a real
network call to the fleet's radio system. Two callers need vehicle
positions: the live dashboard, which can ask for the same vehicle from
more than one widget in a single refresh, and the ops CLI a dispatcher
runs by hand.

## The pressure

`currentPositions` and `printFleetPositions` each construct their own
`RealVehiclePositionService` and call it directly, once per vehicle id
- even when the same id appears twice in one batch. Nothing is wrong
yet, both functions return the right data - but every request pays the
full cost of the slow lookup, including requests for a vehicle this
exact batch already asked about.

## The target

**Proxy.** One `VehiclePositionProxy` implements the same
`VehiclePositionService` interface the real service does, and caches
each vehicle's position the first time it's asked for. `currentPositions`
and `printFleetPositions` each talk to a `VehiclePositionProxy` instead
of the real service directly - neither one can tell the difference,
because the proxy's interface is identical to the thing it stands in for.

## Done when (act 1)

- `./dp test proxy` is green throughout.
- `VehiclePositionProxy` exists, implements `VehiclePositionService`,
  and caches by vehicle id.
- Neither `currentPositions` nor `printFleetPositions` constructs or
  calls a `RealVehiclePositionService` directly.
- Your `git log --oneline` shows small steps, each leaving the suite
  green.

## Then run `./dp act2 proxy`

## Hints

<details>
<summary>What does `VehiclePositionProxy` need to hold onto?</summary>

The real service it wraps, and a `Map<string, VehiclePosition>` cache -
built once, checked before ever calling the real service.

</details>

<details>
<summary>Does `VehiclePosition`'s shape need to change for this?</summary>

No. The proxy returns exactly what the real service returns - callers
can't tell, at the type level or the value level, which one actually
answered.

</details>

<details>
<summary>Should `currentPositions` and `printFleetPositions` share one `VehiclePositionProxy` instance?</summary>

Either compiles and passes act 1. Each function building its own is the
simpler move, and is what this exercise's solution does - the value of
the pattern here is in the *interface*, not in whether the cache is
literally shared across every caller in the program.

</details>

## Reading

- GoF, *Proxy* - the *Intent* section: "provide a surrogate or
  placeholder for another object to control access to it."
- [Proxy on refactoring.guru](https://refactoring.guru/design-patterns/proxy)
