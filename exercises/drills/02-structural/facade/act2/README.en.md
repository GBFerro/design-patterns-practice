[🌐 English](./README.en.md)

# Act 2 — two subsystems change their internals, and one is replaced

Caldermoor just opened the Green Line, out to a new stop, Riverside.
Nothing about the existing Red Line or Blue Line trips changes - but
three things land on trip planning at once, all inside the five
subsystems `TripPlanner` already coordinates:

- **`ScheduleLookup` now needs to know which timezone Riverside runs
  on** - it takes a `riversideTimezone: string` in its constructor, and
  adds a buffer to any trip that rides the Green Line.
- **`FareCalculator` now needs a `SurchargeService`** to add a flat
  surcharge to any trip that crosses into Riverside - it takes one in
  its constructor.
- **`AlertService` is retired.** Caldermoor's alerts now come from a
  live feed, not a static table - `RealTimeAlertService`, constructed
  with a feed URL, replaces it outright. It already knows about a Green
  Line alert the old table was never updated for.

A trip to Mill Ave, Harbor Square or Castleview - anything not riding
the Green Line - must come back with exactly the numbers it always did.
A trip to Riverside is where all three changes actually show up.
