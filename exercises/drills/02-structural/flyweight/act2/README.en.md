[🌐 English](./README.en.md)

# Act 2 — an allocation budget, measured

Nothing about what `buildTimetable` or `renderStopTime` do changes.
What's being asked for is a number: build Caldermoor's full weekday
timetable - 200,000 `StopTime`s, across the handful of physical stops
in `STOP_DIRECTORY` - and prove that the number of `StopMetadata`
objects actually constructed stays equal to the number of *distinct*
stops, no matter how many `StopTime`s are built.

`allocation-tracker.ts` already exists - it's been counting every
`StopMetadata` construction since act 1, quietly, through
`recordStopMetadataAllocation`. Act 2 is the first time anything reads
that count and holds it to a budget. Export `resetStopMetadataAllocations`
and `stopMetadataAllocationCount` from your route's `index.ts` so the
suite can ask.

This is not a functional requirement - `renderStopTime` already
produces the right string whether or not `StopMetadata` is shared.
It's the entire reason Flyweight exists, put into a number: a pattern
that trades memory for indirection and is never measured has only paid
the indirection.
