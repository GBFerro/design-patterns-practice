# Act 2 — the measured part

Every number here comes from `./dp trade proxy`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Refuse a lookup for `svc-9`, a restricted maintenance vehicle, from
every caller - with an error naming the vehicle, and without the
restricted id ever reaching the real lookup. Every other vehicle keeps
working, from both `currentPositions` and `printFleetPositions`.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   3 existing files modified   ·   13 lines touched   ·   3 hunks
```

Two of the three edits (`index.ts`, `vehicle-directory.ts`) are the
same tax every route pays - an export line for the measurement, and one
data row for the restricted vehicle. **The third is
`vehicle-position-proxy.ts`, and it is the only file that changes
because of the actual requirement.** `dashboard.ts` and
`vehicle-position-cli.ts` do not appear in this patch at all - neither
caller was told a restriction exists.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   4 existing files modified   ·   14 lines touched   ·   4 hunks
```

The same two shared files pay the same tax the pattern route pays. The
difference is the other two: `dashboard.ts` and `vehicle-position-cli.ts`
each need the identical restricted-set check `vehicle-position-proxy.ts`
needed once. One route paid that once; the other paid it twice, because
without a shared object standing between every caller and the real
service, there was nowhere else for the check to go - it had to land in
the caller, or in the subject, and this exercise ruled both out.

## What this route made worse

- **A third caller pays nothing extra to be correct, or everything
  extra to be wrong.** A future caller that talks to
  `VehiclePositionProxy` inherits the restriction automatically; a
  future caller that talks to `RealVehiclePositionService` directly -
  which nothing prevents - inherits nothing. The guarantee holds only
  for callers that go through the proxy, and the type system doesn't
  enforce that they do.
- **One more layer between a caller and the data it asked for**, for a
  service this exercise's real subject answers instantly. The
  indirection is worth it here because the requirement showed up twice
  (caching, then access control); a domain where it only ever shows up
  once might not clear that bar.
