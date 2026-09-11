[🌐 English](./README.en.md)

# Visitor

`Behavioral` · `Visitor` · `●●●●` · ~45 min

## Context

Hollowell's nightly log holds three kinds of record: a seeing measurement,
a weather note, an exposure. Three reductions run over the whole night's
worth of records: a human-readable line, how much telescope time a record
cost, and whether it is worth flagging in the morning review.

## The pressure

Each record kind implements all three reductions as its own methods -
`toLine()`, `costSeconds()`, `isAnomaly()` - so `LogRecord` declares all
three as abstract, and `SeeingRecord`, `WeatherRecord` and `ExposureRecord`
each write all three. Reading "what does an anomaly look like" today means
opening three files and comparing three `isAnomaly()` bodies. Adding a
fourth reduction - and the observatory will eventually want one - is not a
new file. It is the same three files, opened again, each one gaining
another method.

## The target

**Visitor.** Records keep exactly one method - `accept(visitor)` - and
stop knowing what any report computes from them. Each reduction becomes
its own class implementing `LogRecordVisitor<R>`, with one method per
record kind. `isAnomaly` moves from being smeared across three record
classes to being one file, in full, readable top to bottom.

## Done when (act 1)

- `./dp test visitor` is green throughout.
- `./dp shape visitor` no longer finds `toLine()`/`costSeconds()`/
  `isAnomaly()` declared as methods on any record class.
- `SeeingRecord`, `WeatherRecord` and `ExposureRecord` each expose exactly
  one method: `accept`.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 visitor`

## Hints

<details>
<summary>What does <code>accept</code> actually do?</summary>

It calls the one method on the visitor that matches its own record kind,
passing itself: `SeeingRecord.accept(visitor)` calls
`visitor.visitSeeing(this)`, nothing more. This is double dispatch - the
concrete record picks the method, the visitor picks the behavior.

</details>

<details>
<summary>Where does <code>isAnomaly</code>'s logic for a weather record live now?</summary>

Inside `AnomalyVisitor.visitWeather`, next to `visitSeeing` and
`visitExposure` in the same file - all three record kinds' anomaly rules,
readable together, instead of one third of the rule living in each record
class.

</details>

<details>
<summary>Is <code>LogRecordVisitor&lt;R&gt;</code> one interface, or one per report?</summary>

One, generic over its return type. `ToLineVisitor implements
LogRecordVisitor<string>`, `CostVisitor implements
LogRecordVisitor<number>` - the same three method names, different `R`
each time.

</details>

## Reading

- GoF, *Visitor* - especially the section naming this pattern's own
  tradeoff: cheap to add an operation, expensive to add a new element
  class, "the opposite of the more common kind of extensibility."
- Fowler, *Refactoring* (2nd ed.) - no single move for this; closest is
  noticing that three near-identical methods scattered one-per-class are
  the same shape as *Extract Class*, just extracted along the wrong axis
  until regrouped by operation instead of by element.
- [Visitor on refactoring.guru](https://refactoring.guru/design-patterns/visitor)
