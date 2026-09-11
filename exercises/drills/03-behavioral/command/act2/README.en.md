[🌐 English](./README.en.md)

# Act 2 — undo, redo, and a macro

Operators keep fat-fingering the focuser and want an undo button. While you are
in there: a sequence of setup moves run together often enough that it should
be one undo, not five.

**`panel.undo()`** reverses the most recently run action and moves it onto a
redo stack. **`panel.redo()`** re-runs the most recently undone action. Running
a *new* action after an undo clears whatever was available to redo — the usual
rule, and the one every undo stack in every application follows.

**A new action kind, `macro`**, wraps a list of actions and runs them as one
unit: `panel.run({ type: "macro", actions: [...] })` executes every action in
order, and a single `panel.undo()` afterward undoes all of them, in reverse
order, as if the macro had never run. The macro counts as exactly one entry in
`history` and in the undo stack - not one entry per sub-action.
