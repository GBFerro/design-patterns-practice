# The route — one VehiclePositionProxy, shared by every caller

## When to choose this

When two or more callers talk to the same expensive, slow or sensitive
resource through a narrow interface, and something about that access -
caching it, guarding it, deferring it - is worth handling in one place
rather than trusting every caller to handle it identically. A single
caller, or a resource cheap enough that the indirection costs more than
it saves, are both signs this route is solving a problem the domain
doesn't have yet.

## What it costs

Every caller of `VehiclePositionService` now goes through an object
that isn't the real thing - correct by construction, since the proxy
implements the identical interface, but one more file between "I need
this vehicle's position" and the code that actually knows how to get
it.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `VehiclePositionProxy` | Implements `VehiclePositionService`. Holds the real service and a `Map` cache. `currentPosition` checks the cache before delegating. | `refactor: introduce VehiclePositionProxy` |
| 2 | Route `currentPositions` through it | `dashboard.ts` builds a `VehiclePositionProxy` instead of calling `RealVehiclePositionService` directly. | `refactor: route currentPositions through VehiclePositionProxy` |
| 3 | Route `printFleetPositions` through it | Same move, in `vehicle-position-cli.ts`. | `refactor: route printFleetPositions through VehiclePositionProxy` |

Step 1 is checked in isolation - a cache that sometimes skips its own
check is worse than no cache. Steps 2 and 3 are each checked against
the act-1 suite before the next one starts; by the time step 3 touches
`vehicle-position-cli.ts`, the pattern of "build a proxy instead of the
real service" has already been proven once.

## Then

```bash
./dp act2 proxy
```

What adding access control costs on this route, and what it would have
cost without the pattern, is in [ACT2.md](./ACT2.md). The full
reasoning, with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
