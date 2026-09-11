[🌐 English](./README.en.md)

# Act 2 — two requirements, and they do not behave the same way

## Part one: a fourth report

Ops wants **`operatorNote(record)`** - a note for whoever is on shift, or
`null` if the record needs no attention. A weather record with
`severity >= 8` notes `"consider closing the dome"`. An exposure record
longer than 1800 seconds notes `"long exposure - verify guiding"`. A
seeing record never has anything to say.

## Part two: a fourth record kind

The dome itself now logs its own events. **`DomeRecord`** has a
`domeState` (`"opened"` or `"closed"`) and a `reason`. It costs no
telescope time, is never an anomaly by itself, and has no operator note of
its own (the event that closed the dome already produced one). Its line
reads `dome <state>: <reason>`.

Every one of the four reports - `toLine`, `costSeconds`, `isAnomaly`, and
the new `operatorNote` - has to answer for `DomeRecord` too. All four act-2
tests exercise it directly.
