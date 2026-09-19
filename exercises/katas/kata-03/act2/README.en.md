[🌐 English](./README.en.md)

# Act 2 — contraband-flagged items need the inspection zone

Compliance has a new rule: picking up an item flagged `"contraband"` is only legal while the
robot is inside the inspection zone - the corner where `x >= 8` and `y >= 8`. Everywhere else
on the grid, picking up a `"contraband"`-flagged item is refused. Every other item id is
unaffected, and nothing about moving, dropping off, or the existing grid/cargo rules changes.

## Done when (act 2)

- `./dp test kata-03 --act2 --solution <your-route>` is green.
- Picking up `"contraband"` inside the inspection zone (`x >= 8 && y >= 8`) still succeeds.
- Picking up `"contraband"` anywhere outside the inspection zone is refused.
- Picking up any other item id behaves exactly as it does today, anywhere on the grid.
- The rule applies the same way whether the command arrives through `runCommand` or as part of
  a `replayBatch` batch.

## Then run `./dp trade kata-03`
