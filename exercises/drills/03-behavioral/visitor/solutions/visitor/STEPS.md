# The route — reports become visitor classes; records only know how to accept one

## When to choose this

When the set of record kinds is stable and the set of operations over them
is not - a reporting or reduction layer over a closed hierarchy, where new
reports arrive more often than new kinds of thing to report on. If the
opposite is true (new kinds arrive constantly, the report list is fixed),
this route earns you the exact cost act 2 demonstrates. Read
[ACT2.md](./ACT2.md) before betting on this pattern for a hierarchy you
expect to grow.

## What it costs

A new report is one new file, full stop. A new record kind is the most
expensive single change this codebase can ask for: it touches the visitor
interface and every class that implements it.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `LogRecordVisitor<R>` | One method per record kind, generic over the return type. | `refactor: introduce LogRecordVisitor` |
| 2 | Give `LogRecord` one abstract method, `accept` | Delete nothing from the concrete classes yet. | `refactor: LogRecord declares accept` |
| 3 | Implement `accept` on `SeeingRecord` | Calls `visitor.visitSeeing(this)`. Its three report methods still exist, unused. | `refactor: SeeingRecord implements accept` |
| 4 | Implement `accept` on `WeatherRecord` | Same shape. | `refactor: WeatherRecord implements accept` |
| 5 | Implement `accept` on `ExposureRecord` | Same shape. | `refactor: ExposureRecord implements accept` |
| 6 | Extract `ToLineVisitor` | One `visit*` method per record kind, copied from the three `toLine()` bodies. | `refactor: extract ToLineVisitor` |
| 7 | Extract `CostVisitor` | | `refactor: extract CostVisitor` |
| 8 | Extract `AnomalyVisitor` | | `refactor: extract AnomalyVisitor` |
| 9 | Route `toLine`/`costSeconds`/`isAnomaly` through `accept` | Each becomes `record.accept(new XVisitor())`. | `refactor: route reports through accept` |
| 10 | Delete `toLine()`/`costSeconds()`/`isAnomaly()` from the three record classes | Only `accept` remains. | `refactor: records keep only accept` |

Steps 3-5 (wire `accept` on each record) happen **before** steps 6-8
(extract the visitors) - by the time `ToLineVisitor` is written in step 6,
every record already knows how to reach it, so the extraction is a pure
copy-and-regroup with the suite staying green against the *old* methods
the whole time, not a simultaneous "move the logic and rewire the caller."

## Then

```bash
./dp act2 visitor
```

What a fourth report and a fourth record kind cost, on both halves of
this act 2, is in [ACT2.md](./ACT2.md) - read it even if you are sure you
already know which way Visitor cuts. The full reasoning, with the diagram
mapping this onto the GoF roles, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
