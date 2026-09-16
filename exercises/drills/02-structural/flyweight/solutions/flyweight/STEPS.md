# The route — one StopMetadataFactory, shared by every StopTime

## When to choose this

When a large number of fine-grained objects each need a reference to
one of a *small* number of distinct values, and equality between those
values is by content, not identity - two `StopTime`s at Mill Ave don't
need to know they're the same object, they just both need to be
correct. A small object count, or objects that legitimately differ in
some way the "shared" data can't capture, are both signs this route is
solving a problem the domain doesn't have.

## What it costs

Reading "what does this stop time's stop look like" now means trusting
that `StopMetadataFactory` is the only thing that ever constructs one -
a discipline the type system does not enforce. Nothing stops a second
piece of code from calling `{ stopId, name, ... }` directly and quietly
opting back out of the sharing this route exists to guarantee.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `StopMetadataFactory` | A `Map<string, StopMetadata>` field and one method, `get(stopId)`. Build straight from `STOP_DIRECTORY` on a cache miss. | `refactor: introduce StopMetadataFactory` |
| 2 | Return the cached instance on a hit | Check the map before building anything; only a genuine cache miss calls `recordStopMetadataAllocation`. | `refactor: cache StopMetadata by stop id` |
| 3 | Route `buildTimetable` through the factory | Delete `buildStopMetadata`; call `stopMetadataFactory.get(entry.stopId)` instead. | `refactor: route buildTimetable through StopMetadataFactory` |

Step 1 and step 2 are usually written together - a factory with no
caching isn't a Flyweight, it's a rename. Step 3 is checked against the
act-1 suite before moving on: `renderStopTime`'s output can't change,
because nothing about *what* a `StopMetadata` contains was supposed to.

## Then

```bash
./dp act2 flyweight
```

What sharing a `StopMetadata` object actually buys, measured in actual
allocations rather than argued in prose, is in [ACT2.md](./ACT2.md).
The full reasoning, with the diagram mapping this onto the GoF roles,
is in [WALKTHROUGH.md](./WALKTHROUGH.md).
