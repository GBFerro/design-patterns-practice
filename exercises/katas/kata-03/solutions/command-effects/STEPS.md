# Steps — command-effects

1. `applyEffect(state, command)`: one function, pulled out of `runCommand`, both apply sites in
   `replayBatch` (the forward pass and the rollback loop), and `undoLast` - every place that
   turns a command into a state transition, forward or inverted.
2. `runCommand`, `replayBatch` and `undoLast` each call `applyEffect` where they used to inline
   the move/pick-up/drop-off logic, then keep their own copies of the legality checks and the
   invert-command logic exactly as `src/` has them - untouched, on purpose.
