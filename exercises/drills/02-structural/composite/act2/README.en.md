[🌐 English](./README.en.md)

# Act 2 — a new node kind: a walking transfer

Some Caldermoor transfers aren't a wait for the next vehicle - they're a
walk to a different platform or a different stop entirely. Add
`WalkingTransfer`, a node whose only contribution to a journey is its
own walking time, usable anywhere an existing node can appear inside a
`Journey`.

`totalMinutes` must keep working, unchanged in signature, for any tree
that now includes a `WalkingTransfer` anywhere in it.
