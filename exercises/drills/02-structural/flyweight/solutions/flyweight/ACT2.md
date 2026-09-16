# Act 2 — the measured part

Every number here comes from `./dp trade flyweight`, which applies the
two patches in `../../patches/` to an isolated copy and counts the diff.
This is the one drill in the repo where the number *is* the exercise -
see DESIGN.md §9: a Flyweight exercise with no allocation count before
and after is cargo cult.

## What act 2 asked for

Build Caldermoor's full weekday timetable - 200,000 `StopTime`s, across
three physical stops - and prove that `StopMetadata` construction stays
at 3, not 200,000, no matter how many `StopTime`s get built. Nothing
about `renderStopTime`'s output was allowed to change.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   1 existing file modified   ·   1 line touched   ·   1 hunk
```

The one line is `index.ts` exporting `resetStopMetadataAllocations` and
`stopMetadataAllocationCount`. **`timetable.ts` and
`stop-metadata-factory.ts` do not appear in this patch at all** - the
sharing this measurement checks for was already true, structurally,
the moment act 1 finished. Act 2 didn't make this route do anything
new; it just gave it a way to prove what it already did.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   15 lines touched   ·   2 hunks
```

`index.ts` pays the identical one-line export tax the pattern route
paid. `timetable.ts` pays for something new: a `Map<string,
StopMetadata>`, a cache check before constructing, and the bookkeeping
to populate it on a miss - fourteen lines that, read closely, **are a
Flyweight factory**, just inlined into `buildStopMetadata` instead of
named and extracted. This route doesn't avoid inventing the pattern; it
just never gives the invention a name, a file, or a second caller who
could reuse it.

## What this route made worse

- **The guarantee lives entirely in discipline, not in the type
  system.** Nothing stops a third file from building a `StopMetadata`
  object literal directly, bypassing `StopMetadataFactory` and quietly
  breaking the count - the compiler is silent, and only `./dp shape`'s
  advisory regex would ever notice, and only if that new code happened
  to reuse the same forbidden shape.
- **A `StopMetadataFactory` that's never asked "how many did you
  build" is indistinguishable, at review time, from one that leaks.**
  This is DESIGN.md §9's whole point about Flyweight: the pattern's
  argument is empty without `act2/tests/allocation-budget.test.ts`
  actually running the number - a `Map` with no test reading its size
  is aspiration, not a trade.
