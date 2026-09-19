# Steps — command-rules

1. `validateCommand(state, command)`: one function, pulled out of both `runCommand` and
   `replayBatch`'s forward pass, deciding whether a command is legal from the robot's current
   position and cargo - bounds for a move, "not already holding" for a pick-up, "holding
   something" for a drop-off.
2. `runCommand` and `replayBatch` each call `validateCommand` once per command, then keep their
   own copies of the apply-effect and invert-command logic exactly as `src/` has them -
   untouched, on purpose. `undoLast` never called validation to begin with (inverses are legal
   by construction), so it is unchanged.
